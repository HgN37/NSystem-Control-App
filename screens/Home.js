import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  DeviceEventEmitter,
  Button
} from 'react-native';
import BleManager from 'react-native-ble-manager';


export default class Home extends Component {
  static navigationOptions = {
    title: 'Home',
  };
  state = {
    status : "Waiting"
  }
  constructor() {
    super()
  }
  buttonBluetooth = () => {
    this.setState({status:"Scanning"})
    BleManager.start({showAlert:false}).then(() => {
      alert("Start bluetooth")
    })
    BleManager.scan([], 5, true)
  }
  render() {
    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>{this.state.status}</Text>
            <Button
              onPress={this.buttonBluetooth}
              title="Scan bluetooth"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
              />
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
    textbox: {
      height: 40,
      width: 200,
      borderColor: "gray",
      borderWidth: 1
    }
});