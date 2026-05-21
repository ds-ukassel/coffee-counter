import * as fs from 'node:fs/promises';
import {glob} from 'node:fs/promises';
import * as YAML from 'yaml';
import cli from '@angular/cli';
import * as jsdom from 'jsdom';
import {fileURLToPath} from "node:url";
import {dirname, join} from "node:path";

async function main() {
  const frontendDir = './';

  const packageJson = JSON.parse(await fs.readFile(`${frontendDir}package.json`, {encoding: 'utf-8'}));
  // TODO these are not supported yet. Declaring them as external breaks SCSS.
  const forbiddenDependencies = new Set([
    'bootstrap',
    'bootstrap-icons',
  ])
  const dependencies = Object.keys(packageJson.dependencies || []).filter(s => !forbiddenDependencies.has(s));

  console.log('Package dependencies: ', dependencies);

  const angularJson = JSON.parse(await fs.readFile(`${frontendDir}angular.json`, {encoding: 'utf-8'}));
  const projectName = Object.entries(angularJson.projects).find(([, v]) => v.projectType === 'application')?.[0];
  if (!projectName) {
    console.log(angularJson);
    throw new Error(`Could not find application project in angular.json.`);
  }

  // await buildAngular(projectName, dependencies);

  const allPackages = await loadPackages(frontendDir);
  const allPackageVersions = Object.fromEntries(allPackages);

  const imports = {};
  await augmentImportMapWithJsImports(frontendDir, imports, allPackageVersions);

  for await (const index of await glob(`dist/**/index.html`, {cwd: frontendDir})) {
    const indexHtmlPath = frontendDir + index;
    await updateIndexHtml(indexHtmlPath, imports, allPackageVersions);
    break;
  }
}

async function buildAngular(projectName, dependencies) {
  const args = [
    'build',
    projectName,
    '--configuration', 'production',
    '--source-map', 'false',
    '--external-dependencies', ...dependencies,
  ];
  console.log(`Building Angular ${cli.VERSION.full}: ng ${args.join(' ')}`);
  const status = await cli.default({
    cliArgs: args,
  });

  if (status) {
    throw new Error(`Angular build failed with status ${status}`);
  }
}

async function loadPackages(frontendDir) {
  const pnpmLock = YAML.parse(await fs.readFile(`${frontendDir}pnpm-lock.yaml`, {encoding: 'utf-8'}));
  const allPackages = Object.entries(pnpmLock.packages)
    // ignore all os-specific packages.
    .filter(([, v]) => !v.os)
    .map(([packageAtVersion]) => {
      if (!packageAtVersion.startsWith('@')) {
        return packageAtVersion.split('@', 2);
      }
      const [p, v] = packageAtVersion.slice(1).split('@', 2);
      return [`@${p}`, v];
    });
  console.log('All packages: ', allPackages.length, /* allPackages */);
  return allPackages;
}

function generateImportMap(allPackages) {
  const imports = {};
  for (const [dependency, version] of allPackages) {
    const unpkgUrl = import2Unpkg(dependency, dependency, version);
    if (unpkgUrl) {
      imports[dependency] = unpkgUrl;
    }
  }
  return imports;
}

function getPackageName(module) {
  const [a, b] = module.split('/');
  if (a.startsWith('@')) {
    return a + '/' + b;
  } else {
    return a;
  }
}

function tryResolve(module, parent) {
  try {
    return import.meta.resolve(module, parent);
  } catch (e) {
    return;
  }
}

function import2Unpkg(module, packageName, version) {
  const url = tryResolve(module);
  return url && url2Unpkg(url, packageName, version);
}

function url2Unpkg(url, packageName, version) {
  const pathNeedle = `node_modules/${packageName}/`;
  const pathStart = url.lastIndexOf(pathNeedle);
  const path = url.substring(pathStart + pathNeedle.length);
  if (pathStart < 0 || !path.endsWith('.js') && !path.endsWith('.mjs')) {
    console.warn(`Dependency ${url} not found: ${path}`);
    return;
  }

  return `https://unpkg.com/${packageName}@${version}/${path}`;
}

async function augmentImportMapWithJsImports(frontendDir, imports, allPackageVersions) {
  for await (const file of await glob('dist/**/*.js', {cwd: frontendDir})) {
    const path = frontendDir + file;
    await collectImports(path, imports, allPackageVersions);
  }
}

async function collectImports(path, imports, allPackageVersions) {
  const content = await fs.readFile(path, {encoding: 'utf8'});
  const matches = content.matchAll(/import(.*?from)?\s*(?<qmod>"[^"]+"|'[^']+')[;\n]/gms).toArray();
  // console.log('Collecting', matches.length, 'imports from', path);

  for (const match of matches) {
    const {qmod} = match.groups;
    const module = qmod.slice(1, -1);
    if (module.startsWith('./') || module.startsWith('../')) {
      // local import e.g. ./chunk-xy.js
      // Don't add this to imports, but recurse anyway
      const nextPath = join(dirname(path), module);
      // console.log('Continuing with', nextPath);
      await collectImports(nextPath, imports, allPackageVersions);
      continue;
    }
    if (module in imports) {
      // already known
      continue;
    }
    const packageName = getPackageName(module);
    const version = allPackageVersions[packageName];

    let url = tryResolve(module, path);
    if (!url) {
      console.warn(`Could not resolve ${module} import in ${path}`);
      continue;
    }

    const unpkgUrl = url2Unpkg(url, packageName, version);
    if (unpkgUrl) {
      imports[module] = unpkgUrl;
    }

    // Recursively collect imports. If a dependency imports another one, we need to find these imports too.
    await collectImports(fileURLToPath(url), imports, allPackageVersions);
  }
}

async function updateIndexHtml(indexHtmlPath, imports, allPackageVersions) {
  const indexHtml = await fs.readFile(indexHtmlPath, {encoding: 'utf-8'});

  const jsDom = new jsdom.JSDOM(indexHtml, {});
  const doc = jsDom.window.document;

  for (const preload of doc.querySelectorAll('link[rel="modulepreload"]')) {
    let module = preload.href;
    if (module.startsWith('https://')) {
      // already a non-local preload
      continue;
    }

    if (module in imports) {
      // a package name preload -> replace with import
      preload.href = imports[module];
      continue;
    }

    if (module.startsWith('chunk-') && !module.includes('/')) {
      // a chunk file
      continue;
    }

    const packageName = getPackageName(module);
    const version = allPackageVersions[packageName];
    const unpkgUrl = import2Unpkg(module, packageName, version);
    if (unpkgUrl) {
      preload.href = unpkgUrl;
      imports[module] = unpkgUrl;
    } else {
      console.warn(`Could not replace ${module} preload`);
    }
  }

  let importMapScript = doc.querySelector('script[type=importmap]');
  if (!importMapScript) {
    importMapScript = doc.createElement('script');
    importMapScript.type = 'importmap';
    doc.body.insertBefore(importMapScript, doc.body.firstChild);
  }
  importMapScript.innerHTML = JSON.stringify({imports}, null, 2);

  let newIndexHtml = jsDom.serialize();
  console.log(`Updating ${indexHtmlPath} (${indexHtml.length} -> ${newIndexHtml.length} +${newIndexHtml.length - indexHtml.length})`);
  await fs.writeFile(indexHtmlPath, newIndexHtml, {encoding: 'utf-8'});
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
