import React, { useState, useRef, useEffect } from 'react';
import { View, SafeAreaView, Button, CameraRoll } from 'react-native';
import { Shaders } from 'gl-react';
import * as Progress from 'react-native-progress';
import { useObserver } from 'mobx-react-lite';

import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';

import styles from './styles';

type Props = {};

const EditorScreen = observer((props: Props) => {
  const store = useStore();
  let surface: any = useRef(null);

  const [params, setParams] = useState({
    contrast: 1,
    saturation: 1,
    brightness: 1
  });

  const savePhoto = () => {
    surface.glView.capture(store.selectedPhoto.width, store.selectedPhoto.height).then(a => {
      CameraRoll.saveToCameraRoll(a.localUri, 'photo');
    });
  };

  const renderEditor = () => <SafeAreaView style={{ flex: 1 }}>
    

    <View style={{ position: 'absolute', bottom: 0 }}>
      <Button title="Close" onPress={() => store.hideEditor()} />
      <Button title="Save" onPress={() => savePhoto()} />
    </View>
  </SafeAreaView>;

  const renderLoader = () => <View style={styles.loaderContainer}>
    <Progress.CircleSnail size={90} color="#c4d9e9" />
  </View>;

  return useObserver(() =>
    store.selectedPhoto
      ? renderEditor()
      : renderLoader()
  );
});

export default EditorScreen;