# WebGL introduction

Source code created while studying the *WebGL Programming Guide* book.

![](https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.ZPxTSZCL9d9bBD4Ape9ORAHaJh%26pid%3DApi&f=1)

## Why WebGL?

![](https://lh3.googleusercontent.com/bOFHHCM7GQ37Bbtikrgralli1lckgJMPlaLFVOBCz_mMgt2CmbO2tbUJWntfz1p67aQzNvPJ25w49U72Z1fzAtBvsmOpSw=s2048)

WebGL powers many web game frameworks: Phaser, Pixi.JS,
Construct, BabylonJS, three.js, etc...

WebGL can be used for online data visualizations, simulators, games, virtual
museums, interactive configurators and many other things like:

- the [SpaceX ISS web simulation](https://iss-sim.spacex.com/)
- British Museum & Google - https://britishmuseum.withgoogle.com/
- https://www.nike-react.com/
- https://www.oeufkicetou.fr/
- https://experiments.withgoogle.com/collection/chrome

## Run the project

```sh
npm install # only the first time
npm run start
```

or the shortcut for VSCode: `CTRL+SHIFT+B` 

## Why I created this repo

I wanted some quality of life features while studying WebGL, so I added:

- Hot reload
- ES6 modules
- Clean, updated and documented code
  - Enforced style with ESLint airbnb code style
  - JSDoc for most important classes/methods
- Some fixes to the libraries provided by the book WebGL Programming Guide:
  - Fixed spelling errors
  - Converted CRLF to LF
  - Updated JSDoc
- VSCode:
  - Autocompletion working out of the box
  - Firefox debugger task (needs the Firefox debugger extensions)
  - Launch shortcut (`CTRL+SHIFT+B`)

## Resources

- https://www.khronos.org/registry/webgl/specs/1.0.3/
- https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API
- [MDN Transformation matrices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web)
-  Typed array objects - ECMA standard - http://www.ecma-international.org/ecma-262/6.0/#sec-typedarray-objects
