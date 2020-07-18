import React, { useEffect, useState } from 'react';
import { Dimensions, PixelRatio } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Progress from 'react-native-progress';
import { observer } from 'mobx-react-lite'
import {
  CameraRoll,
  FlatList,
  Platform,
  GetPhotosParamType,
  Image,
  TouchableHighlight,
  View
} from 'react-native';

import { useStore } from '../../store';

import { colors } from '../../styles';
import styles from './styles';

type Props = {
  tabLabel: string
};

const getPhotosConfigIOS: GetPhotosParamType = {
  first: 1000,
  assetType: 'Photos',
  groupTypes: 'SavedPhotos'
};

const getPhotosConfigAndroid: GetPhotosParamType = {
  first: 1000,
  assetType: 'Photos'
};

const GalleryScreen = observer((props: Props) => {
  const store = useStore();

  const [gallery, setGallery] = useState({
    photos: [],
    status: false,
    isScrollEnded: false,
    endCursor: '',
    hasNext: false,
    isLoading: true
  });

  useEffect(() => {
    !gallery.status && CameraRoll
      .getPhotos(Platform.OS === 'android' ? getPhotosConfigAndroid : getPhotosConfigIOS)
      .then(_photos => {
        setGallery({
          photos: _photos.edges,
          isScrollEnded: false,
          endCursor: _photos.page_info.end_cursor,
          hasNext: _photos.page_info.has_next_page,
          status: true,
          isLoading: false
        });
      });
  }, [gallery.photos]);

  const viewEndDetected = () => {
    if (!gallery.isScrollEnded) {
      setGallery({ ...gallery, isScrollEnded: true });
      gallery.endCursor && gallery.hasNext && CameraRoll
        .getPhotos((() => {
          setGallery({ ...gallery, isLoading: true });
          return Platform.OS === 'android'
            ? { ...getPhotosConfigAndroid, after: gallery.endCursor }
            : { ...getPhotosConfigIOS, after: gallery.endCursor }
        })())
        .then(_photos => {
          setGallery({
            photos: _photos.edges,
            isScrollEnded: false,
            endCursor: _photos.page_info.end_cursor,
            hasNext: _photos.page_info.has_next_page,
            status: true,
            isLoading: false
          });
        });
    }
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  const handleClickImage = (image: any) => {
    store.setCollectionsVisible(true);
    store.setPhotoSource(image.node.image.uri);

    const blockWidth = PixelRatio.getPixelSizeForLayoutSize(Dimensions.get('window').width / 4);
    const getSide = () => {
      return image.node.image.width > image.node.image.height ? 'height' : 'width';
    };

    setTimeout(() => {
      ImageManipulator.manipulateAsync(
        image.node.image.uri,
        [
          {
            crop: {
              originX: image.node.image.width / 2 - image.node.image[getSide()] / 2,
              originY: image.node.image.height / 2 - image.node.image[getSide()] / 2,
              width: image.node.image[getSide()],
              height: image.node.image[getSide()]
            }
          },
          {
            resize: {
              [getSide()]: blockWidth
            }
          },
        ])
        .then(img => store.setPhoto(img));
    }, 50);
  };

  const loader = <View style={styles.loading}>
    <Progress.CircleSnail size={90} color="#c4d9e9" />
  </View>;

  const screen = <FlatList
    onScroll={({ nativeEvent }) => {
      if (isCloseToBottom(nativeEvent)) {
        viewEndDetected();
      }
    }}
    scrollEventThrottle={10000}
    removeClippedSubviews={true}
    numColumns={2}
    refreshing
    initialNumToRender={8}
    windowSize={5}
    data={gallery.photos}
    keyExtractor={(item, index) => index.toString()}
    getItemLayout={(data, index) => ({ length: styles.image.height, offset: styles.image.height * index, index })}
    renderItem={({ item, index }) => {
      return <TouchableHighlight
        underlayColor={colors.main}
        onPress={() => handleClickImage(item)}>
        <Image
          style={styles.image}
          resizeMethod="resize"
          progressiveRenderingEnabled={true}
          source={{ uri: item.node.image.uri }} />
      </TouchableHighlight>
    }}
  />;

  return gallery.isLoading ? loader : screen;
});

export default GalleryScreen;
