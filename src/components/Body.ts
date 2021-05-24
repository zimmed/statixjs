import type { BodyProps } from '../../index.d';

export default function Body({ scripts = SITE.scripts, style, children }: BodyProps = {}) {
  const scriptTags = scripts
    .filter((s) => !s.head)
    .map(
      ({ async, src, type = 'application/javascript' }) =>
        html`<script type="${type}" src="${src}" ${async ? ' async' : ''}></script>`
    )
    .join('\n');
  const css = style ? style() : '';

  return html`
    <body>
      ${children} ${SITE.buildOptions.externalStyles ? '' : css} ${scriptTags}
    </body>
  `;
}
