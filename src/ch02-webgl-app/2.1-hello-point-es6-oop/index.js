import WebGLApp from '../../libs/mgu/webgl-app.js';

class MyApp extends WebGLApp {
  process() {
    this.gl.clearColor(0.1, 0.1, 0.1, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.POINTS, 0, 1);
  }
}

const app = new MyApp();
app.start();
