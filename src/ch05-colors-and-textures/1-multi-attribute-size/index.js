import WebGLApp from '../../libs/mgu/webgl-app.js';

class App extends WebGLApp {
  ready() {
    this.gl.clearColor(0.1, 0.1, 0.1, 1); // set black as clear color
    this.gl.clear(this.gl.COLOR_BUFFER_BIT); // clear

    const points = new Float32Array([
      0.0, 0.5, -0.5, -0.5, 0.5, -0.5,
    ]);
    const sizes = new Float32Array([
      10, 20, 30,
    ]);

    const a_Position = this.gl.getAttribLocation(this.gl.program, 'a_Position');
    if (a_Position < 0) console.error('Failed to get attribute');
    const vertexBuffer = this.gl.createBuffer();
    if (!vertexBuffer) console.error('Failed to create vertex buffer.');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, points, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(a_Position, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(a_Position);

    const a_PointSize = this.gl.getAttribLocation(this.gl.program, 'a_PointSize');
    if (a_PointSize < 0) console.error('Failed to get attribute');
    const sizeBuffer = this.gl.createBuffer();
    if (!sizeBuffer) console.error('Failed to initialize buffer');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, sizeBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, sizes, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(a_PointSize, 1, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(a_PointSize);

    this.gl.drawArrays(this.gl.POINTS, 0, 3);
  }
}

const app = new App();
app.start();
