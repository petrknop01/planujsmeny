/**
 * Setting screen
 * - screen pro zobrazení naplánovaných směn obrazovky
 */


import React, { Component } from 'react';
import { Alert } from "react-native";
import { Container } from "native-base";
import { Colors } from "../Utils/variables";
import { UrlsApi } from "./../Utils/urls";
import { xdateToData, calculateDate, timeToString } from "./../Utils/functions";
import XDate from 'xdate';
import Info from "./../Components/Info";

import Calendar from "./../Components/Calendar";
import Ajax from "./../Utils/ajax";
import DataStore from "./../Utils/dataStore";

import PlanShiftListItem from "./../Components/ListItems/PlanShiftListItem";
import OfflineNotice from "./../Components/OfflineNotice";
import WpSelect from "./../Components/WpSelect"
import ModalPlansAbsence from "./../Components/Modals/ModalPlansAbsence"
import ModalPlansComment from "./../Components/Modals/ModalPlansComment"
import ModalPlansForm from "./../Components/Modals/ModalPlansForm"

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
  data = {};

  state = {
    selectedWp: { id: null, label: "Nahrávám" },
    listWp: [{ id: null, label: "Nahrávám" }],
    jobs: null,
    wps: null,
    users: null,
    absences: null,
    offline: false,
    date: null,
    markedDates: {},
    data: {},
    refreshing: false,
    lastDate: null,
    IDwp: 0,
    wpJobs: []
  }

  reloadData() {
    _selectedDate = new Date();
    this.data = {};

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

  loadItems(day) {
    if ((this.state.jobs == null && this.state.wps == null &&
      this.state.users == null && this.state.absence == null) || this.offline) {
      this.offline = false;
      this.loadMetadata(() => this.loadDates(day))
    } else {
      this.loadDates(day)
    }
  }

  loadDates(day, callback) {
    let data = {
      from: calculateDate(day.dateString, -1),
      to: calculateDate(day.dateString, +1),
    }

    if (this.state.selectedWp.id != null) {
      data.wp = this.state.selectedWp.id;
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

        let wpItem;

        this.state.listWp.map((item) => {
          if (item.id == response.IDwp) {
            wpItem = item;
            return false;
          }
        })

        this.setState({
          data: { ...this.convertShifts(response, day) },
          markedDates: this.convertMarkedDates(),
          refreshing: false,
          lastDate: response.lastForbidenEditationDate,
          IDwp: response.IDwp,
          wpJobs: response.wpJobs,
          selectedWp: wpItem
        },
          () => {
            this.saveOfflineData();
            if(callback){
              callback();
            }
          }
        );
      })
      .catch(() => {
        this.getOfflineData();
      });
  }


  saveOfflineData() {
    if (this.state.selectedWp.id == null) {
      let data = this.state;
      data.date = new Date();
      DataStore.SetMyPlansShifts(data, () => null);
    }
  }

  getOfflineData() {
    DataStore.GetMyPlansShifts((data) => {
      if (data == null) {
        return;
      }
      this.data = { ...data.data };
      this.setState({
        listWp: data.listWp,
        jobs: data.jobs,
        wps: data.wps,
        users: data.users,
        absences: data.absences,
        markedDates: data.markedDates,
        lastDate: data.lastDate,
        IDwp: data.IDwp,
        data: { ...data.data },
        wpJobs: data.wpJobs,
        date: data.date
      })
    });

  }

  convertMarkedDates() {
    for (const key in this.data) {
      let strTime = key;
      if (this.data.hasOwnProperty(key)) {
        const shifts = this.data[key];
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

        let listWp = [];

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
      .catch(() => {
        this.getOfflineData();
      });
  }

  convertShifts(items, day) {
    for (let i = -85; i < 85; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = timeToString(time);
      if (!this.data[strTime]) {
        this.data[strTime] = [{
          date: new Date(strTime),
          notHomeShifts: [],
          absences: [],
          shifts: [],
          comments: []
        }];
      }
    }

    this.itemsToShiftObject(items.notHomeShifts, TYPE.notHomeShifts);
    this.itemsToShiftObject(items.absences, TYPE.absences);
    this.itemsToShiftObject(items.shifts, TYPE.shifts);
    this.itemsToShiftObject(items.comments, TYPE.comments);

    const newItems = {};
    Object.keys(this.data).forEach(key => { newItems[key] = this.data[key]; });
    return newItems;
  }

  itemsToShiftObject(items, type) {
    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        const item = items[key];
        const strTime = timeToString(key.replace("d", ""));
        if (type == TYPE.comments) {
          this.data[strTime][0].comments = [{
            comment: [item]
          }];
        } else {

          for (const key2 in item) {
            if (item.hasOwnProperty(key2)) {
              const item2 = item[key2];
              switch (type) {
                case TYPE.notHomeShifts:
                  const insertNotHomeShifts = {
                    date: new Date(strTime),
                    id: key2,
                    userName: this.getUserName(item2.user),
                    wpName: this.getWorkspaceName(item2.wp)
                  }
                  const indexNotHomeShifts = this.inArray(this.data[strTime][0].notHomeShifts, key2);

                  if (indexNotHomeShifts == -1) {
                    this.data[strTime][0].notHomeShifts.push(insertNotHomeShifts);
                  } else {
                    this.data[strTime][0].notHomeShifts[indexNotHomeShifts] = (insertNotHomeShifts);
                  }
                  break;
                case TYPE.absences:
                  const insertAbsence = {
                    date: new Date(strTime),
                    id: key2,
                    userName: this.getUserName(item2.user),
                    absenceName: this.getAbsenceName(item2.absenceType),
                    color: this.getAbsenceColor(item2.absenceType),
                  };

                  const indexAbsence = this.inArray(this.data[strTime][0].absences, key2);
                  if (indexAbsence == -1) {
                    this.data[strTime][0].absences.push(insertAbsence);
                  } else {
                    this.data[strTime][0].absences[indexAbsence] = (insertAbsence);
                  }
                  break;
                case TYPE.shifts:
                  for (const id in item2) {
                    if (item2.hasOwnProperty(id)) {
                      const shift = item2[id];
                      const insertShift = {
                        date: new Date(strTime),
                        userName: this.getUserName(shift.user),
                        jobName: this.getJobName(shift.job),
                        color: this.getJobsColor(shift.job),
                        start: shift.start,
                        end: shift.end,
                        id: shift.id,
                        jobId: shift.job,
                        userId: shift.user
                      }
                      const indexShift = this.inArray(this.data[strTime][0].shifts, shift.id);
                      if (indexShift == -1) {
                        this.data[strTime][0].shifts.push(insertShift);
                      } else {
                        this.data[strTime][0].shifts[indexShift] = insertShift;
                      }
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

  inArray(array, id) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element.id == id) {
        return index;
      }
    }

    return -1;
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

  onDelete(button, item) {
    button.startLoading();
    let url = UrlsApi.removeShift;
    let { address, cookie, scheduleNotification } = this.props.navigation.getScreenProps();
    let data = {
      IDshift: item.id,
      delete: 1
    }

    Ajax.post(address + url, data, cookie)
      .then(response => response.json())
      .then(res => {
        button.endLoading();
        const strTime = timeToString(new Date(item.date));
        const indexShift = this.inArray(this.data[strTime][0].shifts, item.id);
        if (indexShift != -1) {
          this.data[strTime][0].shifts.splice(indexShift, 1);
          this.data[strTime][0].change = true;
          this.setState({
            data: { ...this.data }
          }, () => {
            this._calendar.selectDate(new Date(item.date));
            scheduleNotification()
          }
          );
        }
        Info.show(res.infoMessages[0][1], res.ok == 0);
      })
      .catch(() => {
        button.endLoading();
      });
  }


  onPressDelete(button, item) {
    Alert.alert(
      "Vymazat",
      "Opravdu chcete směnu smazat?",
      [
        { text: 'Ano', onPress: () => this.onDelete(button, item) },
        { text: 'Ne', onPress: () => { }, style: 'cancel' },
      ],
      { cancelable: false }
    )
  }


  onPressEdit(item, index) {
    this._modalForm.open(item, this.state.IDwp, item.date, this.getJobsList(), index);
  }

  onPressAdd(item, index) {
    this._modalForm.open(null, this.state.IDwp, item.date, this.getJobsList(), index);
  }

  getJobsList() {
    let listJobs = [{ id: null, label: "Nevybráno" }];
    for (const key in this.state.wpJobs) {
      const id = this.state.wpJobs[key];
      if (this.state.jobs.hasOwnProperty("id" + id)) {
        const element = this.state.jobs["id" + id];
        listJobs.push({ id: element.id, label: element.name });
      }
    }
    return listJobs;
  }


  onPressHome(item) {
    this._modalPlansAbsence.open(item);
  }

  onPressComment(item) {
    this._modalPlansComments.open(item, this.state.IDwp, item.date, this.noEdit(item.date));
  }

  noEdit(actualDate) {
    let date = new Date(this.state.lastDate);
    if (this.state.offline) {
      return true;
    }
    return actualDate <= date;
  }

  onSaveDone(date, res, index) {
    let { scheduleNotification } = this.props.navigation.getScreenProps();
    scheduleNotification();

    const strTime = timeToString(date);
    this.data[strTime][0].change = true;
    this.setState({
      data: { ...this.data }
    }, () => {
        this.loadDates(xdateToData(XDate(date)),    
          () => this._calendar.scroll(
            index * 175,
            XDate(date)
          )
        );
      }
    );
    setTimeout(() => {
      Info.show(res.infoMessages[0][1], res.ok == 0);
    }, 250);
  }

  renderItem(item) {
    item.date = new Date(item.date);
    return (
      <PlanShiftListItem
        item={item}
        onPressHome={(item) => this.onPressHome(item)}
        onPressComment={(item) => this.onPressComment(item)}
        onPressEdit={(item,index) => this.onPressEdit(item,index)}
        onPressDelete={(button, item) => this.onPressDelete(button, item)}
        onPressAdd={(item,index) => this.onPressAdd(item,index)}
        noEdit={this.noEdit(item.date)}
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
        <WpSelect disabled={this.state.offline}
          listWp={this.state.listWp}
          selectedWp={this.state.selectedWp}
          onChange={(item) => this.setState({ selectedWp: item }, () => this.reloadData())} />
        <Calendar
          ref={(ref) => this._calendar = ref}
          onDayPress={(day) => this._selectedDate = new Date(day.dateString)}
          onDayChange={(day) => this._selectedDate = new Date(day.dateString)}
          items={this.state.data}
          offline={this.state.offline}
          renderItem={(day) => this.renderItem(day)}
          renderEmptyDay={() => null}
          markingType={'multi-dot'}
          markedDates={this.state.markedDates}
          loadItemsForMonth={(day) => this.loadItems(day)}
          onRefresh={(day) => this.loadOld(day)}
          refreshing={false}
          rowHasChanged={(r1) => r1.change == true}
        />
        <ModalPlansAbsence ref={(ref) => this._modalPlansAbsence = ref} />
        <ModalPlansComment ref={(ref) => this._modalPlansComments = ref} navigation={this.props.navigation} onSaveDone={(date, res) => this.onSaveDone(date, res, 0)}/>
        <ModalPlansForm ref={(ref) => this._modalForm = ref} navigation={this.props.navigation} onSaveDone={(date, res, index) => this.onSaveDone(date, res, index)} />
      </Container>
    );
  }
}