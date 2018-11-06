import React, { Component } from 'react';
import { View } from "react-native";
import { Text, Button } from "native-base";
import { Colors, FontSize, DayNamesShort } from "../Utils/variables";
import { invertColor } from "../Utils/functions";
import  LoadingButton  from "../Components/LoadingButton";

export default function MyTimesListItem(props) {
    let ref = null;
    
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
                        <Text style={{ fontWeight: "bold", backgroundColor: item.type ? item.type.color : "black", padding: 10, color: invertColor(item.type ? item.type.color : "white", true) }}>
                            {item.start == "00:00" && item.end == "00:00" ? "Celý den" : item.start + " - " + item.end}</Text>
                        <View style={{ padding: 10 }}>
                            {item.type ?

                                <Text style={{ fontWeight: "bold", paddingBottom: 5 }} numberOfLines={1} ellipsizeMode="tail" >{item.type.name} - {item.vacHours}</Text> : null
                            }
                            {(props.editovatTW && !item.type) || (props.editovatAbsence && item.type) ?
                                <View style={{flexDirection:"row", alignItems: "flex-end", justifyContent: "flex-end"}}>
                                    <LoadingButton ref={(r) => ref = r} danger small onPress={() => props.onPressDelete(ref,item)} style={{ alignSelf: "flex-end", margin:5 }}><Text>Vymazat</Text></LoadingButton>
                                    <Button small onPress={() => props.onPressEdit(item)} style={{ alignSelf: "flex-end", margin:5 }}><Text>Editovat</Text></Button>
                                </View>
                                : null}
                        </View>
                    </View>
                )}
                {props.editovatAbsence ?
                    <Button small success onPress={() => props.onPressAdd(props.item.items[0])} style={{ alignSelf: "flex-end" }}><Text>Přidat</Text></Button> : null}
            </View>

        </View >
    )
}