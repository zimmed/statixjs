import type { HeadProps, IStringable } from '../../index.d';

export default function Head({
  title = SITE.name,
  desc = SITE.description,
  og = { name: SITE.name, description: SITE.description },
  style,
  children,
}: HeadProps = {}) {
  const ogTags = og
    ? Object.keys(og)
        .map((key) => html`<meta property="og:${key}" name="og:${key}" content="${og[key]}" />`)
        .join('\n')
    : '';
  const icons = SITE.icons
    .filter((i) => i.rel)
    .map(({ rel, type, sizes, src }) => {
      const attributes = [
        `rel="${rel}"`,
        `href="${src}"`,
        sizes && `sizes="${sizes}"`,
        type && `type="${type}"`,
      ];

      return html`<link ${attributes.filter(Boolean).join(' ')} />`;
    })
    .join('\n');
  const styles = SITE.styles
    .map(
      (href) =>
        html`<link rel="stylesheet" type="text/css" href="${href}" />` as unknown as IStringable
    )
    .concat(
      SITE.buildOptions.bundleStyles
        ? (html`<link
            rel="stylesheet"
            type="text/css"
            href="/css/bundle.css"
          />` as unknown as IStringable)
        : ('' as IStringable)
    )
    .join('\n');
  const manifest = SITE.buildOptions.manifest
    ? html`<link rel="manifest" href="manifest.json" />`
    : '';
  const scripts = SITE.scripts
    .filter((s) => s.head)
    .map(
      ({ src, async, type = 'application/javascript' }) =>
        html`<script src="${src}" type="${type}" ${async ? ' async' : ''}></script>`
    )
    .join('\n');
  const css = style ? style() : '';
  const tags = [
    ogTags,
    icons,
    manifest,
    styles,
    SITE.buildOptions.bundleStyles ? '' : css,
    scripts,
    children,
  ].join('');

  return html`
    <head>
      <meta charset="utf8" />
      <meta name="robots" content="index,follow,NOODP,NOYDIR" />
      <meta name="description" content="${desc}" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      ${tags}
    </head>
  `;
}
