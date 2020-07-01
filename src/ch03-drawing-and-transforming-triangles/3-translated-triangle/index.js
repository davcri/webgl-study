import WebGLApp from '../../libs/mgu/webgl-app.js';
import Vector4 from '../../libs/mgu/vector4.js';

class App extends WebGLApp {
  ready() {
    this.position = new Vector4(0.0, 0.4, 0.0);
    this.movement = new Vector4(1, 0);
    this.speed = 2;

    this.gl.clearColor(0.1, 0.1, 0.1, 1); // set black as clear color
    this.gl.clear(this.gl.COLOR_BUFFER_BIT); // clear

    const points = new Float32Array([
      0.0, 0.06, -0.1, -0.1, 0.1, -0.1,
    ]);
    const a_Position = this.gl.getAttribLocation(this.gl.program, 'a_Position');
    if (a_Position < 0) {
      console.error('Failed to get attribute');
    }

    this.u_Translation = this.gl.getUniformLocation(this.gl.program, 'u_Translation');
    this.gl.uniform4f(this.u_Translation, this.position.x, this.position.y, this.position.z, this.position.w);

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
    // update movement
    if (this.movement.x > 0 && this.position.x > 1) {
      this.movement.x = -1;
    } else if (this.movement.x < 0 && this.position.x < -1) {
      this.movement.x = 1;
    }
    // update triangle position
    this.position.add(this.movement.x * this.delta * this.speed);

    // update translation uniform
    this.gl.uniform4f(this.u_Translation, this.position.x, this.position.y, this.position.z, this.position.w);
    // clear and draw
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
}

const app = new App();
app.start();
