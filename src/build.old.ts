// import fs from 'fs-extra';
// import { resolve, join } from 'path';
// import process from 'process';
// import { dumpCss } from './globals/style';
// import { Pages, CMap, Component } from '../index.d';

// type RecursiveCMap = { [x: string]: Component | RecursiveCMap };

// function buildComponent(name: string, src: string): Component {
//   function Comp(props: { [x: string]: any }, ...children: any[]) {
//     return new Function('props', 'children', '__TAG_FN__', `return __TAG_FN__\`${src}\`;`)(
//       props,
//       children,
//       html
//     );
//   }

//   Object.defineProperty(Comp, 'name', { value: name });
//   return Comp;
// }

// function getComponents(componentsPath: string): CMap {
//   const path = resolve(process.cwd(), componentsPath);
//   const files = fs.readdirSync(path, {
//     withFileTypes: true,
//   });

//   return files.reduce((obj, file) => {
//     if (file.isDirectory()) {
//       const next = getComponents(join(componentsPath, file.name));
//       const dupes = Object.keys(next).filter((k) => obj[k]);

//       if (dupes.length) throw new Error(`Duplicate component definition(s): ${dupes.join(', ')}`);
//       return {
//         ...obj,
//         ...getComponents(join(componentsPath, file.name)),
//       };
//     }

//     try {
//       let name = file.name.split('.')[0];
//       let Comp;

//       if (/\.(t|j)s$/i.test(file.name)) {
//         const mod = require(require.resolve(join(path, file.name)));

//         Comp = mod?.default || mod;
//         if (Comp && typeof Comp === 'function') name = Comp.name || file.name.split('.')[0];
//         else throw new Error(`File is not exporting a valid component`);
//       } else if (/\.(t|j)sx$/i.test(file.name)) {
//         Comp = buildComponent(name, fs.readFileSync(join(path, file.name), 'utf8')?.toString());
//       }
//       if (Comp) {
//         if (obj[name]) throw new Error(`Duplicated component defition: ${name}`);
//         return { ...obj, [name]: Comp };
//       }
//     } catch (e) {
//       console.warn(
//         `Failed to include component ${join(componentsPath, file.name)}: ${e?.message || e}`,
//         e?.stack
//       );
//     }
//     return obj;
//   }, {} as CMap);
// }

// function getPages(pagesPath: string): RecursiveCMap {
//   const path = resolve(process.cwd(), pagesPath);
//   const files = fs.readdirSync(path, {
//     withFileTypes: true,
//   });

//   return files.reduce((obj, file) => {
//     if (file.isDirectory()) {
//       if (obj[file.name]) {
//         throw new Error(
//           `Tried to parse page directory ${join(pagesPath, file.name)} but key already exists`
//         );
//       }
//       return {
//         ...obj,
//         [file.name]: getPages(join(pagesPath, file.name)),
//       };
//     }

//     try {
//       const name = file.name.split('.')[0];
//       let Comp;

//       if (/\.(t|j)s$/i.test(file.name)) {
//         const mod = require(require.resolve(join(path, file.name)));

//         Comp = mod?.default || mod;
//         if (!Comp) throw new Error(`File is not exporting a valid component`);
//       } else if (/\.(t|j)sx$/i.test(file.name)) {
//         Comp = buildComponent(name, fs.readFileSync(join(path, file.name), 'utf8')?.toString());
//       }
//       if (Comp) {
//         if (obj[name]) throw new Error(`Page entry already exists for ${join(pagesPath, name)}`);
//         return { ...obj, [name]: Comp };
//       }
//     } catch (e) {
//       console.warn(
//         `Failed to include page ${join(pagesPath, file.name)}: ${e?.message || e}`,
//         e?.stack
//       );
//     }
//     return obj;
//   }, {} as RecursiveCMap);
// }

// type Log = (...args: any) => any;

// export function buildManifest(log: Log) {
//   const manifest = {
//     name: SITE.name,
//     short_name: SITE.shortName || SITE.name,
//     description: SITE.description,
//     icons: SITE.icons.filter((i) => i.type && i.sizes),
//     theme_color: SITE.theme.palette.fg,
//     background_color: SITE.theme.palette.bg,
//   };

//   log('Building site manifest...');
//   fs.writeFileSync(
//     resolve(process.cwd(), SITE.buildOptions.websitePath, 'manifest.json'),
//     JSON.stringify(manifest, null, 2),
//     'utf8'
//   );
//   log('Finished writing manifest.json');
// }

// export function buildPages(pages: Pages, log: Log) {
//   log('Building pages...');
//   Object.keys(pages).forEach((name) => {
//     log(`\tCompiling ${name}.html...`);
//     fs.writeFileSync(
//       resolve(process.cwd(), SITE.buildOptions.websitePath, `${name}.html`),
//       `${pages[name]()}`,
//       'utf8'
//     );
//   });
//   log(`Finished writing pages to ${SITE.buildOptions.websitePath}`);
// }

// export function copyAssets(remove: boolean, log: Log) {
//   const path = resolve(process.cwd(), SITE.buildOptions.websitePath);

//   log(`Copying assets from ${SITE.buildOptions.assetsPath}`);
//   if (remove) fs.rmSync(path, { recursive: true, force: true });
//   fs.mkdirpSync(path);
//   fs.copySync(resolve(process.cwd(), SITE.buildOptions.assetsPath), path);
//   log(`Finished copying assets to ${SITE.buildOptions.websitePath}`);
// }

// export function buildCss(log: Log) {
//   log(`Bundling stylesheet...`);
//   fs.mkdirpSync(resolve(process.cwd(), SITE.buildOptions.websitePath, 'css'));
//   fs.writeFileSync(
//     resolve(process.cwd(), SITE.buildOptions.websitePath, 'css', 'bundle.css'),
//     dumpCss(),
//     'utf8'
//   );
//   log(`Finished writing stylesheet to ${join(SITE.buildOptions.websitePath, 'css', 'bundle.css')}`);
// }

// export default function build(
//   logger: (...args: any) => any = console.log.bind(console),
//   assets: boolean | string = false,
//   remove = true
// ) {
//   try {
//     if (assets) {
//       logger(`Copying static assets...`);
//       copyAssets(remove);
//       logger(`\tComplete.`);
//     }

//     if (assets !== 'only') {
//       if (SITE.buildOptions.manifest) {
//         logger('Generating site manifest...');
//         buildManifest(SITE.buildOptions.manifest);
//         logger('\tComplete.');
//       }

//       logger('Generating pages...');
//       buildPages();
//       logger('\tComplete.');
//     }
//   } catch (e) {
//     logger(`ERROR: ${e?.message || e}`);
//     return e;
//   }
//   return 0;
// }
