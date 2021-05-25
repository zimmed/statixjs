import type { ISass, IStringable } from '../../index.d';

export default function createSass(src: IStringable, props: { [x: string]: any } = {}): ISass {
  return new Function('SITE', 'Color', 'Break', 'sass', 'props', 'return sass`' + src + '`;')(
    SITE,
    Color,
    Break,
    sass,
    props
  );
}
