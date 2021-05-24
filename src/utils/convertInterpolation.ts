export type FORMAT = 'hbs' | 'scss' | 'node' | 'jsx';

const FORMATS: {
  [f in FORMAT]: { openerPattern: RegExp; closerPattern: RegExp; opener: string; closer: string };
} = {
  hbs: {
    opener: '{{',
    closer: '}}',
    openerPattern: /(^|[^\\\$\{])\{\{/g,
    closerPattern: /(^|[^\\])\}\}([^\}]|$)/g,
  },
  scss: {
    opener: '#{(/*',
    closer: '*/)}',
    openerPattern: /(^|[^\\])\#\{\s*\(\s*\/\*/g,
    closerPattern: /(^|[^\\])\*\/\s*\)\s*\}/g,
  },
  node: {
    opener: '${',
    closer: '}',
    openerPattern: /(^|[^\\])\$\{/g,
    closerPattern: /(^|[^\\])\}([^\}]|$)/g,
  },
  jsx: {
    opener: '{',
    closer: '}',
    openerPattern: /(^|[^\\\{])\{/g,
    closerPattern: /(^|[^\\])\}([^\}]|$)/g,
  },
};

export default function convertInterpolation(
  content: string = '',
  format: FORMAT = 'hbs',
  target: FORMAT = 'node'
) {
  if (format === target) return content;
  const { openerPattern, closerPattern } = FORMATS[format];
  const { opener, closer } = FORMATS[target];

  return content
    .replace(openerPattern, (_, p1 = '', p2 = '') => `${p1}${opener}${p2}`)
    .replace(closerPattern, (_, p1 = '', p2 = '') => `${p1}${closer}${p2}`);
}
