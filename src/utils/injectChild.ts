import { v4 } from 'uuid';
import { Component, ComponentProps, IRender } from '../../index.d';
import { CMap } from '../globals/html/constants';

export default function injectChild(
  Parent: Component,
  Child: Component,
  insert?: boolean
): Component {
  function AnonComponent({ children: childrenStr, ...props }: ComponentProps, ...children: any[]) {
    const parent = { constructor: Parent, props: { ...props, children: null } };
    let comps = {};

    function render(tabIdx: number = 0, additionalComponents?: CMap, overrideConflicts?: boolean) {
      const child = Child({
        name: Child.name,
        id: `${Child.name}-${v4().replace(/\-/, '')}`,
        parent,
        children: '',
      });

      const childContent =
        child?.toString(tabIdx === -1 ? -1 : tabIdx + 1, additionalComponents, overrideConflicts) ||
        '';

      return (
        Parent(
          {
            ...props,
            children: insert ? `${childContent}${childrenStr}` : `${childrenStr}${childContent}`,
          },
          ...(insert ? [childContent].concat(children) : children.concat(childContent))
        )?.toString(tabIdx, additionalComponents, overrideConflicts) || ''
      );
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
    run.renderable = true;

    return run as IRender;
  }

  Object.defineProperty(AnonComponent, 'name', { value: Parent.name });
  return AnonComponent;
}
