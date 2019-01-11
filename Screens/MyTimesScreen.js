/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View, Alert } from "react-native";
import Ajax from "./../Utils/ajax";

import { Container, Text, Toast } from "native-base";
import { Colors } from "../Utils/variables";
import { UrlsApi } from "./../Utils/urls";
import { xdateToData, calculateDate } from "./../Utils/functions";

import MyTimesListItem from "./../Components/MyTimesListItem";
import MyTimesFreeListItem from "./../Components/MyTimesFreeListItem";
import OfflineNotice from "./../Components/OfflineNotice";
import ModalPopup from "./../Components/ModalPopup";
import InputTime from "./../Components/InputTime";
import Select from "./../Components/Select";
import DataStore from "./../Utils/dataStore";
import XDate from 'xdate';
import UserSelect from "./../Components/UserSelect";

import Calendar from "./../Components/Calendar";


export default class MyTimesScreen extends Component {
  _calendar = null
  _selectedDate = new Date()
  avails = {};

  constructor(props) {
    super(props);
    let { userID } = props.navigation.getScreenProps();
    this.state = {
      items: {},
      selectedUserId: userID,
      markedDates: {},
      date: null,
      offline: false,
      types: {},
      timeFrom: "00:00",
      timeTo: "00:00",
      timeAbsenceLength: "00:00",
      autoTW: false,
      lastForbidenEditationDate: {},
      editedDate: null,
      editedItem: null,
      editedCanEditTW: false,
      editedCanEditAbsence: false,
      selectMain: { label: "Dostupný" },
      typesArr: [],
      selectedTypes: { label: "" },
      forSelectItems: [{ label: "Dostupný" }, { label: "Absence" }]
    };
  }

  reloadData() {
    this.avails = {};
    _selectedDate = new Date();

    this.setState({
      markedDates: {},
      items: {},
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
      duration: 5000,
      position: "bottom"
    });
  }

  onSave() {
    let url = this.state.editedItem ? UrlsApi.myTimesEdit : UrlsApi.myTimesAdd;
    let { address, cookie } = this.props.navigation.getScreenProps();
    let data = {
      start: this.state.timeFrom,
      end: this.state.timeTo,
      type: this.state.selectMain.label == "Dostupný" ? 0 : 1,
    }

    if (this.state.selectMain.label == "Absence") {
      data.absenceType = this.state.selectedTypes.id;
      data.absenceLength = this.state.timeAbsenceLength;
    }

    if (this.state.editedItem) {
      data.IDtw = this.state.editedItem.id;
    } else {
      data.date = this.state.editedDate.toJSON().slice(0, 10);
    }

    // this.setState({
    //   items: {},
    //   markedDates: {}
    // });

    Ajax.post(address + url + "&empl=" + this.state.selectedUserId, data, cookie)
      .then(response => response.json())
      .then(res => {
        this._calendar.selectDate(this.state.editedDate);
        this._modal.closeModal(() =>
          setTimeout(() => {
            this.showAlert(res.info, res.ok == 0);
          }, 250));
      })
      .catch(() => {
        this._modal.closeModal();
      });
  }


  renderEmptyDate(day) {

    let dateTW = new Date(this.state.lastForbidenEditationDate.tw);
    let dateAb = new Date(this.state.lastForbidenEditationDate.absence);

    dateEdit = day > dateTW;
    dateAbsence = day > dateAb;


    return (
      <MyTimesFreeListItem
        item={{ date: day }}
        onPress={(item) => {
          this.onPressAdd(item);
        }}
        edit={!this.state.offline && (dateEdit || dateAbsence)} />
    );
  }

  loadDates(day) {
    let data = {
      from: calculateDate(day.dateString, -1),
      to: calculateDate(day.dateString, +1),
      loadTypes: 1,
      empl: this.state.selectedUserId
    }

    let { address, cookie, relogin } = this.props.navigation.getScreenProps();
    Ajax.get(address + UrlsApi.myTimes, data, cookie)
      .then(response => response.json())
      .then(response => {
        if (response.ok == 0) {
          if (response.loggedOut == 1) {
            relogin(() => this.loadDates(day))
          }
          return;
        }

        this.setData(response, day);
        this.saveOfflineData(response);
      })
      .catch(error => {
        console.error(error);
        this.getOfflineData(day);
      });
  }

