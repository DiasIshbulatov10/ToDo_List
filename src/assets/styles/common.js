import {
  Dimensions,
  StyleSheet,
} from 'react-native';
import basicStyles from './basic';

const window = Dimensions.get('window');


export default StyleSheet.create({
  SafeAreaView: {
    flex: 1, 
    backgroundColor: '#F1F1F1' 
  },
  BackImg: {
    flex: 1,
    paddingHorizontal: 20
  },    
  centerWapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5
  },
  drawerContainer: {
    flex: 1,
  },
  DrawerImg: {
    flex: 0,
    paddingHorizontal: 20,
    height: 250
  },
  ParagraphTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#6235B2'
  },
  ParagraphContent: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222222'
  },
  ParagraphMain: {
    fontSize: 35,
    fontWeight: 'bold',
    color: basicStyles.defaultColor,
    alignSelf: 'center',
    marginVertical: 20
  },
  alignCenter: {
    flex: 0,
    alignItems: 'center',
  },
  titleArea: {
    flexDirection: 'row', 
    width: '100%', 
  },
  LoginPart: {
    padding: '5%',
    alignItems: 'center',
  },
  commonBtnSize: {
    height: 40, 
    width: '95%'
  }
});
  