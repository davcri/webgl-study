/**
 * @param {Point} point Point in canvas coordinate
 * @param {HTMLCanvasElement} canvasElement
 */
function getPointInWebGLCoordinates(point, canvasElement) {
  const rect = canvasElement.getBoundingClientRect();
  const rectEvent = {
    x: point.x - rect.left,
    y: point.y - rect.top,
  };
  return {
    x: 2 * (rectEvent.x / (rect.width) - 0.5),
    y: -2 * (rectEvent.y / (rect.height) - 0.5),
  };
}

export default {
  getPointInWebGLCoordinates,
};
