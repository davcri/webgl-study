// vertex shader
const VSHADER = `
void main() {
    gl_Position = vec4(0, 0, 0, 1);
    gl_PointSize = 10.0;
}
`;

// fragment shader
const FSHADER = `
void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
}
`;

// WebGL canvas setup
const canvas = document.getElementsByTagName('canvas')[0];
const gl = getWebGLContext(canvas, true);
if (!gl) {
  console.error('WebGL context not initialized.');
}

// setup shaders
if (!initShaders(gl, VSHADER, FSHADER)) {
  console.error('Error initializing shaders');
}

// WebGL clear
gl.clearColor(0.1, 0.1, 0.1, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.POINTS, 0, 1);
