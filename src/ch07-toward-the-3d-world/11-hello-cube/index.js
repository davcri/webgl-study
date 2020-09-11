import WebGLApp from '../../libs/mgu/webgl-app.js';
import Matrix4 from '../../libs/cuon-matrix.js';
import Vector4 from '../../libs/mgu/vector4.js';
import { COLORS } from '../../libs/mgu/color.js';

class App extends WebGLApp {
  ready() {
    this.gl.enable(this.gl.DEPTH_TEST);

    this.u_MvpMatrix = this.getUniformLocation('u_MvpMatrix');

    const { verticesColors, indices } = App.initVertices();
    this.n = indices.length; // vertices

    // see "stride" and "offset" here: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
    const stride = 6 * verticesColors.BYTES_PER_ELEMENT;
    const positionOffset = 0;
    const colorOffset = 3 * verticesColors.BYTES_PER_ELEMENT;

    const vertexBuffer = this.createBuffer();
    const indexBuffer = this.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, verticesColors, this.gl.STATIC_DRAW);

    const a_Position = this.getAttribLocation('a_Position');
    this.gl.vertexAttribPointer(a_Position, 3, this.gl.FLOAT, false, stride, positionOffset);
    this.gl.enableVertexAttribArray(a_Position);

    const a_Color = this.getAttribLocation('a_Color');
    this.gl.vertexAttribPointer(a_Color, 3, this.gl.FLOAT, false, stride, colorOffset);
    this.gl.enableVertexAttribArray(a_Color);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);

    // MVP stuff
    this.projMatrix = new Matrix4();
    this.viewMatrix = new Matrix4();
    this.modelMatrix = new Matrix4().setIdentity();
    this.nearPlane = -2.0;
    this.farPlane = 4.0;

    this.eye = new Vector4(0, 2, 10);
    this.center = new Vector4(0, 0, 0); // look at point
    this.up = new Vector4(0, 1, 0);
    this.viewMatrix.setLookAt(
      this.eye.x, this.eye.y, this.eye.z,
      this.center.x, this.center.y, this.center.z,
      this.up.x, this.up.y, this.up.z,
    );

    //
    this.gl.clearColor(0.1, 0.1, 0.1, 1); // set black as clear color
    this.draw();

    //
    this.registerOnKeyDown();
    this.addNotes();
  }

  registerOnKeyDown() {
    document.onkeydown = (ev) => {
      this.onKeyDown(ev);
    };
  }

  onKeyDown(ev) {
    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;
    if (ev.keyCode === KEY_LEFT) {
      this.modelMatrix.rotate(5, 0, 1, 1);
    }
    if (ev.keyCode === KEY_RIGHT) {
      this.modelMatrix.rotate(-5, 0, 1, 1);
    }
    this.draw();
  }

  draw() {
    this.viewMatrix.setLookAt(
      this.eye.x, this.eye.y, this.eye.z,
      this.center.x, this.center.y, this.center.z,
      this.up.x, this.up.y, this.up.z,
    );

    this.projMatrix.setPerspective(
      30, // fov y
      this.canvas.width / this.canvas.height, // aspect ratio of the frustum
      1, // near plane
      100, // far plane
    );

    this.mvpMatrix = this.projMatrix.multiply(this.viewMatrix).multiply(this.modelMatrix);
    this.gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.mvpMatrix.elements);

    // draw
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.drawElements(this.gl.TRIANGLES, this.n, this.gl.UNSIGNED_BYTE, 0);
  }

  static initVertices() {
    const verticesColors = new Float32Array([
      1, 1, 1, ...COLORS.white, // v0
      -1, 1, 1, ...COLORS.magenta, // v1
      -1, -1, 1, ...COLORS.red,
      1.0, -1.0, 1.0, ...COLORS.yellow,
      1.0, -1.0, -1.0, ...COLORS.green,
      1.0, 1.0, -1.0, ...COLORS.cyan,
      -1.0, 1.0, -1.0, ...COLORS.blue,
      -1.0, -1.0, -1.0, ...COLORS.black, // v7 Black
    ]);

    const indices = new Uint8Array([
      0, 1, 2, 0, 2, 3, // front
      0, 3, 4, 0, 4, 5, // right
      0, 5, 6, 0, 6, 1, // up
      1, 6, 7, 1, 7, 2, // left
      7, 4, 3, 7, 3, 2, // down
      4, 7, 6, 4, 6, 5, // back
    ]);

    return {
      verticesColors,
      indices,
    };
  }

  process() {
    // this.eye.x = 1 * Math.sin(this.time / 1000);
    // this.eye.y = -1 * Math.sin(this.time / 2000);

    // this.draw();
  }

  addNotes() {
    const el = document.getElementsByClassName('notes').item(0);
    el.innerHTML = 'Press left/right arrow to rotate the cube.';
  }
}

const app = new App();
app.start();
