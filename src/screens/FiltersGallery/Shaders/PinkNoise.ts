import { GLSL } from 'gl-react';

export default {
  frag: GLSL`
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D image;
    
    void main()
    {
        vec4 img = texture2D(image, uv);
        vec4 gradients = vec4(1.0, 0.8, 0.9, 0.0);

        gl_FragColor = img + (gradients * 0.25);
    }
  `
};