import cx from 'classnames';
import { ComponentProps } from '../../../index.d'; // '@zimmed/statixjs';

export type Props = ComponentProps & {
  visible?: boolean;
};

export default function MyComponent({ visible, children, style, ...props }: Props) {
  const xs = extendSass(style, sass`display: ${visible ? 'flex' : 'none'};`);

  return html` <x-Component name="MyComponent" style=${xs} ${props}>${children}</x-Component> `;
}

export function AltComponent({ visible, children, className, ...props }: Props) {
  return html`
    <x-Component name="MyComponent" className=${cx(className, { visible })} ${props}>
      <x-Style cls>display: none; &.visible { display: flex; }</x-Style>
      ${children}
    </x-Component>
  `;
}
