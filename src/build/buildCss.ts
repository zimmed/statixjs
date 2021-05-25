import process from 'process';
import { resolve, join } from 'path';
import type { ISass } from '../../index.d';
import { safeWrite } from '../utils';
import { dumpCss } from '../globals/sass';

type SMap = { [x: string]: ISass | SMap };

function buildSheet(style: ISass, path: string, filename: string) {
  globalThis.CURRENT_PAGE = join(path, filename);
  style();
  safeWrite(resolve(process.cwd(), path, `${filename}.css`), `${dumpCss()}\n`, 'utf8');
  globalThis.CURRENT_PAGE = 'default';
}

function buildSheets(sheets: SMap, path: string = '') {
  // safeWrite(resolve(process.cwd(), path, 'bundle.css'), dumpCss('default'), 'utf8');
  Object.keys(sheets).forEach((key) => {
    if (typeof sheets[key] === 'object') {
      buildSheets(sheets[key] as SMap, join(path, key));
    } else {
      buildSheet(sheets[key] as ISass, path, key);
    }
  });
}

export default function buildCss(sheets: SMap, path: string = '') {
  safeWrite(resolve(process.cwd(), path, 'bundle.css'), `${dumpCss('default')}\n`, 'utf8');
  buildSheets(sheets, path);
}
