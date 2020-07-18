import React from 'react';
import FastImage from 'react-native-fast-image-expo'
import { Dimensions, TouchableHighlight, Animated, Image } from 'react-native';
import { Node, LinearCopy, Bus } from 'gl-react';
import { Surface } from 'gl-react-expo';
import ViewShot from "react-native-view-shot";

import { colors } from '../../../styles';

type Props = {
  onPress: any,
  selectedPhoto: any,
  item: any,
  blockSize?: number
}

const GLImage = (props: Props) => {
  const [image, setImage] = React.useState(null);
  let viewShot: any = React.useRef();

  const onCapture = (url) => {
    setImage(url);
  }

  return !image
    ? <TouchableHighlight
      onPress={props.onPress}
      underlayColor={colors.main}>
      <ViewShot onCapture={onCapture} captureMode="mount">
        <Surface
          style={{
            backgroundColor: '#eee',
            width: props.blockSize,
            height: props.blockSize
          }}>
          <Node
            shader={props.item}
            uniforms={{ image: props.selectedPhoto }}
          />
        </Surface>
      </ViewShot>
    </TouchableHighlight>
    : <FastImage
      style={{ width: props.blockSize, height: props.blockSize }}
      source={{
        uri: image,
        headers: { Authorization: 'someAuthToken' },
        priority: FastImage.priority.normal,
      }}
      resizeMode={FastImage.resizeMode.contain}
    />
};

export default GLImage;