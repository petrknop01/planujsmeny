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
import { xdateToData, calculateDate } from "./../Utils/functions";
import Calendar from "./../Components/Calendar";
import Ajax from "./../Utils/ajax";

import Select from "./../Components/Select";
import PlanShiftListItem from "./../Components/PlanShiftListItem";
import OfflineNotice from "./../Components/OfflineNotice";
import ModalPopup from "./../Components/ModalPopup";
import InputTime from "./../Components/InputTime";
import WpSelect from "./../Components/WpSelect"
import ModalPlansAbsence from "./../Components/ModalPlansAbsence"
import ModalPlansComment from "./../Components/ModalPlansComment"

const TYPE = {
  notHomeShifts: 0,
  absences: 1,
  shifts: 2,
  comments: 3
}

export default class PlansShiftsScreen extends Component {
  offline = false;
  _calendar = null;
  _selectedDate = new Date();
  shifts = {};
  offline = true;

  state = {
    selectedWp: { id: null, label: "Nevybráno" },
    listWp: [{ id: null, label: "Nevybráno" }],
    jobs: null,
    wps: null,
    users: null,
    absences: null,
    offline: false,
    date: null,
    markedDates: {},
    data: {},
    refreshing: false
  }



  reloadData() {
    this.shifts = {};
    _selectedDate = new Date();

    this.setState({
      markedDates: {},
      data: {},
    }, () => this._calendar.selectDate(new Date()));
  }

  loadOld() {
    if (this._calendar) {
      this._selectedDate.setDate(this._selectedDate.getDate() - 7);
      this.setState({
        refreshing: true
      });
      this._calendar.selectDate(this._selectedDate);
    }
  }


  showAlert(message, isError) {
    if (isError) {
      Alert.alert(
        "Chyba",
        message,
        [
          { text: 'Ok', onPress: () => { }, style: 'cancel' },
        ],
        { cancelable: false }
      )
      return;
    }

    Toast.show({
      text: message,
      buttonText: "Ok",
      duration: 2000,
      position: "bottom"
    });
  }

  loadItems(day) {
    if ((this.state.jobs == null && this.state.wps == null &&
      this.state.users == null && this.state.absence == null) || this.offline) {
      this.offline = false;
      this.loadMetadata(() => this.loadDates(day))
    } else {
      this.loadDates(day)
    }
  }

  loadDates(day) {
    let data = {
      from: calculateDate(day.dateString, -1),
      to: calculateDate(day.dateString, +1),
    }

    if (this.state.selectedWp.id != null) {
      data.wp == this.state.selectedWp.id;
    }

    let { address, cookie, relogin } = this.props.navigation.getScreenProps();
    Ajax.get(address + UrlsApi.shiftsForWp, data, cookie)
      .then(response => response.json())
      .then(response => {
        if (response.ok == 0) {
          if (response.loggedOut == 1) {
            relogin(() => this.loadDates(day))
          }
          return;
        }

        this.setState({
          shifts: this.convertShifts(response, day),
          markedDates: this.convertMarkedDates(),
          refreshing: false
        },
          () => null //this.saveOfflineData(response.shifts)  
        );
      })
      .catch(error => {
        //this.getOfflineData(day);
      });
  }

  convertMarkedDates() {
    let items = this.state.data
    for (const key in items) {
      let strTime = key;
      if (items.hasOwnProperty(key)) {
        const shifts = items[key];
        if (!this.state.markedDates[strTime]) {
          this.state.markedDates[strTime] = { dots: [] };
        }

        if (this.state.markedDates[strTime].dots.length == 0) {
          if (!shifts[0]) {
            continue;
          }

          if (shifts[0].shifts && shifts[0].shifts.length > 0) {
            this.state.markedDates[strTime].dots.push({
              color: Colors.orange
            });
          }

          if (shifts[0].comments && shifts[0].comments.length > 0) {
            this.state.markedDates[strTime].dots.push({
              color: Colors.blue
            });
          }

          if (shifts[0].notHomeShifts && shifts[0].notHomeShifts.length > 0 || shifts[0].absences && shifts[0].absences.length > 0) {
            this.state.markedDates[strTime].dots.push({
              color: Colors.red
            });
          }

        }

      }
    }

    const newItems = {};
    Object.keys(this.state.markedDates).forEach(key => { newItems[key] = this.state.markedDates[key]; });
    return newItems;
  }


  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  loadMetadata(callback) {
    let { address, cookie, relogin } = this.props.navigation.getScreenProps();
    Ajax.get(address + UrlsApi.metadataShiftsForWp, {}, cookie)
      .then(response => response.json())
      .then(response => {
        if (response.ok == 0) {
          if (response.loggedOut == 1) {
            relogin(() => this.loadMetadata(callback))
          }
          return;
        }

        let listWp = [{ id: null, label: "Nevybráno" }];

        for (const key in response.wps) {
          if (response.wps.hasOwnProperty(key)) {
            const element = response.wps[key];
            listWp.push({ id: element.id, label: element.name });
          }
        }


        this.setState({
          listWp: listWp,
          jobs: response.jobs,
          wps: response.wps,
          users: response.users,
          absences: response.absences,
        }, () => callback())
      })
      .catch(error => {
        //this.getOfflineData(xdateToData(XDate(true)));
      });
  }

