export default class ShaderLoader {
  constructor(shaderFiles) {
    this.shaderFiles = shaderFiles;
    this.onShaderLoaded = () => {};
  }

  load() {
    const shaders = [];

    this.shaderFiles.forEach((s) => {
      shaders.push(
        fetch(s).then((f) => f.text()),
      );
    });

    Promise.all(shaders).then((loadedShaders) => {
      this.onShaderLoaded(loadedShaders);
    });
  }
}
