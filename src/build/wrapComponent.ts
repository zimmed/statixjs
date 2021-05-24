import type { Component } from '../../index.d';

export default function wrapComponent(
  Component: Component,
  opts: {
    props?: { [x: string]: any };
    children?: any[];
    replaceChildren?: boolean;
    replaceProps?: boolean;
    overrideProps?: boolean;
    insertChildren?: boolean;
  } = {}
) {
  function Wrapped({ children: c, ...props }: { [x: string]: any }, ...children: any[]) {
    const newChildren = !opts.children
      ? children
      : opts.replaceChildren
      ? opts.children
      : opts.insertChildren
      ? opts.children.concat(children)
      : children.concat(opts.children);
    const newProps = !opts.props
      ? props
      : opts.replaceProps
      ? opts.props
      : opts.overrideProps
      ? { ...props, ...opts.props }
      : { ...opts.props, ...props };

    return Component({ ...newProps, children: newChildren.join('') }, ...newChildren);
  }

  Object.defineProperty(Wrapped, 'name', { value: Component.name });
  return Wrapped;
}
