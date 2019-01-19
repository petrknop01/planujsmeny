/**
 * Řádek pro volnou směnu
 */

import React from 'react';
import { View, TouchableOpacity } from "react-native";
import { Text, Icon } from "native-base";
import { Colors, FontSize, DayNamesShort } from "./../../Utils/variables";
import { invertColor } from "./../../Utils/functions";
import LoadingButton from "./../../Components/LoadingButton"

function UnasShifts({ noEdit, item, onPressReq, onPressDelete }) {
    let ref = null;

    return (
        <View
            style={{
                borderRadius: 5,
                overflow: "hidden",
                backgroundColor: "white",
                marginBottom: 10,
                flex: 1
            }}>
            <Text style={{ fontWeight: "bold", backgroundColor: item.color, padding: 10, color: invertColor(item.color, true) }}>{item.start} - {item.end}</Text>
            <View style={{ padding: 10 }}>
                {
                    item.statusReq == null ?
                        null
                        :
                        item.statusReq == 0 ?
                            <Text style={{ fontWeight: "bold", color: Colors.blue, paddingBottom: 5 }} numberOfLines={1} ellipsizeMode="tail">Nové</Text>
                            :
                            item.statusReq == 1 ? <Text style={{ fontWeight: "bold", color: Colors.green, paddingBottom: 5 }} numberOfLines={1} ellipsizeMode="tail">Přijato</Text>
                                :
                                <Text style={{ fontWeight: "bold", color: Colors.red, paddingBottom: 5 }} numberOfLines={1} ellipsizeMode="tail">Obsazeno</Text>
                }


                <Text style={{ fontWeight: "bold", paddingBottom: 5 }} numberOfLines={1} ellipsizeMode="tail" >
                    {item.jobName}</Text>


                <Text style={{ fontSize: FontSize.small }} numberOfLines={1} ellipsizeMode="tail">{item.wpName}</Text>
                <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-end" }}>
                    {noEdit ? null :
                        item.statusReq == null ?
                            <LoadingButton ref={(r) => ref = r}
                                warning
                                small
                                onPress={() => onPressReq(ref, item)}
                                style={{ alignSelf: "flex-end", margin: 5 }}><Text>Požádat</Text></LoadingButton>
                            :
                            item.statusReq == 0 ?
                                <LoadingButton ref={(r) => ref = r}
                                    info
                                    small
                                    onPress={() => onPressDelete(ref, item)}
                                    style={{ alignSelf: "flex-end", margin: 5 }}><Text>Zrušit</Text></LoadingButton>
                                :
                                item.statusReq == 2 ?
                                    <LoadingButton ref={(r) => ref = r}
                                        danger
                                        small
                                        onPress={() => onPressDelete(ref, item)}
                                        style={{ alignSelf: "flex-end", margin: 5 }}><Text>Zrušit</Text></LoadingButton>
                                    : null
                    }
                </View>
            </View>
        </View>
    );
}


export default function FreeShiftListItem(props) {


    return (
        <View style={{
            flexDirection: "row", padding: 5, paddingRight: 10
        }}>
            <View style={{ width: 40, alignItems: "center", marginTop: 5, marginRight: 5 }}>
                <Text style={{ fontSize: FontSize.big, fontWeight: "bold", }}>{props.item.date.getDate()}</Text>
                <Text style={{ fontSize: FontSize.small, }}>{DayNamesShort[props.item.date.getDay()]}</Text>
                <TouchableOpacity onPress={() => props.onPressHome(props.item)} style={{ padding: 5 }}><Icon name="sunglasses" type="MaterialCommunityIcons" style={{ fontSize: 20, color: props.item.absences.length > 0 ? Colors.red : Colors.gray }} /></TouchableOpacity>
                <TouchableOpacity onPress={() => props.onPressPlannedShifts(props.item)} style={{ padding: 5 }}><Icon name="worker" type="MaterialCommunityIcons" style={{ fontSize: 20, color: props.item.plannedShifts.length > 0 ? Colors.blue : Colors.gray }} /></TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                <View>
                    {props.item.unasShifts.map((item) => <UnasShifts noEdit={props.noEdit} key={item.id} item={item} onPressReq={(button, item) => props.onPressReq(button, item)} onPressDelete={(button, item) => props.onPressDelete(button, item)} />)}
                    {props.item.unasShifts.length == 0 ? <View
                        style={{
                            borderRadius: 5,
                            overflow: "hidden",
                            backgroundColor: "white",
                            marginBottom: 10,
                            flex: 1,
                            height: 100,
                        }}>
                        <Text style={{ fontWeight: "bold", color: Colors.lightGray, padding: 10 }}>
                            V tento den není volná směna
                            </Text>
                    </View> : null}
                </View>
            </View>
        </View >
    )
}


