import { placeholder, VOID_ELEMENTS, ELEMENT } from './constants';
import type { ValueNode, ElementNode } from './types';
import getValue from './getValue';
import parseValues from './parseValues';
import parseProps from './parseProps';

export default function parseElement(str: string, values: any[]): Array<ValueNode | ElementNode> {
  let match: RegExpMatchArray | boolean | null = str.match(/<(\/)?(x\-)?(\w+)/);
  const startStr = str.slice(0, match?.index ?? 0);
  const nodes: Array<ValueNode | ElementNode> = [];

  if (!match || match[1]) {
    return parseValues(match ? str.slice(0, match.index as number) : str, values);
  }

  if (startStr) nodes.push(...parseValues(startStr, values));

  let length = match[0].length;
  let next = str.slice(startStr.length + length);
  const children: Array<ValueNode | ElementNode> = [];
  const name = match[3];
  const tag = name.startsWith(placeholder) ? getValue(name, values) : name;
  const props = parseProps(next.slice(0, next.match(/>/)?.index ?? 0), values);
  let c: Array<ValueNode | ElementNode> = [];
  let t: number;

  next = next.slice(props.length);
  length += props.length;
  match = next.match(/^\s*\/\s*>/);

  if (match) {
    length += (match.index as number) + match[0].length;
  } else if (VOID_ELEMENTS.includes(tag)) {
    match = next.match(/^\s*>/);
    if (!match) throw new Error(`No closing bracket for void element: ${tag}`);
    t = (match.index as number) + match[0].length;
    length += t;
    next = next.slice(t);
    match = next.match(new RegExp(`<\\/(x\\-)?(${placeholder}\\d+__|${name})>`));

    if (match && (match[2] === name || getValue(match[2], values) === tag)) {
      t = (match.index as number) + match[0].length;
      match = next
        .slice(0, match.index)
        .match(new RegExp(`<(x\\-)?(${placeholder}\\d+__|${name})`));
      if (
        !match ||
        (name.startsWith(placeholder) ? getValue(match[2], values) !== tag : match[2] !== name)
      ) {
        length += t;
      }
    }
  } else if ((match = next.match(/>/)) !== null) {
    length += (match.index as number) + 1;
    next = next.slice((match.index as number) + 1);
    do {
      c = parseElement(next, values);
      t = c.reduce((acc, n) => acc + n.length, 0);
      length += t;
      next = next.slice(t);
      children.push(...c);
    } while (c.length);
    match = next.match(new RegExp(`<\\/(x\\-)?(${placeholder}\\d+__|${name})>`));
    if (match) {
      length += (match.index as number) + match[0].length;
      if (match[2].startsWith(placeholder)) {
        const v = getValue(match[2], values);

        if (v !== tag) throw new Error(`Unexpected closing. Expected ${tag}, but got ${v}`);
      }
    } else {
      console.log('error: ', next);
      console.log('original: ', str);
      console.log('\topen: ', tag, name, props.props, children);
      throw new Error(`No closing tag found for ${name}`);
    }
  } else {
    throw new Error(`Syntax error. '>' expected but not found.`);
  }

  return nodes.concat({
    type: ELEMENT,
    length,
    name,
    tag,
    children,
    props,
  } as ElementNode);
}
