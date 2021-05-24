#!/usr/bin/env node
const process = require('process');
const fs = require('fs');
const { resolve, dirname, join } = require('path');
const pkg = require('../package.json');
const { exec, getConfig, ensureDir } = require('./helpers');

let SITE;

const dependencies = [
  'strip-json-comments',
  'fast-live-reload',
  'fs-extra',
  'glob-watcher',
  'ts-loader',
  'webpack',
  'webpack-cli',
  'webpack-node-externals',
  'typescript',
  'classnames',
  '@types/fs-extra',
  '@types/node',
  '@types/node-sass',
  '@types/uuid',
];

function uniqueAdd(arr, ...els) {
  els.forEach((el) => {
    if (!arr.find((e) => e === el)) arr.push(el);
  });
}

async function initDependencies() {
  const packages = dependencies.map(
    (d) => `${d}@${pkg.devDependencies[d].replace(/[^\d\.]/g, '')}`
  );

  return exec('npm', 'i', '--save-dev', ...packages);
}

function fileExists(path, ...paths) {
  return fs.promises
    .access(join(path, 'pages', 'index.ts'), fs.constants.F_OK)
    .then(() => true)
    .catch(() => (paths.length ? exists(...paths) : false));
}

async function initSiteConfig() {
  const path = resolve(process.cwd(), 'siteconfig.json');
  const exists = await fileExists(path);

  if (!exists) {
    await fs.promises.writeFile(
      path,
      await fs.promises.readFile(resolve(__dirname, 'samples', 'siteconfig.json'), 'utf8'),
      'utf8'
    );
  }

  SITE = getConfig();
}

async function initTsConfig() {
  const path = resolve(process.cwd(), 'tsconfig.json');
  const exists = await fileExists(path);
  let tsconfig;

  if (!exists) {
    await exec('npx', 'tsc', '--init');
  }

  tsconfig = JSON.parse(
    require('strip-json-comments')((await fs.promises.readFile(path, 'utf8')).toString())
  );

  if (!tsconfig) tsconfig = {};
  if (!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
  if (!tsconfig.compilerOptions.typeRoots) tsconfig.compilerOptions.typeRoots = [];
  uniqueAdd(
    tsconfig.compilerOptions.typeRoots,
    'node_modules/@zimmed/statixjs/index.d.ts',
    'node_modules/@types'
  );
  tsconfig.compilerOptions.preserveSymlinks = true;
  tsconfig.compilerOptions.moduleResolution = 'node';
  tsconfig.compilerOptions.target = 'es5';
  tsconfig.compilerOptions.module = 'commonjs';
  tsconfig.compilerOptions.allowSyntheticDefaultImports = true;
  tsconfig.compilerOptions.skipLibCheck = true;
  tsconfig.compilerOptions.resolveJsonModule = true;
  if (!tsconfig.include) tsconfig.include = [];
  uniqueAdd(tsconfig.include, 'src/**/*', 'siteconfig.json');
  if (!tsconfig.exclude) tsconfig.exclude = [];
  uniqueAdd(tsconfig.exclude, 'node_modules', SITE.assetsPath, SITE.websitePath);
  return fs.promises.writeFile(path, JSON.stringify(tsconfig, null, 2) + '\n', 'utf8');
}

async function initSrc() {
  const path = resolve(process.cwd(), SITE.buildOptions.srcPath);
  const indexExists = await fileExists(
    ...['ts', 'tsx', 'jsx', 'js', 'xhtm', 'htm', 'xhtml', 'html', 'xml'].map((ext) =>
      join(path, 'pages', `${index}.${ext}`)
    )
  );

  ensureDir(join(path, 'pages'));
  ensureDir(join(path, 'components'));
  ensureDir(join(path, 'sheets'));
  if (!indexExists) {
    await fs.promises.writeFile(
      join(path, 'pages', 'index.xhtml'),
      await fs.promises.readFile(resolve(__dirname, 'samples', 'pages', 'index.xhtml'), 'utf8'),
      'utf8'
    );
    await fs.promises.writeFile(
      join(path, 'components', 'Page.xhtml'),
      await fs.promises.readFile(resolve(__dirname, 'samples', 'components', 'Page.xhtml'), 'utf8'),
      'utf8'
    );
    await fs.promises.writeFile(
      join(path, 'components', 'Page.sxss'),
      await fs.promises.readFile(resolve(__dirname, 'samples', 'components', 'Page.sxss'), 'utf8'),
      'utf8'
    );
    await fs.promises.writeFile(
      join(path, 'sheets', 'reset.css'),
      await fs.promises.readFile(resolve(__dirname, 'samples', 'sheets', 'reset.css'), 'utf8'),
      'utf8'
    );
    await fs.promises.writeFile(
      join(path, 'sheets', 'theme.sxss'),
      await fs.promises.readFile(resolve(__dirname, 'samples', 'sheets', 'theme.sxss'), 'utf8'),
      'utf8'
    );
  }
}

async function initFolders() {
  await ensureDir(resolve(process.cwd(), SITE.buildOptions.assetsPath));
  await ensureDir(resolve(process.cwd(), SITE.buildOptions.websitePath));
  await ensureDir(resolve(__dirname, '..', 'build'));
}

async function initGitIgnore() {
  const path = resolve(process.cwd(), '.gitignore');
  const exists = await fs.promises
    .access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);

  if (!exists) {
    await fs.promises.writeFile(
      path,
      `
.DS_STORE
*.pem
.env.local
.env.*.local
*.log*

/node_modules
/${SITE.buildOptions.websitePath}
`,
      'utf8'
    );
  }
}

async function init() {
  await initDependencies();
  await initSiteConfig();
  await initTsConfig();
  await initSrc();
  await initFolders();
  await initGitIgnore();
  console.log('Finished initializing statixjs site.');
}

init();
