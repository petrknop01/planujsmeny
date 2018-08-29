/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import Router from "./Router";
import LoginScreen from "./Screens/LoginScreen"
import { Container, StyleProvider } from "native-base";
import getTheme from './native-base-theme/components';
import platform from './native-base-theme/variables/platform';
import DataStore from "./Utils/dataStore";
import SplashScreen from 'react-native-splash-screen'
import LoadingScreen from "./Screens/LoadingScreen"

export default class App extends Component {
  state = {
    address: null,
    userID: null,
    username: null,
    cookie: null,
    loading: true
  }

  componentWillMount() {
    DataStore.GetBaseData((data) => {
      if (data == null) {
        this.setState({
          loading: false
        });
      } else {
        this.setState({
          address: data.ServerAddress,
          userID: data.UserID,
          username: data.UserName,
          cookie: data.Cookie,
          loading: false
        });
      }
    });
  }

  logOut() {
    this.setState({
      userID: null,
      username: null,
      address: null
    });
  }

  renderInner() {
    if (this.state.loading) {
      return (
        <LoadingScreen />
      )
    }

    return (
      this.state.userID == null ?
        <LoginScreen loginOk={(userID, username, address, cookie) => this.setState({ userID, username, address, cookie })} /> :
        <Router screenProps={{ logOut: () => this.setState({ userID: null, username: null, address: null }), ...this.state }} />
    );
  }



  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          {this.renderInner()}
        </Container>
      </StyleProvider>
    );
  }
}


