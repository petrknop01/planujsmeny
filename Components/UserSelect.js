/**
 * Futbalito app, starting layout
 */

import React, { Component } from 'react';

import {
    ScrollView,
    TouchableOpacity,
    View,
    Platform,
    Modal,
    Dimensions
} from 'react-native';

import {
    Text,
    Header,
    Left,
    Body,
    Right,
    Title,
    Button,
    Container,
    Icon
} from 'native-base';

import variable from './../native-base-theme/variables/platform';
import Ajax from "./../Utils/ajax";
import { withNavigation } from 'react-navigation';
import Select from "./Select";
import { UrlsApi } from "./../Utils/urls";

import { Colors, FontSize } from "../Utils/variables";

export class UserSelect extends Component {
    static defaultProps = {
        disabled: false
    }


    constructor(props) {
        super(props);
        let { userID, username } = props.navigation.getScreenProps();
        this.state = {
            users: [],
            selectedUser: { id: userID, label: username }
        }
    }


    componentDidMount() {
        this.loadUsers();
    }

    loadUsers() {
        let { address, cookie, relogin } = this.props.navigation.getScreenProps();
        Ajax.get(address + UrlsApi.users, {}, cookie)
            .then(response => response.json())
            .then(response => {
                if (response.ok == 0) {
                    if (response.loggedOut == 1) {
                        relogin(() => this.loadUsers(day))
                    }
                    return;
                }

                let users = [];
                let selected = {};
                for (const key in response.users) {
                    if (response.users.hasOwnProperty(key)) {
                        const element = response.users[key];
                        if(element.id == this.state.selectedUser.id){
                            selected = {
                                id: element.id,
                                label: element.name
                            };
                        }
                        users.push({
                            id: element.id,
                            label: element.name
                        });
                    }
                }
                this.setState({
                    users: users,
                    selectedUser: selected
                });
            })
            .catch(error => {
                console.error(error);
            });
    }


    render() {
        if (this.state.users.length == 0) {
            return (
                <View style={{ height: 60, backgroundColor: "white", padding: 10 }}>
                    <Select disabled={true} selected={this.state.selectedUser} items={[this.state.selectedUser]} onChange={(item) => null
                    } />
                </View>);
        }

        return (
            <View style={{ height: 60, backgroundColor: "white", padding: 10 }}>
                <Select disabled={this.props.disabled} selected={this.state.selectedUser} items={this.state.users} onChange={(item) => {
                    this.setState({ selectedUser: item });
                    this.props.onChange(item)
                }
                } />
            </View>
        );
    }
}

export default withNavigation(UserSelect);
