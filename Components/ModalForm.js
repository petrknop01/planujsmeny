
import React, { Component } from 'react';
import { View, TouchableOpacity, Modal, Alert } from "react-native";
import { Input, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import ModalPopup from "./../Components/ModalPopup";
import InputTime from "./../Components/InputTime";
import Select from "./../Components/Select";
import { UrlsApi } from "./../Utils/urls";
import Ajax from "./../Utils/ajax";
import CustomSelectUser from "./../Components/CustomSelectUser";


class ModalForm extends Component {
    state = {
        timeFrom: "00:00",
        timeTo: "00:00",
        wpId: 0,
        selectedJob: { id: null, label: "Nevybráno" },
        selectedUserId: null,
        id: null,
        date: null,
        jobList: [{ id: null, label: "Nevybráno" }],
        userList: [],
        index: 0
    }

    open(item, wpId, date, jobList, index) {
        this.setState({
            timeFrom: item ? item.start : "00:00",
            timeTo: item ? item.end : "00:00",
            wpId: wpId,
            selectedItemUserId: item ? item.userId : null,
            selectedUserId: item ? item.userId : null,
            id: item ? item.id : null,
            date: date,
            jobList: jobList,
            index: index,
            selectedJob: item ? this.getJob(item.jobId, jobList) : { id: null, label: "Nevybráno" },
        }, () => {
            this.getUsers();
            this._modal.showModal()
        });
    }

    getJob(id, array) {
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (id == element.id) {
                return { id: id, label: element.label }
            }
        }
    }

    showAlert(message) {
        Alert.alert(
            "Chyba",
            message,
            [
                { text: 'Ok', onPress: () => { }, style: 'cancel' },
            ],
            { cancelable: false }
        )
    }

    getUsers() {
        if (this.state.selectedJob.id == null) {
            return;
        }

        let data = {
            IDshift: this.state.id ? this.state.id : 0,
            job: this.state.selectedJob.id,
            from: this.state.timeFrom,
            to: this.state.timeTo,
            wp: this.state.wpId,
            date: this.state.date.toJSON().slice(0, 10)
        }

        let { address, cookie } = this.props.navigation.getScreenProps();

        Ajax.post(address + UrlsApi.getShiftsUser, data, cookie)
            .then(response => response.json())
            .then(res => {
                if(res.ok == 0){
                    this.setState({
                        userList: [],
                        selectedUserId: null,
                    })
                    this.showAlert(res.infoMessages[0][1]);
                }

                let inArray =  false;
                let users = [];
                for (const key in res.users) {
                    if (res.users.hasOwnProperty(key)) {
                        const element = res.users[key];
                        users.push(element);
                        inArray |= (this.state.selectedItemUserId == element.id);
                    }
                }


                this.setState({
                    userList: users,
                    selectedUserId: inArray ? (this.state.selectedItemUserId ? this.state.selectedItemUserId : null) : null
                });
            })
            .catch(() => {
            });
    }

    onSave(){
        if (this.state.selectedJob.id == null) {
            this._modal._loadingButton.endLoading();
            return;
        }

        if (this.state.selectedUserId== null) {
            this._modal._loadingButton.endLoading();
            return;
        }

        let data = {
            job : this.state.selectedJob.id ,
            user : this.state.selectedUserId,
            from : this.state.timeFrom,
            to : this.state.timeTo
        }

        let url = "";

        if(this.state.id){
            data.IDshift = this.state.id;
            url = UrlsApi.editShift;
        }else{
            data.wp = this.state.wpId;
            data.date = this.state.date.toJSON().slice(0, 10);
            url = UrlsApi.addShift;
        }

        let { address, cookie } = this.props.navigation.getScreenProps();

        Ajax.post(address + url, data, cookie)
        .then(response => response.json())
        .then(res => {
            this._modal.closeModal(() => setTimeout(() => this.props.onSaveDone(this.state.date, res, this.state.index), 100));
        })
        .catch(() => {
        });
    }

    render() {
        return (
            <ModalPopup ref={(ref) => this._modal = ref} onSave={() => this.onSave()}>
                <View>
                    <View style={{ marginBottom: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Text>{new Date(this.state.date).toLocaleDateString()}</Text>
                    </View>
                    <View style={{ marginBottom: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <View style={{ flex: 1 }}>
                            <InputTime
                                value={this.state.timeFrom}
                                onChange={(timeFrom) => this.setState({ timeFrom }, () => this.getUsers())}
                            />
                        </View>
                        <Text style={{ paddingHorizontal: 10 }}>-</Text>
                        <View style={{ flex: 1 }}>
                            <InputTime
                                value={this.state.timeTo}
                                onChange={(timeTo) => this.setState({ timeTo }, () => this.getUsers())}
                            />
                        </View>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Select items={this.state.jobList} selected={this.state.selectedJob} onChange={(item) => this.setState({ selectedJob: item }, () => this.getUsers())} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <CustomSelectUser selected={this.state.selectedUserId} items={this.state.userList} onChange={(id) => this.setState({ selectedUserId: id })} />
                    </View> 
                </View>
            </ModalPopup>
        )
    }
}


export default ModalForm;