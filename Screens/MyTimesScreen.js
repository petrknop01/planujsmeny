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
import Divider from "./../Components/Divider";
import MyTimesListItem from "./../Components/MyTimesListItem";
import MyTimesFreeListItem from "./../Components/MyTimesFreeListItem";
import OfflineNotice from "./../Components/OfflineNotice";
import ModalPopup from "./../Components/ModalPopup";
import InputTime from "./../Components/InputTime";
import Select from "./../Components/Select";

import Calendar from "./../Components/Calendar";


export default class MyTimesScreen extends Component {
  _calendar = null
  _selectedDate = new Date()

  state = {
    items: {},
  };

  loadOld(){
    if(this._calendar){
      this._selectedDate.setDate(this._selectedDate.getDate() - 7); 
      this.setState({
        refreshing: true
      });

      this._calendar.selectDate(this._selectedDate);
    }
  }

  render() {
    return (
      <Container>
        <OfflineNotice />
        <Calendar
          ref={(ref) => this._calendar = ref}
          onDayPress={(day) => this._selectedDate = new Date(day.dateString)}
          onDayChange={(day) => this._selectedDate = new Date(day.dateString)}
          items={this.state.items}
          renderItem={(day) => this.renderItem(day)}
          renderEmptyDate={(day) => this.renderEmptyDate(day)}
          // markingType={'multi-dot'}
          // markedDates={this.state.markedDates}
          loadItemsForMonth={(day) => this.loadItems(day)}
          onRefresh={(day) => this.loadOld(day)}
          refreshing={false}
        />
        <ModalPopup ref={(ref) => this._modal = ref} onSave={() => this._modal.closeModal()}>
          <View>
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
              <Select selected={{ label: "Absence" }} items={[{ label: "Absence" }]} onChange={(item) => console.log("onchange")} />
            </View>
            <View style={{ marginBottom: 10 }}>
              <Select selected={{ label: "Nemoc" }} items={[{ label: "Nemoc" }]} onChange={(item) => console.log("onchange")} />
            </View>
          </View>
        </ModalPopup>
      </Container>

    );
  }

  renderEmptyDate(day) {
    console.log(day);
    return <MyTimesFreeListItem item={{ date: day }} onPress={(item) => this._modal.showModal()} />;
  }


  loadItems(day) {
    for (let i = -15; i < 85; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = this.timeToString(time);
      if (!this.state.items[strTime]) {
        this.state.items[strTime] = [];
        const numItems = Math.floor(Math.random() * 2);
        for (let j = 0; j < numItems; j++) {
          this.state.items[strTime].push({
            name: 'Dovolená ' + strTime,
            date: new Date(time)
          });
        }
      }
    }
    //console.log(this.state.items);
    const newItems = {};
    Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
    this.setState({
      items: newItems
    });
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <MyTimesListItem item={item} onPress={(item) => this._modal.showModal()} />
    );
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}