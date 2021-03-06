import { v4 } from 'uuid';
import cx from 'classnames';
import type { ComponentProps } from '../../index.d';

export default function Component({
  style,
  name = 'Component',
  id = `${name}-${v4().replace(/-/g, '')}`,
  className,
  children,
}: ComponentProps = {}) {
  const cls = cx(name, className);
  const css = style ? style(`.${name}#${id}`) : '';

  return html`
    <div data-component=${name} className=${cls} id=${id}>
      ${children} ${SITE.buildOptions.bundleStyles ? '' : css}
    </div>
  `;
}
