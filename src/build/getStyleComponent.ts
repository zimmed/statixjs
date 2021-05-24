import { Component, IRender } from '../../index.d';
import { convertInterpolation } from '../utils';
import { Sass } from '../components';
import wrapComponent from './wrapComponent';

export default async function getStyleComponent(
  name: string,
  content?: Buffer | string | IRender | Component
): Promise<Component | undefined> {
  if (!content) return undefined;
  if (typeof content === 'string' || Buffer.isBuffer(content)) {
    return wrapComponent(Sass, {
      props: { inst: false },
      overrideProps: true,
      children: [convertInterpolation(content.toString(), 'scss', 'node')],
      replaceChildren: true,
    });
  }
  if ((content as IRender).renderable) {
    const Comp: Component = function () {
      return content as IRender;
    };

    Object.defineProperty(Comp, 'name', { value: name });
    return Comp;
  }
  if (typeof content !== 'function' || content.name !== 'Sass') {
    return undefined;
  }
  return content as Component;
}
