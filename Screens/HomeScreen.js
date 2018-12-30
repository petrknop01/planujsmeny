/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View, TouchableOpacity, Alert } from "react-native";
import { Container, Content, Text, Toast, Icon, Spinner, Input } from "native-base";
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
import ModalPopup from "./../Components/ModalPopup";
import DataStore from "./../Utils/dataStore";

const ACTION_TYPE = {
  clockIn: 1,
  clockOut: 2,
  pauseIn: 3,
  pauseOut: 4
}

export default class HomeScreen extends Component {
  _loadingButton = null;
  _loadingButtonPause = null;
  _lastTypeClock = ACTION_TYPE.clockIn

  state = {
    shift: null,
    shiftRequirements: {},
    currentlyAtWork: [],
    loading: true,
    comment: "",
    commentError: false,
    commentDevice: "",
    commentDeviceError: false,
    offline: false,
    savedDate: null,
    wpNames: {},
    error: [],
    showCommentDevice: false
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
        response["savedDate"] = new Date() + "";
        DataStore.SetHome(response, () => null);
        this.setData(response, callback)
        this.setState({
          offline: false
        });
      })
      .catch(error => {
        DataStore.GetHome((data) => {
          if (data == null) {
            this.setState({
              loading: false
            })
            return;
          }

          this.setData(data, callback)
          this.setState({
            offline: true
          });
        })
      });
  }

  setData(response, callback) {
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
      shiftRequirements: response.shiftReq,
      currentlyAtWork: response.currentlyAtWork,
      loading: false,
      savedDate: response.savedDate,
      wpNames: response.wpNames
    }, () => callback ? callback() : null)

    this.props.navigation.getScreenProps().setMenuType(this.getMenuType(response.shiftReq));
  }

  getMenuType(shiftRequirements){
    if(shiftRequirements == null){
      return 0;
    }

    if(shiftRequirements.canEdit == 0){
      return 1;
    }

    return 2;
  }

  renderPerson() {
    if (this.state.currentlyAtWork.length == 0) {
      return <NoData text="Nikdo není v práci" />
    }

    let items = [];
    for (const key in this.state.currentlyAtWork) {
      if (this.state.currentlyAtWork.hasOwnProperty(key)) {
        let id = key.replace("wp", "id");
        let wp = {};
        if (this.state.wpNames.hasOwnProperty(id)) {
          wp = this.state.wpNames[id];
        }
        let personItem = []
        const element = this.state.currentlyAtWork[key];
        for (const key2 in element) {
          const element2 = element[key2];
          personItem.push(<PersonListItem
            key={key2}
            item={element2} />);
        }

        items.push(
          <View key={key} style={{ margin: 10, borderRadius: 5, backgroundColor: "white", overflow: "hidden" }}>
            <Text style={{ fontWeight: "bold", borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: "black", padding: 10, color: "white" }}>{wp.name}</Text>
            {personItem}
          </View>
        );
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


  startLoadingButton(button) {
    if (button != null) {
      button.startLoading();
    }
  }

  endLoadingButton() {
    if (this._loadingButton != null) {
      this._loadingButton.endLoading();
    }


    if (this._loadingButtonPause != null) {
      this._loadingButtonPause.endLoading();
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

  showAlert(message) {
    Toast.show({
      text: message,
      buttonText: "Ok",
      duration: 5000,
      position: "bottom"
    });
  }

  onPressClockSave(type, showloadingButton) {
    if (type == null) {
      type = this._lastTypeClock;
    } else {
      this._lastTypeClock = type;
    }

    if (showloadingButton) {
      if (type == ACTION_TYPE.pauseIn || type == ACTION_TYPE.pauseOut) {
        this.startLoadingButton(this._loadingButtonPause);
      } else {
        this.startLoadingButton(this._loadingButton);
      }
    }
    let { address, cookie } = this.props.navigation.getScreenProps();

    this.loadData(() => {
      let data = {
        b: "app",
        bv: DeviceInfo.getReadableVersion(),
        bm: true,
        os: DeviceInfo.getSystemName(),
        osv: DeviceInfo.getSystemVersion(),
      }

      if (parseInt(this.state.clock.reqCom) == 1 && this.state.comment != "") {
        data["comment"] = this.state.comment;
      }

      if(this.state.commentDevice != ""){
        data["commentComputer"] = this.state.commentDevice;
      }

      Ajax.post(address + this.getUrl(type), data, cookie)
        .then(response => {
          response.json().then(res => {
            if (res.action == "fillComment" || res.action == "confirmUnallowed"){
              this.setState({
                error: res.infoMessages,
                showCommentDevice: res.action == "confirmUnallowed"
              }, () => {
                this.endLoadingButton();
                this._modal.showModal();
              })
              return;
            }

            this.loadData(() => {
              this.endLoadingButton();
              this._modal.closeModal(() =>
                setTimeout(() => {
                  if (res.infoMessages[0]) {
                    this.showAlert(res.infoMessages[0][1]);
                  }
                }, 250)

              );
            });
          });
        })
        .catch(error => {
          this.endLoadingButton();
          this._modal.closeModal();
        });
    });
  }

  getClockType() {
    return ACTION_TYPE.clockIn
  }

  renderClockButton() {
    let result = [];
    const { clock } = this.state;

    if (clock.clockIn == null) {
      result.push(<View key={1} style={{ padding: 5 }}><LoadingButton key={ACTION_TYPE.clockIn} ref={(ref) => this._loadingButton = ref} small style={{ alignSelf: "flex-end" }} onPress={() => this.onPressClockSave(ACTION_TYPE.clockIn, true)}><Text>Clock In</Text></LoadingButton></View>);
    }

    if (clock.clockIn != null && (clock.clockIn.pauseStart == null || (clock.clockIn.pauseEnd != null && clock.clockIn.pauseEnd != "0000-00-00 00:00:00"))) {
      result.push(<View key={2} style={{ padding: 5 }}><LoadingButton danger key={ACTION_TYPE.clockOut} ref={(ref) => this._loadingButton = ref} small style={{ alignSelf: "flex-end" }} onPress={() => this.onPressClockSave(ACTION_TYPE.clockOut, true)}><Text>Clock Out</Text></LoadingButton></View>);
    }


    if (parseInt(clock.enablePause) == 1 && clock.clockIn != null && clock.clockIn.pauseStart != null && clock.clockIn.pauseEnd == "0000-00-00 00:00:00") {
      result.push(<View key={3} style={{ padding: 5 }}><LoadingButton  info key={ACTION_TYPE.pauseOut} ref={(ref) => this._loadingButtonPause = ref} small style={{ alignSelf: "flex-end" }} onPress={() => this.onPressClockSave(ACTION_TYPE.pauseOut, true)}><Text>Pause end</Text></LoadingButton></View>);
    } else if (parseInt(clock.enablePause) == 1 && clock.clockIn != null) {
      result.push(<View key={4} style={{ padding: 5 }}><LoadingButton info key={ACTION_TYPE.pauseIn} ref={(ref) => this._loadingButtonPause = ref} small style={{ alignSelf: "flex-end" }} onPress={() => this.onPressClockSave(ACTION_TYPE.pauseIn, true)}><Text>Pause start</Text></LoadingButton></View>);
    }

    return result;
  }

  renderClock() {
    if (!this.state.clock ||
      parseInt(this.state.clock.enabled) == 0 ||
      this.state.offline) {
      return null;
    }

    let splitTime = this.state.clock.actualTime.split(" ")[1].split(":");
    let time = splitTime[0] + ":" + splitTime[1];

    return (
      <View style={{ padding: 5, flexDirection: "row", alignItems: "center", backgroundColor: "white" }}>
        <Text style={{ fontSize: FontSize.extra, fontWeight: "bold", width: 150 }}>{time}</Text>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap" }}>
          {this.renderClockButton()}
        </View>
      </View>
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <Spinner size="large" />
      )
    }

    return (
      <Container>
        <OfflineNotice
          date={this.state.savedDate}
          onConectionChange={(isConnected) => {
            if (isConnected) {
              this.loadData();
            }
            this.setState({
              offline: !isConnected
            });
          }
          } />
        <Content style={{ backgroundColor: Colors.lightGray }}>
          {this.renderClock()}
          <View>
            <Divider title="Nejbližší směny" />
            <View style={{ backgroundColor: Colors.lightGray }}>
              {this.renderShifts()}
            </View>
          </View>
          { this.state.shiftRequirements == null || 
            (this.state.shiftRequirements != null && this.state.shiftRequirements.canEdit == 0) ?
            null : 
            <View>
              <Divider title="Volné směny" />
              <View style={{ backgroundColor: Colors.lightGray }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('FreeShiftsDrawer')}>
                  <View style={{ justifyContent: "space-between", padding: 10, backgroundColor: "white", borderRadius: 5, margin: 10, flexDirection: "row", alignItems: "center" }}>
                      <Text>{this.state.shiftRequirements.thisMname} - {this.state.shiftRequirements.thisMcount}</Text><Text> {this.state.shiftRequirements.nextMname} - {this.state.shiftRequirements.nextMcount}</Text>
                    <Icon name="arrow-dropright" style={{ color: Colors.orange }} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          }
          <View>
            <Divider title="Aktuálně pracuje" />
            <View style={{ backgroundColor: Colors.lightGray }}>
              {this.renderPerson()}
            </View>
          </View>
        </Content>
        <ModalPopup
          ref={(ref) => this._modal = ref}
          onSave={() => {
            this.onPressClockSave(null, false);
            this.endLoadingButton();
          }}
          onClose={() => {
            this.endLoadingButton();
            this.setState({
              comment: "",
              commentError: true,
              commentDevice: "",
              commentDevceError: true,
            });
          }}>
          <View>
            <View>
              {this.state.error.map((item, i) => <Text key={i} style={{ color: Colors.red, paddingBottom: 10, textAlign: "center" }}>{item[1]}</Text>)}
            </View>
            {this.state.showCommentDevice?
            <View style={{ height: 100 }}>
              <Input
                style={{ flex: 1 }}
                error={this.state.commentDeviceError}
                value={this.state.commentDevice}
                placeholder="Proč používáte jiné zařízení"
                onChangeText={(commentDevice) => this.setState({ commentDevice, commentDeviceError: commentDevice == "" })}
                multiline={true}
              />
            </View> : null}

             {!this.state.showCommentDevice?
            <View style={{ height: 100, marginTop: 10 }}>
              <Input
                style={{ flex: 1 }}
                error={this.state.commentError}
                value={this.state.comment}
                placeholder="Komentář k vašemu příchodu"
                onChangeText={(comment) => this.setState({ comment, commentError: comment == "" })}
                multiline={true}
              />
            </View> : null}
            
          </View>
        </ModalPopup>
      </Container>
    );
  }
}