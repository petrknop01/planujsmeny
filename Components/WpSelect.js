/**
 * Komponenta pro výběr pracovního místa
 */

import React, { Component } from 'react';
import {View} from 'react-native';
import { withNavigation } from 'react-navigation';
import Select from "./Select";


export class WpSelect extends Component {
    static defaultProps = {
        disabled: false
    }

    render() {
        if (this.props.listWp.length == 0) {
            return (
                <View style={{ height: 60, backgroundColor: "white", padding: 10 }}>
                    <Select disabled={true} selected={this.props.selectedWp} items={[this.props.selectedWp]} onChange={() => null
                    } />
                </View>);
        }

        return (
            <View style={{ height: 60, backgroundColor: "white", padding: 10 }}>
                <Select disabled={this.props.disabled} selected={this.props.selectedWp} items={this.props.listWp}       onChange={(item) => {
                    this.props.onChange(item)
                    }
                } />
            </View>
        );
    }
}

export default withNavigation(WpSelect);
