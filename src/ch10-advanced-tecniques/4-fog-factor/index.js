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
    this.u_NormalMatrix = this.getUniformLocation('u_NormalMatrix');
    this.projMatrix = new Matrix4();
    this.viewMatrix = new Matrix4();
    this.normalMatrix = new Matrix4();
    this.modelMatrix = new Matrix4().setIdentity();
    this.nearPlane = -2.0;
    this.farPlane = 4.0;

    this.eye = new Vector4(3, 3, 10);
    this.center = new Vector4(0, 0, 0); // look at point
    this.up = new Vector4(0, 1, 0);
    this.viewMatrix.setLookAt(
      this.eye.x,
      this.eye.y,
      this.eye.z,
      this.center.x,
      this.center.y,
      this.center.z,
      this.up.x,
      this.up.y,
      this.up.z,
    );

    // fog
    const u_FogDist = this.getUniformLocation('u_FogDist');
    const u_FogCol = this.getUniformLocation('u_FogCol');
    this.u_Eye = this.getUniformLocation('u_Eye');
    this.fogColor = new Float32Array([0.3, 0.3, 0.3]);
    this.fogDist = new Float32Array([5.0, 20.0]);
    this.gl.uniform3fv(u_FogCol, this.fogColor);
    this.gl.uniform2fv(u_FogDist, this.fogDist);
    this.gl.uniform4fv(this.u_Eye, this.eye.coords);

    this.normalMatrix.setInverseOf(this.modelMatrix);
    this.normalMatrix.transpose();
    this.gl.uniformMatrix4fv(
      this.u_NormalMatrix,
      false,
      this.normalMatrix.elements,
    );

    const fCol = this.fogColor[0];
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clearColor(fCol, fCol, fCol, 1); // set black as clear color

    this.registerOnKeyDown();

    this.draw();

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
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      indices,
      this.gl.STATIC_DRAW,
    );
  }

  setupLights() {
    const u_LightColor = this.getUniformLocation('u_LightColor');
    this.gl.uniform3f(u_LightColor, 0.4, 0.4, 0.4);

    const u_LightPosition = this.getUniformLocation('u_LightPosition');
    const lightPosition = new Vector3([-4.0, 2.0, 3.0]);
    this.gl.uniform3fv(u_LightPosition, lightPosition.elements);

    const u_AmbientLight = this.getUniformLocation('u_AmbientLight');
    this.gl.uniform3f(u_AmbientLight, 0.4, 0.4, 0.4);
  }

  registerOnKeyDown() {
    this.inputData = {
      dragging: false,
      lastX: -1,
      lastY: -1,
    };

    document.onmousedown = (ev) => this.onMouseDown(ev);
    document.onmouseup = (ev) => this.onMouseUp(ev);
    document.onmousemove = (ev) => this.onMouseMove(ev);
  }

  onMouseDown(ev) {
    this.inputData.dragging = true;
    this.inputData.lastX = ev.clientX;
    this.inputData.lastY = ev.clientY;
  }

  onMouseUp(ev) {
    this.inputData.dragging = false;
  }

  onMouseMove(ev) {
    if (this.inputData.dragging) {
      this.onDrag(ev);
    }
  }

  onDrag(ev) {
    const x = ev.clientX;

    const factor = 100 / this.canvas.height; // The rotation ratio
    this.dz = factor * (x - this.inputData.lastX);

    this.draw();
    this.inputData.lastX = ev.clientX;
  }

  initArrayBuffer({
    data,
    num,
    attribute,
    type = this.gl.FLOAT,
    stride = 0,
    positionOffset = 0,
  } = {}) {
    const buffer = this.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    const a_attribute = this.getAttribLocation(attribute);
    this.gl.vertexAttribPointer(
      a_attribute,
      num,
      type,
      false,
      stride,
      positionOffset,
    );
    this.gl.enableVertexAttribArray(a_attribute);
    return a_attribute != -1;
  }

  process() {
    if (!this.elapsed) this.elapsed = 0;
    this.elapsed += this.delta;

    this.modelMatrix.setTranslate(0, 0, Math.sin(2 * Math.PI * 0.4 * this.elapsed) * 4);
    // this.gl.uniform1f(this.asd, 1 - Math.sin(2 * Math.PI * 0.4 * this.elapsed));
    this.gl.uniformMatrix4fv(this.u_NormalMatrix, false, this.normalMatrix.elements);
    this.gl.uniformMatrix4fv(this.u_ModelMatrix, false, this.modelMatrix.elements);
    this.draw();
  }

  draw() {
    this.viewMatrix.setLookAt(
      this.eye.x,
      this.eye.y,
      this.eye.z,
      this.center.x,
      this.center.y,
      this.center.z,
      this.up.x,
      this.up.y,
      this.up.z,
    );

    this.projMatrix.setPerspective(
      50, // fov y
      this.canvas.width / this.canvas.height, // aspect ratio of the frustum
      1, // near plane
      100, // far plane
    );

    this.mvpMatrix = this.projMatrix
      .multiply(this.viewMatrix)
      .multiply(this.modelMatrix);

    this.gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.mvpMatrix.elements);

    // draw
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.drawElements(this.gl.TRIANGLES, this.n, this.gl.UNSIGNED_BYTE, 0);
  }

  static initVertices() {
    const vertices = new Float32Array([
      /* eslint-disable no-multi-spaces */
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0, // face v0-v1-v2-v3 front
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0, // v0-v3-v4-v5 right
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0, // v0-v5-v6-v1 up
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0, // v1-v6-v7-v2 left
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0, // v7-v4-v3-v2 down
      1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0, // v4-v7-v6-v5 back
    ]);

    const normals = new Float32Array([
      // Normal
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0, // v0-v1-v2-v3 front
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0, // v0-v3-v4-v5 right
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0, // v0-v5-v6-v1 up
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0, // v1-v6-v7-v2 left
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0, // v7-v4-v3-v2 down
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0, // v4-v7-v6-v5 back
    ]);

    const colors = new Float32Array([
      // Colors
      ...COLORS.red,
      ...COLORS.red,
      ...COLORS.red,
      ...COLORS.red, // v0-v1-v2-v3 front(white)
      ...COLORS.red,
      ...COLORS.red,
      ...COLORS.red,
      ...COLORS.red, // v0-v3-v4-v5 right(white)
      ...COLORS.red,
      ...COLORS.red,
      ...COLORS.red,
      ...COLORS.red, // v0-v5-v6-v1 up(white)
      ...COLORS.red,
      ...COLORS.red,
      ...COLORS.red,
      ...COLORS.red, // v1-v6-v7-v2 left(white)
      ...COLORS.red,
      ...COLORS.red,
      ...COLORS.red,
      ...COLORS.red, // v7-v4-v3-v2 down(white)
      ...COLORS.red,
      ...COLORS.red,
      ...COLORS.red,
      ...COLORS.red, // v4-v7-v6-v5 back(white)
    ]);

    const indices = new Uint8Array([
      0,
      1,
      2,
      0,
      2,
      3, // front
      4,
      5,
      6,
      4,
      6,
      7, // right
      8,
      9,
      10,
      8,
      10,
      11, // up
      12,
      13,
      14,
      12,
      14,
      15, // left
      16,
      17,
      18,
      16,
      18,
      19, // down
      20,
      21,
      22,
      20,
      22,
      23, // back
    ]);

    /* eslint-enable no-multi-spaces */
    return {
      vertices,
      normals,
      colors,
      indices,
    };
  }

  addNotes() {
    const el = document.getElementsByClassName('notes').item(0);
    el.innerHTML = '';
  }
}

const app = new App();
app.start();
