import React, { Component } from 'react';
import { View } from "react-native";
import { Text } from "native-base";
import { Colors, FontSize } from "../Utils/variables";

export default function PersonListItem(props) {
    return (
        <View style={{ flexDirection: "row", alignItems: "center",padding: 10, borderRadius: 5, margin: 5,  marginHorizontal: 10,  backgroundColor: "white", }}>
            <Text style={{ fontWeight: "bold", color: Colors.orange, padding: 5 }}>20:00</Text>
            <Text style={{ fontWeight: "bold", padding: 5 }} numberOfLines={1} ellipsizeMode="tail">Petr Knop</Text>
        </View>
    )
}