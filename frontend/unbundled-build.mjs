import * as fs from 'node:fs/promises';
import { glob } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import cli from '@angular/cli';
import * as esbuild from 'esbuild';
import * as jsdom from 'jsdom';

const BUILD_CONFIGURATION = process.env.NG_BUILD_CONFIGURATION || 'production';
const OUTPUT_SUBDIR = process.env.DEP_CHUNKS_OUTDIR || 'vendor';
const DISABLE_STYLE_EXCLUDES = process.env.DEP_CHUNKS_DISABLE_STYLE_EXCLUDES === '1';

function toSet(input) {
  if (!input) {
    return new Set();
  }
  return new Set(
    input
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
}

function toWebPath(path) {
  return path.replaceAll('\\', '/');
}

function toRelativeWebPath(fromDir, toFile) {
  let path = toWebPath(relative(fromDir, toFile));
  if (!path.startsWith('.')) {
    path = `./${path}`;
  }
  return path;
}

function fileNameForPackage(packageName) {
  return `${packageName.replaceAll('@', '').replaceAll('/', '--')}.mjs`;
}

function packageNameFromSpecifier(specifier) {
  if (specifier.startsWith('.') || specifier.startsWith('/')) {
    return null;
  }
  const parts = specifier.split('/');
  if (parts[0]?.startsWith('@')) {
    return parts.length > 1 ? `${parts[0]}/${parts[1]}` : parts[0];
  }
  return parts[0] || null;
}

function applicationProjectName(angularJson) {
  const projectName = process.env.NG_BUILD_PROJECT;
  if (projectName) {
    return projectName;
  }
  const appProject = Object.entries(angularJson.projects || {}).find(
    ([, config]) => config?.projectType === 'application',
  );
  return appProject?.[0];
}

async function resolveDependencies(projectDir) {
  const packageJson = JSON.parse(
    await fs.readFile(join(projectDir, 'package.json'), 'utf-8'),
  );
  const include = toSet(process.env.DEP_CHUNKS_INCLUDE);
  const exclude = toSet(process.env.DEP_CHUNKS_EXCLUDE);
  const allDependencies = Object.keys(packageJson.dependencies || {}).sort();

  const selectedDependencies = allDependencies.filter((dependency) => {
    if (include.size && !include.has(dependency)) {
      return false;
    }
    return !exclude.has(dependency);
  });

  if (!selectedDependencies.length) {
    throw new Error(
      'No dependencies selected for external chunk generation. ' +
        'Check package.json dependencies and DEP_CHUNKS_INCLUDE/DEP_CHUNKS_EXCLUDE.',
    );
  }

  return selectedDependencies;
}

async function dependenciesUsedInStyles(projectDir, dependencies) {
  if (DISABLE_STYLE_EXCLUDES) {
    return new Set();
  }

  const dependencySet = new Set(dependencies);
  const usedInStyles = new Set();
  const styleImportPattern = /@(use|import)\s+["']([^"']+)["']/g;
  const styleFiles = await glob('src/**/*.{scss,sass,css,less}', { cwd: projectDir });

  for await (const file of styleFiles) {
    const content = await fs.readFile(join(projectDir, file), 'utf-8');
    const matches = content.matchAll(styleImportPattern);
    for (const match of matches) {
      const specifier = match[2];
      const packageName = packageNameFromSpecifier(specifier);
      if (packageName && dependencySet.has(packageName)) {
        usedInStyles.add(packageName);
      }
    }
  }

  return usedInStyles;
}

async function dependenciesUsedInSources(projectDir, dependencies) {
  const dependencySet = new Set(dependencies);
  const usedInSources = new Set();
  const sourceFiles = await glob('src/**/*.{ts,js,mts,mjs,cts,cjs}', {
    cwd: projectDir,
  });
  const staticImportPattern =
    /(?:import|export)\s+(?:[\s\w{},*$]*\s+from\s+)?["']([^"']+)["']/g;
  const dynamicImportPattern = /import\(\s*["']([^"']+)["']\s*\)/g;

  for await (const file of sourceFiles) {
    const content = await fs.readFile(join(projectDir, file), 'utf-8');
    const staticMatches = content.matchAll(staticImportPattern);
    const dynamicMatches = content.matchAll(dynamicImportPattern);

    for (const match of [...staticMatches, ...dynamicMatches]) {
      const specifier = match[1];
      const packageName = packageNameFromSpecifier(specifier);
      if (packageName && dependencySet.has(packageName)) {
        usedInSources.add(packageName);
      }
    }
  }

  return usedInSources;
}

async function buildAngular(projectName, dependencies) {
  const args = [
    'build',
    projectName,
    '--configuration',
    BUILD_CONFIGURATION,
    '--source-map',
    'false',
    '--external-dependencies',
    ...dependencies,
  ];
  console.log(`Building Angular ${cli.VERSION.full}: ng ${args.join(' ')}`);
  const status = await cli.default({ cliArgs: args });
  if (status) {
    throw new Error(`Angular build failed with status ${status}`);
  }
}

async function findIndexHtml(projectDir) {
  const indices = [];
  for await (const file of await glob('dist/**/index.html', { cwd: projectDir })) {
    indices.push(file);
  }
  indices.sort();
  const index = indices[0];
  if (!index) {
    throw new Error('Could not find index.html in dist output.');
  }
  return join(projectDir, index);
}

async function buildDependencyBundle(projectDir, dependency, allDependencies, outputDir) {
  const outputFile = join(outputDir, fileNameForPackage(dependency));
  const external = allDependencies.filter((candidate) => candidate !== dependency);
  await esbuild.build({
    absWorkingDir: projectDir,
    bundle: true,
    conditions: ['browser', 'module', 'import', 'default'],
    entryPoints: [dependency],
    external,
    format: 'esm',
    legalComments: 'none',
    logLevel: 'warning',
    mainFields: ['browser', 'module', 'main'],
    minify: true,
    outfile: outputFile,
    platform: 'browser',
    sourcemap: false,
    target: 'es2022',
    treeShaking: true,
  });
  return outputFile;
}

async function buildDependencyBundles(projectDir, dependencies, outputDir) {
  await fs.mkdir(outputDir, { recursive: true });
  const imports = {};

  for (const dependency of dependencies) {
    const outputFile = await buildDependencyBundle(
      projectDir,
      dependency,
      dependencies,
      outputDir,
    );
    imports[dependency] = outputFile;
  }

  return imports;
}

function mergeImportMaps(existing, generated) {
  return {
    ...existing,
    ...generated,
  };
}

async function updateIndexHtml(indexHtmlPath, imports) {
  const indexHtml = await fs.readFile(indexHtmlPath, 'utf-8');
  const dom = new jsdom.JSDOM(indexHtml);
  const doc = dom.window.document;
  const indexDir = dirname(indexHtmlPath);

  const webImports = Object.fromEntries(
    Object.entries(imports).map(([key, absoluteFile]) => [
      key,
      toRelativeWebPath(indexDir, absoluteFile),
    ]),
  );

  let importMapScript = doc.querySelector('script[type="importmap"]');
  let existingImports = {};
  if (importMapScript?.textContent?.trim()) {
    const parsed = JSON.parse(importMapScript.textContent);
    existingImports = parsed.imports || {};
  }

  const nextImports = mergeImportMaps(existingImports, webImports);
  if (!importMapScript) {
    importMapScript = doc.createElement('script');
    importMapScript.type = 'importmap';
    doc.head.prepend(importMapScript);
  }
  importMapScript.textContent = `${JSON.stringify({ imports: nextImports }, null, 2)}\n`;

  await fs.writeFile(indexHtmlPath, dom.serialize(), 'utf-8');
  console.log(`Updated import map in ${indexHtmlPath}`);
}

async function main() {
  const projectDir = process.cwd();
  const allDependencies = await resolveDependencies(projectDir);
  const sourceDependencies = await dependenciesUsedInSources(
    projectDir,
    allDependencies,
  );
  const styleDependencies = await dependenciesUsedInStyles(projectDir, allDependencies);
  const dependencies = allDependencies.filter((dependency) => {
    if (styleDependencies.has(dependency)) {
      return false;
    }
    return sourceDependencies.has(dependency);
  });

  if (!dependencies.length) {
    throw new Error(
      'No source-used dependencies remain for chunk generation after filtering. ' +
        'Check DEP_CHUNKS_INCLUDE/DEP_CHUNKS_EXCLUDE and style exclusions.',
    );
  }

  const sourceSkipped = allDependencies.filter(
    (dependency) => !sourceDependencies.has(dependency),
  );
  if (sourceSkipped.length) {
    console.log(
      `Skipping source-unused dependencies: ${sourceSkipped.join(', ')}`,
    );
  }
  if (styleDependencies.size) {
    console.log(
      `Skipping style-linked dependencies: ${Array.from(styleDependencies).sort().join(', ')}`,
    );
  }
  console.log(`External dependency chunks: ${dependencies.join(', ')}`);

  const angularJson = JSON.parse(
    await fs.readFile(join(projectDir, 'angular.json'), 'utf-8'),
  );
  const projectName = applicationProjectName(angularJson);
  if (!projectName) {
    throw new Error('Could not find Angular application project in angular.json.');
  }

  await buildAngular(projectName, dependencies);

  const indexHtmlPath = await findIndexHtml(projectDir);
  const outputDir = join(dirname(indexHtmlPath), OUTPUT_SUBDIR);
  const generatedImports = await buildDependencyBundles(
    projectDir,
    dependencies,
    outputDir,
  );

  await updateIndexHtml(indexHtmlPath, generatedImports);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
