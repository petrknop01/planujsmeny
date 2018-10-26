import React, { Component } from 'react';
import { View } from "react-native";
import { Text } from "native-base";
import { Colors, FontSize } from "../Utils/variables";

export default function PersonListItem(props) {
    return (
        <View style={{ flexDirection: "row", alignItems: "flex-start", padding: 10, borderBottomLeftRadius: 5, borderBottomRightRadius: 5,  backgroundColor: "white", }}>
            <Text style={{ width: 60 ,fontWeight: "bold", color: props.item.color == "no" ? "black" : props.item.color , padding: 5 }}>{props.item.clockIn}</Text>
            <View>
                <Text style={{ fontWeight: "bold", color: props.item.color == "no" ? "black" : props.item.color , padding: 5 }} numberOfLines={1} ellipsizeMode="tail">{props.item.userName}</Text>
                <Text style={{paddingHorizontal: 5 }} >{props.item.jobName}</Text>
            </View>
        </View>
    )
}