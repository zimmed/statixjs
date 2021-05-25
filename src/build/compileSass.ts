export default function compileSass(src: string, selector?: string): string {
  const css = new Function('SITE', 'sass', 'extendSass', `return sass\`${src}\`;`)(
    SITE,
    sass,
    extendSass
  )(selector);

  return SITE.buildOptions.bundleStyles ? '' : css;
}
