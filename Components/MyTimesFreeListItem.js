import React, { Component } from 'react';
import { View } from "react-native";
import { Text, Button, Icon } from "native-base";
import { Colors, FontSize,DayNamesShort } from "../Utils/variables";



export default function MyTimesListItem(props) {
    return (
        <View style={{ flexDirection: "row", padding: 5, paddingBottom: 9,paddingRight: 10 }}>
            <View style={{ width: 40, alignItems: "center", marginTop: 5, marginRight: 5 }}>
                <Text style={{ fontSize: FontSize.big, fontWeight: "bold", }}>{props.item.date.getDate()}</Text>
                <Text style={{ fontSize: FontSize.small, }}>{DayNamesShort[props.item.date.getDay()]}</Text>
            </View>

            <View style={{
                borderRadius: 5,
                // shadowRadius: 4,
                // shadowOffset: { width: 2, height: 0 },
                // shadowColor: 'black',
                // shadowOpacity: 0.2,
                overflow: "hidden",
                backgroundColor: "white",
                marginBottom: 10,
                flex: 1,
                padding: 10,
            }}>
                <View>
                    <Text style={{ color: Colors.gray, fontWeight: "bold" }} numberOfLines={1} ellipsizeMode="tail" >Nezadáno</Text>
                </View>
                <View style={{paddingTop: 5, flex: 1}}>
                    <Button small success onPress={() => props.onPress(props.item)} style={{alignSelf: "flex-end"}}><Text>Přidat</Text></Button>
                </View>
            </View>
        </View >
    )
}