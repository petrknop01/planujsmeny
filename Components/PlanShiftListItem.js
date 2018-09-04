import React, { Component } from 'react';
import { View } from "react-native";
import { Text, Button } from "native-base";
import { Colors, FontSize, DayNamesShort } from "../Utils/variables";
import { invertColor } from "../Utils/functions";


export default function PlanShiftListItem(props) {
    return (
        <View style={{
            flexDirection: "row", padding: 5, paddingRight: 10
        }}>
            <View style={{ width: 40, alignItems: "center", marginTop: 5, marginRight: 5 }}>
                <Text style={{ fontSize: FontSize.big, fontWeight: "bold", }}>{props.item.date.getDate()}</Text>
                <Text style={{ fontSize: FontSize.small, }}>{DayNamesShort[props.item.date.getDay()]}</Text>
            </View>
            <View
                style={{
                    flex: 1
                }}
            >
                <View
                    style={{
                        borderRadius: 5,
                        // shadowRadius: 4,
                        // shadowOffset: { width: 2, height: 0 },
                        // shadowColor: 'black',
                        // shadowOpacity: 0.2,
                        overflow: "hidden",
                        backgroundColor: "white",
                        marginBottom: 10,                        
                        flex: 1,
                    }}>
                    <Text style={{ fontWeight: "bold", backgroundColor: "#000000", padding: 10, color: invertColor("#000000", true) }}>03:00 - 14:00</Text>
                    <View style={{ padding: 10, paddingBottom: 0 }}>
                        <Text style={{ fontWeight: "bold" }} numberOfLines={1} ellipsizeMode="tail" >Smena 1</Text>
                    </View>
                    <View style={{ padding: 10 , flex: 1 }}>
                        <Button small success onPress={() => props.onPressEdit()} style={{ alignSelf: "flex-end" }}><Text>Editovat</Text></Button>
                    </View>
                </View>
                <View style={{ padding: 5, paddingTop: 7, flex: 1, marginBottom: 10 }}>
                    <Button small onPress={() => props.onPressAdd()} style={{ alignSelf: "flex-end" }}><Text>Přidat</Text></Button>
                </View>
            </View>
        </View>
    )
}