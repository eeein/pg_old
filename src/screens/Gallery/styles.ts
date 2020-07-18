import { StyleSheet, Dimensions } from 'react-native';

const imageSize = Dimensions.get('window').width * 0.5;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 35,
    marginBottom: 35,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageOdd: {
    width: imageSize,
    height: imageSize,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderColor: '#fff',
    resizeMode: 'cover'
  },
  imageEven: {
    width: imageSize,
    height: imageSize,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderColor: '#fff',
    resizeMode: 'cover'
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderWidth: 2,
    borderColor: '#fff',
    resizeMode: 'cover'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default styles;