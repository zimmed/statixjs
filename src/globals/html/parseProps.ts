import { placeholder, PROPS } from './constants';
import type { PropsNode } from './types';
import getValue from './getValue';
import parseValues from './parseValues';

function tryJson(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

function matchAttributes(str: string) {
  return (
    str.match(/\s*(\w[\w\-]*)=(""|".*?[^\\]")/) ||
    str.match(/\s*(\w[\w\-]*)=(''|'.*?[^\\]')/) ||
    str.match(new RegExp(`\\s*(\\w[\\w\\-]*)=(${placeholder}\\d+__)`)) ||
    str.match(new RegExp(`\\s*(${placeholder}\\d+__)`)) ||
    str.match(/\s*(\w[\w\-]+)/) // ||
    // str.match(/\s*(\w[\w\-]*)=(".*[^\\]")/) ||
    // str.match(/\s*(\w[\w\-]*)=('.*[^\\]')/)
  );
}

export default function parseProps(str: string, values: any[]): PropsNode {
  let props: { [x: string]: any } = {};
  let length = 0;
  let match = matchAttributes(str);

  while (match) {
    const propStr = match[0] as string;
    let [key, ...rest] = propStr.split('=');
    let value = rest.join('=').trim();

    length += propStr.length;
    key = key.trim();
    if (key === 'class') key = 'className';
    if (key.startsWith(placeholder) && !value) {
      value = getValue(key, values);
      if (value) {
        if (Array.isArray(value)) {
          props = { ...props, ...parseProps(value.join(' '), values).props };
        } else if (typeof value === 'object') {
          Object.keys(value).forEach((k) => {
            const v = value[k as keyof typeof value];

            if (typeof v !== 'undefined') {
              props[k] = v === null ? '' : v;
            }
          });
        } else {
          props = { ...props, ...parseProps(`${value}`, values).props };
        }
      }
    } else {
      value = value.startsWith(placeholder)
        ? getValue(value, values)
        : `'"`.includes(value[0])
        ? parseValues(value.slice(1, -1), values)
            .map((n) => n.value)
            .join('')
        : value
        ? tryJson(value)
        : true;
      props[key as string] = value;
    }
    str = str.slice(0, match.index) + str.slice((match.index as number) + propStr.length);

    match = matchAttributes(str);
  }

  return {
    type: PROPS,
    length,
    props,
  };
}
