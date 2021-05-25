import process from 'process';
import { resolve, join } from 'path';
import { safeWrite } from '../utils';
import type { Component, CMap } from '../../index.d';

type PMap = { [x: string]: Component | PMap };

function buildPage(
  Page: Component,
  components: CMap,
  path: string,
  filename: string = Page.name,
  opts: { prettyPrint?: boolean } = {}
) {
  globalThis.CURRENT_PAGE = 'default'; // join(path, filename);
  safeWrite(
    resolve(process.cwd(), path, `${filename}.html`),
    `${Page({})?.toString(opts.prettyPrint ? 0 : -1, components, false) || ''}\n`,
    'utf8'
  );
  globalThis.CURRENT_PAGE = '';
}

export default function buildPages(
  pages: PMap,
  components: CMap,
  path: string = '',
  opts?: { prettyPrint?: boolean }
) {
  Object.keys(pages).forEach((key) => {
    if (typeof pages[key] === 'object') {
      buildPages(pages[key] as PMap, components, join(path, key), opts);
    } else {
      buildPage(pages[key] as Component, components, path, key, opts);
    }
  });
}
