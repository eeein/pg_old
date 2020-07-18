import React, { useState, useRef, useEffect } from 'react';
import { View, SafeAreaView, SectionList, Button, FlatList, Dimensions, ScrollView } from 'react-native';
import { Shaders } from 'gl-react';
import * as Progress from 'react-native-progress';
import { useObserver } from 'mobx-react-lite';
import { GLImage } from './components';

import FiltersCollection from './Collections'

import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';

import styles from './styles';

const { Base, BlackAndWhite } = FiltersCollection;

import Gray from './Shaders/Gray';
import GrayBlue from './Shaders/GrayBlue';
import GrayGreen from './Shaders/GrayGreen';
import Cold from './Shaders/Cold';
import Milk from './Shaders/Milk';
import PinkNoise from './Shaders/PinkNoise';
import Rainbow from './Shaders/Rainbow';
import Violet from './Shaders/Violet';
import Warm from './Shaders/Warm';

const allFilters = [
  { key: 0, item: Gray },
  { key: 1, item: GrayBlue },
  { key: 2, item: GrayGreen },
  { key: 3, item: Cold },
  { key: 4, item: Milk },
  { key: 5, item: PinkNoise },
  { key: 6, item: Rainbow },
  { key: 7, item: Violet },
  { key: 8, item: Warm },
  { key: 9, item: Gray },
  { key: 10, item: GrayBlue },
  { key: 11, item: GrayGreen },
  { key: 12, item: Cold },
  { key: 13, item: Milk },
  { key: 14, item: PinkNoise },
  { key: 15, item: Rainbow },
  { key: 16, item: Violet },
  { key: 17, item: Warm },
  { key: 18, item: Gray },
  { key: 19, item: GrayBlue },
  { key: 20, item: GrayGreen },
  { key: 21, item: Cold },
  { key: 22, item: Milk },
  { key: 23, item: PinkNoise },
  { key: 24, item: Rainbow },
  { key: 25, item: Violet },
  { key: 26, item: Warm },
  { key: 27, item: Gray },
  { key: 28, item: GrayBlue },
  { key: 29, item: GrayGreen },
  { key: 30, item: Cold },
  { key: 31, item: Milk },
  { key: 32, item: PinkNoise },
  { key: 33, item: Rainbow },
  { key: 34, item: Violet },
  { key: 35, item: Warm },
  { key: 36, item: Gray },
  { key: 37, item: GrayBlue },
  { key: 38, item: GrayGreen },
  { key: 39, item: Cold },
  { key: 40, item: Milk },
  { key: 41, item: PinkNoise },
  { key: 42, item: Rainbow },
  { key: 43, item: Violet },
  { key: 44, item: Warm },
  { key: 45, item: Gray },
  { key: 46, item: GrayBlue },
  { key: 47, item: GrayGreen },
  { key: 48, item: Cold },
  { key: 49, item: Milk },
  { key: 50, item: PinkNoise },
  { key: 51, item: Rainbow },
  { key: 52, item: Violet },
  { key: 53, item: Warm },
  { key: 54, item: Gray },
  { key: 55, item: GrayBlue },
  { key: 56, item: GrayGreen },
  { key: 57, item: Cold },
  { key: 58, item: Milk },
  { key: 59, item: PinkNoise },
  { key: 60, item: Rainbow },
  { key: 61, item: Violet },
  { key: 62, item: Warm },
  { key: 63, item: Gray },
  { key: 64, item: GrayBlue },
  { key: 65, item: GrayGreen },
  { key: 66, item: Cold },
  { key: 67, item: Milk },
  { key: 68, item: PinkNoise },
  { key: 69, item: Rainbow },
  { key: 70, item: Violet },
  { key: 71, item: Warm },
  { key: 72, item: Gray },
  { key: 73, item: GrayBlue },
  { key: 74, item: GrayGreen },
  { key: 75, item: Cold },
  { key: 76, item: Milk },
  { key: 77, item: PinkNoise },
  { key: 78, item: Rainbow },
  { key: 79, item: Violet },
  { key: 80, item: Warm },
  { key: 81, item: Gray },
  { key: 82, item: GrayBlue },
  { key: 83, item: GrayGreen },
  { key: 84, item: Cold },
  { key: 85, item: Milk },
  { key: 86, item: PinkNoise },
  { key: 87, item: Rainbow },
  { key: 88, item: Violet },
  { key: 89, item: Warm },
  { key: 90, item: Gray },
  { key: 91, item: GrayBlue },
  { key: 92, item: GrayGreen },
  { key: 93, item: Cold },
  { key: 94, item: Milk },
  { key: 95, item: PinkNoise },
  { key: 96, item: Rainbow },
  { key: 97, item: Violet },
  { key: 98, item: Warm },
  { key: 99, item: Gray },
  { key: 100, item: GrayBlue },
  { key: 101, item: GrayGreen },
  { key: 102, item: Cold },
  { key: 103, item: Milk },
  { key: 104, item: PinkNoise },
  { key: 105, item: Rainbow },
  { key: 106, item: Violet },
  { key: 107, item: Warm },
  { key: 108, item: Gray },
  { key: 109, item: GrayBlue },
  { key: 110, item: GrayGreen },
  { key: 111, item: Cold },
  { key: 112, item: Milk },
  { key: 113, item: PinkNoise },
  { key: 114, item: Rainbow },
  { key: 115, item: Violet },
  { key: 116, item: Warm },
  { key: 117, item: Gray },
  { key: 118, item: GrayBlue },
  { key: 119, item: GrayGreen },
  { key: 120, item: Cold },
  { key: 121, item: Milk },
  { key: 122, item: PinkNoise },
  { key: 123, item: Rainbow },
  { key: 124, item: Violet },
  { key: 125, item: Warm },
  { key: 126, item: Gray },
  { key: 127, item: GrayBlue },
  { key: 128, item: GrayGreen },
  { key: 129, item: Cold },
  { key: 130, item: Milk },
  { key: 131, item: PinkNoise },
  { key: 132, item: Rainbow },
  { key: 133, item: Violet },
  { key: 134, item: Warm },
  { key: 135, item: Gray },
  { key: 136, item: GrayBlue },
  { key: 137, item: GrayGreen },
  { key: 138, item: Cold },
  { key: 139, item: Milk },
  { key: 140, item: PinkNoise },
  { key: 141, item: Rainbow },
  { key: 142, item: Violet },
  { key: 143, item: Warm },
  { key: 144, item: Gray },
  { key: 145, item: GrayBlue },
  { key: 146, item: GrayGreen },
  { key: 147, item: Cold },
  { key: 148, item: Milk },
  { key: 149, item: PinkNoise },
  { key: 150, item: Rainbow },
  { key: 151, item: Violet },
  { key: 152, item: Warm },
  { key: 153, item: Gray },
  { key: 154, item: GrayBlue },
  { key: 155, item: GrayGreen },
  { key: 156, item: Cold },
  { key: 157, item: Milk },
  { key: 158, item: PinkNoise },
  { key: 159, item: Rainbow },
  { key: 160, item: Violet },
  { key: 161, item: Warm },
  { key: 162, item: Gray },
  { key: 163, item: GrayBlue },
  { key: 164, item: GrayGreen },
  { key: 165, item: Cold },
  { key: 166, item: Milk },
  { key: 167, item: PinkNoise },
  { key: 168, item: Rainbow },
  { key: 169, item: Violet },
  { key: 170, item: Warm },
  { key: 171, item: Gray },
  { key: 172, item: GrayBlue },
  { key: 173, item: GrayGreen },
  { key: 174, item: Cold },
  { key: 175, item: Milk },
  { key: 176, item: PinkNoise },
  { key: 177, item: Rainbow },
  { key: 178, item: Violet },
];

