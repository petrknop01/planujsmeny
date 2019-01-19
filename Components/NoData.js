/**
 * Komponenta pro výpis bez dat
 */


import React, { Component } from 'react';
import { View } from "react-native";
import { Text } from "native-base";

export default function NoData(props) {
    return (
        <View style={{ flexDirection: "row", alignItems: "center",padding: 10, borderRadius: 5, margin: 10,  backgroundColor: "white", }}>
            <Text style={{ fontWeight: "bold", padding: 5 }} numberOfLines={1} ellipsizeMode="tail">{props.text}</Text>
        </View>
    )
}