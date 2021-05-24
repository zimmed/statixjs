import { Component, IStringable, IRender, CMap } from '../../../index.d';

export { Component, IStringable, IRender, CMap };

export const TAB_CHAR = '  ';

export type ValueNode = {
  type: 'value';
  value: IStringable;
  length: number;
};
export type PropsNode = { type: 'props'; props: { [x: string]: any }; length: number };
export type ElementNode = {
  type: 'element';
  tag: string | Component;
  props: PropsNode;
  length: number;
  children: Node[];
  name: string;
};

export type Node = ValueNode | PropsNode | ElementNode;

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
