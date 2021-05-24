import type { Component, IStringable } from '../../../index.d';

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
