import WebGLApp from '../../libs/mgu/webgl-app.js';
import utils from '../../libs/mgu/utils.js';

class MyApp extends WebGLApp {
  ready() {
    this.a_Position = this.gl.getAttribLocation(this.gl.program, 'a_Position');
    if (this.a_Position < 0) {
      console.log('Failed to get attribute');
    }
    this.gl.clearColor(0.1, 0.1, 0.1, 1);
    this.points = [];
    this.canvas.onclick = (event) => this.onClick(event);
  }

  onClick(event) {
    // transform mouse coordinate to webgl coordinate
    const pos = utils.getPointInWebGLCoordinates(event, this.canvas);
    this.points.push(pos);
    // clear
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  process() {
    // clear
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    // draw each point
    this.points.forEach((p) => {
      this.gl.vertexAttrib2f(this.a_Position, p.x, p.y);
      this.gl.drawArrays(this.gl.POINTS, 0, 1);
    });
  }
}

const app = new MyApp();
app.start();
