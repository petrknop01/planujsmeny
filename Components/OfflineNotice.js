import React, { Component } from 'react';
import { View, NetInfo } from 'react-native';
import { Text } from "native-base";
import { Colors, FontSize } from "../Utils/variables";

export default class OfflineNotice extends Component {
  state = {
    isConnected: true
  };

  componentDidMount() {
    NetInfo.isConnected.fetch().then((isConnected) => this.setState({ isConnected }));
    NetInfo.isConnected.addEventListener('connectionChange', (isConnected) => {
      this.setState({ isConnected })
      if(this.props.onConectionChange){
        this.props.onConectionChange(isConnected);
      }
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', (isConnected) => this.setState({ isConnected }));
  }

  getDate() {
    if (this.props.date == null) {
      return null;
    }
    let date = new Date(this.props.date);

    return (
      this.isToday(date) ?
        (("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2)) :
        (date.getDate() + "." + (date.getMonth() + 1))
    )
  }

  isToday(td) {
    var d = new Date();
    return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
  }

  render() {
    if (!this.state.isConnected) {
      return (
        <View style={{ padding: 3, alignItems: "center", backgroundColor: Colors.header }}>
          <Text style={{ fontSize: FontSize.small, color: "white", textAlign: "center" }}>Offline {this.getDate()}</Text>
        </View >);
    }
    return null;
  }
}