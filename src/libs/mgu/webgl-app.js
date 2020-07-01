import { getWebGLContext, initShaders } from '../cuon-utils-module.js';
import ShaderLoader from './shader-loader.js';

const SHADER_FILES = ['shaders/shader.vert', 'shaders/shader.frag'];

export default class WebGLApp {
  constructor({ canvasId = 'canvas', shaderFiles = SHADER_FILES, bodyBgColor = 'light\gray' } = {}) {
    /**
     * @type HTMLCanvasElement
     */
    this.canvas = document.getElementById(canvasId);
    this.canvas.setAttribute('width', 600);
    this.canvas.setAttribute('height', 600);

    this.body = document.getElementsByTagName('body').item(0);
    this.body.style.backgroundColor = bodyBgColor;

    document.title = this.getTitleByCurrentURL();

    this.gl = getWebGLContext(this.canvas);
    if (!this.gl) {
      console.error('WebGL context not initialized.');
    }

    const shaderLoader = new ShaderLoader(shaderFiles);
    shaderLoader.onShaderLoaded = this.onShaderLoaded.bind(this);
    this.shaderLoader = shaderLoader;

    this.time = Date.now(); // ms
    this.previousTime = this.time; // ms
    this.delta = 0; // seconds
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
    pathArray = pathArray.filter(el => el !== "");
    return pathArray[pathArray.length - 1];
  }
}
