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
    shift: null,
    loadingShift: true
  }

  componentDidMount() {
    let { address, cookie } = this.props.navigation.getScreenProps();
    Ajax.get(address + UrlsApi.myShifts, {}, cookie)
      .then(response => response.json())
      .then(response => {
        let shifts = {};
        response.shifts.map((item, i) => {
          if (!shifts.hasOwnProperty(item.startDate)) {
            shifts[item.startDate] = [{ items: [] }];
          }
          shifts[item.startDate][0].items.push({
            name: item.wpName,
            position: item.name,
            date: new Date(item.startDate),
            timeFrom: item.startTime,
            timeTo: item.endTime,
            color: item.color
          });
        });

        this.setState({
          shift: shifts,
          loadingShift: false
        })
      })
      .catch(error => {
      });
  }

  renderShifts() {
    let items = [];
    for (const key in this.state.shift) {
      if (this.state.shift.hasOwnProperty(key)) {
        const element = this.state.shift[key][0];
        items.push(<ShiftListItem
          key={key}
          item={element} />);
      }
    }

    return items;
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
        <Content style={{ backgroundColor: Colors.lightGray }}>
          <View style={{ padding: 5, flexDirection: "row", alignItems: "center", backgroundColor: "white" }}>
            <Text style={{ fontSize: FontSize.extra, fontWeight: "bold", width: 150 }}>20:00</Text>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap" }}>
              <Button small style={{ alignSelf: "flex-end" }}><Text>Do práce</Text></Button>
              {/* <Button small style={{marginLeft: 10, marginTop: 10, alignSelf: "flex-end"}}><Text>V práci</Text></Button> */}
            </View>
          </View>
          <View>
            <Divider title="Nejbližší směny" />
            <View style={{ backgroundColor: Colors.lightGray }}>
              {this.renderShifts()}
            </View>
          </View>
          <View>
            <Divider title="Volné směny" />
            <View style={{ backgroundColor: Colors.lightGray }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('FreeShiftsDrawer')}>
                <View style={{ justifyContent: "space-between", padding: 10, backgroundColor: "white", borderRadius: 5, margin: 10, flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: FontSize.big }}>Aktuálně je <Text style={{ fontSize: FontSize.big, color: Colors.orange, fontWeight: "bold" }}>15</Text> volných směn</Text>
                  <Icon name="arrow-dropright" style={{ color: Colors.orange }} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Divider title="Aktuálně pracuje" />
            <View style={{ backgroundColor: Colors.lightGray }}>
              <PersonListItem />
              <PersonListItem />
              <PersonListItem />
              <PersonListItem />
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}