/**
 * Komponenta pro input
 */

import React, { Component } from 'react';
import { Input } from "native-base";
import {Colors} from "../Utils/variables";


export default class MyInput extends Component {
    render() {
        return (
            <Input {...this.props} style={[this.props.error ? {borderWidth: 1, borderColor: Colors.red} : {}, this.props.style]}/>
        );
    }
}
