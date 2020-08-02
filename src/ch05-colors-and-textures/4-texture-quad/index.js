import WebGLApp from '../../libs/mgu/webgl-app.js';

class App extends WebGLApp {
  ready() {
    this.gl.clearColor(0.1, 0.1, 0.1, 1); // set black as clear color
    this.gl.clear(this.gl.COLOR_BUFFER_BIT); // clear

    const texture = this.initTexture();
    if (!texture) {
      console.error('Error in initTexture');
      return false;
    }

    const verticesData = new Float32Array([
      // x, y, (vec2) texture coordinates
      -0.5, -0.5, 0.0, 1.0, // top left
      -0.5, +0.5, 0.0, 0.0, // bot left
      +0.5, -0.5, 1.0, 1.0, // top right
      +0.5, +0.5, 1.0, 0.0, // bot right
    ]);

    // see "stride" and "offset" here: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
    const stride = 4 * verticesData.BYTES_PER_ELEMENT;
    const positionOffset = 0;
    const textureCoordOffset = 2 * verticesData.BYTES_PER_ELEMENT;

    const vertexBuffer = this.gl.createBuffer();
    if (!vertexBuffer) console.error('Failed to create vertex buffer.');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, verticesData, this.gl.STATIC_DRAW);

    const a_Position = this.gl.getAttribLocation(this.gl.program, 'a_Position');
    if (a_Position < 0) console.error('Failed to get attribute');
    this.gl.vertexAttribPointer(a_Position, 2, this.gl.FLOAT, false, stride, positionOffset);
    this.gl.enableVertexAttribArray(a_Position);

    const a_TextureCoord = this.gl.getAttribLocation(this.gl.program, 'a_TextureCoord');
    if (a_TextureCoord < 0) console.error('Failed to get a_TextureCoord');
    this.gl.vertexAttribPointer(a_TextureCoord, 2, this.gl.FLOAT, false, stride, textureCoordOffset);
    this.gl.enableVertexAttribArray(a_TextureCoord);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  initTexture(n = 4) {
    const texture = this.gl.createTexture();
    if (!texture) {
      console.error('Failed to create texture');
      return false;
    }

    const u_Sampler = this.gl.getUniformLocation(this.gl.program, 'u_Sampler');
    if (u_Sampler < 0) {
      console.error('Failed to get the storage location of u_Sampler');
      return false;
    }

    const image = new Image();
    image.onload = () => {
      this.loadTexture(n, texture, u_Sampler, image);
    };
    image.src = './sky.jpg'; // load image
    return true;
  }

  /**
   * @param {number} n
   * @param {WebGLTexture} texture
   * @param {WebGLUniformLocation} u_Sampler
   * @param {Image} image
   */
  loadTexture(n, texture, u_Sampler, image) {
    const { gl } = this;

    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei
    const TRUE = 1;
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler, 0);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }
}

const app = new App();
app.start();
