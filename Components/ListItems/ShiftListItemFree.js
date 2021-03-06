/**
 * Řádek pro volné směn
 */

import React from 'react';
import { View } from "react-native";
import { Text } from "native-base";
import { Colors, FontSize, DayNamesShort } from "./../../Utils/variables";


export default function ShiftListItemFree(props) {
    return (
        <View style={{ flexDirection: "row", padding: 5, paddingBottom: 9,paddingRight: 10 }}>
            <View style={{ width: 40, alignItems: "center", marginTop: 5, marginRight: 5 }}>
                <Text style={{ fontSize: FontSize.big, fontWeight: "bold",  color: Colors.gray }}>{props.item.date.getDate()}</Text>
                <Text style={{ fontSize: FontSize.small, color: Colors.gray }}>{DayNamesShort[props.item.date.getDay()]}</Text>
            </View>

            <View style={{
                borderRadius: 5,
                justifyContent: "center",
                overflow: "hidden",
                backgroundColor: "white",
                marginBottom: 10,
                flex: 1,
                padding: 10,
                paddingBottom: 15
            }}>
                <Text style={{ fontWeight: "bold", color: Colors.gray }}>Volno</Text>
            </View>
        </View >
    )
}