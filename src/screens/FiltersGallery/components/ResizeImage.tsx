import React from 'react';
import { Node, GLSL, Uniform } from 'gl-react';

const ResizeImage = ({ photo }) => {
  return (
    <Node
      shader={Cover}
      uniforms={{
        tR: Uniform.textureSizeRatio(photo),
        res: Uniform.Resolution,
        t: { uri: photo.uri },
        center: [0.5, 0.5],
        zoom: 1
      }}>
    </Node>
  )
};

const Cover = {
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
      // clamp to not escape the edges
      float w = crop[2], h = crop[3];
      float ratio = w / h;
      if (w > 1.) {
        w = 1.;
        h = w / ratio;
      }
      if (h > 1.) {
        h = 1.;
        w = h * ratio;
      }
      crop = vec4(
        max(0., min(crop.x, 1.-w)),
        max(0., min(crop.y, 1.-h)),
        w,
        h
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
      gl_FragColor = texture2D(t, uv);
    }
  `
};

export default ResizeImage;