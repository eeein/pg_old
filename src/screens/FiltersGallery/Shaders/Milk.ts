import { GLSL } from 'gl-react';

export default {
  frag: GLSL`
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D image;
    const vec3 L = vec3(0.2125, 0.7154, 0.0721);

    void main()
    {
        float contrast, saturation, brightness;

        contrast = 1.1;
        saturation = 0.9;
        brightness = 0.9;

        vec4 img = texture2D(image, uv);

        vec4 milkColor = vec4(0.94, 0.90, 0.65, 0.33);
        vec4 result = img + (milkColor * 0.25);
    
        vec3 brt = result.rgb * brightness;

        gl_FragColor = vec4(
            mix(vec3(0.5),
            mix(vec3(dot(brt, L)), brt, saturation), contrast), result.a
        );
    }
  `
};