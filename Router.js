import HomeScreen from "./Screens/HomeScreen"
import FreeShiftsAgreeScreen from "./Screens/FreeShiftsAgreeScreen"
import FreeShiftsScreen from "./Screens/FreeShiftsScreen"
import MyShiftsScreen from "./Screens/MyShiftsScreen"
import MyTimesScreen from "./Screens/MyTimesScreen"
import PlansShiftsScreen from "./Screens/PlansShiftsScreen"
import LoginScreen from "./Screens/LoginScreen"
import LoadingScreen from "./Screens/LoadingScreen"
import React, { Component } from 'react';

import { View } from "react-native";
import { createDrawerNavigator, createStackNavigator, DrawerItems, SafeAreaView } from "react-navigation";
import { Icon, Content, Text, Button } from "native-base";
import { Colors } from "./Utils/variables";

const headerSetting =
{
  headerBackTitle: "Zpět",
  headerStyle: {
    backgroundColor: Colors.header,
  },
  headerTintColor: "white",
  headerTitleStyle: {
    color: "white",
  }
}

const DrawerMenu = (props) => (
  <Content>
    <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
      <DrawerItems {...props} />
      <Button onPress={() => props.screenProps.logOut()} danger small block style={{marginTop: 50, marginHorizontal: 20}}>
        <Text>Odhlásit</Text>
      </Button>
    </SafeAreaView>
  </Content>
);

const DrawerIcon = (props) => {
  return <View><Button transparent light onPress={() => props.navigation.toggleDrawer()}><Icon name="menu" /></Button></View>
}

function initStack(initRoute) {
  const stack = createStackNavigator(
    {
      Home: {
        screen: HomeScreen,
        navigationOptions: ({ navigation, screenProps }) => {
          return {
            title: screenProps.username,
            ...headerSetting,
            headerRight: <DrawerIcon navigation={navigation} />,
            headerLeft: null,
          }
        }
      },
      FreeShiftsAgree: {
        screen: FreeShiftsAgreeScreen,
        navigationOptions: ({ navigation, screenProps }) => {
          return {
            title: "Volné směny - potvrzení",
            ...headerSetting,
            headerRight: null,
            headerLeft: null,
          }
        }
      },
      FreeShifts: {
        screen: FreeShiftsScreen,
        navigationOptions: ({ navigation, screenProps }) => {
          return {
            title: "Volné směny",
            ...headerSetting,
            headerRight: <DrawerIcon navigation={navigation} />,
            headerLeft: null,
          }
        }
      },
      MyShifts: {
        screen: MyShiftsScreen,
        navigationOptions: ({ navigation, screenProps }) => {
          return {
            title: "Moje směny",
            ...headerSetting,
            headerRight: <DrawerIcon navigation={navigation} />,
            headerLeft: null,
          }
        }
      },
      MyTimes: {
        screen: MyTimesScreen,
        navigationOptions: ({ navigation, screenProps }) => {
          return {
            title: "Časové možnosti",
            ...headerSetting,
            headerRight: <DrawerIcon navigation={navigation} />,
            headerLeft: null,
          }
        }
      },
      PlansShifts: {
        screen: PlansShiftsScreen,
        navigationOptions: ({ navigation, screenProps }) => {
          return {
            title: "Plán směn",
            ...headerSetting,
            headerRight: <DrawerIcon navigation={navigation} />,
            headerLeft: null,
          }
        }
      },
    },
    {
      initialRouteName: initRoute
    }
  )

  return stack;
}



const Router = createDrawerNavigator(
  {
    HomeDrawer: {
      screen: initStack("Home"),
      navigationOptions: ({ navigation, screenProps }) => {
        return {
          drawerLabel: 'Domů'
        }
      }
    },
    MyShiftsDrawer: {
      screen: initStack("MyShifts"),
      navigationOptions: ({ navigation, screenProps }) => {
        return {
          drawerLabel: 'Mé směny'
        }
      }
    },
    MyTimesDrawer: {
      screen: initStack("MyTimes"),
      navigationOptions: ({ navigation, screenProps }) => {
        return {
          drawerLabel: 'Časové možnosti'
        }
      }
    },
    FreeShiftsDrawer: {
      screen: initStack("FreeShifts"),
      navigationOptions: ({ navigation, screenProps }) => {
        return {
          drawerLabel: 'Volné směny'
        }
      }
    },
    PlansShiftsDrawer: {
      screen: initStack("PlansShifts"),
      navigationOptions: ({ navigation, screenProps }) => {
        return {
          drawerLabel: 'Plán směny'
        }
      }
    },
  },
  {
    contentComponent: DrawerMenu,
    contentOptions: {
      activeTintColor: "white",
      activeBackgroundColor: Colors.orange,
      inactiveTintColor: Colors.header,
      inactiveBackgroundColor: "white"
    }
  }
);


export default Router;