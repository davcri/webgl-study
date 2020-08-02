export default class Image {
  constructor(gl, u_Sampler) {
    this.gl = gl;
    this.image = new Image();
    this.u_Sampler = u_Sampler;
    this.texture = this.initTexture();
  }

  initTexture() {
    const texture = this.gl.createTexture();
    if (!this.texture) {
      console.error('Failed to create texture');
      return false;
    }
    return texture;
  }

  loadTexture(texturePath, callback = () => {}) {
    this.image.onload = () => {
      this.onImageLoaded();
      callback();
    };
    this.image.src = texturePath; // load image
  }

  onImageLoaded() {

  }

  /**
   * @param {Image} image
   */
  bindTexture(image, textureUnit = 0) {
    const { gl, texture, u_Sampler } = this;
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // specify the texture unit for the sampler
    gl.uniform1i(u_Sampler, textureUnit);
  }
}
