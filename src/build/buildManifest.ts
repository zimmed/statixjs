import { resolve } from 'path';
import type { IConfig } from '../../index.d';
import { safeWrite } from '../utils';

export default function buildManifest(wsPath: string, config: IConfig = SITE) {
  const manifest = {
    name: config.name,
    short_name: config.shortName || config.name,
    description: config.description,
    icons: config.icons.filter((i) => i.type && i.sizes),
    theme_color: config.theme.palette.fg,
    background_color: config.theme.palette.bg,
  };

  return safeWrite(
    resolve(process.cwd(), wsPath, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );
}
