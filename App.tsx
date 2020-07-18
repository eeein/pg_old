import React from 'react';
import ScrollableTabView from "react-native-scrollable-tab-view";
import { Modal, View, Button } from 'react-native';
import * as Progress from 'react-native-progress';

import MainScreen from './src/screens/Main';
import GalleryScreen from './src/screens/Gallery';
import Editor from './src/screens/Editor';
import CameraScreen from './src/screens/Camera';
import FiltersGallery from './src/screens/FiltersGallery';

import { StoreProvider, useStore } from './src/store';
import { observer } from 'mobx-react-lite';

import styles, { colors } from './src/styles';

const App = observer(() => {
  const store = useStore();
  const changeIndex = (tab: any) => setTimeout(() => store.setCurrentScreen(tab.i), 270);

  return (
    <>
      <ScrollableTabView
        ref={(ref: any) => store.setSwiperRef(ref)}
        onChangeTab={changeIndex}
        initialPage={1}
        tabBarActiveTextColor={colors.main}
        tabBarUnderlineStyle={{ backgroundColor: colors.main }}
        tabBarPosition='bottom'
      >
        <GalleryScreen tabLabel="Gallery" />
        <MainScreen tabLabel="Main" />
        <CameraScreen tabLabel="Camera" />
      </ScrollableTabView>
      <Modal
        onRequestClose={() => store.setCollectionsVisible(false)}
        visible={store.collectionsVisible}
        animated
        animationType="fade">
        <FiltersGallery />
      </Modal>
      <Modal
        onRequestClose={() => store.hideEditor()}
        visible={store.editorVisible}
        animated
        animationType="fade">
        <Editor />
      </Modal>
    </>
  );
});

const Root = () => {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
};

export default Root;