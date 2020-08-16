import WebGLApp from '../../libs/mgu/webgl-app.js';
import Matrix4 from '../../libs/cuon-matrix.js';
import Vector4 from '../../libs/mgu/vector4.js';

class App extends WebGLApp {
  ready() {
    this.gl.clearColor(0.1, 0.1, 0.1, 1); // set black as clear color
    this.gl.clear(this.gl.COLOR_BUFFER_BIT); // clear

    this.registerOnKeyDown();

    const verticesData = App.initVertices();
    this.n = 6; // vertices

    // see "stride" and "offset" here: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
    const stride = 6 * verticesData.BYTES_PER_ELEMENT;
    const positionOffset = 0;
    const colorOffset = 3 * verticesData.BYTES_PER_ELEMENT;

    const vertexBuffer = this.gl.createBuffer();
    if (!vertexBuffer) console.error('Failed to create vertex buffer.');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);

    this.u_ModelViewMatrix = this.getUniformLocation('u_ModelViewMatrix');
    this.viewMatrix = new Matrix4();
    this.eye = new Vector4(0.2, 0.2, 0.25);
    this.center = new Vector4(0, 0, 0); // look at point
    this.up = new Vector4(0, 1, 0);
    this.viewMatrix.setLookAt(
      this.eye.x, this.eye.y, this.eye.z,
      this.center.x, this.center.y, this.center.z,
      this.up.x, this.up.y, this.up.z
    );

    this.modelMatrix = new Matrix4();
    this.modelMatrix.setRotate(-10, 0, 0, 1);

    this.modelViewMatrix = this.viewMatrix.multiply(this.modelMatrix);
    this.gl.uniformMatrix4fv(this.u_ModelViewMatrix, false, this.modelViewMatrix.elements);

    const a_Position = this.getAttribLocation('a_Position');
    this.gl.bufferData(this.gl.ARRAY_BUFFER, verticesData, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(a_Position, 2, this.gl.FLOAT, false, stride, positionOffset);
    this.gl.enableVertexAttribArray(a_Position);

    const a_Color = this.getAttribLocation('a_Color');
    this.gl.bufferData(this.gl.ARRAY_BUFFER, verticesData, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(a_Color, 3, this.gl.FLOAT, false, stride, colorOffset);
    this.gl.enableVertexAttribArray(a_Color);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.n);
  }

  static initVertices() {
    const triangle1 = [
      0.0, 0.5, -0.4, 1.0, 1.0, 1.0,
      -0.5, -0.5, -0.4, 0.0, 1.0, 0.0,
      0.5, -0.5, -0.4, 1.0, 1.0, 0.0,
    ];
    const triangle2 = [
      0.5, 0.4, 0.2, 1.0, 0.4, 0.4,
      -0.5, 0.4, 0.2, 1.0, 1.0, 0.4,
      0.0, -0.6, 0.2, 1.0, 1.0, 0.4,
    ];
    return new Float32Array([
      // vec3, vec3 rgb
      ...triangle1,
      ...triangle2,
    ]);
  }

  registerOnKeyDown() {
    document.onkeydown = (ev) => {
      this.onKeyDown(ev);
    };
  }

  onKeyDown(ev) {
    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;
    const increment = 0.05;
    if (ev.keyCode === KEY_LEFT) {
      this.eye.x -= increment;
    }
    if (ev.keyCode === KEY_RIGHT) {
      this.eye.x += increment;
    }
    console.log(this.eye.x);

    this.viewMatrix.setLookAt(
      this.eye.x, this.eye.y, this.eye.z,
      this.center.x, this.center.y, this.center.z,
      this.up.x, this.up.y, this.up.z
    );

    this.modelViewMatrix = this.viewMatrix.multiply(this.modelMatrix);
    this.gl.uniformMatrix4fv(this.u_ModelViewMatrix, false, this.modelViewMatrix.elements);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.n);
  }
}

const app = new App();
app.start();
