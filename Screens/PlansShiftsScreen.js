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
import { UrlsFull, UrlsApi } from "./../Utils/urls";
import Select from "./../Components/Select";
import PlanShiftListItem from "./../Components/PlanShiftListItem";
import OfflineNotice from "./../Components/OfflineNotice";
import ModalPopup from "./../Components/ModalPopup";
import InputTime from "./../Components/InputTime";



export default class PlansShiftsScreen extends Component {

  state = {

  }

  render() {
    let items = [];
    for (let index = 1; index < 31; index++) {
      items.push(
        <PlanShiftListItem item={{
          name: "Směna " + index,
          date: new Date(2018, 0, index)
        }}
          onPressEdit={() => this._modal.showModal()}
          onPressAdd={() => this._modal.showModal()}
          key={index}
        />
      );
    }


    return (
      <Container>
        <OfflineNotice />
        <View style={{ padding: 5, flexDirection: "row", height: 60 }}>
          <View style={{ padding: 5, flex: 0.5 }}>
            <Select selected={{ label: "Leden" }} items={[{ label: "Leden" }]} onChange={(item) => console.log("onchange")} />
          </View>
          <View style={{ padding: 5, flex: 0.5 }}>
            <Select selected={{ label: "Brno - recepce" }} items={[{ label: "Brno - recepce" }]} onChange={(item) => console.log("onchange")} />
          </View>
        </View>
        <Content style={{backgroundColor: Colors.lightGray}}>
          {items}
        </Content>
        <ModalPopup ref={(ref) => this._modal = ref} onSave={() => this._modal.closeModal()}>
          <View>
            <View style={{ marginBottom: 10 }}>
              <Select selected={{ label: "Recepční" }} items={[{ label: "Recepční" }]} onChange={(item) => console.log("onchange")} />
            </View>
            <View style={{ marginBottom: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <InputTime />
              </View>
              <Text style={{ paddingHorizontal: 10 }}>-</Text>
              <View style={{ flex: 1 }}>
                <InputTime />
              </View>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Select selected={{ label: "Petr Knop" }} items={[{ label: "Petr Knop" }]} onChange={(item) => console.log("onchange")} />
            </View>
          </View>
        </ModalPopup>
      </Container >
    );
  }
}