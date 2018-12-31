import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView, } from 'react-navigation';
import { Text, Accordion,Icon } from "native-base";
import TouchableItem from 'react-navigation/src/views/TouchableItem'
import { Colors } from '../Utils/variables';
/**
 * Component that renders the navigation list in the drawer.
 */
class Menu extends Component {

  renderItem(route, index,padding) {
    const {
      activeItemKey,
      activeTintColor,
      activeBackgroundColor,
      inactiveTintColor,
      inactiveBackgroundColor,
      getLabel,
      renderIcon,
      onItemPress,
      itemStyle,
      labelStyle,
      activeLabelStyle,
      inactiveLabelStyle,
      iconContainerStyle,
      drawerPosition    
    } = this.props;

    const focused = activeItemKey === route.key;
    const color = focused ? activeTintColor : inactiveTintColor;
    const backgroundColor = focused ? activeBackgroundColor : inactiveBackgroundColor;
    const scene = { route, index, focused, tintColor: color };
    const icon = renderIcon(scene);
    const label = getLabel(scene);
    const extraLabelStyle = focused ? activeLabelStyle : inactiveLabelStyle;

    return (
      <TouchableItem key={route.key} onPress={() => {
        onItemPress({ route, focused });
      }} delayPressIn={0}>
        <SafeAreaView style={{ backgroundColor }} forceInset={{
          [drawerPosition]: 'always',
          [drawerPosition === 'left' ? 'right' : 'left']: 'never',
          vertical: 'never'
        }}>
          <View style={[styles.item, itemStyle, {paddingLeft: padding? 30:0}]}>
            {icon ? <View style={[styles.icon, focused ? null : styles.inactiveIcon, iconContainerStyle]}>
              {icon}
            </View> : null}
            {typeof label === 'string' ? <Text style={[styles.label, { color }, labelStyle, extraLabelStyle]}>
              {label}
            </Text> : label}
          </View>
        </SafeAreaView>
      </TouchableItem>

    )
  }

  renderContent(){
    const {
      items
    } = this.props;

    let itemsToRender = [];
    for (let index = 0; index < items.length; index++) {
      const route = items[index];
      if(route.key == "FreeShiftsDrawer" || route.key == "FreeShiftsAgreeDrawer"){
        itemsToRender.push(this.renderItem(route, index, true));
      }
    }
    return <View>{itemsToRender}</View>;
  }

  renderHeader(item, expanded) {
    return (
      <View
        style={{ flexDirection: "row", padding: 10, justifyContent: "space-between", alignItems: "center", backgroundColor: "white" }}
      >
        <Text style={{ fontWeight: "bold", color: Colors.header }}>
          {" "}{item.title}
        </Text>
        {expanded
          ? <Icon style={{ fontSize: 18 }} name="ios-arrow-up" />
          : <Icon style={{ fontSize: 18 }} name="ios-arrow-down" />}
      </View>
    );
  }

  render() {
    const {
      items,
      itemsContainerStyle,
      menuType,
    } = this.props;

    let renderItems = [];
    let renderDivider = true;

    for (let index = 0; index < items.length; index++) {
      const route = items[index];


      if (menuType == 0 && (route.key == "FreeShiftsDrawer" || route.key == "FreeShiftsAgreeDrawer")) {
        return null;
      }

      if (menuType == 1 && route.key == "FreeShiftsAgreeDrawer") {
        return null;
      }

      if (menuType == 2 && renderDivider && (route.key == "FreeShiftsDrawer" || route.key == "FreeShiftsAgreeDrawer")) {
        renderDivider = false;
        renderItems.push(
          <Accordion
            headerStyle={[{ backgroundColor: "white"}]}
            contentStyle={{marginLeft: 10}}
            style={{ backgroundColor: "white" }}
            key="accordionFreeShifts"
            dataArray={[{title: "Volné směny", content: "Volné směny"}]}
            renderContent={() => this.renderContent()}
            renderHeader={(item, expanded) => this.renderHeader(item, expanded)}
          />
        );
        break;
      }

      renderItems.push(this.renderItem(route, index));
    }

    return (
      <View style={[styles.container, itemsContainerStyle]}>
        {renderItems}
      </View>
    );
  }
}

/* Material design specs - https://material.io/guidelines/patterns/navigation-drawer.html#navigation-drawer-specs */
Menu.defaultProps = {
  activeTintColor: '#2196f3',
  activeBackgroundColor: 'rgba(0, 0, 0, .04)',
  inactiveTintColor: 'rgba(0, 0, 0, .87)',
  inactiveBackgroundColor: 'transparent'
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginHorizontal: 16,
    width: 24,
    alignItems: 'center'
  },
  inactiveIcon: {
    /*
     * Icons have 0.54 opacity according to guidelines
     * 100/87 * 54 ~= 62
     */
    opacity: 0.62
  },
  label: {
    margin: 16,
    fontWeight: 'bold'
  }
});

export default Menu;