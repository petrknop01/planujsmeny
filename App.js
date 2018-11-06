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
import { Container, StyleProvider, Root } from "native-base";
import getTheme from './native-base-theme/components';
import platform from './native-base-theme/variables/platform';
import DataStore from "./Utils/dataStore";
import SplashScreen from 'react-native-splash-screen'
import LoadingScreen from "./Screens/LoadingScreen"
import Ajax from "./Utils/ajax";
import { UrlsApi } from "./Utils/urls";


export default class App extends Component {
  state = {
    address: null,
    userID: null,
    username: null,
    appKey: null,
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
          appKey: data.AppKey,
        }, () => this.relogin(this.setState({loading: false})));
      }
    });
  }

  relogin(callback = () => null) {
    const { address, userID, username, appKey } = this.state;

    Ajax.post(address + UrlsApi.relogin, { IDuser: userID, appKey: appKey })
      .then(response => {
        var cookie = response.headers.get('set-cookie');
        response.json().then(res => {
          if (res.ok == 0) {
            this.setState({ userID: null, username: null, appKey: null, address: null, cookie: null }, () => callback());
          } else {
            DataStore.SetBaseData({
              UserID: userID,
              UserName: username,
              ServerAddress: address,
              AppKey: appKey,
              Cookie: cookie
            }, () =>this.setState({ cookie: cookie }, () => callback()));
          }
        });
      })
      .catch(error => {
        callback();
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
        <LoginScreen loginOk={(userID, username, address, appKey, cookie) => this.setState({ userID, username, address, appKey, cookie })} /> :
        <Router screenProps={{ relogin: (callback) => this.relogin(callback), logOut: () => this.setState({ userID: null, username: null, appKey: null, address: null }), ...this.state }} />
    );
  }



  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
      <Root>
        <Container>
          {this.renderInner()}
        </Container>
        </Root>
      </StyleProvider>
    );
  }
}


