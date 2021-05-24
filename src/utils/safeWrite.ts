import { dirname } from 'path';
import fs from 'fs';
import ensureDir from './ensureDir';

export default function safeWrite(path: string, content: string | Buffer, encoding: string) {
  ensureDir(dirname(path));
  return fs.writeFileSync(path, content, encoding);
}
