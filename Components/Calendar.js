

import React, { Component } from 'react';
import { View } from "react-native";
import { Text, Spinner } from "native-base";

import { Colors, MonthNames, MonthNamesShort, DayNames, DayNamesShort } from "../Utils/variables";

import { LocaleConfig, Agenda } from 'react-native-calendars';

LocaleConfig.locales['cs'] = {
    monthNames: MonthNames,
    monthNamesShort: MonthNamesShort,
    dayNames: DayNames,
    dayNamesShort: DayNamesShort
};

LocaleConfig.defaultLocale = 'cs';


export default class Calendar extends Component {
    static defaultProps={
        markedDates: null
    }

    renderItem(item) {
        return (
            <View style={{
            }}>
                {this.props.renderItem(item)}
            </View>
        );
    }

    rowHasChanged(r1, r2) {
        if(this.props.offline){
            return true;
        }
        return JSON.stringify(r1) !== JSON.stringify(r2) ;
    }

    renderDay(day, item){
        return null;
    }


    selectDate(date){
        if(this._agenda){
            this._agenda.chooseDay(date, true);
        }
    }

    render() {
        return (
            <Agenda
                ref={ref => this._agenda = ref}
                renderDay={(day, item) => this.renderDay(day,item)}
                rowHasChanged={this.rowHasChanged.bind(this)}
                renderEmptyData = {() => {return (<Spinner size="large" />);}}
                theme={{
                    agendaKnobColor: Colors.header,
                    agendaBackgroundColor: Colors.lightGray,
                    selectedDotColor: Colors.orange,
                    dotColor: Colors.orange,
                    backgroundColor: Colors.lightGray,
                    calendarBackground: 'white',
                    textSectionTitleColor: Colors.gray,
                    selectedDayBackgroundColor: Colors.gray,
                    selectedDayTextColor: 'white',
                    todayTextColor: Colors.orange,
                    dayTextColor: "black",
                    todayTextColor: Colors.orange,
                    textMonthFontWeight: 'bold',
                    agendaTodayColor: Colors.orange,
                }}
                firstDay={1}
                {...this.props}
            />
        );
    }

}