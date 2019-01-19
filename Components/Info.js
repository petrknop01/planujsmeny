/**
 * Komponenta pro výpis alertu/toustu
 */

import { Toast } from "native-base";
import { Alert } from "react-native";

const Info = {
  show(message, isError) {
    if (isError) {
      Alert.alert(
        "Chyba",
        message,
        [
          { text: 'Ok', onPress: () => { }, style: 'cancel' },
        ],
        { cancelable: false }
      )
      return;
    }

    Toast.show({
      text: message,
      buttonText: "Ok",
      duration: 5000,
      position: "bottom"
    });
  }
}

export default Info;