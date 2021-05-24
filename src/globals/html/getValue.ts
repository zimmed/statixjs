import { placeholderPattern } from './constants';

export default function getValue(str: string, values: any[]): any {
  const [, idx] = str.match(placeholderPattern) || [];

  return idx && values[Number(idx)];
}
