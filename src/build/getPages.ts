import fs from 'fs-extra';
import { resolve, join, relative } from 'path';
import process from 'process';
import type { Component } from '../../index.d';
import { convertInterpolation } from '../utils';
import createComponent from './createComponent';
import injectStyle from './injectStyle';

type RecursiveCMap = { [x: string]: RecursiveCMap | Component };

export default async function getPages(pagesPath: string): Promise<RecursiveCMap> {
  const path = resolve(process.cwd(), pagesPath);
  const files = fs.readdirSync(path, {
    withFileTypes: true,
  });

  return files.reduce(async (promise, file) => {
    const obj: RecursiveCMap = await promise;

    if (file.isDirectory()) {
      if (obj[file.name]) {
        throw new Error(
          `Tried to parse page directory ${join(pagesPath, file.name)} but key already exists`
        );
      }
      return {
        ...obj,
        [file.name]: getPages(join(pagesPath, file.name)),
      } as RecursiveCMap;
    }

    try {
      const name = file.name.split('.')[0];
      let Comp;
      let mod;

      if (/\.(t|j)sx?$/i.test(file.name)) {
        mod = await import(relative(__dirname, join(path, file.name)));
        Comp = mod?.default || mod;
        if (!Comp) throw new Error(`File export is empty: ${join(path, file.name)}`);
        if (Comp.renderable) {
          const C = Comp;

          Comp = function () {
            return C;
          };
          Object.defineProperty(Comp, 'name', { value: name });
        } else if (typeof Comp !== 'function') {
          throw new Error(
            `File export is not valid component or renderable: ${join(path, file.name)}`
          );
        }
      } else if (/\.(xml|x?html?)$/i.test(file.name)) {
        Comp = createComponent(
          name,
          convertInterpolation(
            await import(relative(__dirname, join(path, file.name))),
            // fs.readFileSync(join(path, file.name), 'utf8')?.toString(),
            'hbs',
            'node'
          )
        );
      }
      if (Comp) {
        if (obj[name]) throw new Error(`Page entry already exists for ${join(pagesPath, name)}`);
        return { ...obj, [name]: await injectStyle(Comp, name, path, files) };
      }
    } catch (e) {
      console.warn(
        `Failed to include page ${join(pagesPath, file.name)}: ${e?.message || e}`,
        e?.stack
      );
    }
    return obj;
  }, Promise.resolve({} as RecursiveCMap));
}
