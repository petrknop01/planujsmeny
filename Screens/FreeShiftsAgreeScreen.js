/**
 * Setting screen
 * - screen pro zobrazení směn obrazovky které se mají přijmout
 */

import React, { Component } from 'react';
import { Container } from "native-base";
import { Colors } from "../Utils/variables";
import { UrlsApi } from "./../Utils/urls";
import { xdateToData, calculateDate, timeToString } from "./../Utils/functions";
import XDate from 'xdate';

import Calendar from "./../Components/Calendar";
import Ajax from "./../Utils/ajax";
import DataStore from "./../Utils/dataStore";
import ModalShifts from "./../Components/Modals/ModalShifts"
import ModalAbsence from "./../Components/Modals/ModalFreeShiftsAbsence"

import FreeShiftListItemManager from "./../Components/ListItems/FreeShiftListItemManager";
import OfflineNotice from "./../Components/OfflineNotice";
import Info from "./../Components/Info"

export default class FreeShiftsScreen extends Component {
  offline = false;
  _calendar = null;
  _selectedDate = new Date();
  data = {};

  state = {
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

    let { address, cookie, relogin } = this.props.navigation.getScreenProps();
    Ajax.get(address + UrlsApi.getUnassignedShiftsForManager, data, cookie)
      .then(response => response.json())
      .then(response => {
        if (response.ok == 0) {
          if (response.loggedOut == 1) {
            relogin(() => this.loadDates(day))
          }
          return;
        }

        this.setState({
          data: this.convertShifts(response, day),
          markedDates: this.convertMarkedDates(),
          refreshing: false,
          lastDate: response.lastForbidenEditationDate,
        },
          () => this.saveOfflineData()
        );
      })
      .catch(() => {
        this.getOfflineData();
      });
  }


  saveOfflineData() {
    let data = this.state;
    data.date = new Date();
    DataStore.SetMyFreeShifts(data, () => null);
  }

  getOfflineData() {
    DataStore.GetMyFreeShifts((data) => {
      if (data == null) {
        return;
      }
      this.data = data.data;

      this.setState({
        jobs: data.listWp,
        wps: data.jobs,
        users: data.users,
        absences: data.absences,
        offline: true,
        date: data.date,
        markedDates: data.markedDates,
        data: data.data,
        lastDate: data.lastDate,
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

          if (shifts[0].unasShifts && shifts[0].unasShifts.length > 0) {
            this.state.markedDates[strTime].dots.push({
              color: Colors.orange
            });
          }

          if (shifts[0].plannedShifts && shifts[0].plannedShifts.length > 0) {
            this.state.markedDates[strTime].dots.push({
              color: Colors.blue
            });
          }

          if (shifts[0].absences && shifts[0].absences.length > 0) {
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

        this.setState({
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
          unasShifts: []
        }];
      }
    }

    this.itemsToShiftObject(items.unasShifts);

    const newItems = {};
    Object.keys(this.data).forEach(key => { newItems[key] = this.data[key]; });
    return newItems;
  }

  itemsToShiftObject(items) {
    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        const item = items[key];
        const strTime = timeToString(key.replace("d", ""));
        for (const key2 in item) {
          if (item.hasOwnProperty(key2)) {
            const item2 = item[key2];

            const insertUnasShifts = {
              date: new Date(strTime),
              userName: this.getUserName(item2.user),
              jobName: this.getJobName(item2.job),
              color: this.getJobsColor(item2.job),
              wpName: this.getWorkspaceName(item2.wp),
              start: item2.start,
              end: item2.end,
              id: item2.id,
              jobId: item2.job,
              userId: item2.user,
              statusReq: item2.statusReq,
              requests: []
            };

            if(item2.reqs){
              for (const reqsKey in item2.reqs) {
                if (item2.reqs.hasOwnProperty(reqsKey)) {
                  const req = item2.reqs[reqsKey];
                  insertUnasShifts.requests.push(
                    {
                      userName: this.getUserName(req.reqUser),
                      color: this.getUserColor(),
                      statusReq:req.statusReq,
                      idReq:req.IDreq,
                      dateReq:req.dateReq,
                      timeReq:req.timeReq,
                      date: new Date(strTime),
                      id: item2.id
                    }
                  );
                }
              }
            }
            const indexUnasShifts = this.inArray(this.data[strTime][0].unasShifts, insertUnasShifts.id);
            if (indexUnasShifts == -1) {
              this.data[strTime][0].unasShifts.push(insertUnasShifts);
            } else {
              this.data[strTime][0].unasShifts[indexUnasShifts] = (insertUnasShifts);
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

  getUserColor() {
    return "#000000";
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


  onCancel(button, item) {
    button.startLoading();
    let url = UrlsApi.appUnassignedShiftsCancelReq;
    let { address, cookie,scheduleNotification } = this.props.navigation.getScreenProps();
    let data = {
      IDreq: item.idReq,
    }

    Ajax.post(address + url, data, cookie)
      .then(response => response.json())
      .then(res => {
        const strTime = timeToString(item.date);
        this.data[strTime][0].change = true;
        this.setState({
          data: { ...this.data }
        });
        button.endLoading();
        this._calendar.selectDate(new Date(item.date));
        Info.show(res.infoMessages[0][1], res.ok == 0);
        scheduleNotification();
      })
      .catch(() => {
        button.endLoading();
      });
  }

  onPressCancel(button, item) {
    this.onCancel(button, item)
  }

  onPressAccept(button, item) {
    button.startLoading();
    let url = UrlsApi.appUnassignedShiftsAcceptReq;
    let { address, cookie, scheduleNotification } = this.props.navigation.getScreenProps();
    let data = {
      IDreq: item.idReq,
    }

    Ajax.post(address + url, data, cookie)
      .then(response => response.json())
      .then(res => {
        const strTime = timeToString(item.date);
        this.data[strTime][0].change = true;
        this.setState({
          data: { ...this.data }
        });
        button.endLoading();
        this._calendar.selectDate(new Date(item.date));
        this.data[strTime][0].unasShifts = [];
        Info.show(res.infoMessages[0][1], res.ok == 0);
        scheduleNotification();
      })
      .catch(() => {
        button.endLoading();
      });
  }

  onPressHome(item) {
    this._modalAbsence.open(item);
  }

  onPressPlannedShifts(item) {
    this._modalShifts.open(item);
  }

  noEdit(actualDate) {
    let date = new Date(this.state.lastDate);
    if (this.state.offline) {
      return true;
    }
    return actualDate <= date;
  }

  renderItem(item) {
    item.date = new Date(item.date);
    return (
      <FreeShiftListItemManager
        item={item}
        noEdit={this.noEdit(item.date)}
        onPressAccept={(button, item) => this.onPressAccept(button, item)}
        onPressCancel={(button, item) => this.onPressCancel(button, item)}
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

        <ModalShifts ref={(ref) => this._modalShifts = ref} />
        <ModalAbsence ref={(ref) => this._modalAbsence = ref} />
      </Container>
    );
  }
}