import type { HeadProps, IStringable } from '../../index.d';

export default function Head({
  title = SITE.name,
  desc = SITE.description,
  og = { name: SITE.name, description: SITE.description },
  style,
  children,
}: HeadProps = {}) {
  const ogTags = og
    ? Object.keys(og).map(
        (key) => html`<meta property="og:${key}" name="og:${key}" content=${og[key]} />`
      )
    : '';
  const icons = SITE.icons.filter((i) => i.rel).map((props) => html`<link ${props} />`);
  const styles = SITE.styles
    .map((href) => html`<link rel="stylesheet" type="text/css" href="${href}" />`)
    .concat(
      SITE.buildOptions.bundleStyles
        ? html`<link rel="stylesheet" type="text/css" href="/css/bundle.css" />`
        : []
    );
  const manifest = SITE.buildOptions.manifest
    ? html`<link rel="manifest" href="manifest.json" />`
    : '';
  const scripts = SITE.scripts
    .filter((s) => s.head)
    .map((props) => html`<script ${props}></script>`);
  const css = style ? style() : '';

  return html`
    <head>
      <meta charset="utf8" />
      <meta name="robots" content="index,follow,NOODP,NOYDIR" />
      <meta name="description" content=${desc} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      ${ogTags}
      <title>${title}</title>
      ${manifest}${styles}${scripts}${icons}${children}${SITE.buildOptions.bundleStyles ? '' : css}
    </head>
  `;
}
