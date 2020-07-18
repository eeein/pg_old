import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import Assets from '../../assets';

import styles from './styles';

const TakePhoto = props => {
  return (
    <View style={styles.mainStyles}>
      <TouchableOpacity onPress={props.onPress} style={styles.cameraIconWrapper}>
        <Assets.CameraIcon
          fill="#efefef"
          stroke="#efefef"
          width={100}
          height={100}
        />
        <Text style={styles.textStyles}>Take photo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TakePhoto;
