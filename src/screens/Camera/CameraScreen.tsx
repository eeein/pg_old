import { ScreenOrientation, FileSystem } from 'expo';
import * as ImageManipulator from 'expo-image-manipulator';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';

import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  Platform,
  PixelRatio,
  Dimensions
} from 'react-native';

import styles from './styles';

import {
  Ionicons,
  MaterialIcons,
  Foundation,
  MaterialCommunityIcons,
  Octicons
} from '@expo/vector-icons';

const landmarkSize = 2;

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const flashIcons = {
  off: 'flash-off',
  on: 'flash-on',
  auto: 'flash-auto',
  torch: 'highlight'
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

const wbIcons = {
  auto: 'wb-auto',
  sunny: 'wb-sunny',
  cloudy: 'wb-cloudy',
  shadow: 'beach-access',
  fluorescent: 'wb-iridescent',
  incandescent: 'wb-incandescent',
};

type Props = {
  tabLabel?: string;
  currentScreen?: number;
};

const CameraScreen = observer((props: Props) => {
  const store = useStore();
  const [state, setState] = React.useState({
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    type: 'back',
    depth: 0,
    whiteBalance: 'auto',
    ratio: '16:9',
    ratios: [],
    barcodeScanning: false,
    faceDetecting: false,
    faces: [],
    newPhotos: false,
    permissionsGranted: false,
    pictureSize: undefined,
    pictureSizes: [],
    pictureSizeId: 0,
    showGallery: false,
    showMoreOptions: false
  });

  React.useEffect(() => {
    Permissions.askAsync(Permissions.CAMERA).then(response => {
      setState({ ...state, permissionsGranted: response.permissions.camera.status === 'granted' });
    });
  }, [state.permissionsGranted]);

  let camera: any = React.useRef(null);

  const getRatios = async () => {
    const ratios = await camera.getSupportedRatios();
    return ratios;
  };

  const toggleView = () => setState({ ...state, showGallery: !state.showGallery, newPhotos: false });

  const toggleMoreOptions = () => setState({ ...state, showMoreOptions: !state.showMoreOptions });

  const toggleFacing = () => setState({ ...state, type: state.type === 'back' ? 'front' : 'back' });

  const toggleFlash = () => setState({ ...state, flash: flashModeOrder[state.flash] });

  const setRatio = ratio => setState({ ...state, ratio });

  const toggleWB = () => setState({ ...state, whiteBalance: wbOrder[state.whiteBalance] });

  const toggleFocus = () => setState({ ...state, autoFocus: state.autoFocus === 'on' ? 'off' : 'on' });

  const zoomOut = () => setState({ ...state, zoom: state.zoom - 0.1 < 0 ? 0 : state.zoom - 0.1 });

  const zoomIn = () => setState({ ...state, zoom: state.zoom + 0.1 > 1 ? 1 : state.zoom + 0.1 });

  const setFocusDepth = depth => setState({ ...state, depth });

  const toggleBarcodeScanning = () => setState({ ...state, barcodeScanning: !state.barcodeScanning });

  const toggleFaceDetection = () => setState({ ...state, faceDetecting: !state.faceDetecting });

  const takePicture = () => {
    if (camera) {
      camera.takePictureAsync({ onPictureSaved: onPictureSaved, fastMode: true });
      setTimeout(() => store.setCollectionsVisible(true), 400);
    }
  };

  const handleMountError = ({ message }) => console.error(message);

  const onPictureSaved = async photo => {
    const blockWidth = PixelRatio.getPixelSizeForLayoutSize(Dimensions.get('window').width / 1.80);
    const getSide = () => {
      return photo.width > photo.height ? 'height' : 'width';
    };

    ImageManipulator.manipulateAsync(
      photo.uri,
      [
        {
          resize: {
            [getSide()]: blockWidth
          }
        },
        {
          rotate: getSide() === 'width' ? -90 : 0
        }
      ])
      .then(img => store.setPhoto(img));


    await FileSystem.moveAsync({
      from: photo.uri,
      to: `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`,
    });


    setState({ ...state, newPhotos: true });
  }

  const onBarCodeScanned = code => {
    setState({ ...state, barcodeScanning: !state.barcodeScanning });
  };

  const onFacesDetected = ({ faces }) => setState({ ...state, faces });
  const onFaceDetectionError = state => console.warn('Faces detection error:', state);

  const collectPictureSizes = async () => {
    if (camera) {
      const pictureSizes = await camera.getAvailablePictureSizesAsync(state.ratio);
      let pictureSizeId = 0;
      if (Platform.OS === 'ios') {
        pictureSizeId = pictureSizes.indexOf('High');
      } else {
        // returned array is sorted in ascending order - default size is the largest one
        pictureSizeId = pictureSizes.length - 1;
      }
      setState({ ...state, pictureSizes, pictureSizeId, pictureSize: pictureSizes[pictureSizeId] });
    }
  };

  const previousPictureSize = () => changePictureSize(1);
  const nextPictureSize = () => changePictureSize(-1);

  const changePictureSize = direction => {
    let newId = state.pictureSizeId + direction;
    const length = state.pictureSizes.length;
    if (newId >= length) {
      newId = 0;
    } else if (newId < 0) {
      newId = length - 1;
    }
    setState({ ...state, pictureSize: state.pictureSizes[newId], pictureSizeId: newId });
  }

  // renderGallery() {
  //   return <GalleryScreen onPress={toggleView.bind(} />;
  // }

  const renderFace = ({ bounds, faceID, rollAngle, yawAngle }) => {
    return (
      <View
        key={faceID}
        //@ts-ignore
        transform={[
          { perspective: 600 },
          { rotateZ: `${rollAngle.toFixed(0)}deg` },
          { rotateY: `${yawAngle.toFixed(0)}deg` },
        ]}
        style={[
          styles.face,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}>
        <Text style={styles.faceText}>ID: {faceID}</Text>
        <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
        <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
      </View>
    );
  }

  const renderLandmarksOfFace = (face) => {
    const renderLandmark = position =>
      position && (
        <View
          style={[
            styles.landmark,
            {
              left: position.x - landmarkSize / 2,
              top: position.y - landmarkSize / 2,
            },
          ]}
        />
      );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)}
      </View>
    );
  }

  const renderFaces = () =>
    <View style={styles.facesContainer} pointerEvents="none">
      {state.faces.map(renderFace)}
    </View>

  const renderLandmarks = () =>
    <View style={styles.facesContainer} pointerEvents="none">
      {state.faces.map(renderLandmarksOfFace)}
    </View>

  const renderNoPermissions = () =>
    <View style={styles.noPermissions} />

  const renderTopBar = () =>
    <View
      style={styles.topBar}>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleFacing}>
        <Ionicons name="ios-reverse-camera" size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleFlash}>
        <MaterialIcons name={flashIcons[state.flash]} size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleWB}>
        <MaterialIcons name={wbIcons[state.whiteBalance]} size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleFocus}>
        <Text style={[styles.autoFocusLabel, { color: state.autoFocus === 'on' ? "white" : "#6b6b6b" }]}>AF</Text>
      </TouchableOpacity>
    </View>

  const renderBottomBar = () =>
    <View
      style={styles.bottomBar}>
      <TouchableOpacity style={styles.bottomButton} onPress={toggleMoreOptions}>
        <Octicons name="kebab-horizontal" size={30} color="white" />
      </TouchableOpacity>
      <View style={{ flex: 0.4 }}>
        <TouchableOpacity
          onPress={takePicture}
          style={{ alignSelf: 'center' }}
        >
          <Ionicons name="ios-radio-button-on" size={70} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.bottomButton} onPress={toggleView}>
        <View>
          <Foundation name="thumbnails" size={30} color="white" />
          {state.newPhotos && <View style={styles.newPhotosDot} />}
        </View>
      </TouchableOpacity>
    </View>

  const renderMoreOptions = () =>
    (
      <View style={styles.options}>
        <View style={styles.detectors}>
          <TouchableOpacity onPress={toggleFaceDetection}>
            <MaterialIcons name="tag-faces" size={32} color={state.faceDetecting ? "white" : "#858585"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleBarcodeScanning}>
            <MaterialCommunityIcons name="barcode-scan" size={32} color={state.barcodeScanning ? "white" : "#858585"} />
          </TouchableOpacity>
        </View>

        <View style={styles.pictureSizeContainer}>
          <Text style={styles.pictureQualityLabel}>Picture quality</Text>
          <View style={styles.pictureSizeChooser}>
            <TouchableOpacity onPress={previousPictureSize} style={{ padding: 6 }}>
              <Ionicons name="md-arrow-dropleft" size={14} color="white" />
            </TouchableOpacity>
            <View style={styles.pictureSizeLabel}>
              <Text style={{ color: 'white' }}>{state.pictureSize}</Text>
            </View>
            <TouchableOpacity onPress={nextPictureSize} style={{ padding: 6 }}>
              <Ionicons name="md-arrow-dropright" size={14} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );

  const renderCamera = () =>
    (
      <View style={{ flex: 1 }}>
        {store.currentScreen === 2 &&
          <Camera
            ref={ref => {
              camera = ref;
            }}
            style={styles.camera}
            onCameraReady={collectPictureSizes}
            type={state.type}
            flashMode={state.flash}
            autoFocus={state.autoFocus}
            zoom={state.zoom}
            whiteBalance={state.whiteBalance}
            ratio={state.ratio}
            pictureSize={state.pictureSize}
            onMountError={handleMountError}
            onFacesDetected={state.faceDetecting ? onFacesDetected : undefined}
            barCodeScannerSettings={{
              barCodeTypes: [
                BarCodeScanner.Constants.BarCodeType.qr,
                BarCodeScanner.Constants.BarCodeType.pdf417,
              ],
            }}
            onBarCodeScanned={state.barcodeScanning ? onBarCodeScanned : undefined}
          >
            {renderTopBar()}
            {renderBottomBar()}
          </Camera>}
        {state.faceDetecting && renderFaces()}
        {state.faceDetecting && renderLandmarks()}
        {state.showMoreOptions && renderMoreOptions()}
      </View>
    );

  const cameraScreenContent = state.permissionsGranted
    ? renderCamera()
    : renderNoPermissions();
  return <View style={styles.container}>{cameraScreenContent}</View>
});



export default CameraScreen;