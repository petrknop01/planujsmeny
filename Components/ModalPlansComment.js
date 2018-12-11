
import React, { Component } from 'react';
import { View, TouchableOpacity, Modal } from "react-native";
import { Input, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import ModalPopup from "./../Components/ModalPopup";

export default class ModalPlansComment extends Component {
    state = {
        comment: "",
        commentError: false
    }

    open(item) {
        let comment = "";
        if (item.comments && item.comments.length > 0) {
            comment = item.comments[0].comment[0];
        }
        this.setState({
            comment: comment,
            commentError: false
        }, () => this._modal.showModal());
    }

    render() {
        return (
            <ModalPopup ref={(ref) => this._modal = ref} onSave={() => this._modal.closeModal()}>
                <View style={{ height: 100 }}>
                    <Input
                        style={{ flex: 1 }}
                        error={this.state.commentError}
                        value={this.state.comment}
                        placeholder="Komentář"
                        onChangeText={(comment) => this.setState({ comment, commentError: comment == "" })}
                        multiline={true}
                    />
                </View>
            </ModalPopup>
        )
    }
}