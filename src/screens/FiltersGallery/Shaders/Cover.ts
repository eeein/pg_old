import { GLSL } from 'gl-react';

export default {
  vert: GLSL`
  attribute vec2 _p;
  varying vec2 uv;
  uniform float zoom;
  uniform vec2 center;
  uniform float tR;
  uniform vec2 res;
  float r;
  vec2 invert (vec2 p) {
    return vec2(p.x, 1.0-p.y);
  }
  void main() {
    r = res.x / res.y;
    gl_Position = vec4(_p,0.0,1.0);
    // crop with zoom & center in a cover mode. preserving image ratio
    float maxR = max(r, tR);
    vec2 zoomedCanvasSize = vec2(
      (r / maxR) * zoom,
      (tR / maxR) * zoom
    );
    vec4 crop = vec4(
      center.x - zoomedCanvasSize.x / 2.,
      center.y - zoomedCanvasSize.y / 2.,
      zoomedCanvasSize.x,
      zoomedCanvasSize.y
    );
    // apply the crop rectangle
    uv = invert(invert(.5+.5*_p) * crop.zw + crop.xy);
  }
  `,
  frag: GLSL`
  precision highp float;
  varying vec2 uv;
  uniform sampler2D t;
  void main () {
    gl_FragColor =
      step(0.0, uv.x) *
      step(0.0, uv.y) *
      step(uv.x, 1.0) *
      step(uv.y, 1.0) *
      texture2D(t, uv);
  }
  `
};