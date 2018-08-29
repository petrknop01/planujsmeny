import React, { Component } from 'react';
import { View } from "react-native";
import { Text, Button } from "native-base";
import { Colors, FontSize, DayNamesShort } from "../Utils/variables";


export default function PlanShiftListItem(props) {
    return (
        <View style={{
            flexDirection: "row", padding: 5, borderTopColor: Colors.gray,
            borderTopWidth: 1
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
                <View style={{ padding:5 , paddingTop:7, flex: 1, marginBottom: 10 }}>
                    <Button small onPress={() => props.onPressAdd()}><Text>Přidat</Text></Button>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}>
                    <View style={{
                        backgroundColor: "white",
                        padding: 5,
                        flex: 1,
                    }}>
                        <Text style={{ fontWeight: "bold" }}>20:00 - 03:00</Text>
                        <View style={{ marginTop: 5 }}>
                            <Text style={{ color: Colors.orange }} numberOfLines={1} ellipsizeMode="tail" >{props.item.name}</Text>
                            <Text style={{ fontSize: FontSize.small }} numberOfLines={1} ellipsizeMode="tail"
                            >Petr Knop</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 5 }}>
                        <Button small success onPress={() => props.onPressEdit()}><Text>Editovat</Text></Button>
                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}>
                    <View style={{
                        backgroundColor: "white",
                        padding: 5,
                        flex: 1,

                    }}>
                        <Text style={{ fontWeight: "bold" }}>03:00 - 14:00</Text>
                        <View style={{ marginTop: 5 }}>
                            <Text style={{ color: Colors.orange }} numberOfLines={1} ellipsizeMode="tail" >{props.item.name}</Text>
                            <Text style={{ fontSize: FontSize.small }} numberOfLines={1} ellipsizeMode="tail"
                            >Petr Knop</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 5 }}>
                        <Button small success onPress={() => props.onPressEdit()}><Text>Editovat</Text></Button>
                    </View>
                </View>
            </View>
        </View>
    )
}