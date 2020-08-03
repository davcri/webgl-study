import WebGLApp from '../../libs/mgu/webgl-app.js';

class App extends WebGLApp {
  ready() {
    this.gl.clearColor(0.1, 0.1, 0.1, 1); // set black as clear color
    this.gl.clear(this.gl.COLOR_BUFFER_BIT); // clear

    const verticesData = new Float32Array([
      // x, y, size
      0.0, 0.5, 10.0,
      -0.5, -0.5, 20.0,
      0.5, -0.5, 30.0,
    ]);
    // see "stride" and "offset" here: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
    const stride = 3 * verticesData.BYTES_PER_ELEMENT;
    const positionOffset = 0;
    const pointSizeOffset = 2 * verticesData.BYTES_PER_ELEMENT;

    const vertexBuffer = this.gl.createBuffer();
    if (!vertexBuffer) console.error('Failed to create vertex buffer.');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, verticesData, this.gl.STATIC_DRAW);

    const a_Position = this.gl.getAttribLocation(this.gl.program, 'a_Position');
    if (a_Position < 0) console.error('Failed to get attribute');
    this.gl.vertexAttribPointer(a_Position, 2, this.gl.FLOAT, false, stride, positionOffset);
    this.gl.enableVertexAttribArray(a_Position);

    const a_PointSize = this.gl.getAttribLocation(this.gl.program, 'a_PointSize');
    if (a_PointSize < 0) console.error('Failed to get attribute');
    this.gl.vertexAttribPointer(a_PointSize, 1, this.gl.FLOAT, false, stride, pointSizeOffset);
    this.gl.enableVertexAttribArray(a_PointSize);

    this.gl.drawArrays(this.gl.POINTS, 0, 3);
  }
}

const app = new App();
app.start();
