import { placeholderPattern, VALUE } from './constants';
import type { ValueNode } from './types';

export default function parseValues(str: string, values: any[]): ValueNode[] {
  const nodes: ValueNode[] = [];

  const [match, idx] = (str && str.match(placeholderPattern)) || [];

  if (match) {
    const [head, tail] = str.split(match);
    let value = values[Number(idx)];

    if (head) nodes.push({ type: VALUE, length: head.length, value: head });
    if (typeof value === 'string') value = value.trim();
    nodes.push({ type: VALUE, length: match.length, value });
    if (tail) nodes.push(...parseValues(tail, values));
  } else if (str) {
    nodes.push({ type: VALUE, length: str.length, value: str });
  }

  const t = nodes.reduce((acc, n) => acc + n.length, 0);

  if (t !== str.length) {
    console.log('str', str, 'values', values);
    console.log('nodes', JSON.stringify(nodes, null, 2));
    throw new Error(`length mismatch! expected ${str.length} got ${t}`);
  }

  return nodes;
}
