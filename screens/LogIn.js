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
import Sockets from 'react-native-sockets';

export default class LogIn extends Component {
    static navigationOptions = {
      title: 'Log in',
    };
    state = {
        connection:"Disconnected",
        info:"Version 1.0.1",
        id:"admin",
        password:"admin"
      }
    constructor() {
      super()
      config={
        address: "cretatech.com", //ip address of server
        port: 55555, //port of socket server
        reconnect:true, //OPTIONAL (default false): auto-reconnect on lost server
        reconnectDelay:500, //OPTIONAL (default 500ms): how often to try to auto-reconnect
        maxReconnectAttempts:10, //OPTIONAL (default infinity): how many time to attemp to auto-reconnect
      }
      Sockets.startClient(config);
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
        alert(payload.data);
      });
      //on client closed
      DeviceEventEmitter.addListener('socketClient_closed', (data) => {
        console.log('socketClient_closed',data.error);
      });
    }
    buttonLogIn = () => {
      //alert("Log in")
      if (this.state.connection == "Connected") {
        Sockets.write('{"USER":"admin","PASS":"admin","FUNC":"SIGNIN","DATA":""}');
      }
      else {
        //alert("No Internet Connection")
      }
      this.props.navigation.navigate('Home')
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
          <Text style={styles.instructions}>
            Status: {this.state.connection}
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
      borderWidth: 1
    }
  });