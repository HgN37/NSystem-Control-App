import React, {Component} from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Home from './screens/Home'
import LogIn from './screens/LogIn'
import Sys from './screens/Sys'
import Rule from './screens/Rule'
import AddSys from './screens/AddSys'

const RootStack = createStackNavigator(
  {
    LogIn: LogIn,
    Home: Home,
    Sys: Sys,
    Rule: Rule,
    AddSys: AddSys
  },
  {
    initialRouteName: 'LogIn',
  }
);

export default class App extends Component {
  render() {
    return <RootStack />;
  }
}