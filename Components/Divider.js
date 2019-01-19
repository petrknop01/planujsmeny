/**
 * Komponenta pro oddělovač
 */

import React from 'react';
import { View } from "react-native";
import { Text } from "native-base";
import { Colors, FontSize } from "../Utils/variables";

export default function Divider(props) {
    return (
        <View style={{padding: 3, paddingLeft: 5, flexDirection: "row", alignItems: "center", backgroundColor: Colors.header }}>
            <Text style={{ fontSize: FontSize.small, color: "white"}}>{props.title}</Text>
        </View >
    )
}