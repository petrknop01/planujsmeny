/**
 * Modal pro zadávání časových možností
 */

import React, { Component } from 'react';
import { View } from "react-native";
import { Text } from 'native-base';
import ModalPopup from "./../../Components/ModalPopup";
import InputTime from "./../../Components/InputTime";
import Select from "./../../Components/Select";
import { UrlsApi } from "./../../Utils/urls";
import Ajax from "./../../Utils/ajax";
import { timeToReadString } from "./../../Utils/functions";

class ModalMyTymesForm extends Component {
    state = {
        timeFrom: "00:00",
        timeTo: "00:00",
        timeAbsenceLength: "00:00",
        editedDate: null,
        editedItem: null,
        selectMain: { label: "Dostupný" },
        selectedTypes: { label: "" },
        forSelectItems: [{ label: "Dostupný" }, { label: "Absence" }]
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

        Ajax.post(address + url + "&empl=" + this.props.selectedUserId, data, cookie)
            .then(response => response.json())
            .then(res => {
                this._modal.closeModal(() =>
                    setTimeout(() => {
                        this.props.onSaveDone(this.state.editedDate, res)
                    }, 100));
            })
            .catch(() => {
                this._modal.closeModal();
            });
    }

    showModal(item) {
        this.setState({ ...item }, () => this._modal.showModal());
    }

    render() {
        return (
            <ModalPopup ref={(ref) => this._modal = ref} onSave={() => this.onSave()}>
                <View>
                    <View style={{ marginBottom: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Text>{timeToReadString(this.state.editedDate)}</Text>
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
                            <Select selected={this.state.selectedTypes} items={this.props.typesToSelect} onChange={(item) => this.setState({ selectedTypes: item })} />
                        </View> : null}
                </View>
            </ModalPopup>
        )
    }
}


export default ModalMyTymesForm;