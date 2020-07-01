
import Color from '../../libs/mgu/color.js';
import WebGLApp from '../../libs/mgu/webgl-app.js';
import utils from '../../libs/mgu/utils.js';

class MyApp extends WebGLApp {
  ready() {
    this.points = [];
    // get attribute and uniform variables
    this.a_Position = this.gl.getAttribLocation(this.gl.program, 'a_Position');
    this.u_FragCol = this.gl.getUniformLocation(this.gl.program, 'u_FragColor');
    if (this.a_Position < 0 || this.u_FragCol < 0) {
      console.error('Failed to get attribute or uniform');
    }
    // clear color
    this.gl.clearColor(0.1, 0.1, 0.1, 1);
    // register onClick callback
    this.canvas.onclick = (event) => { this.onClick(event); };
  }

  onClick(event) {
    const pos = utils.getPointInWebGLCoordinates(event, this.canvas);
    this.points.push({
      x: pos.x,
      y: pos.y,
      color: Color.random(),
    });
  }

  process() {
    // clear
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    // draw each point
    this.points.forEach((p) => {
      this.gl.vertexAttrib2f(this.a_Position, p.x, p.y);
      this.gl.uniform4f(this.u_FragCol, p.color.r, p.color.g, p.color.b, p.color.a);
      this.gl.drawArrays(this.gl.POINTS, 0, 1);
    });
  }
}

const app = new MyApp();
app.start();
