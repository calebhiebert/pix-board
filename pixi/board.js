let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas';
}
PIXI.utils.sayHello(type);

let app = new PIXI.Application({
  width: 1900, // default: 800
  height: 900, // default: 600
  antialias: true, // default: false
  transparent: false, // default: false
  resolution: 1, // default: 1
});
app.renderer.backgroundColor = 0x061639;
document.body.appendChild(app.view);
