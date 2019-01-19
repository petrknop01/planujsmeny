/**
 * Modal pro výpis absencí
 */

import React, { Component } from 'react';
import { View, Modal } from "react-native";
import { Container, Header, Title, Content, Button, Left, Right, Body, Text } from 'native-base';
import { invertColor } from "./../../Utils/functions";
import { Colors } from "./../../Utils/variables";

function Absence({ item }) {
    return (
        <View
            style={{
                borderRadius: 5,
                overflow: "hidden",
                backgroundColor: "white",
                marginBottom: 10,
                flex: 1,
            }}>
            <Text style={{ fontWeight: "bold", backgroundColor: item.color, padding: 10, color: invertColor(item.color, true) }}>Absence: {item.absenceName}</Text>
        </View>
    );
}

export default class ModalFreeShiftsAbsence extends Component {
    state={
        open: false,
        absences: [],
    }

    open(item){
        this.setState({
            open: true,
            absences: item.absences,
        });
    }



    render() {
        return (
            <Modal
                visible={this.state.open}
                animationType={"slide"}
                supportedOrientations={["portrait" , "portrait-upside-down" , "landscape" , "landscape-left" , "landscape-right"]}
                onRequestClose={() => this.setState({ open: false })}
            >
                <Container>
                    <Header>
                        <Left />
                        <Body>
                            <Title>Absence</Title>
                        </Body>
                        <Right>
                            <Button transparent primary onPress={() => this.setState({ open: false })}><Text>Zavřít</Text></Button>
                        </Right>
                    </Header>
                    <Content style={{padding: 15, backgroundColor: Colors.lightGray}}>
                        {
                            this.state.absences.length == 0 ? 
                                <Text>Žádná absence</Text> :
                                null
                        }
                        {this.state.absences.map((item,i) => <Absence item={item} key={i} />)}
                    </Content>
                </Container>
            </Modal>
        )
    }
}