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

    this.g_arm1Angle = 90.0; // The rotation angle of arm1 (degrees)
    this.g_joint1Angle = 45.0; // The rotation angle of joint1 (degrees)
    this.g_joint2Angle = 0.0; // The rotation angle of joint2 (degrees)
    this.g_joint3Angle = 0.0; // The rotation angle of joint3 (degrees)

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

    this.eye = new Vector4(20, 10, 30);
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
      if (this.g_joint1Angle < 135.0) {
        this.g_joint1Angle += ANGLE_STEP;
      }
    }
    if (ev.keyCode === KEY_DOWN) {
      if (this.g_joint1Angle > -135.0) {
        this.g_joint1Angle -= ANGLE_STEP;
      }
    }
    if (ev.keyCode === KEY_RIGHT) {
      this.g_arm1Angle = (this.g_arm1Angle + ANGLE_STEP) % 360;
    }
    if (ev.keyCode === KEY_LEFT) {
      this.g_arm1Angle = (this.g_arm1Angle - ANGLE_STEP) % 360;
    }

    if (ev.keyCode === 90) { // 'ｚ'key -> the positive rotation of joint2
      this.g_joint2Angle = (this.g_joint2Angle + ANGLE_STEP) % 360;
    }
    if (ev.keyCode === 88) { // 'x'key -> the negative rotation of joint2
      this.g_joint2Angle = (this.g_joint2Angle - ANGLE_STEP) % 360;
    }
    if (ev.keyCode === 86) { // 'v'key -> the positive rotation of joint3
      if (this.g_joint3Angle < 60.0) this.g_joint3Angle = (this.g_joint3Angle + ANGLE_STEP) % 360;
    }
    if (ev.keyCode === 67) { // 'c'key -> the nagative rotation of joint3
      if (this.g_joint3Angle > -60.0) this.g_joint3Angle = (this.g_joint3Angle - ANGLE_STEP) % 360;
    }

    this.draw();
  }

  process() {
  }

  draw() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.viewMatrix.setLookAt(
      this.eye.x, this.eye.y, this.eye.z,
      this.center.x, this.center.y, this.center.z,
      this.up.x, this.up.y, this.up.z,
    );

    this.projMatrix.setPerspective(
      50, // fov y
      this.canvas.width / this.canvas.height, // aspect ratio of the frustum
      1, // near plane
      100, // far plane
    );

    this.mvpMatrix = this.projMatrix.multiply(this.viewMatrix).multiply(this.modelMatrix);
    this.gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.mvpMatrix.elements);

    // base
    const baseHeight = 2;
    this.g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    this.drawBox(10.0, baseHeight, 10.0);

    // Arm1
    const arm1Length = 10.0;
    this.g_modelMatrix.translate(0.0, baseHeight, 0.0); // Move onto the base
    this.g_modelMatrix.rotate(this.g_arm1Angle, 0.0, 1.0, 0.0); // Rotate around the y-axis
    this.drawBox(3.0, arm1Length, 3.0);

    // Arm2
    const arm2Length = 10.0;
    this.g_modelMatrix.translate(0.0, arm1Length, 0.0); // Move to joint1
    this.g_modelMatrix.rotate(this.g_joint1Angle, 0.0, 0.0, 1.0); // Rotate around the z-axis
    this.drawBox(4.0, arm2Length, 4.0); // Draw

    // A palm
    const palmLength = 2.0;
    this.g_modelMatrix.translate(0.0, arm2Length, 0.0); // Move to palm
    this.g_modelMatrix.rotate(this.g_joint2Angle, 0.0, 1.0, 0.0); // Rotate around the y-axis
    this.drawBox(2.0, palmLength, 6.0); // Draw

    // Move to the center of the tip of the palm
    this.g_modelMatrix.translate(0.0, palmLength, 0.0);

    // Draw finger1
    this.pushMatrix(this.g_modelMatrix);
    this.g_modelMatrix.translate(0.0, 0.0, 2.0);
    this.g_modelMatrix.rotate(this.g_joint3Angle, 1.0, 0.0, 0.0); // Rotate around the x-axis
    this.drawBox(1.0, 2.0, 1.0);
    this.g_modelMatrix = this.popMatrix();

    // Draw finger2
    this.g_modelMatrix.translate(0.0, 0.0, -2.0);
    this.g_modelMatrix.rotate(-this.g_joint3Angle, 1.0, 0.0, 0.0); // Rotate around the x-axis
    this.drawBox(1.0, 2.0, 1.0);
  }

  drawBox(width, height, depth) {
    this.pushMatrix(this.g_modelMatrix); // Save the model matrix
    // Scale a cube and draw
    this.g_modelMatrix.scale(width, height, depth);
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
    this.g_modelMatrix = this.popMatrix(); // Retrieve the model matrix
  }

  pushMatrix(m) {
    if (this.g_matrixStack === undefined) this.g_matrixStack = [];
    const m2 = new Matrix4(m);
    this.g_matrixStack.push(m2);
  }

  popMatrix() {
    if (this.g_matrixStack === undefined) return null;
    return this.g_matrixStack.pop();
  }

  static initVertices() {
    const vertices = new Float32Array([
      0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, 0.5, // v0-v1-v2-v3 front
      0.5, 1.0, 0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 1.0, -0.5, // v0-v3-v4-v5 right
      0.5, 1.0, 0.5, 0.5, 1.0, -0.5, -0.5, 1.0, -0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
      -0.5, 1.0, 0.5, -0.5, 1.0, -0.5, -0.5, 0.0, -0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
      -0.5, 0.0, -0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
      0.5, 0.0, -0.5, -0.5, 0.0, -0.5, -0.5, 1.0, -0.5, 0.5, 1.0, -0.5, // v4-v7-v6-v5 back
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
    Use LEFT/RIGHT to rotate the arm. <br>
    Try also Z X V C.`;
  }
}

const app = new App();
app.start();
