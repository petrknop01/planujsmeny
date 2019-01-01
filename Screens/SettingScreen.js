/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Modal, Switch, Slider, View } from "react-native";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import DataStore from "./../Utils/dataStore";
import { Colors } from "./../Utils/variables"

function SettingItem({ dataKey, data, label, unit, minValue, maxValue, onChange }) {
    return (
        <View
            style={{
                borderRadius: 5,
                overflow: "hidden",
                backgroundColor: "white",
                marginBottom: 10,
                flex: 1,
            }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ padding: 10 }}>{label}</Text>
                <Switch
                    value={data.enabled}
                    onValueChange={(value) => {
                        data.enabled = value;
                        onChange(data);
                    }}
                />
            </View>
            <View style={{ padding: 10 }}>
                <Slider
                    disabled={!data.enabled}
                    value={data.value}
                    minimumValue={minValue}
                    maximumValue={maxValue}
                    step={1}
                    onValueChange={(value) => {
                        data.value = value;
                        onChange(data);
                    }}
                />
                <Text style={{ textAlign: "center", color: data.enabled ? Colors.orange : Colors.lightGray }}>{data.value} {unit}</Text>
            </View>
        </View>
    );
}


export default class SettingScreen extends Component {
    state = {
        open: false,
        data: {}
    }

    open() {
        DataStore.GetNotificationSetting((data) => {
            this.setState({
                open: true,
                data: data,
            });
        })
    }

    onPressSave() {
        DataStore.SetNotificationSetting(this.state.data, () => { 
            this.setState({ open: false }); 
            this.props.scheduleNotification();
        });
    }

    onChange(dataKey, value) {
        this.state.data[dataKey] = value;
        this.setState({
            data: this.state.data
        });
    }

    render() {
        return (
            <Modal
                visible={this.state.open}
                animationType={"slide"}
                supportedOrientations={["portrait", "portrait-upside-down", "landscape", "landscape-left", "landscape-right"]}
                onRequestClose={() => this.setState({ open: false })}
            >
                <Container>
                    <Header>
                        <Left />
                        <Body>
                            <Title>Nastavení</Title>
                        </Body>
                        <Right>
                            <Button transparent primary onPress={() => this.setState({ open: false })}><Text>Zavřít</Text></Button>
                        </Right>
                    </Header>
                    <Content style={{ padding: 15, backgroundColor: Colors.lightGray }}>
                        <SettingItem
                            label="Dlouhá notifikace před směnou"
                            data={this.state.data.longTermStart}
                            minValue={2}
                            maxValue={48}
                            unit="hod."
                            onChange={(value) => this.onChange("longTermStart", value)}
                        />
                        <SettingItem
                            label="Krátká notifikace před směnou"
                            data={this.state.data.shortTermStart}
                            minValue={0}
                            maxValue={120}
                            unit="min."
                            onChange={(value) => this.onChange("shortTermStart", value)}
                        />
                        <SettingItem
                            label="Notifikace před koncem směny"
                            data={this.state.data.endTerm}
                            minValue={0}
                            maxValue={600}
                            unit="min."
                            onChange={(value) => this.onChange("endTerm", value)}
                        />
                    </Content>
                    <Footer>
                        <FooterTab>
                            <Button
                                success
                                block
                                onPress={() => this.onPressSave()}
                            >
                                <Text style={{color: "white"}}>Uložit</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container>
            </Modal>
        )
    }
}