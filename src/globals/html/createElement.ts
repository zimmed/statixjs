import { v4 } from 'uuid';
import {
  IStringable,
  TAB_CHAR,
  BOOL_ATTRIBUTES,
  VOID_ELEMENTS,
  ELEMENT,
  VALUE,
  CMap,
  Node,
  IRender,
  Component,
} from './constants';

type Parent = {
  constructor: Component;
  props: { [x: string]: any };
};

const TAB = (idx = 0) => Array(idx).fill(TAB_CHAR).join('');

function createAttributes(props: { [x: string]: IStringable }) {
  return Object.keys(props)
    .map((key) => {
      const v = props[key];

      if (BOOL_ATTRIBUTES.includes(key)) {
        return v && v !== 'false' ? ` ${key}="${key}"` : '';
      }
      return typeof v === 'undefined'
        ? ''
        : ` ${key === 'className' ? 'class' : key}="${`${props[key] ?? ''}`
            .replace(/\\'/g, "'")
            .replace(/(^|[^\\])"/g, (m, p) => `${p}\\"`)}"`;
    })
    .filter(Boolean)
    .join('');
}

function createDomElement(
  tag: string,
  props: { [x: string]: IStringable },
  children: IStringable[],
  tabIdx: number
): string {
  const propStr = createAttributes(props);
  const isVoid = VOID_ELEMENTS.includes(tag);
  const child = children.join('');

  if (tabIdx === -1)
    return `<${tag}${propStr}${isVoid ? ' /' : ''}>${isVoid ? '' : `${child}</${tag}>`}`;

  const tab = TAB(tabIdx);
  const open = `\n${tab}<${tag}${propStr}${isVoid ? ' /' : ''}>`;
  const inner = child[0] === '\n' || child.length <= 16 ? child : `\n${TAB(tabIdx + 1)}${child}`;
  const close = inner[0] === '\n' ? `${inner}\n${tab}</${tag}>` : `${inner}</${tag}>`;

  return `${open}${isVoid ? '' : close}`;
}

function renderValue(value: any, components: CMap, tabIdx: number): IStringable {
  if (Array.isArray(value)) return value.map((v) => renderValue(v, components, tabIdx)).join('');

  return value?.renderable ? (value as IRender).toString(tabIdx, components) : value;
}

export default function createElement(
  node: Node,
  components: CMap,
  tabIdx: number,
  parent?: Parent
): IStringable {
  if (node.type === VALUE) return renderValue(node.value, components, tabIdx);

  if (node.type === ELEMENT) {
    if (
      typeof node.tag === 'function' ||
      components[node.tag] ||
      (node.tag.startsWith('x-') && components[node.tag.slice(2)])
    ) {
      const Comp = typeof node.tag === 'function' ? node.tag : components[node.tag];
      const props = {
        id: `${Comp.name}-${v4().replace(/\-/g, '')}`,
        name: Comp.name || node.name,
        ...node.props.props,
        parent,
        children: null,
      };
      const children = node.children
        .map((c) =>
          createElement(c, components, tabIdx === -1 ? -1 : tabIdx + 1, {
            constructor: Comp,
            props,
          })
        )
        .filter((s) => s != null && s !== '' && s !== ' ');

      return (
        Comp(
          {
            ...props,
            children: children.join(''),
          },
          ...children
        )?.toString(tabIdx, components) || ''
      );
    }
    const children = node.children
      .map((c) => createElement(c, components, tabIdx === -1 ? -1 : tabIdx + 1, parent))
      .filter((s) => s != null && s !== '' && s !== ' ');

    return createDomElement(node.tag, node.props.props, children, tabIdx);
  }

  return '';
}
