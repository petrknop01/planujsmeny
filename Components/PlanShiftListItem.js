import React, { Component } from 'react';
import { View, TouchableOpacity } from "react-native";
import { Text, Button, Icon } from "native-base";
import { Colors, FontSize, DayNamesShort } from "../Utils/variables";
import { invertColor } from "../Utils/functions";
import LoadingButton from "./../Components/LoadingButton"

function Comment({ item }) {
    return (
        <View
            style={{
                borderRadius: 5,
                overflow: "hidden",
                backgroundColor: "white",
                marginBottom: 10,
                flex: 1,
            }}>
            <Text style={{ fontWeight: "bold", padding: 10, }}>{item}</Text>
        </View>
    );
}


function Shift({noEdit, item, onPressEdit, onPressDelete }) {
    let ref = null;

    return (
        <View
            style={{
                borderRadius: 5,
                overflow: "hidden",
                backgroundColor: "white",
                marginBottom: 10,
                flex: 1,
            }}>
            <Text style={{ fontWeight: "bold", backgroundColor: item.color, padding: 10, color: invertColor(item.color, true) }}>{item.userName}</Text>
            <View style={{ padding: 10 }}>
                <Text style={{ fontWeight: "bold", paddingBottom: 5 }} numberOfLines={1} ellipsizeMode="tail" >{item.jobName}</Text>
                <View>
                    <Text>Od: {item.start}</Text>
                    <Text>Do: {item.end}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-end" }}>
                {noEdit ? null :
                    <LoadingButton ref={(r) => ref = r}
                        danger
                        small
                        onPress={() => onPressDelete(ref, item)}
                        style={{ alignSelf: "flex-end", margin: 5 }}><Text>Vymazat</Text></LoadingButton> }
                    {noEdit ? null :<Button small onPress={() => onPressEdit(item)} style={{ alignSelf: "flex-end", margin: 5 }}><Text>Editovat</Text></Button>}
                </View>
            </View>
        </View>
    );
}


export default function PlanShiftListItem(props) {
    return (
        <View style={{
            flexDirection: "row", padding: 5, paddingRight: 10
        }}>
            <View style={{ width: 40, alignItems: "center", marginTop: 5, marginRight: 5 }}>
                <Text style={{ fontSize: FontSize.big, fontWeight: "bold", }}>{props.item.date.getDate()}</Text>
                <Text style={{ fontSize: FontSize.small, }}>{DayNamesShort[props.item.date.getDay()]}</Text>
                <TouchableOpacity onPress={() => props.onPressHome(props.item)} style={{ padding: 5 }}><Icon name="home" style={{ fontSize: 20, color: props.item.notHomeShifts.length > 0 || props.item.absences.length > 0 ? Colors.red : Colors.gray }} /></TouchableOpacity>
                <TouchableOpacity onPress={() => props.onPressComment(props.item)} style={{ padding: 5 }}><Icon name="chatboxes" style={{ fontSize: 20, color: props.item.comments.length > 0 ? Colors.blue : Colors.gray }} /></TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                <View>
                    {props.item.shifts.map((item, i) => <Shift noEdit={props.noEdit} key={item.id} item={item} onPressEdit={(item) => props.onPressEdit(item, i)} onPressDelete={(button, item) => props.onPressDelete(button, item)} />)}
                </View>
                {props.noEdit? <View></View> :
                <Button small success onPress={() => props.onPressAdd(props.item, props.item.shifts.length)} style={{ alignSelf: "flex-end" }}><Text>Přidat</Text></Button>}
            </View>
        </View >
    )
}


