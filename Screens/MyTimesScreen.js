/**
 * Setting screen
 * - screen pro zobrazení časových směn obrazovky
 */


import React, { Component } from 'react';
import { Alert } from "react-native";
import Ajax from "./../Utils/ajax";
import Info from "./../Components/Info";
import { Container, Toast } from "native-base";
import { Colors } from "../Utils/variables";
import { UrlsApi } from "./../Utils/urls";
import { xdateToData, calculateDate, timeToString } from "./../Utils/functions";

import MyTimesListItem from "./../Components/ListItems/MyTimesListItem";
import MyTimesFreeListItem from "./../Components/ListItems/MyTimesFreeListItem";
import OfflineNotice from "./../Components/OfflineNotice";
import DataStore from "./../Utils/dataStore";
import XDate from 'xdate';
import UserSelect from "./../Components/UserSelect";

import Calendar from "./../Components/Calendar";
import ModalMyTymesForm from '../Components/Modals/ModalMyTymesForm';


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
      autoTW: false,
      lastForbidenEditationDate: {},
      typesToSelect: [],
      selectedTypes: { label: "" },
    };
  }

  reloadData() {
    this.avails = {};
    this._selectedDate = new Date();
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
      typesToSelect: types,
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
      const strTime = timeToString(time);
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

  onDelete(button, item) {
    button.startLoading();
    let url = UrlsApi.myTimesEdit + "&empl=" + this.state.selectedUserId;
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
        this.onSaveDone(new Date(item.date), res)
      })
      .catch(() => {
        button.endLoading();
      });
  }

  onSaveDone(date, res){
    this._calendar.selectDate(date);
    Info.show(res.info, res.ok == 0);
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

  onPress(item, isAdd) {
    let dateTW = new Date(this.state.lastForbidenEditationDate.tw);
    let dateAb = new Date(this.state.lastForbidenEditationDate.absence);

    forSelectItems = [];
    let canEdit = item.date > dateTW;
    let canAbsence = item.date > dateAb;

    if (canEdit) {
      forSelectItems.push({ label: "Dostupný" });
    }

    if (canAbsence) {
      forSelectItems.push({ label: "Absence" });
    }

    let modalToItem = {
      editedItem: isAdd ? null : item,
      editedDate: item.date,
      timeFrom: isAdd ? "00:00" : item.start,
      timeTo: isAdd ? "00:00" : item.end,
      timeAbsenceLength: isAdd ? "00:00" : item.vacHours,
      selectMain: isAdd ? forSelectItems[0] :
        forSelectItems.length == 0 ? forSelectItems[0] :
          item.type ? { label: "Absence" } :
            { label: "Dostupný" },
      forSelectItems: forSelectItems,
      selectedTypes: isAdd ? this.state.typesToSelect[0] :
        item.type ? { label: item.type.name, ...item.type } :
          { label: "" }
    };

    this._modalForm.showModal(modalToItem);
  }

  renderEmptyDate(day) {

    let dateTW = new Date(this.state.lastForbidenEditationDate.tw);
    let dateAb = new Date(this.state.lastForbidenEditationDate.absence);

    let canEdit  = day > dateTW;
    let canAbsence = day > dateAb;

    return (
      <MyTimesFreeListItem
        item={{ date: day }}
        onPress={(item) => {
          this.onPress(item, true);
        }}
        edit={!this.state.offline && (canEdit || canAbsence)} />
    );
  }

  renderItem(item) {
    let dateTW = new Date(this.state.lastForbidenEditationDate.tw);
    let dateAb = new Date(this.state.lastForbidenEditationDate.absence);

    let canEdit = item.items[0].date > dateTW;
    let canAbsence = item.items[0].date > dateAb;

    return (
      <MyTimesListItem item={item}
        onPressEdit={(item) => {
          this.onPress(item, false);
        }}
        onPressAdd={(item) => {
          this.onPress(item, true);
        }}
        onPressDelete={(button, item) => {
          this.onPressDelete(button, item);
        }}
        editovatTW={!this.state.offline && !this.state.autoTW && canEdit}
        editovatAbsence={!this.state.offline && canAbsence}
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
        <UserSelect
          disabled={this.state.offline}
          onChange={(item) => this.setState({ selectedUserId: item.id }, () => this.reloadData())} />
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
        <ModalMyTymesForm
          ref={(ref) => this._modalForm = ref}
          typesToSelect={this.state.typesToSelect}
          navigation={this.props.navigation}
          selectedUserId={this.state.selectedUserId}
          onSaveDone={(date,res) => this.onSaveDone(date,res)} />
      </Container>
    );
  }
}