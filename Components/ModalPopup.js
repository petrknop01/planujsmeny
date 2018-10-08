/**
 * Futbalito app, starting layout
 */

import React, { Component } from 'react';
import variable from "./../native-base-theme/variables/platform";

import {
    ScrollView,
    TouchableOpacity,
    View,
    Modal,
} from 'react-native';

import {
    Text,
    Footer,
    Container,
    Content,
    Button
} from 'native-base';

import LoadingButton from './LoadingButton';

import { Colors, FontSize } from "../Utils/variables";

export default class ModalPopup extends Component {
    _loadingButton = null;


    state = {
        showModal: false
    }

    showModal() {
        this.setState({
            showModal: true
        });
    }

    closeModal() {
        if (this._loadingButton != null) {
            this._loadingButton.togleLoading();
        }

        this.setState({
            showModal: false
        });

        if(this.props.onClose){
            this.props.onClose();
        }
    }

    onPressSave() {
        if (this._loadingButton != null) {
            this._loadingButton.togleLoading();
        }
        this.props.onSave();
    }

    render() {
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.showModal}
                supportedOrientations={["portrait" , "portrait-upside-down" , "landscape" , "landscape-left" , "landscape-right"]}
                onRequestClose={() => this.setState({ showModal: false })}
            >
                <Container
                    style={{ backgroundColor: "rgba(0,0,0,0.2)", padding: 40, justifyContent: "center" }}
                >
                    <View
                        style={{
                            overflow: "hidden",
                            backgroundColor: "white",
                            borderRadius: variable.borderRadiusBase,
                            shadowColor: variable.platformStyle === "material" ? variable.brandDark : undefined,
                            height: 300,
                            shadowOffset: variable.platformStyle === "material" ? { width: 0, height: 2 } : undefined,
                            shadowOpacity: variable.platformStyle === "material" ? 0.2 : undefined,
                            shadowRadius: variable.platformStyle === "material" ? 1.2 : undefined,
                        }}
                    >
                        <Content style={{ padding: 20 }}>
                            {this.props.children}
                        </Content>
                        <Footer style={{ alignItems: "center" }}>
                            <Button small danger onPress={() => this.setState({ showModal: false })} style={{ marginRight: 10, alignSelf: "center" }}><Text>Zavřít</Text></Button>
                            <LoadingButton small success ref={(ref) => this._loadingButton = ref}  onPress={() => this.onPressSave()} style={{ marginLeft: 10, alignSelf: "center" }}><Text>Uložit</Text></LoadingButton>
                        </Footer>
                    </View>
                </Container>
            </Modal>
        );
    }
}
