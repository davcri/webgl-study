import WebGLApp from '../../libs/mgu/webgl-app.js';
import Matrix4 from '../../libs/cuon-matrix.js';
import Vector4 from '../../libs/mgu/vector4.js';
import { COLORS } from '../../libs/mgu/color.js';
import Vector3 from '../../libs/cuon-vec3.js';

class App extends WebGLApp {
  ready() {
    const {
      vertices, normals, colors, indices,
    } = App.initVertices();
    this.n = indices.length; // vertices

    this.setupShaderParams(vertices, normals, colors, indices);
    this.setupLights();

    // MVP stuff
    this.u_MvpMatrix = this.getUniformLocation('u_MvpMatrix');
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
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clearColor(0.1, 0.1, 0.1, 1); // set black as clear color
    this.draw();

    //
    this.registerOnKeyDown();
    this.addNotes();
  }

  setupShaderParams(vertices, normals, colors, indices) {
    this.initArrayBuffer({
      data: vertices,
      attribute: 'a_Position',
      num: 3,
    });
    this.initArrayBuffer({
      data: normals,
      attribute: 'a_Normal',
      num: 3,
    });
    this.initArrayBuffer({
      data: colors,
      attribute: 'a_Color',
      num: 3,
    });
    const indexBuffer = this.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);
  }

  setupLights() {
    // directional light
    const u_LightColor = this.getUniformLocation('u_LightColor');
    const u_LightDirection = this.getUniformLocation('u_LightDirection');
    this.gl.uniform3f(u_LightColor, 0.8, 0.8, 0.8);
    const lightDirection = new Vector3([0.6, 0.5, 3.0]);
    lightDirection.normalize();
    this.gl.uniform3fv(u_LightDirection, lightDirection.elements);

    // ambient light
    const u_AmbientLight = this.getUniformLocation('u_AmbientLight');
    this.gl.uniform3f(u_AmbientLight, 0.3, 0.3, 0.3);
  }

  registerOnKeyDown() {
    document.onkeydown = (ev) => {
      this.onKeyDown(ev);
    };
  }

  initArrayBuffer({
    data, num, attribute, type = this.gl.FLOAT, stride = 0, positionOffset = 0,
  } = {}) {
    const buffer = this.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    const a_attribute = this.getAttribLocation(attribute);
    this.gl.vertexAttribPointer(a_attribute, num, type, false, stride, positionOffset);
    this.gl.enableVertexAttribArray(a_attribute);
    return a_attribute != -1;
  }

  onKeyDown(ev) {
    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;
    const KEY_UP = 38;
    const KEY_DOWN = 40;
    if (ev.keyCode === KEY_UP) {
    }
    if (ev.keyCode === KEY_DOWN) {
    }
    if (ev.keyCode === KEY_RIGHT) {
    }
    if (ev.keyCode === KEY_LEFT) {
    }
    // this.draw();
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
    const vertices = new Float32Array([
      /* eslint-disable no-multi-spaces */
      1.0, 1.0, 1.0,    -1.0, 1.0, 1.0,  -1.0, -1.0, 1.0,   1.0, -1.0, 1.0, // face v0-v1-v2-v3 front
      1.0, 1.0, 1.0,    1.0, -1.0, 1.0,   1.0, -1.0, -1.0,   1.0, 1.0, -1.0, // v0-v3-v4-v5 right
      1.0, 1.0, 1.0,    1.0, 1.0, -1.0,  -1.0, 1.0, -1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
      -1.0, 1.0, 1.0,   -1.0, 1.0, -1.0,  -1.0, -1.0, -1.0,  -1.0, -1.0, 1.0, // v1-v6-v7-v2 left
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0,   1.0, -1.0, 1.0,  -1.0, -1.0, 1.0, // v7-v4-v3-v2 down
      1.0, -1.0, -1.0,  -1.0, -1.0, -1.0,  -1.0, 1.0, -1.0,   1.0, 1.0, -1.0, // v4-v7-v6-v5 back
    ]);

    const normals = new Float32Array([    // Normal
      0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
      1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
      0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
      -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
      0.0, -1.0, 0.0,   0.0, -1.0, 0.0,   0.0, -1.0, 0.0,   0.0, -1.0, 0.0,  // v7-v4-v3-v2 down
      0.0, 0.0, -1.0,   0.0, 0.0, -1.0,   0.0, 0.0, -1.0,   0.0, 0.0, -1.0,   // v4-v7-v6-v5 back
    ]);

    const colors = new Float32Array([     // Colors
      ...COLORS.red,  ...COLORS.red,  ...COLORS.red,  ...COLORS.red,  // v0-v1-v2-v3 front(white)
      ...COLORS.red,  ...COLORS.red,  ...COLORS.red,  ...COLORS.red,  // v0-v3-v4-v5 right(white)
      ...COLORS.red,  ...COLORS.red,  ...COLORS.red,  ...COLORS.red,  // v0-v5-v6-v1 up(white)
      ...COLORS.red,  ...COLORS.red,  ...COLORS.red,  ...COLORS.red,  // v1-v6-v7-v2 left(white)
      ...COLORS.red,  ...COLORS.red,  ...COLORS.red,  ...COLORS.red,  // v7-v4-v3-v2 down(white)
      ...COLORS.red,  ...COLORS.red,  ...COLORS.red,  ...COLORS.red,   // v4-v7-v6-v5 back(white)
    ]);

    const indices = new Uint8Array([
      0, 1, 2,   0, 2, 3,    // front
      4, 5, 6,   4, 6, 7,    // right
      8, 9, 10,   8, 10, 11,    // up
      12, 13, 14,  12, 14, 15,    // left
      16, 17, 18,  16, 18, 19,    // down
      20, 21, 22,  20, 22, 23,     // back
    ]);

    /* eslint-enable no-multi-spaces */
    return {
      vertices,
      normals,
      colors,
      indices,
    };
  }

  process() {
    this.eye.x = 10 * Math.sin(this.time / 2000);
    this.eye.y = 3 * Math.sin(this.time / 2000);
    this.draw();
  }

  addNotes() {
    const el = document.getElementsByClassName('notes').item(0);
    el.innerHTML = '';
  }
}

const app = new App();
app.start();
