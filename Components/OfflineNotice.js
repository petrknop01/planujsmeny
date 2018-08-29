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
    NetInfo.isConnected.addEventListener('connectionChange', (isConnected) => this.setState({ isConnected }));
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', (isConnected) => this.setState({ isConnected }));
  }

  render() {
    if (!this.state.isConnected) {
      return (
        <View style={{ padding: 3, alignItems: "center", backgroundColor: Colors.header }}>
          <Text style={{ fontSize: FontSize.small, color: "white", textAlign: "center" }}>Offline</Text>
        </View >);
    }
    return null;
  }
}