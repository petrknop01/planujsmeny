/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View, TouchableOpacity } from "react-native";
import { Container, Content, Text, Button, Icon } from "native-base";
import { Colors, FontSize } from "../Utils/variables";
import { UrlsFull, UrlsApi } from "../Utils/urls";
import Divider from "../Components/Divider";
import ShiftListItem from "../Components/ShiftListItem";
import PersonListItem from "../Components/PersonListItem";
import OfflineNotice from "./../Components/OfflineNotice";



export default class FreeShiftsAgreeScreen extends Component {

  state = {

  }

  render() {
    return (
      <Container>
        <OfflineNotice />
        <Content>
        
        </Content>
      </Container>
    );
  }
}