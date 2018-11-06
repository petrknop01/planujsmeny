import React, { Component } from 'react';
import { View } from "react-native";
import { Text } from "native-base";
import { Colors, FontSize } from "../Utils/variables";

export default function PersonListItem(props) {
    return (
        <View style={{ flexDirection: "row", alignItems: "flex-start", padding: 10, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, backgroundColor: "white", }}>
            <View style={{ width: 60, justifyContent: "center", alignItems:"center", borderWidth: 1, borderColor: getColor(props.item) }}>
                <Text style={{ fontWeight: "bold", color: getColor(props.item), padding: 5 }}>{props.item.startTime?props.item.startTime.slice(0,5) : null}</Text>
                <Text style={{ fontWeight: "bold", color: getColor(props.item), padding: 5 }}>{props.item.endTime ? props.item.endTime .slice(0,5): null}</Text>
            </View>
            <View>
                <Text style={{ fontWeight: "bold", color: props.item.color == "no" ? "black" : props.item.color, padding: 5 }} numberOfLines={1} ellipsizeMode="tail">{props.item.userName}</Text>
                <Text style={{ paddingHorizontal: 5 }} >{props.item.jobName}</Text>
            </View>
        </View>
    )
}

function getColor(item) {
    if (item.status != -1 && item.job == null) {
        if (item.color == "no") {
            return "black";
        }

        if (item.status == 0 && item.color == "no") {
            return Colors.green;
        } else if (item.status == 0 && item.color == "no") {
            return Colors.blue;
        }
        return item.color == "no" ? "black" : item.color
    }
    else if (item.status != -1) {
        if (item.color == "no") {
            return "black";
        }

        if (item.status == 0 && item.color == "no") {
            return Colors.green;
        } else if (item.status == 0 && item.color == "no") {
            return Colors.blue;
        }

        return item.color == "no" ? "black" : item.color
    }
    else {
        return item.color == "no" ? "black" : item.color
    }
}