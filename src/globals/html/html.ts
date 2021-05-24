import { ElementNode, ValueNode, CMap, placeholder, IRender } from './constants';
import parseElement from './parseElement';
import createElement from './createElement';

export default function html(splits: TemplateStringsArray, ...expressions: any[]) {
  const values = expressions.map((e) => (e === null ? '' : e));
  const str = splits
    .map((s, i) => (i ? `${placeholder}${i - 1}__${s}` : s))
    .join('')
    .replace(/[\t\n]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  let elements: Array<ElementNode | ValueNode> = [];
  let length = 0;
  let comps: CMap = {};

  do {
    elements = elements.concat(parseElement(str.slice(length), values));
    length = elements.reduce((t, n) => t + n.length, 0);
  } while (length < str.length);

  if (length > str.length) {
    throw new Error(`Length mismatch on total html: expected ${str.length} got ${length}`);
  }

  function render(
    tabIdx: number = 0,
    additionalComps: CMap = {},
    overrideConflicts: boolean = false
  ) {
    return elements
      .map((e) =>
        createElement(
          e,
          overrideConflicts ? { ...comps, ...additionalComps } : { ...additionalComps, ...comps },
          tabIdx
        )
      )
      .join('');
  }

  function run(tabIdx?: number, additionalComponents?: CMap, overrideConflicts?: boolean) {
    return render(tabIdx, additionalComponents, overrideConflicts);
  }
  run.bind = function bind(components?: CMap, name?: string) {
    if (typeof components !== 'undefined') comps = components;
    return typeof name !== 'undefined' ? run.setName(name) : run;
  };
  run.toString = function toString(
    tabIdx?: number,
    additionalComponents?: CMap,
    overrideConflicts?: boolean
  ) {
    return render(tabIdx, additionalComponents, overrideConflicts);
  };
  run.setName = function setName(name?: string) {
    Object.defineProperty(run, 'name', { value: name });
    return run;
  };
  run.minify = function minify(additionalComponents?: CMap, overrideConflicts?: boolean) {
    return render(-1, additionalComponents, overrideConflicts);
  };
  run.renderable = true as const;

  return run;
}
