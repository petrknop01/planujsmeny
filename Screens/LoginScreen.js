/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, View, Image, Dimensions, TouchableOpacity, Linking, Alert } from "react-native";
import { Container, Form, Text, Content, Switch } from "native-base";
import LoadingButton from './../Components/LoadingButton';
import Input from './../Components/Input';
import DataStore from "./../Utils/dataStore";
import OfflineNotice from "./../Components/OfflineNotice";
import PropTypes from 'prop-types';
import Ajax from "./../Utils/ajax";

import { Colors } from "../Utils/variables";
import { UrlsFull, UrlsApi } from "./../Utils/urls";

const width = Dimensions.get("window").width / 2;


export default class LoginScreen extends Component {

  _loadingButton = null;
  state = {
    isPrivateServer: false,
    name: "",
    password: "",
    address: "",
    nameError: false,
    passwordError: false,
    addressError: false
  }

  constructor(props) {
    super(props)
    DataStore.ClearData(() => null);
  }

  onPressLogin = () => {
    if (!this.validation()) {
      return;
    }

    const { name, password, address, isPrivateServer } = this.state;

    this.togleLoadingButton();

    let adresa = isPrivateServer ? address : UrlsApi.base_url;

      Ajax.post(adresa + UrlsApi.login, { name: name, pw: password })
        .then(response => {
          var cookies = response.headers.get('set-cookie');         
          response.json().then(res => {
            this.togleLoadingButton();
            if (res.ok == 0) {
              this.showError(res.message);
            } else {
              this.loginOk(res.IDuser, res.username, adresa, cookies);
            }
          });
        })
        .catch(error => {
          this.showError(error.message);
          this.togleLoadingButton();
        });
  }

  validation() {
    let hasError = false;
    const { name, password, address, isPrivateServer } = this.state;

    if (name == "") {
      hasError = true;
      this.setState({ nameError: true });
    }

    if (password == "") {
      hasError = true;
      this.setState({ passwordError: true });
    }

    if (isPrivateServer && address == "") {
      hasError = true;
      this.setState({ addressError: true });
    }

    return !hasError;

  }

  showError(error) {
    Alert.alert(
      "Chyba",
      error,
      [
        { text: 'Zrušit', onPress: () => { }, style: 'cancel' },
      ],
      { cancelable: false }
    )
  }

  loginOk(userID, username, address, cookie) {
    DataStore.SetBaseData({
      UserID: userID,
      UserName: username,
      ServerAddress: address,
      Cookie: cookie
    }, () => {
      this.props.loginOk(userID, username, address, cookie)
    });
  }

  togleLoadingButton() {
    if (this._loadingButton != null) {
      this._loadingButton.togleLoading();
    }
  }

  render() {
    return (
      <Container style={{ paddingTop: Platform.select({ ios: 20, android: 0 }) }}>
        <OfflineNotice />
        <Content>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
              resizeMode="center"
              source={require("./../assets/alarm_clock.png")}
              style={{ width: width, height: width }}
            />
          </View>
          <Form>
            <View style={{ padding: 10 }}>
              <Input error={this.state.nameError} value={this.state.name} placeholder="Přihlašovací jméno" onChangeText={(name) => this.setState({ name, nameError: name == "" })} />
            </View>
            <View style={{ padding: 10 }}>
              <Input error={this.state.passwordError} value={this.state.password} placeholder="Heslo" secureTextEntry={true} onChangeText={(password) => this.setState({ password, passwordError: password == "" })} />
            </View>
            <View style={{ padding: 10, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: Colors.gray }}>Privátní server</Text>
              <Switch value={this.state.isPrivateServer} onValueChange={() => this.setState({ isPrivateServer: !this.state.isPrivateServer })} />
            </View>

            {this.state.isPrivateServer ?
              <View style={{ padding: 10 }}>
                <Input error={this.state.addressError} value={this.state.address} placeholder="Adresa serveru" onChangeText={(address) => this.setState({ address, addressError: address == "" })} />
              </View>
              : null}
            <View style={{ padding: 10 }}>
              <LoadingButton ref={(ref) => this._loadingButton = ref} block primary onPress={this.onPressLogin}><Text>Přihlásit</Text></LoadingButton>
            </View>
            <View style={{ padding: 10, flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
              <TouchableOpacity style={{ padding: 10 }} onPress={() => Linking.openURL(UrlsFull.login)}>
                <Text style={{ color: Colors.gray }}>Zapomněl jsem heslo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 10 }} onPress={() => Linking.openURL(UrlsFull.registration)}>
                <Text style={{ color: Colors.orange }}>Registrovat</Text>
              </TouchableOpacity>
            </View>
          </Form>
        </Content>
      </Container>
    );
  }
}


LoginScreen.propTypes = {
  loginOk: PropTypes.func.isRequired
}