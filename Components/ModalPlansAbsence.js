
import React, { Component } from 'react';
import { View, TouchableOpacity, Modal } from "react-native";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { invertColor } from "../Utils/functions";
import { Colors, FontSize, DayNamesShort } from "../Utils/variables";

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
            <Text style={{ fontWeight: "bold", backgroundColor: item.color, padding: 10, color: invertColor(item.color, true) }}>Absence: {item.userName}</Text>
            <View style={{ padding: 10 }}>
                <Text style={{ fontWeight: "bold", paddingBottom: 5 }} numberOfLines={1} ellipsizeMode="tail" >{item.absenceName}</Text>
            </View>
        </View>
    );
}

function NotHomeShifts(props) {
    return (
        <View
            style={{
                borderRadius: 5,
                overflow: "hidden",
                backgroundColor: "white",
                marginBottom: 10,
                flex: 1,
            }}>
            <Text style={{ fontWeight: "bold", padding: 10 }}>{item.userName}</Text>
            <View style={{ padding: 10 }}>
                <Text style={{ fontWeight: "bold", paddingBottom: 5 }} numberOfLines={1} ellipsizeMode="tail" >{item.wpName}</Text>
            </View>
        </View>
    );
}


export default class ModalPlansAbsence extends Component {
    state={
        open: false,
        absences: [],
        home: [],
    }

    open(item){
        this.setState({
            open: true,
            absences: item.absences,
            home: item.notHomeShifts
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
                            <Title>Doma</Title>
                        </Body>
                        <Right>
                            <Button transparent primary onPress={() => this.setState({ open: false })}><Text>Zavřít</Text></Button>
                        </Right>
                    </Header>
                    <Content style={{padding: 15, backgroundColor: Colors.lightGray}}>
                        {
                            this.state.absences.length == 0 && this.state.home.length == 0 ? 
                                <Text>Nikdo nebude doma</Text> :
                                null
                        }
                        {this.state.absences.map((item,i) => <Absence item={item} key={i} />)}
                        {this.state.home.map((item,i) => <NotHomeShifts item={item} key={i} />)}
                    </Content>
                </Container>
            </Modal>
        )
    }
}