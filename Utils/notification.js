var PushNotification = require('react-native-push-notification');
import {PushNotificationIOS, Platform} from "react-native";
import DataStore from "./dataStore";


class Notification {
    constructor() {
        PushNotification.configure({
            onNotification: function(notification) {
                if(Platform.OS == "ios"){
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                }
            },
    
        });
    }


    scheduleNotification(){
        DataStore.GetNotificationSetting((data) => {
            
        });
    }
}

export default Notification