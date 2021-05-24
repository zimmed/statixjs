import { renderSync } from 'node-sass';
import { ISass, IStringable } from '../../index.d';

const compiledCss: { [x: string]: IStringable[] } = { default: [] };

function replace(
  str: string,
  start: number,
  length: number,
  predicate: ((substr: string, str: string) => IStringable) | IStringable
): string {
  const substr = str.substr(start, length);
  const r = typeof predicate === 'function' ? predicate(substr, str) : predicate;

  return `${str.substring(0, start)}${r}${str.substr(start + substr.length)}`;
}

function newLineSrc(css: string) {
  let match;
  let count = 0;
  let next = css.replace(/\s+/g, ' ');
  let i = 0;
  let t;

  do {
    match = next.substr(i).match(/(\s*[^\{\}]+\s*?\{|\}\s?)/);
    if (match) {
      i += match.index as number;
      if (match[1].startsWith('}')) {
        if (!count) {
          throw new Error(`Unexpected closing brace in sass source: ${next.substr(i - 16, 32)}`);
        }
        count -= 1;
        if (count === 0) {
          next = replace(next, i, match[0].length, '}\n');
          i += 2;
        } else {
          i += match[0].length;
        }
      } else {
        t = match[0];
        if (!count) {
          t = t.trim();
          next = replace(next, i, match[0].length, t);
        }
        count += 1;
        i += t.length;
      }
    }
  } while (match);

  if (count) {
    throw new Error(`Missing ${count} closing braces in sass source: ${next}`);
  }

  return next;
}

function addCss(css: string) {
  const lines = css.split('\n');
  const arr = compiledCss[CURRENT_PAGE];

  lines.forEach((line) => {
    if (line && !arr.includes(line)) arr.push(line);
  });
}

globalThis.sass = function sass(strings: TemplateStringsArray, ...expressions: any[]) {
  const compiled = `${strings[0]}${expressions
    .map((exp, i) => `${exp}${strings[i + 1]}`)
    .join('')}`;

  function template(selector?: string, nowrap?: boolean) {
    const css = newLineSrc(
      renderSync({
        data: selector ? `${selector} {\n${compiled}\n}` : compiled,
      }).css.toString()
    );

    addCss(css);
    return nowrap
      ? css
      : `<style data-sheet-type="${selector ? 'component' : 'root'}">\n${css}</style>`;
  }

  template.toString = () => template();
  template.raw = () => compiled;
  template.style = true as const;
  return template;
};

globalThis.extendSass = function extendSass(
  ...args: Array<ISass | null | undefined | false>
): ISass {
  const compiled = args
    .map((a) => (a ? a.raw() : false))
    .filter(Boolean)
    .join('\n');

  function template(selector?: string, nowrap?: boolean) {
    const css = newLineSrc(
      renderSync({
        data: selector ? `${selector} {\n${compiled}\n}` : compiled,
      }).css.toString()
    );

    addCss(css);
    return nowrap
      ? css
      : `<style data-sheet-type="${selector ? 'component' : 'root'}">\n${css}</style>`;
  }

  template.toString = () => template();
  template.raw = () => compiled;
  template.style = true as const;
  return template;
};

export function dumpCss(page = CURRENT_PAGE) {
  return compiledCss[page].join('\n');
}
