import type { ComponentProps } from '../../index.d';

export default function Sass({
  children,
  parent,
  selector,
  inst = true,
  cls = false,
}: ComponentProps & {
  inst?: boolean;
  cls?: boolean;
  selector?: string;
} = {}) {
  const isInstance =
    (!cls && inst) || (!cls && children && /\$\{[^\}]*\bprops\b/.test(`${children}`));
  let sel = selector;

  if (!sel && isInstance) {
    sel = parent?.props.id
      ? `#${parent?.props.id}`
      : parent
      ? `.${[parent.props.name, ...parent.props.className.split(' ')].join('.')}`
      : '';
    if (!sel)
      throw new Error(
        `Instance specific styling for ${parent?.props.name} but no parent component found for style.`
      );
  } else {
    sel = parent ? `.${parent.props.name}` : '';
  }

  const css = new Function(
    'SITE',
    'Color',
    'Break',
    'sass',
    'props',
    'return sass`' + children + '`;'
  )(
    SITE,
    Color,
    Break,
    sass,
    parent?.props || {}
  )(sel);

  return SITE.buildOptions.externalStyles ? null : html`${css}`;
}
