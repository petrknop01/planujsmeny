/**
 * Modal pro výpis směn
 */

import React, { Component } from 'react';
import { View, Modal } from "react-native";
import { Container, Header, Title, Content, Button, Left, Right, Body, Text } from 'native-base';
import { invertColor } from "./../../Utils/functions";
import { Colors, FontSize } from "./../../Utils/variables";

function PlannedShifts({ item }) {
    return (
<View
            style={{
                borderRadius: 5,
                overflow: "hidden",
                backgroundColor: "white",
                marginBottom: 10,
                flex: 1,
            }}>
            <Text style={{ fontWeight: "bold", backgroundColor: item.color, padding: 10, color: invertColor(item.color, true) }}>{item.start} - {item.end}</Text>
            <View style={{ padding: 10 }}>
                <Text style={{ fontWeight: "bold", paddingBottom: 5 }} numberOfLines={1} ellipsizeMode="tail" >{item.jobName}</Text>
                <Text style={{ fontSize: FontSize.small }} numberOfLines={1} ellipsizeMode="tail">{item.wpName}</Text>
            </View>
        </View>
    );
}

export default class ModalShifts extends Component {
    state={
        open: false,
        plannedShifts: [],
    }

    open(item){
        this.setState({
            open: true,
            plannedShifts: item.plannedShifts,
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
                            <Title>Plánované směny</Title>
                        </Body>
                        <Right>
                            <Button transparent primary onPress={() => this.setState({ open: false })}><Text>Zavřít</Text></Button>
                        </Right>
                    </Header>
                    <Content style={{padding: 15, backgroundColor: Colors.lightGray}}>
                        {
                            this.state.plannedShifts.length == 0 ? 
                                <Text>Žádná naplánovaná směna</Text> :
                                null
                        }
                        {this.state.plannedShifts.map((item,i) => <PlannedShifts item={item} key={i} />)}
                    </Content>
                </Container>
            </Modal>
        )
    }
}