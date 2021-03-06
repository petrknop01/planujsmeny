/**
 * Setting screen
 * - screen pro zobrazení směn obrazovky
 */

import React, { Component } from 'react';
import { Container } from "native-base";
import Ajax from "./../Utils/ajax";
import { UrlsApi } from "./../Utils/urls";
import { xdateToData, calculateDate, timeToString } from "./../Utils/functions";
import OfflineNotice from "./../Components/OfflineNotice";
import ShiftListItemFree from "./../Components/ListItems/ShiftListItemFree";
import ShiftListItem from "./../Components/ListItems/ShiftListItem";
import Calendar from "./../Components/Calendar";
import UserSelect from "./../Components/UserSelect";

import DataStore from "./../Utils/dataStore";
import XDate from 'xdate';


export default class MyShiftsScreen extends Component {
  _calendar = null;
  _selectedDate = new Date();
  shifts = {};
  offline = true;

  constructor(props){
    super(props);
    let { userID } = props.navigation.getScreenProps();

    this.state = {
      jobs: null,
      selectedUserId: userID,
      workplaces: null,
      markedDates: {},
      shifts: {},
      offline: false,
      date: null,
    };
  }


  reloadData(){
    this.shifts = {};
    _selectedDate = new Date();

    this.setState({
      markedDates: {},
      shifts: {},
    }, () =>  this._calendar.selectDate(new Date()));
  }

  loadJobsAndWorkplaces(callback) {
    let { address, cookie, relogin } = this.props.navigation.getScreenProps();
    Ajax.get(address + UrlsApi.jobsAndWorkplaces, {}, cookie)
      .then(response => response.json())
      .then(response => {
        if (response.ok == 0) {
          if (response.loggedOut == 1) {
            relogin(() => this.loadJobsAndWorkplaces(callback))
          }
          return;
        }

        this.setState({
          jobs: response.jobs,
          workplaces: response.wps,
        }, () => callback())
      })
      .catch(error => {
        this.getOfflineData(xdateToData(XDate(true)));
      });
  }


  loadDates(day) {
    let data = {
      from: calculateDate(day.dateString, -1),
      to: calculateDate(day.dateString, +1),
      empl: this.state.selectedUserId
    }

    let { address, cookie, relogin } = this.props.navigation.getScreenProps();
    Ajax.get(address + UrlsApi.shifts, data, cookie)
      .then(response => response.json())
      .then(response => {
        if (response.ok == 0) {
          if (response.loggedOut == 1) {
            relogin(() => this.loadDates(day))
          }
          return;
        }

        this.setState({
          shifts: this.convertShifts(response.shifts, day),
          markedDates: this.convertMarkedDates(response.shifts),
          refreshing: false
        }, () => this.saveOfflineData(response.shifts));
      })
      .catch(error => {
        this.getOfflineData(day);
      });
  }

  getOfflineData(day) {
    this.offline = true;

    DataStore.GetMyShift((data) => {
      if (data == null) {
        return;
      }

      this.setState((state, props) => {
          return {
            jobs: data.jobs,
            workplaces: data.workplaces,
            date: new Date(data.savedDate)
          }
        }
      );


      this.setState({
        shifts: this.convertShifts(data.shifts, day),
        markedDates: this.convertMarkedDates(data.shifts),
        refreshing: false
      })
    });
  }


  saveOfflineData(shifts) {
    let { userID } = this.props.navigation.getScreenProps();

    if(this.state.selectedUserId !== userID){
      return;
    }

    this.shifts = { ...shifts, ...this.shifts };
    DataStore.SetMyShift({ jobs: this.state.jobs, workplaces: this.state.workplaces, shifts: this.shifts, savedDate: new Date() }, () => null);
  }

  getJobsName(id) {
    if (!this.state.jobs || !this.state.jobs.hasOwnProperty("id" + id)) {
      return "";
    }

    let job = this.state.jobs["id" + id];
    return job.name
  }

  getWorkspaceName(id) {
    if (!this.state.workplaces || !this.state.workplaces.hasOwnProperty("id" + id)) {
      return "";
    }

    let workplace = this.state.workplaces["id" + id];
    return workplace.name
  }

  getJobsColor(id) {
    if (!this.state.jobs.hasOwnProperty("id" + id)) {
      return "#000000";
    }

    let job = this.state.jobs["id" + id];
    return job.color
  }

  convertMarkedDates(items) {
    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        const shifts = items[key];
        const strTime = timeToString(key.replace("d", ""));
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
      const strTime = timeToString(time);
      if (!this.state.shifts[strTime]) {
        this.state.shifts[strTime] = [];
      }
    }

    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        const shifts = items[key];
        const strTime = timeToString(key.replace("d", ""));
        this.state.shifts[strTime] = [{ items: [] }];
        for (const key2 in shifts) {
          if (shifts.hasOwnProperty(key2)) {
            const shift = shifts[key2];
            this.state.shifts[strTime][0].items.push({
              position: this.getJobsName(shift.job),
              name: this.getWorkspaceName(shift.wp),
              timeFrom: shift.start,
              timeTo: shift.end,
              clockIn: shift.clockIn ,
              clockOut:shift.clockOut ,
              isClock: shift.clock,
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
    if ((this.state.jobs == null && this.state.workplaces == null) || this.offline) {
      this.offline = false;
      this.loadJobsAndWorkplaces(() => this.loadDates(day))
    } else {
      this.loadDates(day)
    }
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


  renderItem(item) {
    return (
      <ShiftListItem item={item} />
    );
  }

  renderEmptyDate(day) {
    return <ShiftListItemFree item={{ date: day }} />;
  }
  
  render() {
    return (
      <Container style={{ backgroundColor: "gray" }}>
        <OfflineNotice 
          date={this.state.date} 
          onConectionChange={(isConnected) => {
            if(isConnected){
              this.loadItems(xdateToData(XDate(true)));
            }

            this.setState({
              offline: !isConnected
            });
          }
        }/>
        <UserSelect disabled={this.state.offline} onChange={(item) => this.setState({selectedUserId: item.id}, () => this.reloadData())}/>
        <Calendar
          ref={(ref) => this._calendar = ref}
          onDayPress={(day) => this._selectedDate = new Date(day.dateString)}
          onDayChange={(day) => this._selectedDate = new Date(day.dateString)}
          items={this.state.shifts}
          renderItem={(day) => this.renderItem(day)}
          renderEmptyDate={(day) => this.renderEmptyDate(day)}
          markingType={'multi-dot'}
          offline={this.state.offline}
          markedDates={this.state.markedDates}
          loadItemsForMonth={(day) => this.loadItems(day)}
          onRefresh={(day) => this.loadOld(day)}
          refreshing={false}
        />
      </Container>
    );
  }
}
