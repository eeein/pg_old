import React, { useContext, ReactNode } from 'react';
import { useLocalStore, useObserver } from "mobx-react-lite";

function createStore() {
  const store = {
    editorVisible: false,
    collectionsVisible: false,
    selectedPhoto: null,
    selectedFilter: null,
    photoSource: null,
    currentScreen: 1,
    swiperIsLocked: false,
    swiperRef: null,
    setFilter(filter: any) {
      this.selectedFilter = filter;
    },
    setPhotoSource(photoUrl: any) {
      this.photoSource = photoUrl;
    },
    setSwiperRef(ref: any) {
      this.swiperRef = ref;
    },
    setCollectionsVisible(state: boolean) {
      this.collectionsVisible = state;

      if (!state) {
        this.selectedPhoto = null;
      }
    },
    showEditor(callback?: Function) {
      this.editorVisible = true;
      callback && callback();
    },
    hideEditor(callback?: Function) {
      this.editorVisible = false;
      callback && callback();
    },
    swiperLock() {
      this.swiperIsLocked = true;
    },
    swiperUnlock() {
      this.swiperIsLocked = false;
    },
    setCurrentScreen(screenNum) {
      this.currentScreen = screenNum;
    },
    setPhoto(photoUrl: any) {
      this.selectedPhoto = photoUrl;
    }
  };
  return store;
}

type Store = ReturnType<typeof createStore>;

const StoreContext = React.createContext<Store | null>(null);

export const StoreProvider = (props: { children?: ReactNode }) => {
  const store = useLocalStore(createStore);
  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error("useStore: !store, did you forget StoreProvider?");
  }
  return store;
};