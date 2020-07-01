import WebGLApp from '../../libs/mgu/webgl-app.js';

class MyApp extends WebGLApp {
  ready() {
    // get attribute variable
    this.a_Position = this.gl.getAttribLocation(this.gl.program, 'a_Position');
    if (this.a_Position < 0) {
      console.error('Failed to get attribute');
    }
  }

  process() {
    // set vertex attribute position
    this.gl.vertexAttrib4f(this.a_Position, 0, 0.5, 0, 1);
    // clear
    this.gl.clearColor(0.1, 0.1, 0.1, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    // draw point
    this.gl.drawArrays(this.gl.POINTS, 0, 1);
  }
}

const app = new MyApp();
app.start();
