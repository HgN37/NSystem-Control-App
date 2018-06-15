import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  DeviceEventEmitter,
  Button,
  FlatList,
  TouchableOpacity
} from 'react-native';
import Sockets from 'react-native-sockets';

var frame = {"USER":"","PASS":"","FUNC":"SIGNIN","DATA":""}

export default class AddSys extends Component {
    static navigationOptions = {
        title: 'Add system',
    };
    constructor() {
        super()
        this.state = {
          id:"000000008a8c7394",
          name:"Test system",
          user:"",
          password:""
        }
        this.buttonAddSys = this.buttonAddSys.bind(this)
    }
    componentWillMount() {
      this.setState({user:this.props.navigation.getParam('user','admin')})
      this.setState({password:this.props.navigation.getParam('password','admin')})
    }
    componentDidMount() {
      //alert(this.state.user)
    }
    buttonAddSys() {
      frame["USER"] = this.state.user
      frame["PASS"] = this.state.password
      frame["FUNC"] = "ADDSYS"
      var temp = {}
      temp["ID"] = this.state.id
      temp["NAME"] = this.state.name
      frame["DATA"] = temp;
      Sockets.write(JSON.stringify(frame))
      this.props.navigation.goBack()
    }
    render() {
        return(
            <View style={styles.container}>
              <TextInput
                style={styles.textbox}
                onChangeText={(text) => this.setState({id:text})}
                value={this.state.id}
                />
              <TextInput
                style={styles.textbox}
                onChangeText={(text) => this.setState({name:text})}
                value={this.state.name}
                />
              <Button
                onPress={this.buttonAddSys}
                title="Add system"
                color="#0040ff"
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
    },
    sysbox: {
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'flex-start',
      margin:10,
      borderColor: "gray",
      borderWidth: 1,
      width: 300,
      padding:10
    }
});