import * as fs from 'node:fs/promises';
import {glob} from 'node:fs/promises';
import * as YAML from 'yaml';
import cli from '@angular/cli';
import * as jsdom from 'jsdom';

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

  const imports = generateImportMap(allPackages);

  for await (const index of await glob(`dist/**/index.html`, {cwd: frontendDir})) {
    const indexHtmlPath = frontendDir + index;
    await updateIndexHtml(indexHtmlPath, imports);
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
  console.log(`Building Angular ${cli.VERSION}: ng ${args.join(' ')}`);
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
    let url;
    try {
      url = import.meta.resolve(dependency);
    } catch (e) {
      // console.warn(`Import ${dependency} cannot be resolved`);
      continue;
    }
    const pathNeedle = `node_modules/${dependency}/`;
    const pathStart = url.lastIndexOf(pathNeedle);
    const path = url.substring(pathStart + pathNeedle.length);
    if (pathStart < 0 || !path.endsWith('.js') && !path.endsWith('.mjs')) {
      console.warn(`Dependency ${url} not found: ${path}`);
      continue;
    }

    const unpkgUrl = `https://unpkg.com/${dependency}@${version}/${path}`;
    imports[dependency] = unpkgUrl;
  }
  return imports;
}

async function updateIndexHtml(indexHtmlPath, imports) {
  const indexHtml = await fs.readFile(indexHtmlPath, {encoding: 'utf-8'});

  const jsDom = new jsdom.JSDOM(indexHtml, {});
  const doc = jsDom.window.document;

  let importMapScript = doc.querySelector('script[type=importmap]');
  if (!importMapScript) {
    importMapScript = doc.createElement('script');
    importMapScript.type = 'importmap';
    doc.body.appendChild(importMapScript);
  }
  importMapScript.innerHTML = JSON.stringify({imports});

  for (const preload of doc.querySelectorAll('link[rel="modulepreload"]')) {
    if (preload.href in imports) {
      preload.href = imports[preload.href];
    }
  }

  let newIndexHtml = jsDom.serialize();
  console.log(`Updating ${indexHtmlPath} (${indexHtml.length} -> ${newIndexHtml.length} +${newIndexHtml.length - indexHtml.length})`);
  await fs.writeFile(indexHtmlPath, newIndexHtml, {encoding: 'utf-8'});
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
