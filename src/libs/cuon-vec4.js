export default class Vector4 {
  /**
   * Constructor of Vector4
   * If opt_src is specified, new vector is initialized by opt_src.
   * @param opt_src source vector(option)
   */
  constructor(opt_src) {
    const v = new Float32Array(4);
    if (opt_src && typeof opt_src === 'object') {
      v[0] = opt_src[0];
      v[1] = opt_src[1];
      v[2] = opt_src[2];
      v[3] = opt_src[3];
    }
    this.elements = v;
  }
}
