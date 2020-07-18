import { GLSL } from 'gl-react';

export default {
  frag: GLSL`
      precision mediump float;
      varying vec2 uv;
      uniform sampler2D image;
      
      void main()
      {
          vec4 img = texture2D(image, uv);

          img.r = img.g;
          img.g = img.g;
          img.b = img.g;
      
          gl_FragColor = img;
      }
    `
}