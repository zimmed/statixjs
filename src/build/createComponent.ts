import cx from 'classnames';
import { v4 } from 'uuid';
import type { Component } from '../../index.d';

export default function createComponent(name: string, src: string): Component {
  function Comp(props: { [x: string]: any }, ...children: any[]) {
    return new Function(
      'props',
      'children',
      'SITE',
      'Color',
      'Break',
      'html',
      'sass',
      'extendSass',
      'uuid',
      'cx',
      'return html`' + src + '`;'
    )(props, children, SITE, Color, Break, html, sass, extendSass, v4, cx);
  }

  Object.defineProperty(Comp, 'name', { value: name });
  return Comp;
}
