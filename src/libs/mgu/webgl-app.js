import { getWebGLContext, initShaders } from '../cuon-utils-module.js';
import ShaderLoader from './shader-loader.js';

const SHADER_FILES = ['shaders/shader.vert', 'shaders/shader.frag'];

export default class WebGLApp {
  constructor({ canvasId = 'canvas', shaderFiles = SHADER_FILES, bodyBgColor = 'lightgray' } = {}) {
    /**
     * @type HTMLCanvasElement
     */
    this.canvas = this.initCanvas(canvasId);
    /**
     * @type HTMLBodyElement
     */
    this.body = this.initBody(bodyBgColor);
    /**
     * @type WebGLRenderingContext
     */
    this.gl = this.initGl(this.canvas);
    /**
     * @type ShaderLoader
     */
    this.shaderLoader = new ShaderLoader(shaderFiles);

    this.time = 0; // ms
    this.previousTime = 0; // ms
    this.delta = 0; // seconds

    this.setup();
  }

  setup() {
    this.time = Date.now(); // ms
    this.previousTime = this.time; // ms
    this.delta = 0; // seconds
    this.shaderLoader.onShaderLoaded = this.onShaderLoaded.bind(this);
    document.title = this.getTitleByCurrentURL();
  }

  initCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    canvas.setAttribute('width', 600);
    canvas.setAttribute('height', 600);
    return canvas;
  }

  initBody(bodyBgColor) {
    const body = document.getElementsByTagName('body').item(0);
    body.style.backgroundColor = bodyBgColor;
    return body;
  }

  initGl(canvas) {
    const gl = getWebGLContext(canvas);
    if (!gl) {
      console.error('WebGL context not initialized.');
    }
    return gl;
  }

  start() {
    this.shaderLoader.load();
  }

  onShaderLoaded(shaders) {
    // vertex shader
    const VSHADER = shaders[0];
    // fragment shader
    const FSHADER = shaders[1];
    initShaders(this.gl, VSHADER, FSHADER);
    this.startWebGLApp();
  }

  startWebGLApp() {
    if (this.ready) this.ready();
    // start game loop
    this.update();
  }

  /**
   * Game loop.
   * Override process() to extend it.
   */
  update() {
    // update delta time
    this.previousTime = this.time;
    this.time = Date.now();
    this.delta = (this.time - this.previousTime) / 1000;

    if (this.process) this.process();

    window.requestAnimationFrame(this.update.bind(this), this.canvas);
  }

  getTitleByCurrentURL() {
    let pathArray = window.location.pathname.split('/');
    pathArray = pathArray.filter((el) => el !== '');
    return pathArray[pathArray.length - 1];
  }

  getAttribLocation(attribName) {
    const attr = this.gl.getAttribLocation(this.gl.program, attribName);
    if (attr < 0) console.error(`Failed to get ${attr}`);
    return attr;
  }

  getUniformLocation(uniformName) {
    const uniform = this.gl.getUniformLocation(this.gl.program, uniformName);
    if (uniform < 0) console.error(`Failed to get ${uniformName}`);
    return uniform;
  }
}
