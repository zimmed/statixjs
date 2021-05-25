export interface IStringable {
  toString(...any: any[]): string;
}

export type RenderMap = { [x: string]: IRender };

export interface IRender {
  (tabIdx?: number, additionalComponents?: CMap, overrideConflicts?: boolean): IStringable;
  toString(tabIdx?: number, additionalComponents?: CMap, overrideConflicts?: boolean): IStringable;
  bind(components?: { [x: string]: Component<any> }, name?: string): IRender;
  setName(name?: string): IRender;
  minify(additionalComponents?: CMap, overrideConflicts?: boolean): IStringable;
  name?: string;
  renderable: true;
}

export interface Component<Props extends object = any> {
  (props: Props, ...children: IStringable[]): IRender | null | undefined;
}

export type CMap = { [x: string]: Component };

export interface IColor {
  mod(color: string, factor?: number): string;
  opacity(color: string, alpha?: number): string;
}

export type BP = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface IBreak {
  inc(bp: BP): BP;
  dec(bp: BP): BP;
  query: {
    only(bp: BP): string;
    smallerThan(bp: BP): string;
    largerThan(bp: BP): string;
    between(a: BP, b: BP): string;
  };
}

export interface IConfig {
  name: string;
  shortName?: string;
  language: string;
  region: string;
  domain: string;
  description: string;
  styles: string[];
  scripts: Array<{
    type?: string;
    src: string;
    head?: boolean;
    async?: boolean;
  }>;
  icons: Array<{ rel?: string; src: string; sizes?: string; type?: string }>;
  theme: {
    breakpoints: { [p in BP]: number };
    palette: {
      bg: string;
      bgAlt: string;
      fg: string;
      fgAlt: string;
      link: string;
      linkHover: string;
    };
    font: {
      heading: string;
      body: string;
    };
  };
  buildOptions: {
    srcPath: string;
    assetsPath: string;
    websitePath: string;
    manifest?: boolean;
    bundleStyles?: boolean;
  };
  devServerOptions: {
    port: number;
  };
}

export interface ISass {
  (id?: string, nowrap?: boolean): string;
  toString(): string;
  raw(): string;
  style: true;
}

export type BodyProps = {
  scripts?: Array<{
    src: string;
    async?: boolean;
    head?: boolean;
    type?: string;
  }>;
  style?: ISass;
  children?: IStringable;
};

export type ComponentProps = {
  style?: ISass;
  id?: string;
  className?: string;
  name?: string;
  children?: IStringable;
  parent?: { constructor: Component; props: { [x: string]: any } };
};

export type DocumentProps = { lang?: string; region?: string; children?: IStringable };

export type HeadProps = {
  title?: string;
  desc?: string;
  og?: { [x: string]: string };
  style?: ISass;
  children?: IStringable;
};

export type PageProps = ComponentProps &
  DocumentProps &
  HeadProps &
  BodyProps & {
    headStyle?: ISass;
    title?: string;
    desc?: string;
  };

declare global {
  var SITE: IConfig;
  // var html: (strings: TemplateStringsArray, ...expressions: any[]) => string;
  // var jsx: (strings: TemplateStringsArray, ...expressions: any[]) => IRender;
  var html: (strings: TemplateStringsArray, ...expressions: any[]) => IRender;
  var sass: (strings: TemplateStringsArray, ...expressions: any[]) => ISass;
  var extendSass: (...args: Array<ISass | null | undefined | false>) => ISass;
  var Color: IColor;
  var Break: IBreak;
  var CURRENT_PAGE: string;
}

declare var SITE: IConfig;
// declare var html: (strings: TemplateStringsArray, ...expressions: any[]) => string;
// declare var jsx: (strings: TemplateStringsArray, ...expressions: any[]) => IRender;
declare var html: (strings: TemplateStringsArray, ...expressions: any[]) => IRender;
declare var sass: (strings: TemplateStringsArray, ...expressions: any[]) => ISass;
declare var extendsSass: (...args: Array<ISass | null | undefined | false>) => ISass;
declare var Color: IColor;
declare var Break: IBreak;
declare var CURRENT_PAGE: string;

declare module 'statixjs' {
  export type {
    PageProps,
    BodyProps,
    HeadProps,
    DocumentProps,
    ISass,
    IConfig,
    IStringable,
    IRender,
    RenderMap,
  };
  export default function buildAll(
    config?: IConfig,
    opts?: {
      prettyPrint?: boolean;
      pages?: boolean;
      hard?: boolean;
      assets?: boolean;
      manifest?: boolean;
    }
  ): void;
}

export default global;
