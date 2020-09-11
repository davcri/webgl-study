export default class Color {
  constructor(r, g, b, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static random() {
    return new Color(
      Math.random(),
      Math.random(),
      Math.random(),
      1,
    );
  }
}

export const COLORS = {
  white: [1, 1, 1],
  magenta: [1, 0, 1],
  red: [1, 0, 0],
  black: [0, 0, 0],
  yellow: [1, 1, 0],
  green: [0, 1, 0],
  cyan: [0, 1, 1],
  blue: [0, 0, 1],
};
