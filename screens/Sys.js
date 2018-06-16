import React, { Component } from 'react';
import {HeaderBackButton} from 'react-navigation'
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
var mqtt_frame = {"ADDR":"000000008a8c7394", "FUNC":"WRITE","DEV1":"01","DEV2":"FF","DATA":{"1":"FF","2":"FF","3":"FF","4":"FF"}}

export default class Sys extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'System',
    headerLeft:  <HeaderBackButton
      onPress={() => {
        DeviceEventEmitter.emit('StartListSys')
        navigation.goBack()
      }}
    />
  });
  constructor() {
    super()
    this.state = {
      connection:"Connected",
      user:"",
      password:"",
      sys_name:"",
      sys_id:"",
      dev_list:[],
      count:0
    }
    this.deviceControl = this.deviceControl.bind(this)
  }
  componentWillMount() {
    this.setState({user:this.props.navigation.getParam('user','admin')})
    this.setState({password:this.props.navigation.getParam('password','admin')})
    this.setState({sys_name:this.props.navigation.getParam('sys_name','None')})
    this.setState({sys_id:this.props.navigation.getParam('sys_id','None')})
  }
  componentDidMount() {
    this.sysInterval = setInterval( () => {
      frame["USER"] = this.state.user
      frame["PASS"] = this.state.password
      frame["FUNC"] = "READ"
      frame["DATA"] = this.state.sys_id
      Sockets.write(JSON.stringify(frame));
    }, 1000)
    this.sysListener = DeviceEventEmitter.addListener('socketClient_data', (payload) => {
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
        this.setState({dev_list:[]})
        let dev_list_t = this.state.dev_list.slice()
        let dev_format_temp = {"num":"None", "hardware":"None", "name":"None", "data":"None"}
        if(data["FILE"] == "DEVLIST") {
          //alert(JSON.stringify(data))
          let k
          for(k in data) {
            if (k == "FILE") continue;
            if (k == "RASPID") continue;
            let j
            let exist = false
            for (j in dev_list_t) {
              if(dev_list_t[j]["num"] == data[k]["ID"].toString()) {
                dev_list_t[j]["hardware"] == data[k]["HARDWARE"].toString()
                dev_list_t[j]["data"] == data[k]["VALUE"].toString()
                exist = true
              }
            }
            if(exist == false) {
              dev_format_temp["num"]=data[k]["ID"].toString()
              dev_format_temp["hardware"]=data[k]["HARDWARE"].toString()
              dev_format_temp["data"]=data[k]["VALUE"].toString()
              let clone = Object.assign({}, dev_format_temp)
              dev_list_t.push(clone)
            }
          }
          this.setState({dev_list:dev_list_t})
        }/*
        if(data["FILE"] == "DEVDATA") {
          //alert(JSON.stringify(data))
          dev_list_t = this.state.dev_list.slice()
          //alert(JSON.stringify(data))
          let k
          for(k in data) {
            if (k == "FILE") continue;
            if (k == "RASPID") continue;
            let j
            for(j in dev_list_t) {
              if(k.toString() == dev_list_t[j]["num"]) {
                dev_list_t[j]["data"] = data[k][data[k].length-1][1]
              }
            }
          }
          this.setState({dev_list:dev_list_t})
        }*/
      }
    })
  }
  componentWillUnmount() {
    clearInterval(this.sysInterval)
    this.sysListener.remove()
  }
  deviceControl(dev_id, dev_value) {
    //console.log('Pressed')
    mqtt_frame['ADDR'] = this.state.sys_id
    mqtt_frame['FUNC'] = "WRITE"
    mqtt_frame['DEV1'] = dev_id
    mqtt_frame['DATA']['1'] = (dev_value == 100)? 0 : 100
    frame["USER"] = this.state.user
    frame["PASS"] = this.state.password
    frame["FUNC"] = "WRITE"
    frame["DATA"] = mqtt_frame
    Sockets.write(JSON.stringify(frame));
  }
  buttonRule = (sys_name) => {
    this.props.navigation.navigate('Rule', {
      user: this.state.user,
      password: this.state.password,
      connection: this.state.connection,
      sys_name: this.state.sys_name,
      sys_id: this.state.sys_id
    })
  }
  render() {
      return (
          <View style={styles.container}>
            <Text style={styles.welcome}>System {JSON.stringify(this.state.sys_name)}</Text>
            <FlatList
              data={this.state.dev_list}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={()=>this.deviceControl(item.num,item.data)} 
                  style={styles.sysbox}>
                <Text>Hardware: {item.hardware}{"\n"}Data: {(item.hardware == "1")? (item.data == "100")? "ON" : "OFF" : item.data}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <Button
              onPress={this.buttonRule}
              title="Rule"
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