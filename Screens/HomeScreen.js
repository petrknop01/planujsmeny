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
import NoData from "./../Components/NoData";
import OfflineNotice from "./../Components/OfflineNotice";
import Ajax from "./../Utils/ajax";
import { UrlsApi } from "./../Utils/urls";
import LoadingButton from "./../Components/LoadingButton";
import DeviceInfo from 'react-native-device-info';

const ACTION_TYPE = {
  clockIn: 1,
  clockOut: 2,
  pauseIn: 3,
  pauseOut: 4
}

export default class HomeScreen extends Component {
  _loadingButton = null;

  state = {
    shift: null,
    shiftRequirements: {},
    currentlyAtWork: [],
    loadingShift: true,
    comment: "",
    commentDialog: false,
  }

  componentDidMount() {
    this.loadData();
  }

  loadData(callback) {
    let { address, cookie, relogin } = this.props.navigation.getScreenProps();
    Ajax.get(address + UrlsApi.homepage, {}, cookie)
      .then(response => response.json())
      .then(response => {
        if (response.ok == 0) {
          if (response.loggedOut == 1) {
            relogin(() => this.loadData())
          }
          return;
        }

        let shifts = null;
        response.shifts.map((item, i) => {
          if (shifts == null) {
            shifts = {};
          }

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
          clock: response.clockInfo.clockInInfo,
          shiftRequirements: response.shiftRequirements,
          currentlyAtWork: response.currentlyAtWork,
          loadingShift: false
        }, () => callback ? callback() : null)
      })
      .catch(error => {
      });
  }

  renderPerson() {
    if (this.state.currentlyAtWork.length == 0) {
      return <NoData text="Není nikdo v práci" />
    }

    let items = [];
    for (const key in this.state.currentlyAtWork) {
      if (this.state.currentlyAtWork.hasOwnProperty(key)) {
        const element = this.state.currentlyAtWork[key];
        for (const key2 in element) {
          const element2 = element[key2];
          items.push(<PersonListItem
            key={key}
            item={element2} />);
        }
      }
    }

    return items;
  }

  renderShifts() {
    if (this.state.shift == null) {
      return <NoData text="Nemáte naplánované směny" />
    }

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


  togleLoadingButton(button) {
    if (button != null) {
      button.togleLoading();
    }
  }

  getUrl(type) {
    switch (type) {
      case ACTION_TYPE.clockIn:
        return UrlsApi.clockIn;
      case ACTION_TYPE.clockOut:
        return UrlsApi.clockOut;
      case ACTION_TYPE.pauseIn:
        return UrlsApi.clockPause;
      case ACTION_TYPE.pauseOut:
        return UrlsApi.clockResume;
    }
  }


  onPressClock(type) {
    this.togleLoadingButton(this._loadingButton);
    let { address, cookie } = this.props.navigation.getScreenProps();


    this.loadData(() => {
      if (this.state.clock.reqCom && !this.state.commentDialog) {
        this.setState({
          commentDialog: true
        })
        return;
      }

      let data = {
        b :"app", 
        bv : DeviceInfo.getReadableVersion(), 
        bm :true, 
        os : DeviceInfo.getSystemName(),
        osv :DeviceInfo.getSystemVersion()
      }

      if(this.state.commentDialog){
        data["comment"] = this.state.comment;
      }

      Ajax.post(address + this.getUrl(type), data, cookie)
        .then(response => {
          var cookies = response.headers.get('set-cookie');
          response.json().then(res => {
            this.togleLoadingButton(this._loadingButton);
          });
        })
        .catch(error => {
          this.togleLoadingButton(this._loadingButton);
        });
    });
  }

  renderClock() {
    if (!this.state.clock.enabled) {
      return null;
    }

    let time = new Date(this.state.clock.actualTime);

    return (
      <View style={{ padding: 5, flexDirection: "row", alignItems: "center", backgroundColor: "white" }}>
        <Text style={{ fontSize: FontSize.extra, fontWeight: "bold", width: 150 }}>{(("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2))}</Text>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap" }}>
          <LoadingButton ref={(ref) => this._loadingButton = ref} small style={{ alignSelf: "flex-end" }} onPress={() => this.onPressClock(ACTION_TYPE.clockIn)}><Text>Clock In</Text></LoadingButton>
          {/* <Button small style={{marginLeft: 10, marginTop: 10, alignSelf: "flex-end"}}><Text>V práci</Text></Button> */}
        </View>
      </View>
    );
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
          {this.renderClock()}
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
                  <View>
                    <Text style={{ fontSize: FontSize.big }}>V tomto měsíci je <Text style={{ fontSize: FontSize.big, color: Colors.orange, fontWeight: "bold" }}>{this.state.shiftRequirements.nextMcount}</Text> volných směn.</Text>
                    <Text style={{ fontSize: FontSize.big }}>V následujícím je <Text style={{ fontSize: FontSize.big, color: Colors.orange, fontWeight: "bold" }}>{this.state.shiftRequirements.nextMcount}</Text> volných směn.</Text>
                  </View>
                  <Icon name="arrow-dropright" style={{ color: Colors.orange }} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Divider title="Aktuálně pracuje" />
            <View style={{ backgroundColor: Colors.lightGray }}>
              {this.renderPerson()}
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}