/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { TouchableOpacity, View } from "react-native";
import { Input, Text } from "native-base";
import { Colors } from "../Utils/variables";
import DateTimePicker from 'react-native-modal-datetime-picker';
import variable from './../native-base-theme/variables/platform'


export default class InputTime extends Component {
    state = {
        isDateTimePickerVisible: false,
    };

    showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    handleDatePicked = (date) => {
        this.hideDateTimePicker();
        let time = ((date.getHours()) < 10 ? "0" : "") + (date.getHours()) + ":" +
                    ((date.getMinutes()) < 10 ? "0" : "") + (date.getMinutes());

        this.props.onChange(time);
    };

    render() {
        return (
            <View>
                <TouchableOpacity onPress={this.showDateTimePicker} style={{
                    height: variable.inputHeightBase,
                    color: variable.inputColor,
                    paddingLeft: 10,
                    paddingRight: 10,
                    flex: 1,
                    fontSize: variable.inputFontSize,
                    backgroundColor: "#EEE",
                    borderRadius: variable.borderRadiusBase,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <Text>{this.props.value}</Text>
                </TouchableOpacity>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    cancelTextIOS="Zavřít"
                    confirmTextIOS="Použít"
                    titleIOS="Vyberte čas"
                    datePickerModeAndroid="spinner"
                    mode="time"
                    is24Hour={true}
                    locale="cs"
                    date={new Date("1995-12-17T" + this.props.value + ":00")}
                />
            </View>
        );
    }
}
