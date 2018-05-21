import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  DeviceEventEmitter,
  Button,
  ActivityIndicator,
  NativeAppEventEmitter
} from 'react-native';
import Sockets from 'react-native-sockets';

var frame = {"USER":"","PASS":"","FUNC":"SIGNIN","DATA":""}

export default class LogIn extends Component {
    static navigationOptions = {
      title: 'Log in',
    };
    state = {
        connection:"Disconnected",
        info:"Version 1.0.1",
        id:"admin",
        password:"admin",
        msg: "",
        animating:true
      }
    constructor() {
      super()
      //on connected
      DeviceEventEmitter.addListener('socketClient_connected', () => {
        this.setState({connection:"Connected"})
      });
      //on error
      DeviceEventEmitter.addListener('socketClient_error', (data) => {
        console.log('socketClient_error',data.error);
      });
      //on new message
      DeviceEventEmitter.addListener('socketClient_data', (payload) => {
        this.setState({msg:payload.data.replace(/'/g,'"')})
        let cmd = JSON.parse(this.state.msg)
        if(cmd["FUNC"] == "SIGNIN") {
          if(cmd["DATA"] == "OK") {
            this.props.navigation.navigate('Home')
          }
          else {
            Sockets.disconnect()
            alert("Wrong username or password")
          }
        }
      });
      //on client closed
      DeviceEventEmitter.addListener('socketClient_closed', (data) => {
        console.log('socketClient_closed',data.error);
      });
    }
    buttonLogIn = () => {
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
      }, 200)
    }
    render() {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Welcome to N-System!
          </Text>
          <Text style={styles.instructions}>
            {this.state.info}
          </Text>
          <TextInput
            style={styles.textbox}
            onChangeText={(text) => this.setState({id:text})}
            value={this.state.id}
            />
          <TextInput
            style={styles.textbox}
            onChangeText={(text) => this.setState({password:text})}
            value={this.state.password}
            />
          <Button
            onPress={this.buttonLogIn}
            title="Log in"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
            />
        </View>
      );
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
      borderWidth: 1,
      marginBottom: 5
    }
  });