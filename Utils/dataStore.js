import {
  AsyncStorage
} from 'react-native';


const _app = "Planujsmeny";
const _baseKey = _app + ":BaseData";
const _myShiftsKey = _app + ":MyShifts";
const _myHome =  _app + ":Home";
const _myTimes =  _app + ":MyTimes";

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

  static GetMyShift(callback){
    AsyncStorage.getItem(_myShiftsKey, (error, value) => {
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

  static SetMyShift(data, callback){
    AsyncStorage.setItem(_myShiftsKey, JSON.stringify(data), () => callback());
  }


  static GetHome(callback){
    AsyncStorage.getItem(_myHome, (error, value) => {
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

  static SetHome(data, callback){
    AsyncStorage.setItem(_myHome, JSON.stringify(data), () => callback());
  }


  static GetMyTimes(callback){
    AsyncStorage.getItem(_myTimes, (error, value) => {
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

  static SetMyTimes(data, callback){
    AsyncStorage.setItem(_myTimes, JSON.stringify(data), () => callback());
  }

  static GetMyPlansShifts(callback){
    AsyncStorage.getItem(_myTimes, (error, value) => {
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

  static SetMyPlansShifts(data, callback){
    AsyncStorage.setItem(_myTimes, JSON.stringify(data), () => callback());
  }
}