  saveOfflineData(response) {
    let { userID } = this.props.navigation.getScreenProps();

    if (this.state.selectedUserId !== userID) {
      return;
    }

    response.avails = this.avails,
      response.savedDate = new Date(),
      DataStore.SetMyTimes(response, () => null);
  }

  getOfflineData(day) {
    DataStore.GetMyTimes((data) => {
      this.setData(data, day);
    });
  }

  setData(data, day) {
    this.avails = this.margeAvails(this.avails, data.avails);

    types = this.getTypes(data.types);
    this.setState({
      items: this.convertMyTimes(this.avails, data.types, day),
      markedDates: this.convertMarkedDates(this.avails),
      types: data.types,
      autoTW: data.autoTW,
      lastForbidenEditationDate: data.lastForbidenEditationDate,
      date: data.date,
      typesArr: types,
      selectedTypes: types[0]
    })
  }

  margeAvails(oldDates, newDates) {
    let result = { ...oldDates, ...newDates };
    for (const key in result) {
      if (newDates.hasOwnProperty(key)) {
        result[key] = newDates[key];
      }
    }
    return result;
  }

  convertMarkedDates(items) {
    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        const times = items[key];
        const strTime = key.replace("d", "");
        if (!this.state.markedDates[strTime]) {
          this.state.markedDates[strTime] = { dots: [] };
          for (const key2 in times) {
            if (times.hasOwnProperty(key2)) {
              const time = times[key2];
              let color = Colors.green;
              if (time.type == 1) {
                color = Colors.red;
              }
              this.state.markedDates[strTime].dots.push({
                color: color
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

  getTypes(types) {
    let result = [];
    for (const key in types) {
      if (types.hasOwnProperty(key)) {
        let element = types[key];
        element.label = element.name
        result.push(element)
      }
    }

    return result;
  }

  convertMyTimes(items, types, day) {
    for (let i = -85; i < 85; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = this.timeToString(time);
      if (!this.state.items[strTime]) {
        this.state.items[strTime] = [];
      }
    }

    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        const times = items[key];
        const strTime = key.replace("d", "");
        this.state.items[strTime] = [{ items: [] }];
        for (const key2 in times) {
          if (times.hasOwnProperty(key2)) {
            const time = times[key2];
            let type = null;
            if (types && time.type == 1 && types.hasOwnProperty("id" + time.vacType)) {
              type = types["id" + time.vacType];
            }

            this.state.items[strTime][0].items.push({ date: new Date(strTime), ...time, type: type });
          }
        }
      }
    }

    const newItems = {};
    Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
    return newItems;
  }

  loadItems(day) {
    this.loadDates(day);
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  onDelete(button, item) {
    button.startLoading();
    let url = UrlsApi.myTimesEdit;
    let { address, cookie } = this.props.navigation.getScreenProps();
    let data = {
      IDtw: item.id,
      delete: 1
    }

    data.IDtw = item.id;

    Ajax.post(address + url, data, cookie)
      .then(response => response.json())
      .then(res => {
        button.endLoading();
        this._calendar.selectDate(new Date(item.date));
        this.showAlert(res.info, res.ok == 0);
      })
      .catch(() => {
        button.endLoading();
      });
  }


  onPressDelete(button, item) {
    Alert.alert(
      "Vymazat",
      "Opravdu chcete položku smazat?",
      [
        { text: 'Ano', onPress: () => this.onDelete(button, item) },
        { text: 'Ne', onPress: () => { }, style: 'cancel' },
      ],
      { cancelable: false }
    )
  }

  onPressEdit(item) {
    let dateTW = new Date(this.state.lastForbidenEditationDate.tw);
    let dateAb = new Date(this.state.lastForbidenEditationDate.absence);

    forSelectItems = [];
    dateEdit = item.date > dateTW;
    dateAbsence = item.date > dateAb;

    if (dateEdit) {
      forSelectItems.push({ label: "Dostupný" });
    }

    if (dateAbsence) {
      forSelectItems.push({ label: "Absence" });
    }


    this.setState({
      editedItem: item,
      editedDate: item.date,
      editedCanEditTW: dateEdit,
      editedCanEditAbsence: dateAbsence,
      timeFrom: item.start,
      timeTo: item.end,
      timeAbsenceLength: item.vacHours,
      selectMain: forSelectItems.length == 0 ? forSelectItems[0] : (item.type ? { label: "Absence" } : { label: "Dostupný" }),
      forSelectItems: forSelectItems,
      selectedTypes: item.type ? { label: item.type.name, ...item.type } : { label: "" }
    }, () => this._modal.showModal());
  }

  onPressAdd(item) {
    let dateTW = new Date(this.state.lastForbidenEditationDate.tw);
    let dateAb = new Date(this.state.lastForbidenEditationDate.absence);
    forSelectItems = [];
    dateEdit = item.date > dateTW;
    dateAbsence = item.date > dateAb;

    if (dateEdit) {
      forSelectItems.push({ label: "Dostupný" });
    }

    if (dateAbsence) {
      forSelectItems.push({ label: "Absence" });
    }

    this.setState({
      editedItem: null,
      editedDate: item.date,
      editedCanEditTW: dateEdit,
      timeFrom: "00:00",
      timeTo: "00:00",
      timeAbsenceLength: "00:00",
      editedCanEditAbsence: dateAbsence,
      forSelectItems: forSelectItems,
      selectMain: forSelectItems[0],
      selectedTypes: this.state.typesArr[0]
    }, () => this._modal.showModal());
  }

  renderItem(item) {
    let dateTW = new Date(this.state.lastForbidenEditationDate.tw);
    let dateAb = new Date(this.state.lastForbidenEditationDate.absence);

    dateEdit = item.items[0].date > dateTW;
    dateAbsence = item.items[0].date > dateAb;

    return (
      <MyTimesListItem item={item}
        onPressEdit={(item) => {
          this.onPressEdit(item);
        }}
        onPressAdd={(item) => {
          this.onPressAdd(item);
        }}
        onPressDelete={(button, item) => {
          this.onPressDelete(button, item);
        }}
        editovatTW={!this.state.offline && !this.state.autoTW && dateEdit}
        editovatAbsence={!this.state.offline && dateAbsence}
      />
    );
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
        <UserSelect disabled={this.state.offline} onChange={(item) => this.setState({ selectedUserId: item.id }, () => this.reloadData())} />
        <Calendar
          ref={(ref) => this._calendar = ref}
          onDayPress={(day) => this._selectedDate = new Date(day.dateString)}
          onDayChange={(day) => this._selectedDate = new Date(day.dateString)}
          items={this.state.items}
          renderItem={(day) => this.renderItem(day)}
          renderEmptyDate={(day) => this.renderEmptyDate(day)}
          markingType={'multi-dot'}
          offline={this.state.offline}
          markedDates={this.state.markedDates}
          loadItemsForMonth={(day) => this.loadItems(day)}
          onRefresh={(day) => this.loadOld(day)}
          refreshing={false}
        />
        <ModalPopup ref={(ref) => this._modal = ref} onSave={() => this.onSave()}>
          <View>
            <View style={{ marginBottom: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <Text>{new Date(this.state.editedDate).toLocaleDateString()}</Text>
            </View>
            <View style={{ marginBottom: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <InputTime
                  value={this.state.timeFrom}
                  onChange={(timeFrom) => this.setState({ timeFrom })}
                />
              </View>
              <Text style={{ paddingHorizontal: 10 }}>-</Text>
              <View style={{ flex: 1 }}>
                <InputTime
                  value={this.state.timeTo}
                  onChange={(timeTo) => this.setState({ timeTo })}
                />
              </View>
            </View>
            {this.state.selectMain.label == "Absence" ?
              <View style={{ marginBottom: 10 }}>
                <InputTime
                  value={this.state.timeAbsenceLength}
                  onChange={(timeAbsenceLength) => this.setState({ timeAbsenceLength })}
                />
              </View> : null}
            {this.state.editedItem ?
              null :
              <View style={{ marginBottom: 10 }}>
                <Select selected={this.state.selectMain} items={this.state.forSelectItems} onChange={(item) => this.setState({ selectMain: item })} />
              </View>}
            {this.state.selectMain.label == "Absence" ?
              <View style={{ marginBottom: 10 }}>
                <Select selected={this.state.selectedTypes} items={this.state.typesArr} onChange={(item) => this.setState({ selectedTypes: item })} />
              </View> : null}
          </View>
        </ModalPopup>
      </Container>
    );
  }
}