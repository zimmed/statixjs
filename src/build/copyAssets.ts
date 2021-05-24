import fs from 'fs-extra';
import { resolve } from 'path';
import process from 'process';
import { ensureDir } from '../utils';

export default function copyAssets(remove: boolean, wsPath: string, assetsPath: string) {
  const path = resolve(process.cwd(), wsPath);

  if (remove) fs.rmSync(path, { recursive: true, force: true });
  ensureDir(path);
  return fs.copySync(resolve(process.cwd(), assetsPath), path);
}
