import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  cameraIconWrapper: {
    borderRadius: 200,
    width: 200,
    height: 200,
    borderWidth: 1,
    padding: 10,
    borderColor: '#d6d7da',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  textStyles: {
    marginTop: 16,
    color: '#ededed',
    textTransform: 'uppercase',
  },
  mainStyles: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default styles;