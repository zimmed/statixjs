import { join } from 'path';
import './globals';
import type { Component, IConfig, ISass } from '../index.d';
import * as build from './build';
import * as builtins from './components';

type Pages = { [x: string]: Component | Pages };
type Components = { [x: string]: Component };
type Sheets = { [x: string]: ISass | Sheets };

let pages: Pages | null = null;
let components: Components | null = null;
let sheets: Sheets | null = null;

build.getPages(join(SITE.buildOptions.srcPath, 'pages')).then((data) => {
  pages = data;
});
build.getComponents(join(SITE.buildOptions.srcPath, 'components')).then((data) => {
  components = { ...builtins, ...data };
});
build.getSheets(join(SITE.buildOptions.srcPath, 'sheets')).then((data) => {
  sheets = data;
});

export function buildPages(config?: IConfig, opts: { prettyPrint?: boolean } = {}) {
  if (!pages || !components || !sheets) throw new Error(`Not ready to build yet.`);
  if (typeof config !== 'undefined') globalThis.SITE = config;
  build.buildPages(pages, components, SITE.buildOptions.websitePath, opts);
  build.buildCss(sheets, join(SITE.buildOptions.websitePath, 'css'));
}

export function resetPublic(config?: IConfig) {
  if (typeof config !== 'undefined') globalThis.SITE = config;
  build.copyAssets(true, SITE.buildOptions.websitePath, SITE.buildOptions.assetsPath);
}

export function copyAssets(config?: IConfig) {
  if (typeof config !== 'undefined') globalThis.SITE = config;
  build.copyAssets(false, SITE.buildOptions.websitePath, SITE.buildOptions.assetsPath);
}

export function buildManifest(config?: IConfig) {
  if (typeof config !== 'undefined') globalThis.SITE = config;
  build.buildManifest(SITE.buildOptions.websitePath, SITE);
}

export default function buildAll(
  config?: IConfig,
  opts: {
    prettyPrint?: boolean;
    pages?: boolean;
    clean?: boolean;
    assets?: boolean;
    manifest?: boolean;
  } = {}
) {
  if (opts.clean) resetPublic(config);
  if (!opts.clean && opts.assets) copyAssets(config);
  if (opts.pages) buildPages(config, { prettyPrint: opts.prettyPrint });
  if (opts.manifest) buildManifest(config);
}
