import {
  AsyncStorage
} from 'react-native';


const _app = "Planujsmeny";
const _baseKey = _app + ":BaseData";


export default class DataStore {
  static GetBaseData(callback) {
    AsyncStorage.getItem(_baseKey, (error, value) => {
      if (error) {
        callback(null)
      } else {
        if (value) {
          callback(JSON.parse(value));
        } else {
          callback(null);
        }
      }
    });
  }

  static SetBaseData(data, callback) {
    AsyncStorage.setItem(_baseKey, JSON.stringify(data), () => callback());
  }

  static ClearData(callback){
    AsyncStorage.clear(() => callback());
  }
}
