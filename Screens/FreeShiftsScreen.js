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
import FreeShiftListItem from "./../Components/FreeShiftListItem";
import OfflineNotice from "./../Components/OfflineNotice";

import Calendar from "./../Components/Calendar";


export default class FreeShiftsScreen extends Component {

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
      </Container>
    );
  }

  renderEmptyDate(day) {
    return null;
  }

  loadItems(day) {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = 1;
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Směna na ' + strTime,
              date: new Date(time),
              pozadano: Math.floor(Math.random() * 2) > 0
            });
          }
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
      this.setState({
        items: newItems
      });
  }

  renderItem(item) {
    return (
      <FreeShiftListItem item={item} />
    );
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}