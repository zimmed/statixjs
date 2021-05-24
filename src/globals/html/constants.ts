export const TAB_CHAR = '  ';

export const placeholder = `__PH${Date.now().toString(36)}__`;
export const placeholderPattern = new RegExp(`${placeholder}(\\d+)__`);

export const ELEMENT = 'element' as const;
export const VALUE = 'value' as const;
export const PROPS = 'props' as const;

export const VOID_ELEMENTS = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

export const BOOL_ATTRIBUTES = [
  'allowpaymentrequest',
  'async',
  'autocomplete',
  'autofocus',
  'autoplay',
  'checked',
  'controls',
  'default',
  'disabled',
  'formnovalidate',
  'hidden',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nomodule',
  'novalidate',
  'open',
  'playsinline',
  'readonly',
  'required',
  'reversed',
  'selected',
  'truespeed',
];
