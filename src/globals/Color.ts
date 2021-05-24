function mod(n: string, f: number, b: number = 16) {
  return Math.min(255, Math.floor(parseInt(n, b) * f)).toString();
}

globalThis.Color = class Color {
  /**
   * Modify color by factor (> 1 lightens, < 1 darkens)
   */
  static mod(color: string, factor = 1) {
    if (color[0] === '#') {
      if (color.length === 7 || color.length === 9) {
        const [m, r, g, b, a = 1] =
          /^#([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])?$/i.exec(
            color
          ) || [];

        if (m) {
          return `rgba(${mod(r, factor)},${mod(g, factor)},${mod(b, factor)},${a})`;
        }
      } else if (color.length === 4) {
        const [m, r, g, b] = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(color) || [];

        if (m) {
          return `rgb(${mod(`${r}${r}`, factor)},${mod(`${g}${g}`, factor)},${mod(
            `${b}${b}`,
            factor
          )})`;
        }
      }
    } else if (color.startsWith('rgb')) {
      const [m, r, g, b, a = 1] = /^rgba?\((\d+),(\d+),(\d+),?(\d+)?\)$/i.exec(color) || [];

      if (m) {
        return `rgba(${mod(r, factor, 10)},${mod(g, factor, 10)},${mod(b, factor, 10)},${a})`;
      }
    }
    throw new Error(`Cannot use modColor on non-color string: ${color}`);
  }

  static opacity(color: string, alpha = 1) {
    const a = Math.max(0, Math.min(1, alpha));

    if (color[0] === '#') {
      if (color.length === 7 || color.length === 9) {
        const [m, r, g, b] =
          /^#([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])?$/i.exec(
            color
          ) || [];

        if (m) return `rgba(${r},${g},${b},${a})`;
      } else if (color.length === 4) {
        const [m, r, g, b] = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(color) || [];

        if (m) return `rgba(${r}${r}, ${g}${g}, ${b}${b}, ${a})`;
      }
    } else if (color.startsWith('rgb')) {
      const [m, r, g, b, a = 1] = /^rgba?\((\d+),(\d+),(\d+),?(\d+)?\)$/i.exec(color) || [];

      if (m) return `rgba(${r},${g},${b},${a})`;
    }
    throw new Error(`Cannot use modColor on non-color string: ${color}`);
  }
};
