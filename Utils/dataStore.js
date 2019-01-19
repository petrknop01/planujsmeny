/**
 * Třída pro ukládání dat
 */


import {
  AsyncStorage
} from 'react-native';


const _app = "Planujsmeny";
const _baseKey = _app + ":BaseData";
const _myShiftsKey = _app + ":MyShifts";
const _myHome =  _app + ":Home";
const _myTimes =  _app + ":MyTimes";
const _myPlansShift =  _app + ":MyPlans";
const _myFreeShift=  _app + ":MyFreeShift";
const _notificationSetting =  _app + ":NotificationSetting";

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
    AsyncStorage.getItem(_myPlansShift, (error, value) => {
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
    AsyncStorage.setItem(_myPlansShift, JSON.stringify(data), () => callback());
  }

  static GetMyFreeShifts(callback){
    AsyncStorage.getItem(_myFreeShift, (error, value) => {
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

  static SetMyFreeShifts(data, callback){
    AsyncStorage.setItem(_myFreeShift, JSON.stringify(data), () => callback());
  }


  static GetNotificationSetting(callback){
    let defaultSetting = {
      longTermStart: {
        enabled: true,
        value: 24
      },
      shortTermStart: {
        enabled: true,
        value: 60
      },
      endTerm: {
        enabled: false,
        value: 60
      }
    }

    AsyncStorage.getItem(_notificationSetting, (error, value) => {
      if (error) {
        callback(defaultSetting)
      } else {
        if (value) {
          callback(JSON.parse(value));
        } else {
          callback(defaultSetting);
        }
      }
    });
  }

  static SetNotificationSetting(data, callback){
    AsyncStorage.setItem(_notificationSetting, JSON.stringify(data), () => callback());
  }
}
