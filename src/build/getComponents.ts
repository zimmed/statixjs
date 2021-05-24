import fs from 'fs-extra';
import { resolve, join } from 'path';
import process from 'process';
import { CMap } from '../../index.d';
import { convertInterpolation } from '../utils';
import createComponent from './createComponent';
import injectStyle from './injectStyle';

export default function getComponents(componentsPath: string): Promise<CMap> {
  const path = resolve(process.cwd(), componentsPath);
  const files = fs.readdirSync(path, {
    withFileTypes: true,
  });

  return files.reduce(async (promise, file) => {
    const obj = await promise;

    if (file.isDirectory()) {
      const next = getComponents(join(componentsPath, file.name));
      const dupes = Object.keys(next).filter((k) => obj[k]);

      if (dupes.length) throw new Error(`Duplicate component definition(s): ${dupes.join(', ')}`);
      return {
        ...obj,
        ...getComponents(join(componentsPath, file.name)),
      };
    }

    try {
      let name = file.name.split('.')[0];
      let Comp;

      if (/\.(t|j)sx?$/i.test(file.name)) {
        const mod = await import(join(path, file.name));

        Comp = mod?.default || mod;
        if (Comp && typeof Comp === 'function') name = Comp.name || file.name.split('.')[0];
        else throw new Error(`File is not exporting a valid component`);
      } else if (/\.(xml|x?html?)$/i.test(file.name)) {
        Comp = createComponent(
          name,
          convertInterpolation(
            fs.readFileSync(join(path, file.name), 'utf8')?.toString(),
            'hbs',
            'node'
          )
        );
      }
      if (Comp) {
        if (obj[name]) throw new Error(`Duplicated component defition: ${name}`);
        return { ...obj, [name]: await injectStyle(Comp, name, path, files) };
      }
    } catch (e) {
      console.warn(
        `Failed to include component ${join(componentsPath, file.name)}: ${e?.message || e}`,
        e?.stack
      );
    }
    return obj;
  }, Promise.resolve({} as CMap));
}
