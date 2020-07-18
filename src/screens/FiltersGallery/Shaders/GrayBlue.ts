import { GLSL } from 'gl-react';

export default {
  frag: GLSL`
      precision mediump float;
      varying vec2 uv;
      uniform sampler2D image;
      
      void main()
      {
          vec4 img = texture2D(image, uv);

          img.r = img.b;
          img.g = img.b;
          img.b = img.b;
      
          gl_FragColor = img;
      }
    `
}