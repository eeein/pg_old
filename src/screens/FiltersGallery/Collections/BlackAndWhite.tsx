import React from 'react';
import { View, SafeAreaView, Animated, Text, Dimensions } from 'react-native';
import { Shaders } from 'gl-react';
import * as Progress from 'react-native-progress';
import { useObserver } from 'mobx-react-lite';

import Gray from '../Shaders/Gray';
import GrayBlue from '../Shaders/GrayBlue';
import GrayGreen from '../Shaders/GrayGreen';

import { observer } from 'mobx-react-lite';

import { GLImage } from '../components';

import styles from '../styles';

type Props = {
  selectedPhoto: object,
  onClick: () => {}
};

const shaders = Shaders.create({
  // Saturate: {
  //   frag: GLSL`
  //     precision highp float;
  //     varying vec2 uv;
  //     uniform sampler2D t;
  //     uniform float contrast, saturation, brightness;
  //     const vec3 L = vec3(0.2125, 0.7154, 0.0721);
  //     void main() {
  //       vec4 c = texture2D(t, uv);
  //       vec3 brt = c.rgb * brightness;
  //       gl_FragColor = vec4(mix(
  //         vec3(0.5),
  //         mix(vec3(dot(brt, L)), brt, saturation),
  //         contrast), c.a);
  //     }
  //   `
  // },

});

const Filters = [
  Gray,
  Gray,
  GrayBlue,
  GrayBlue,
  GrayGreen
];

const BlackAndWhite = observer((props: Props) => {
  const [fadeAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 700,
        useNativeDriver: true
      }
    ).start();
  }, [])

  return useObserver(() =>
    props.selectedPhoto && <Animated.View style={{
      opacity: fadeAnim,
      width: Dimensions.get('window').width / 5,
      height: Dimensions.get('window').width / 5
    }}>
      {Filters.map((item, index) => <GLImage onPress={props.onClick} key={`GL_Image-${index}`} item={item} selectedPhoto={props.selectedPhoto} />)}
    </Animated.View>
  );
});

export default React.memo(BlackAndWhite);