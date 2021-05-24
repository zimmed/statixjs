import { DocumentProps } from '../../index.d';

export default function Document({
  lang = SITE.language,
  region = SITE.region,
  children,
}: DocumentProps = {}) {
  return html`<!DOCTYPE html>
    <html lang=${[lang, region].join('-')}>
      ${children}
    </html>`;
}
