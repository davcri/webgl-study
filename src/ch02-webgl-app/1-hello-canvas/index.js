// take HTML canvas element
const canvas = document.getElementById('canvas');

// WebGL init
const gl = getWebGLContext(canvas);
if (!gl) {
  console.error('WebGL context not initialized.');
}

// set clear color
gl.clearColor(0, 0, 0, 1);
// clear
gl.clear(gl.COLOR_BUFFER_BIT);
