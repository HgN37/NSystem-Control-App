import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  DeviceEventEmitter,
  Button,
  FlatList
} from 'react-native';
import Sockets from 'react-native-sockets';

var frame = {"USER":"","PASS":"","FUNC":"SIGNIN","DATA":""}

export default class Sys extends Component {
  static navigationOptions = {
    title: 'System',
  };
  constructor() {
    super()
    this.state = {
      connection:"Connected",
      user:"",
      password:"",
      sys_name:"",
      dev_list:[{"num":"None", "hardware":"relay", "name":"relay0", "data":"None"}]
    }
    DeviceEventEmitter.addListener('socketClient_data', (payload) => {
      this.setState({msg:payload.data.replace(/'/g,'"')})
      let cmd
      try {
        cmd = JSON.parse(this.state.msg)
      }
      catch(err) {
        alert(this.state.msg)
        while(1);
      }
      if(cmd["FUNC"] == "READ") {
        let data = cmd["DATA"]
        let dev_list_t = []
        let dev_format_temp = {"num":"None", "hardware":"None", "name":"None", "data":"None"}
        if(data["FILE"] == "DEVLIST") {
          //alert(JSON.stringify(data))
          let k
          for(k in data) {
            if (k == "FILE") continue;
            if (k == "RASPID") continue;
            dev_format_temp["num"]=data[k]["ID"].toString()
            dev_format_temp["hardware"]=data[k]["HARDWARE"].toString()
            dev_list_t.push(dev_format_temp)
          }
          this.setState({dev_list:dev_list_t})
        }
        if(data["FILE"] == "DEVDATA") {
          dev_list_t = this.state.dev_list.slice()
          alert(JSON.stringify(data))
          let k
          for(k in data) {
            if (k == "FILE") continue;
            if (k == "RASPID") continue;
            let j
            for(j=0; j<dev_list_t.length; j++) {
              if(k.toString() == dev_list_t[j]["num"]) {
                dev_list_t[j]["data"] = data[k][0][1]
              }
            }
          }
          this.setState({dev_list:dev_list_t})
        }
      }
    })
  }
  componentWillMount() {
    this.setState({user:this.props.navigation.getParam('user','admin')})
    this.setState({password:this.props.navigation.getParam('password','admin')})
    this.setState({sys_name:this.props.navigation.getParam('sys_name','None')})
  }
  componentDidMount() {
    frame["USER"] = this.state.user
    frame["PASS"] = this.state.password
    frame["FUNC"] = "READ"
    frame["DATA"] = this.state.sys_name
    Sockets.write(JSON.stringify(frame));

  }
  render() {
      return (
          <View style={styles.container}>
              <Text style={styles.welcome}>This is Sys {this.state.sys_name}</Text>
              <FlatList
                data={this.state.dev_list}
                renderItem={({item}) => <Text>{item.num}:{item.hardware}:{item.data}</Text>}
                keyExtractor={(item, index) => index}
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