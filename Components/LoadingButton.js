/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Button, Spinner } from "native-base";


export default class LoadingButton extends Component {
    state = {
        isLoading: false,
    }

    startLoading() {
        this.setState({
            isLoading: true
        });
    }

    endLoading() {
        this.setState({
            isLoading: true
        });
    }

    togleLoading() {
        this.setState({
            isLoading: !this.state.isLoading
        });
    }

    render() {
        const { isLoading } = this.state;
        return (
            <Button 
                {...this.props}
                disabled={isLoading ? true : this.props.disabled}
            >
                {isLoading ? <Spinner size="small" color="white" style={{marginVertical: 5, marginHorizontal: 20}}/> : this.props.children}
            </Button>
        );
    }
}
