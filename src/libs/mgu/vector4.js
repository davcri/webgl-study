export default class Vector4 {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.coords = new Float32Array([x, y, z, w]);
  }

  get x() {
    return this.coords[0];
  }

  get y() {
    return this.coords[1];
  }

  get z() {
    return this.coords[2];
  }

  get w() {
    return this.coords[3];
  }

  set x(value) {
    this.coords[0] = value;
  }

  set y(value) {
    this.coords[1] = value;
  }

  set z(value) {
    this.coords[2] = value;
  }

  set w(value) {
    this.coords[3] = value;
  }

  add(x, y = 0, z = 0) {
    this.coords[0] += x;
    this.coords[1] += y;
    this.coords[2] += z;
  }
}
