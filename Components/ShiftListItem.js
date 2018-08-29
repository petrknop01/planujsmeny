import React, { Component } from 'react';
import { View } from "react-native";
import { Text } from "native-base";
import { Colors, FontSize, DayNamesShort } from "../Utils/variables";


export default function ShiftListItem(props) {
    return (
        <View style={{ flexDirection: "row", padding: 5, borderTopColor: Colors.gray,
        borderTopWidth: 1 }}>
            <View style={{ width: 40, alignItems: "center", marginTop: 5, marginRight: 5 }}>
                <Text style={{ fontSize: FontSize.big, fontWeight: "bold", }}>{props.item.date.getDate()}</Text>
                <Text style={{ fontSize: FontSize.small, }}>{DayNamesShort[props.item.date.getDay()]}</Text>
            </View>

            <View style={{
                // borderRadius: 5,
                // shadowRadius: 4,
                // shadowOffset: { width: 2, height: 0 },
                // shadowColor: 'black',
                // shadowOpacity: 0.2,
                backgroundColor: "white",
                padding: 5,
                flex: 1,

            }}>
                <Text style={{ fontWeight: "bold" }}>{props.item.timeFrom} - {props.item.timeTo}</Text>
                <View style={{ marginTop: 5 }}>
                    <Text style={{ color: props.item.color }} numberOfLines={1} ellipsizeMode="tail" >{props.item.position}</Text>
                    <Text style={{ fontSize: FontSize.small }} numberOfLines={1} ellipsizeMode="tail"
                    >{props.item.name}</Text>
                </View>
            </View>
        </View >
    )
}