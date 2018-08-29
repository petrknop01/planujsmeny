/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Dimensions } from "react-native";
import { Container, Spinner } from "native-base";
import DataStore from "./../Utils/dataStore";


export default class LoadingScreen extends Component {
  


  render() {
    return (
      <Container style={{ justifyContent: "center", alignItems: "center" }}>
        <Spinner size="large" />
      </Container>
    );
  }
}