type Props = {};

const FilterGalleryScreen = observer((props: Props) => {
  const store = useStore();

  useEffect(() => {
    store.selectedPhoto && setTimeout(() => {
      store.swiperRef.goToPage(0)
    }, 500);
  });

  const showEditor = (filter: any) => {
    console.log('showEditor');
    console.log(filter);
    store.showEditor();
  };

  const blockSize = Dimensions.get('window').width / 4;

  const renderCollections = () => <SafeAreaView style={{ flex: 1 }}>
    {/* <SectionList
      sections={collectionSection}
      initialNumToRender={5}
      maxToRenderPerBatch={2}
      windowSize={5}
      showsHorizontalScrollIndicator
      showsVerticalScrollIndicator
      keyExtractor={(item, index) => index.toString()}
      // TODO Попробовать сделать с этим, и посмотреть, что получится
      // getItemLayout={(data, index) => ({ length: 240, offset: 240 * index, index })}
      renderItem={({ item, index }) => {
        const Elem = item;
        return <Elem
          onClick={showEditor}
          selectedPhoto={store.selectedPhoto} />
      }}
    /> */}

    <View style={styles.container}>
      <FlatList
        removeClippedSubviews={false}
        updateCellsBatchingPeriod={200}
        initialNumToRender={10}
        windowSize={2}
        numColumns={4}
        data={allFilters}
        getItemLayout={(data, index) => ({ length: blockSize, offset: blockSize * index, index })}
        renderItem={({ item }) => {
          return <GLImage
            item={item.item}
            blockSize={blockSize}
            onPress={() => showEditor(item.item)}
            selectedPhoto={store.selectedPhoto} />;
        }}
      />
    </View>

    {/* <ScrollView style={styles.container}>
      {allFilters.map(item => <GLImage
        id={item.key}
        item={item.item}
        blockSize={blockSize}
        onPress={() => showEditor(item.item)}
        selectedPhoto={store.selectedPhoto} />)}
    </ScrollView> */}

    <View style={{ position: 'absolute', bottom: 0 }}>
      <Button title="Close" onPress={() => store.setCollectionsVisible(false)} />
    </View>
  </SafeAreaView>;

  const renderLoader = () => <View style={styles.loaderContainer}>
    <Progress.CircleSnail size={90} color="#c4d9e9" />
  </View>;

  return useObserver(() =>
    store.selectedPhoto
      ? renderCollections()
      : renderLoader()
  );
});

export default FilterGalleryScreen;