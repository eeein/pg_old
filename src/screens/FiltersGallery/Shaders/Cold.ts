import { GLSL } from 'gl-react';

export default {
  frag: GLSL`
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D image;
    
    void main() {
        vec4 img = texture2D(image, uv);

        img.r = img.r * 1.2;
        img.g = img.g * 1.3;
        img.b = img.b * 1.8;
    
        gl_FragColor = img;
    }
  `
};