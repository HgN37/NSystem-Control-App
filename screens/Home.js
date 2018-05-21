import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  DeviceEventEmitter,
  Button,
  ListView,
  NativeAppEventEmitter
} from 'react-native';
import Sockets from 'react-native-sockets';

var frame = {"USER":"","PASS":"","FUNC":"SIGNIN","DATA":""}

export default class Home extends Component {
  static navigationOptions = {
    title: 'Home',
  };
  constructor() {
    super()
    this.state = {
      connection : "Connected",
      id: "admin",
      password:"admin",
      msg:"None",
      sys: "None"
    };
    DeviceEventEmitter.addListener('socketClient_data', (payload) => {
      this.setState({msg:payload.data.replace(/'/g,'"')})
      let cmd = JSON.parse(this.state.msg)
      if(cmd["FUNC"] == "LISTSYS"){
        this.setState({sys:this.state.msg})
      }
    });
  }
  componentWillMount() {
    config={
      address: "cretatech.com", //ip address of server
      port: 55555, //port of socket server
      reconnect:true, //OPTIONAL (default false): auto-reconnect on lost server
      reconnectDelay:500, //OPTIONAL (default 500ms): how often to try to auto-reconnect
      maxReconnectAttempts:10, //OPTIONAL (default infinity): how many time to attemp to auto-reconnect
    }
    Sockets.startClient(config);
    setTimeout(() => {
      if (this.state.connection == "Connected") {
        frame["USER"] = this.state.id
        frame["PASS"] = this.state.password
        frame["FUNC"] = "SIGNIN"
        frame["DATA"] = "None"
        Sockets.write(JSON.stringify(frame));
      }
      setTimeout(()=>{
        frame["USER"] = this.state.id
        frame["PASS"] = this.state.password
        frame["FUNC"] = "LISTSYS"
        frame["DATA"] = "None"
        Sockets.write(JSON.stringify(frame));
      }, 10)
    }, 200)
  }
  buttonAddSystem = () => {
    
  }
  render() {
    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>{this.state.sys}</Text>
            <Button
              onPress={this.buttonAddSystem}
              title="Add new system"
              color="#841584"
              />
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
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