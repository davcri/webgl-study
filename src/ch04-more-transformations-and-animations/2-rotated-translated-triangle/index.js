import WebGLApp from '../../libs/mgu/webgl-app.js';
import Vector4 from '../../libs/mgu/vector4.js';
import Matrix4 from '../../libs/cuon-matrix.js';

class App extends WebGLApp {
  ready() {
    // triangle data
    this.position = new Vector4(0.5, 0.0, 0.0);
    this.zRotation = 60; // degree
    this.speed = 100;
    const points = new Float32Array([
      0.0, 0.06, -0.1, -0.1, 0.1, -0.1,
    ]);
    this.modelMatrix = new Matrix4();

    this.gl.clearColor(0, 0, 0, 1);
    const a_Position = this.gl.getAttribLocation(this.gl.program, 'a_Position');
    if (a_Position < 0) {
      console.error('Failed to get attribute');
    }

    this.u_modelMatrix = this.gl.getUniformLocation(this.gl.program, 'u_modelMatrix');
    if (this.u_modelMatrix < 0) {
      console.error('Failed to get u_modelMatrix');
    }

    this.gl.uniformMatrix4fv(this.u_modelMatrix, false, this.modelMatrix.elements);

    // step 1 - create the buffer
    const vertexBuffer = this.gl.createBuffer();
    if (!vertexBuffer) console.error('Failed to create vertex buffer.');
    // step 2 - bind the buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    // step 3 - write data into the buffer
    this.gl.bufferData(this.gl.ARRAY_BUFFER, points, this.gl.STATIC_DRAW);
    // step 4 - assign the buffer object to an attribute variable
    this.gl.vertexAttribPointer(a_Position, 2, this.gl.FLOAT, false, 0, 0);
    // step 5 - enable the assignment
    this.gl.enableVertexAttribArray(a_Position);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }

  process() {
    // update triangle rotation
    this.zRotation += this.delta * this.speed;
    if (this.zRotation > 360) this.zRotation = 0;
    // update modelMatrix
    this.modelMatrix.setRotate(this.zRotation, 0, 0, 1);
    this.modelMatrix.translate(this.position.x, this.position.y, this.position.z, 1);

    // update modelMatrix uniform
    this.gl.uniformMatrix4fv(this.u_modelMatrix, false, this.modelMatrix.elements);
    // clear and draw
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
}

const app = new App();
app.start();
