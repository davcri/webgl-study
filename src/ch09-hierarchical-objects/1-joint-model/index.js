import WebGLApp from '../../libs/mgu/webgl-app.js';
import Matrix4 from '../../libs/cuon-matrix.js';
import Vector4 from '../../libs/mgu/vector4.js';
import Vector3 from '../../libs/cuon-vec3.js';

class App extends WebGLApp {
  ready() {
    const {
      vertices, normals, indices,
    } = App.initVertices();
    this.n = indices.length; // vertices

    this.setupShaderParams(vertices, normals, [], indices);
    this.setupLights();

    this.g_arm1Angle = -90.0; // The rotation angle of arm1 (degrees)
    this.g_joint1Angle = 0.0; // The rotation angle of joint1 (degrees)

    // Coordinate transformation matrix
    this.g_modelMatrix = new Matrix4();
    this.g_mvpMatrix = new Matrix4();
    this.g_normalMatrix = new Matrix4(); // Coordinate transformation matrix for normals

    // MVP stuff
    this.u_MvpMatrix = this.getUniformLocation('u_MvpMatrix');
    this.u_NormalMatrix = this.getUniformLocation('u_NormalMatrix');
    this.projMatrix = new Matrix4();
    this.viewMatrix = new Matrix4();
    this.normalMatrix = new Matrix4();
    this.modelMatrix = new Matrix4().setIdentity();
    this.nearPlane = 0.0;
    this.farPlane = 50.0;

    this.eye = new Vector4(0, 10, 50);
    this.center = new Vector4(0, 0, 0); // look at point
    this.up = new Vector4(0, 1, 0);
    this.viewMatrix.setLookAt(
      this.eye.x, this.eye.y, this.eye.z,
      this.center.x, this.center.y, this.center.z,
      this.up.x, this.up.y, this.up.z,
    );

    this.modelMatrix.setTranslate(0, 1, 0);
    this.modelMatrix.rotate(90, 0, 0, 1);

    this.normalMatrix.setInverseOf(this.modelMatrix);
    this.normalMatrix.transpose();
    this.gl.uniformMatrix4fv(this.u_NormalMatrix, false, this.normalMatrix.elements);

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
    const indexBuffer = this.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);
  }

  setupLights() {
    const u_LightColor = this.getUniformLocation('u_LightColor');
    this.gl.uniform3f(u_LightColor, 0.8, 0.8, 0.8);

    // point light
    const u_LightPosition = this.getUniformLocation('u_LightPosition');
    const lightPosition = new Vector3([3.0, 0.0, 3.0]);
    this.gl.uniform3fv(u_LightPosition, lightPosition.elements);

    // directional light
    const u_LightDirection = this.getUniformLocation('u_LightDirection');
    const lightDirection = new Vector3([0.8, 0.9, 0.4]);
    lightDirection.normalize();
    this.gl.uniform3fv(u_LightDirection, lightDirection.elements);

    // ambient light
    const u_AmbientLight = this.getUniformLocation('u_AmbientLight');
    this.gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
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

    const ANGLE_STEP = 3.0; // The increments of rotation angle (degrees)

    if (ev.keyCode === KEY_UP) {
      if (this.g_joint1Angle < 135.0) this.g_joint1Angle += ANGLE_STEP;
    }
    if (ev.keyCode === KEY_DOWN) {
      if (this.g_joint1Angle > -135.0) this.g_joint1Angle -= ANGLE_STEP;
    }
    if (ev.keyCode === KEY_RIGHT) {
      this.g_arm1Angle = (this.g_arm1Angle + ANGLE_STEP) % 360;
    }
    if (ev.keyCode === KEY_LEFT) {
      this.g_arm1Angle = (this.g_arm1Angle - ANGLE_STEP) % 360;
    }
    this.draw();
  }

  process() {
    // this.normalMatrix.setInverseOf(this.modelMatrix);
    // this.normalMatrix.transpose();
    // this.gl.uniformMatrix4fv(this.u_NormalMatrix, false, this.normalMatrix.elements);
    // this.gl.uniformMatrix4fv(this.u_ModelMatrix, false, this.modelMatrix.elements);
    // this.draw();
  }

  draw() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

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

    // Arm1
    const arm1Length = 10.0; // Length of arm1
    this.g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    this.g_modelMatrix.rotate(this.g_arm1Angle, 0.0, 1.0, 0.0); // Rotate around the y-axis
    this.drawBox();

    // Arm2
    this.g_modelMatrix.translate(0.0, arm1Length, 0.0); // Move to joint1
    this.g_modelMatrix.rotate(this.g_joint1Angle, 0.0, 0.0, 1.0); // Rotate around the z-axis
    this.g_modelMatrix.scale(1.3, 1.0, 1.3); // Make it a little thicker
    this.drawBox();
  }

  // Draw the cube
  drawBox() {
    // Calculate the model view project matrix and pass it to u_MvpMatrix
    this.g_mvpMatrix.set(this.projMatrix);
    this.g_mvpMatrix.multiply(this.g_modelMatrix);
    this.gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.g_mvpMatrix.elements);
    // Calculate the normal transformation matrix and pass it to u_NormalMatrix
    this.g_normalMatrix.setInverseOf(this.g_modelMatrix);
    this.g_normalMatrix.transpose();
    this.gl.uniformMatrix4fv(this.u_NormalMatrix, false, this.g_normalMatrix.elements);
    // Draw
    this.gl.drawElements(this.gl.TRIANGLES, this.n, this.gl.UNSIGNED_BYTE, 0);
  }

  static initVertices() {
    const vertices = new Float32Array([
      1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5, 0.0, 1.5, 1.5, 0.0, 1.5, // v0-v1-v2-v3 front
      1.5, 10.0, 1.5, 1.5, 0.0, 1.5, 1.5, 0.0, -1.5, 1.5, 10.0, -1.5, // v0-v3-v4-v5 right
      1.5, 10.0, 1.5, 1.5, 10.0, -1.5, -1.5, 10.0, -1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
      -1.5, 10.0, 1.5, -1.5, 10.0, -1.5, -1.5, 0.0, -1.5, -1.5, 0.0, 1.5, // v1-v6-v7-v2 left
      -1.5, 0.0, -1.5, 1.5, 0.0, -1.5, 1.5, 0.0, 1.5, -1.5, 0.0, 1.5, // v7-v4-v3-v2 down
      1.5, 0.0, -1.5, -1.5, 0.0, -1.5, -1.5, 10.0, -1.5, 1.5, 10.0, -1.5, // v4-v7-v6-v5 back
    ]);

    // Normal
    const normals = new Float32Array([
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // v0-v1-v2-v3 front
      1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // v0-v3-v4-v5 right
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v0-v5-v6-v1 up
      -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // v7-v4-v3-v2 down
      0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    const indices = new Uint8Array([
      0, 1, 2, 0, 2, 3, // front
      4, 5, 6, 4, 6, 7, // right
      8, 9, 10, 8, 10, 11, // up
      12, 13, 14, 12, 14, 15, // left
      16, 17, 18, 16, 18, 19, // down
      20, 21, 22, 20, 22, 23, // back
    ]);

    /* eslint-enable no-multi-spaces */
    return {
      vertices,
      normals,
      indices,
    };
  }

  addNotes() {
    const el = document.getElementsByClassName('notes').item(0);
    el.innerHTML = `Use UP/DOWN to rotate the joint.<br>
    Use LEFT/RIGHT to rotate the arm.`;
  }
}

const app = new App();
app.start();
