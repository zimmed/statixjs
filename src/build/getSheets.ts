import fs from 'fs-extra';
import { resolve, join } from 'path';
import process from 'process';
import type { ISass } from '../../index.d';
import { convertInterpolation, createSass } from '../utils';

type RecursiveSMap = { [x: string]: RecursiveSMap | ISass };

export default async function getPages(sheetsPath: string): Promise<RecursiveSMap> {
  const path = resolve(process.cwd(), sheetsPath);
  const files = fs.readdirSync(path, {
    withFileTypes: true,
  });

  return files.reduce(async (promise, file) => {
    const obj: RecursiveSMap = await promise;

    if (file.isDirectory()) {
      if (obj[file.name]) {
        throw new Error(
          `Tried to parse sheets directory ${join(sheetsPath, file.name)} but key already exists`
        );
      }
      return {
        ...obj,
        [file.name]: getPages(join(sheetsPath, file.name)),
      } as RecursiveSMap;
    }

    try {
      const name = file.name.split('.')[0];
      let style;
      let mod;

      if (/\.(t|j)x?ss$/i.test(file.name)) {
        mod = await import(join(path, file.name));
        style = mod?.default || mod;
        if (!style) throw new Error(`File export is empty: ${join(path, file.name)}`);
        if (!style.style && typeof style === 'function') {
          style = style();
        } else if (!style.style) {
          throw new Error(`File export is not valid style: ${join(path, file.name)}`);
        }
      } else if (/\.(sass|scss|x?css|sxss|style|sheet|stylesheet)$/i.test(file.name)) {
        style = createSass(
          convertInterpolation(
            await import(join(path, file.name)),
            // fs.readFileSync(join(path, file.name), 'utf8')?.toString(),
            'scss',
            'node'
          )
        );
      }
      if (style) {
        if (obj[name])
          throw new Error(`Stylesheet entry already exists for ${join(sheetsPath, name)}`);
        return { ...obj, [name]: style };
      }
    } catch (e) {
      console.warn(
        `Failed to include stylesheet ${join(sheetsPath, file.name)}: ${e?.message || e}`,
        e?.stack
      );
    }
    return obj;
  }, Promise.resolve({} as RecursiveSMap));
}
