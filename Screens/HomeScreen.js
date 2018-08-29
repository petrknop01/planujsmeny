/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View, TouchableOpacity } from "react-native";
import { Container, Content, Text, Button, Icon, Spinner } from "native-base";
import { Colors, FontSize } from "../Utils/variables";
import Divider from "./../Components/Divider";
import ShiftListItem from "./../Components/ShiftListItem";
import PersonListItem from "./../Components/PersonListItem";

import OfflineNotice from "./../Components/OfflineNotice";
import Ajax from "./../Utils/ajax";
import { UrlsApi } from "./../Utils/urls";

export default class HomeScreen extends Component {

  state = {
    shift: [],
    loadingShift: true
  }

  componentDidMount() {
    let { address, cookie } = this.props.navigation.getScreenProps();
    Ajax.get(address + UrlsApi.myShifts, {}, cookie)
      .then(response => response.json())
      .then(response => {
        this.setState({
          shift: response.shifts,
          loadingShift: false
        })
      })
      .catch(error => {
      });
  }

  render() {
    if (this.state.loadingShift) {
      return (
        <Spinner size="large" />
      )
    }


    return (
      <Container>
        <OfflineNotice />
        <Content>
          <View style={{ padding: 5, flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: FontSize.extra, fontWeight: "bold", width: 150 }}>20:00</Text>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap" }}>
              <Button small style={{ alignSelf: "flex-end" }}><Text>Do práce</Text></Button>
              {/* <Button small style={{marginLeft: 10, marginTop: 10, alignSelf: "flex-end"}}><Text>V práci</Text></Button> */}
            </View>
          </View>
          <View>
            <Divider title="Nejbližší směny" />
            {this.state.shift.map((item, i) =>
              <ShiftListItem
                key={i}
                item={{
                  name: item.wpName,
                  position: item.name,
                  date: new Date(item.startDate),
                  timeFrom: item.startTime,
                  timeTo: item.endTime,
                  color: item.color
                }} />)}
          </View>
          <View>
            <Divider title="Volné směny" />
            <TouchableOpacity onPress={() => this.props.navigation.navigate('FreeShiftsDrawer')}>
              <View style={{ justifyContent: "space-between", padding: 5, flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: FontSize.big }}>Aktuálně je <Text style={{ fontSize: FontSize.big, color: Colors.orange, fontWeight: "bold" }}>15</Text> volných směn</Text>
                <Icon name="arrow-dropright" style={{ color: Colors.orange }} />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <Divider title="Aktuálně pracuje" />
            <PersonListItem />
            <PersonListItem />
            <PersonListItem />
            <PersonListItem />
          </View>
        </Content>
      </Container>
    );
  }
}