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
