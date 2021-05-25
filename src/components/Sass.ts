import type { ComponentProps } from '../../index.d';
import { createSass } from '../utils';

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
      ? `${parent.props.name ? `.${parent.props.name}` : ''}#${parent.props.id}`
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

  const css = children ? createSass(children, parent?.props)(sel) : null;

  return SITE.buildOptions.bundleStyles && css ? null : html`${css}`;
}
