/**
 * Řádek pro potvrzení žádosti volné směny
 */

import React from 'react';
import { View } from "react-native";
import { Text, Icon, Accordion } from "native-base";
import { Colors, FontSize, DayNamesShort } from "./../../Utils/variables";
import { invertColor,timeToReadString } from "./../../Utils/functions";
import LoadingButton from "./../../Components/LoadingButton"

function getColor(state) {
    switch (parseInt(state)) {
        case 0:
            return Colors.blue;
        case 1:
            return Colors.green;
        case 2:
            return Colors.red;
    }

    return Colors.lightGray;
}

function getText(state) {
    switch (parseInt(state)) {
        case 0:
            return "Nové";
        case 1:
            return "Přijato"
        case 2:
            return "Zamítnuto"
    }
}

function renderHeader(item, expanded) {
    return (
      <View
        style={{ flexDirection: "row", padding: 10, justifyContent: "space-between", alignItems: "center", backgroundColor: Colors.lightGray }}
      >
        <Text style={{color: Colors.header }}>
          {" "}{item.title}
        </Text>
        {expanded
          ? <Icon style={{ fontSize: 18 }} name="ios-arrow-up" />
          : <Icon style={{ fontSize: 18 }} name="ios-arrow-down" />}
      </View>
    );
  }


function Request({ noEdit, item, onPressAccept, onPressCancel }) {
    let refAccept = null;
    let refCancel = null;

    return (
        <View
            style={{
                overflow: "hidden",
                backgroundColor: "white",
                flex: 1
            }}>
            <Text style={{ fontWeight: "bold", padding: 10, backgroundColor: getColor(item.statusReq), color: invertColor(getColor(item.statusReq),true) }}>{item.userName} - {getText(item.statusReq)}
            </Text>
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: FontSize.small }}>Vytvořeno: {timeToReadString(item.dateReq)} {item.timeReq}</Text>
                <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-end" }}>
                    {noEdit ? null :
                        item.statusReq == 0 || item.statusReq == 2 ?
                            <LoadingButton ref={(r) => refAccept = r}
                                warning
                                small
                                onPress={() => onPressAccept(refAccept, item)}
                                style={{ alignSelf: "flex-end", margin: 5 }}><Text>Přijmout</Text></LoadingButton>
                            : null}
                    {noEdit ? null :
                        item.statusReq == 0 || item.statusReq == 1 ?
                            <LoadingButton ref={(r) => refCancel = r}
                                danger
                                small
                                onPress={() => onPressCancel(refCancel, item)}
                                style={{ alignSelf: "flex-end", margin: 5 }}><Text>Zamítnout</Text></LoadingButton>
                            :
                            null
                    }
                </View>
            </View>
        </View>
    );
}

function UnasShifts({ noEdit, item, onPressAccept, onPressCancel }) {

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
                <Text style={{ fontWeight: "bold", paddingBottom: 5 }} numberOfLines={1} ellipsizeMode="tail" >{item.jobName}</Text>
                <Text style={{ fontSize: FontSize.small, fontWeight: "bold", paddingBottom: 5 }}>{item.userName ? item.userName : "Uživatel nepřiřazen"}</Text>
                <Text style={{ fontSize: FontSize.small, paddingBottom: 5 }} numberOfLines={1} ellipsizeMode="tail">{item.wpName}</Text>
                {item.requests.length == 0 ?
                    <Text style={{ fontWeight: "bold", color: Colors.lightGray, padding: 10, textAlign: "center" }}>
                        Žádné žádosti
                    </Text> :
                    <Accordion
                        style={{
                            marginTop: 10,
                            borderRadius: 5,
                            overflow: "hidden",
                            borderWidth: 1,
                            borderColor: Colors.lightGray
                        }}
                        renderHeader={(item, expanded) => renderHeader(item, expanded)}
                        dataArray={[{ title: "Žádosti o směnu", content: "Volné směny" }]}
                        renderContent={() => item.requests.map((req, r) => <Request key={r} item={req} noEdit={noEdit} onPressAccept={(ref, item) => onPressAccept(ref, item)} onPressCancel={(ref, item) => onPressCancel(ref, item)} />)}
                    />
                }
            </View>
        </View>
    );
}


export default function FreeShiftListItemManager(props) {
    return (
        <View style={{
            flexDirection: "row", padding: 5, paddingRight: 10
        }}>
            <View style={{ width: 40, alignItems: "center", marginTop: 5, marginRight: 5 }}>
                <Text style={{ fontSize: FontSize.big, fontWeight: "bold", }}>{props.item.date.getDate()}</Text>
                <Text style={{ fontSize: FontSize.small, }}>{DayNamesShort[props.item.date.getDay()]}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <View>
                    {props.item.unasShifts.map((item) => <UnasShifts noEdit={props.noEdit} key={item.id} item={item} onPressAccept={(button, item) => props.onPressAccept(button, item)} onPressCancel={(button, item) => props.onPressCancel(button, item)} />)}
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
                            Žádné neobsazené směny
                        </Text>
                    </View> : null}
                </View>
            </View>
        </View >
    )
}


