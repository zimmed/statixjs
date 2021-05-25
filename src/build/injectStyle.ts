import fs from 'fs-extra';
import type { Dirent } from 'fs-extra';
import { join } from 'path';
import type { Component, IRender } from '../../index.d';
import { injectChild } from '../utils';
import getStyleComponent from './getStyleComponent';

export default async function getStyle(
  Parent: Component,
  name: string,
  path: string,
  files: Dirent[]
): Promise<Component> {
  const cName = `${Parent.name}Style`;
  let styleFile = files.find((f) =>
    new RegExp(`^${name}.*\\.(sass|scss|x?css|sxss|style)$`, 'i').test(f.name)
  );
  let Style: Component | IRender | undefined;

  if (styleFile) {
    Style = await getStyleComponent(
      cName,
      await import(join(path, styleFile.name))
      // fs.readFileSync(join(path, styleFile.name), 'utf8')
    );
  } else {
    styleFile = files.find((f) => new RegExp(`^${name}.*\\.(t|j)x?ss$`, 'i').test(f.name));
    if (styleFile) {
      Style = await getStyleComponent(cName, await import(join(path, styleFile.name)));
      if (!Style) throw new Error(`Invalid style export from ${join(path, styleFile.name)}`);
    }
  }

  return Style ? injectChild(Parent, Style as Component) : Parent;
}
