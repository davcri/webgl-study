import WebGLApp from '../../libs/mgu/webgl-app.js';

class App extends WebGLApp {
  ready() {
    this.gl.clearColor(0.1, 0.1, 0.1, 1); // set black as clear color
    this.gl.clear(this.gl.COLOR_BUFFER_BIT); // clear

    const verticesData = new Float32Array([
      // x, y, color (rgb)
      0.0, 0.5, 1.0, 0.0, 0.0,
      -0.5, -0.5, 0.0, 1.0, 0.0,
      0.5, -0.5, 0.0, 0.0, 1.0,
    ]);
    // see "stride" and "offset" here: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
    const stride = 5 * verticesData.BYTES_PER_ELEMENT;
    const positionOffset = 0;
    const colorOffset = 2 * verticesData.BYTES_PER_ELEMENT;

    const vertexBuffer = this.gl.createBuffer();
    if (!vertexBuffer) console.error('Failed to create vertex buffer.');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);

    const a_Position = this.gl.getAttribLocation(this.gl.program, 'a_Position');
    if (a_Position < 0) console.error('Failed to get attribute');
    this.gl.bufferData(this.gl.ARRAY_BUFFER, verticesData, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(a_Position, 2, this.gl.FLOAT, false, stride, positionOffset);
    this.gl.enableVertexAttribArray(a_Position);

    const a_Color = this.gl.getAttribLocation(this.gl.program, 'a_Color');
    if (a_Color < 0) console.error('Failed to get attribute');
    this.gl.bufferData(this.gl.ARRAY_BUFFER, verticesData, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(a_Color, 3, this.gl.FLOAT, false, stride, colorOffset);
    this.gl.enableVertexAttribArray(a_Color);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
}

const app = new App();
app.start();
