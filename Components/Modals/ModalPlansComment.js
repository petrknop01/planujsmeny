/**
 * Modal pro zadání komentářu
 */

import React, { Component } from 'react';
import { View } from "react-native";
import { Input } from 'native-base';
import ModalPopup from "./../../Components/ModalPopup";
import { UrlsApi } from "./../../Utils/urls";
import Ajax from "./../../Utils/ajax";

export default class ModalPlansComment extends Component {
    state = {
        comment: "",
        commentError: false,
        date: null,
        wp: null,
        noEdit: false,
    }

    open(item, wp, date, noEdit) {
        let comment = "";
        if (item.comments && item.comments.length > 0) {
            comment = item.comments[0].comment[0];
        }
        this.setState({
            comment: comment,
            commentError: false,
            noEdit: noEdit,
            wp: wp,
            date: date
        }, () => this._modal.showModal());
    }

    save(){
        let { address, cookie } = this.props.navigation.getScreenProps();
        let data = {
            wp: this.state.wp,
            date: this.state.date.toJSON().slice(0, 10),
            text: this.state.comment
        };
        Ajax.post(address + UrlsApi.updateComment, data, cookie)
        .then(response => response.json())
        .then(res => {
            this._modal.closeModal(() => setTimeout(() => this.props.onSaveDone(this.state.date, res), 100));
        })
        .catch(() => {
        });
    }

    render() {
        return (
            <ModalPopup ref={(ref) => this._modal = ref} onSave={() => this.save()} hideSaveButton={this.state.noEdit}>
                <View style={{ height: 100 }}>
                    <Input
                        style={{ flex: 1 }}
                        error={this.state.commentError}
                        value={this.state.comment}
                        placeholder="Komentář"
                        onChangeText={(comment) => this.setState({ comment, commentError: comment == "" })}
                        multiline={true}
                        disabled={this.state.noEdit}
                    />
                </View>
            </ModalPopup>
        )
    }
}