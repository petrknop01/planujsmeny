/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Container, Spinner } from "native-base";
import { Colors, FontSize } from "../Utils/variables";
import Ajax from "./../Utils/ajax";
import { UrlsApi } from "./../Utils/urls";
import Divider from "./../Components/Divider";
import OfflineNotice from "./../Components/OfflineNotice";
import ShiftListItemFree from "./../Components/ShiftListItemFree";
import ShiftListItem from "./../Components/ShiftListItem";
import Calendar from "./../Components/Calendar";


export default class MyShiftsScreen extends Component {
  _calendar = null
  _selectedDate = new Date()
  state = {
    jobs: null,
    workplaces: null,
    markedDates: {},
    shifts: {},
  };

  loadJobsAndWorkplaces(callback) {
    let { address, cookie } = this.props.navigation.getScreenProps();
    Ajax.get(address + UrlsApi.jobsAndWorkplaces, {}, cookie)
      .then(response => response.json())
      .then(response => {
        if (response.ok == 0) {
          if (response.loggedOut == 1) {
            relogin(() => this.loadJobsAndWorkplaces())
          }
          return;
        }

        this.setState({
          jobs: response.jobs,
          workplaces: response.wps
        }, () => callback())
      })
      .catch(error => {
      });
  }


  calculateDate(day, addMonths) {
    let date = new Date(day);
    date.setMonth(date.getMonth() + addMonths);

    return (
      date.getFullYear() + "-" +
      ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1) + "-" +
      date.getDate()
    );
  }


  loadDates(day) {
    let date = new Date(day.dateString);
    let data = {
      from: this.calculateDate(day.dateString, -1),
      to: this.calculateDate(day.dateString, +1)
    }

    let { address, cookie } = this.props.navigation.getScreenProps();
    Ajax.get(address + UrlsApi.shifts, data, cookie)
      .then(response => response.json())
      .then(response => {
        if (response.ok == 0) {
          if (response.loggedOut == 1) {
            relogin(() => this.loadDates())
          }
          return;
        }

        this.setState({
          shifts: this.convertShifts(response.shifts, day),
          markedDates: this.convertMarkedDates(response.shifts),
          refreshing: false
        });
      })
      .catch(error => {
      });
  }

  getJobsName(id) {
    if(!this.state.jobs.hasOwnProperty("id" + id)){
      return "";
    }
    
    let job = this.state.jobs["id" + id];
    return job.name
  }

  getWorkspaceName(id) {
    if(!this.state.workplaces.hasOwnProperty("id" + id)){
      return "";
    }

    let workplace = this.state.workplaces["id" + id];
    return workplace.name
  }

  getJobsColor(id) {
    if(!this.state.jobs.hasOwnProperty("id" + id)){
      return "#000000";
    }

    let job = this.state.jobs["id" + id];
    return job.color
  }

  convertMarkedDates(items) {
    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        const shifts = items[key];
        const strTime = this.timeToString(key.replace("d", ""));
        if (!this.state.markedDates[strTime]) {
          this.state.markedDates[strTime] = { dots: [] };
          for (const key2 in shifts) {
            if (shifts.hasOwnProperty(key2)) {
              const shift = shifts[key2];
              this.state.markedDates[strTime].dots.push({
                color: this.getJobsColor(shift.job)
              });
            }
          }
        }
      }
    }

    const newItems = {};
    Object.keys(this.state.markedDates).forEach(key => { newItems[key] = this.state.markedDates[key]; });
    return newItems;
  }

  convertShifts(items, day) {
    for (let i = -85; i < 85; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = this.timeToString(time);
      if (!this.state.shifts[strTime]) {
        this.state.shifts[strTime] = [];
      }
    }

    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        const shifts = items[key];
        const strTime = this.timeToString(key.replace("d", ""));
        this.state.shifts[strTime] = [{items: []}];
        for (const key2 in shifts) {
          if (shifts.hasOwnProperty(key2)) {
            const shift = shifts[key2];
            this.state.shifts[strTime][0].items.push({
              position: this.getJobsName(shift.job),
              name: this.getWorkspaceName(shift.wp),
              timeFrom: shift.clock ? shift.clockIn : shift.start,
              timeTo:shift.clock ? shift.clockOut : shift.end,
              date: new Date(strTime),
              color: this.getJobsColor(shift.job)
            });
          }
        }
      }
    }

    const newItems = {};
    Object.keys(this.state.shifts).forEach(key => { newItems[key] = this.state.shifts[key]; });
    return newItems;
  }

  loadItems(day) {
    if (this.state.jobs == null && this.state.workplaces == null) {
      this.loadJobsAndWorkplaces(() => this.loadDates(day))
    } else {
      this.loadDates(day)
    }
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  renderItem(item) {
    return (
      <ShiftListItem item={item} />
    );
  }

  renderEmptyDate(day) {
    return <ShiftListItemFree item={{ date: day }} />;
  }

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
      <Container style={{backgroundColor: "gray"}}>
        <OfflineNotice />
        <Calendar
          ref={(ref) => this._calendar = ref}
          onDayPress={(day) => this._selectedDate = new Date(day.dateString)}
          onDayChange={(day) => this._selectedDate = new Date(day.dateString)}
          items={this.state.shifts}
          renderItem={(day) => this.renderItem(day)}
          renderEmptyDate={(day) => this.renderEmptyDate(day)}
          markingType={'multi-dot'}
          markedDates={this.state.markedDates}
          loadItemsForMonth={(day) => this.loadItems(day)}
          onRefresh={(day) => this.loadOld(day)}
          refreshing={false}
        />
      </Container>
    );
  }
}
