/**
 * Loading screen
 * - screen pro první načtení aplikace
 */

import React, { Component } from 'react';
import { Container, Spinner } from "native-base";


export default class LoadingScreen extends Component {
  
  render() {
    return (
      <Container style={{ justifyContent: "center", alignItems: "center" }}>
        <Spinner size="large" />
      </Container>
    );
  }
}