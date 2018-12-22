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

import { Colors, FontSize } from "../Utils/variables";

export default class CustomSelectUser extends Component {

    static defaultProps = {
        noOverflow: false,
        disabled: false,
    }


    state = {
        showList: false
    }


    onPressSelect(item) {
        this.props.onChange(item);
        this.setState({ showList: !this.state.showList })
    }

    getBackground(item){
        if(item.work == "1"){
            return "red";
        }

        if(item.avail == "0"){
            return "pink";
        }

        return "white";
    }

    getSymbol(item){
        if(item.pp == "1" && item.pa == "1" ){
            return " (<-p->)";
        }

        if(item.pp == "1"){
            return " (<-p)";
        }

        if(item.pa == "1" ){
            return " (p->)";
        }

        return "";
    }


    renderList() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.showList}
                onRequestClose={() => this.setState({ showList: false })}
            >
                <Header style={{ backgroundColor: "white" }} androidStatusBarColor="white">
                    <Left>
                    </Left>
                    <Body>
                        <Title>
                            <Text style={{ color: Colors.header }}>Vyberte</Text>
                        </Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.setState({ showList: false })}>
                            <Text>Zavřít</Text>
                        </Button>
                    </Right>
                </Header>
                <Container>
                    <ScrollView>
                        {this.props.items.map((item, i) =>
                            <TouchableOpacity onPress={() => this.onPressSelect(item.id)} key={i} style={{ borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 1, padding: 15 }}>
                                <View style={{justifyContent: "space-between", alignItems: "flex-end", flexDirection: "row", backgroundColor: this.getBackground(item)}}>
                                    <Text style={{ color: (this.props.selected == item.id ? Colors.orange : "black")}}>
                                        {item.prio} {item.name}
                                        {item.max == "1" ? " (M)":""}
                                        {this.getSymbol(item)}
                                    </Text>
                                    <Text style={{fontSize: FontSize.small}}>{item.availText}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </Container>
            </Modal>
        );
    }

    getUser(){
        for (let index = 0; index < this.props.items.length; index++) {
            const element = this.props.items[index];
            if(element.id == this.props.selected ){
                return element
            }
        }
    }

    renderItem(){
        let item = this.getUser();
        if(this.props.selected == null || item == null){
            return <Text numberOfLines={1} ellipsizeMode="tail">Vyberte uživatele</Text>
        }

        
        return <Text numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
    }

    render() {
        return (
            <View style={{
                height: variable.inputHeightBase,
                color: variable.inputColor,
                paddingLeft: 10,
                paddingRight: 10,
                flex: 1,
                fontSize: variable.inputFontSize,
                backgroundColor: "#EEE",
                borderRadius: variable.borderRadiusBase,
                flex: 1
            }}>
                <TouchableOpacity
                    disabled={this.props.disabled} 
                    style={{ zIndex: 2 }}
                    onPress={() => this.setState({ showList: !this.state.showList })}
                >
                    <View {...this.props}>
                        <View style={{ flexDirection: "row", alignItems:"center", justifyContent: "space-between", padding: 10 }}>
                            <View>
                                {this.renderItem()}
                            </View>
                            {this.props.disabled? null :
                            <View style={{ paddingLeft: 10, marginTop: -3 }}>
                                <Icon name="ios-arrow-down"/>
                            </View>}
                        </View>
                    </View>
                </TouchableOpacity>

                {this.renderList()}
            </View>
        );
    }
}
