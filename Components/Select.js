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

export default class Select extends Component {

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
                            <TouchableOpacity onPress={() => this.onPressSelect(item)} key={i} style={{ borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 1, padding: 15 }}>
                                <View><Text style={{ color: (this.props.selected.label == item.label ? Colors.orange : "black") }}>{item.label}</Text></View>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </Container>
            </Modal>
        );
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
                                <Text numberOfLines={1} ellipsizeMode="tail">{this.props.selected.label}</Text>
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