  convertShifts(items, day) {
    for (let i = -85; i < 85; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = this.timeToString(time);
      this.state.data[strTime] = [{
        date: new Date(strTime),
        notHomeShifts: [],
        absences: [],
        shifts: [],
        comments: []
      }];
    }

    this.itemsToShiftObject(items.notHomeShifts, TYPE.notHomeShifts);
    this.itemsToShiftObject(items.absences, TYPE.absences);
    this.itemsToShiftObject(items.shifts, TYPE.shifts);
    this.itemsToShiftObject(items.comments, TYPE.comments);

    const newItems = {};
    Object.keys(this.state.data).forEach(key => { newItems[key] = this.state.data[key]; });
    return newItems;
  }

  itemsToShiftObject(items, type) {
    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        const item = items[key];
        const strTime = this.timeToString(key.replace("d", ""));
        if (type == TYPE.comments) {
          this.state.data[strTime][0].comments.push({
            comment: [item]
          });
        } else {

          for (const key2 in item) {
            if (item.hasOwnProperty(key2)) {
              const item2 = item[key2];
              switch (type) {
                case TYPE.notHomeShifts:
                  this.state.data[strTime][0].notHomeShifts.push({
                    userName: this.getUserName(item2.user),
                    wpName: this.getWorkspaceName(item2.wp)
                  });
                  break;
                case TYPE.absences:
                  this.state.data[strTime][0].absences.push({
                    userName: this.getUserName(item2.user),
                    absenceName: this.getAbsenceName(item2.absenceType),
                    color: this.getAbsenceColor(item2.absenceType),
                  });
                  break;
                case TYPE.shifts:
                  for (const key in item2) {
                    if (item2.hasOwnProperty(key)) {
                      const shift = item2[key];
                      this.state.data[strTime][0].shifts.push({
                        userName: this.getUserName(shift.user),
                        jobName: this.getJobName(shift.job),
                        color: this.getJobsColor(shift.job),
                        start: shift.start,
                        end: shift.end
                      });
                    }
                  }
                  break;
              }
            }
          }
        }
      }
    }
  }

  getUserName(id) {
    if (this.state.users.hasOwnProperty("id" + id)) {
      return this.state.users["id" + id].name;
    }

    return null;
  }

  getJobName(id) {
    if (this.state.jobs.hasOwnProperty("id" + id)) {
      return this.state.jobs["id" + id].name;
    }

    return null;
  }

  getWorkspaceName(id) {
    if (this.state.wps.hasOwnProperty("id" + id)) {
      return this.state.wps["id" + id].name;
    }
    return null;
  }

  getAbsenceName(id) {
    if (this.state.absences.hasOwnProperty("id" + id)) {
      return this.state.absences["id" + id].name;
    }
    return null;
  }

  getAbsenceColor(id) {
    if (this.state.absences.hasOwnProperty("id" + id)) {
      return this.state.absences["id" + id].color;
    }
    return "#000000";
  }

  getJobsColor(id) {
    if (this.state.jobs.hasOwnProperty("id" + id)) {
      return this.state.jobs["id" + id].color;
    }
    return "#000000";
  }


  renderItem(item) {
    return (
      <PlanShiftListItem
        item={item}
        onPressHome={(item) => this.onPressHome(item)}
        onPressComment={(item) => this.onPressComment(item)}
        onPressEdit={(item) => null}
        onPressDelete={(item) => null}
        onPressAdd={(item) => null}
      />
    );
  }

  onPressHome(item) {
    this._modalPlansAbsence.open(item);
  }

  onPressComment(item) {
    this._modalPlansComments.open(item);
  }

  render() {
    return (
      <Container>
        <OfflineNotice
          date={this.state.date}
          onConectionChange={(isConnected) => {
            if (isConnected) {
              this.loadItems(xdateToData(XDate(true)));
            }

            this.setState({
              offline: !isConnected
            });
          }
          } />
        <WpSelect disabled={this.state.offline}
          listWp={this.state.listWp}
          selectedWp={this.state.selectedWp}
          onChange={(item) => this.setState({ selectedWp: item }, () => this.reloadData())} />
        <Calendar
          ref={(ref) => this._calendar = ref}
          onDayPress={(day) => this._selectedDate = new Date(day.dateString)}
          onDayChange={(day) => this._selectedDate = new Date(day.dateString)}
          items={this.state.data}
          renderItem={(day) => this.renderItem(day)}
          renderEmptyDay={(day) => null}
          markingType={'multi-dot'}
          markedDates={this.state.markedDates}
          loadItemsForMonth={(day) => this.loadItems(day)}
          onRefresh={(day) => this.loadOld(day)}
          refreshing={false}
        />
        <ModalPlansAbsence ref={(ref) => this._modalPlansAbsence = ref} />
        <ModalPlansComment ref={(ref) => this._modalPlansComments = ref} />
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
      </Container>
    );
  }
}