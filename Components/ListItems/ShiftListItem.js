/**
 * Řádek pro směnu
 */

import React from 'react';
import { View } from "react-native";
import { Text } from "native-base";
import { FontSize, DayNamesShort } from "./../../Utils/variables";
import { invertColor } from "./../../Utils/functions";

export default function ShiftListItem(props) {
    return (
        <View style={{
            flexDirection: "row", padding: 5, paddingRight: 10
        }}>
            <View style={{ width: 40, alignItems: "center", marginTop: 5, marginRight: 5 }}>
                <Text style={{ fontSize: FontSize.big, fontWeight: "bold", }}>{props.item.items[0].date.getDate()}</Text>
                <Text style={{ fontSize: FontSize.small, }}>{DayNamesShort[props.item.items[0].date.getDay()]}</Text>
            </View>
            <View style={{ flex: 1 }}>
                {props.item.items.map((item, i) =>
                    <View
                        key={i}
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
                        <Text style={{ fontWeight: "bold", backgroundColor: item.color, padding: 10, color: invertColor(item.color, true) }}>{item.timeFrom ?  item.timeFrom +" - "+item.timeTo : "Neplánovaná směna"}</Text>
                        <View style={{ padding: 10 }}>
                            {item.position ?
                                <Text style={{ fontWeight: "bold", paddingBottom: 5 }} numberOfLines={1} ellipsizeMode="tail" >{item.position}</Text> : null
                            }
                            {item.name ?
                                <Text style={{ fontSize: FontSize.small }} numberOfLines={1} ellipsizeMode="tail"
                                >{item.name}</Text> : null
                            }
                            {item.clockIn ?
                                <View>
                                    <Text>Příchod: {item.clockIn}</Text>
                                    <Text>Odchod: {item.clockOut}</Text>
                                </View> : null
                            }
                        </View>
                    </View>
                )}
            </View>
        </View >
    )
}