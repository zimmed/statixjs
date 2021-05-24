import fs from 'fs';

export default function ensureDir(path: string) {
  try {
    fs.mkdirSync(path, { recursive: true });
    return true;
  } catch (e) {
    return false;
  }
}
