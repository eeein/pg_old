import React, { useState } from 'react';
import { View, Image } from 'react-native';

import { useStore } from '../../store';

// import Logo from '../../assets/Logo';

import styles from './styles';

type Props = {
  tabLabel: string
};

const MainScreen = (props: Props) => {
  return (
    <View style={styles.wrapper}>
      {/* <Logo style={styles.logoStyles} /> */}
      <Image style={styles.logoStyles} source={require('../../assets/Logo_big_new.png')} />
    </View>
  );
};

export default MainScreen;
