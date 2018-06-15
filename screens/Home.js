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
  NativeAppEventEmitter,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import Sockets from 'react-native-sockets';

var frame = {"USER":"","PASS":"","FUNC":"SIGNIN","DATA":""}

export default class Home extends Component {
  static navigationOptions = {
    title: 'Home',
    headerLeft: null
  };
  constructor(props) {
    super()
    this.state = {
      connection : "Disconnected",
      user: "",
      password:"",
      msg:"None",
      sys: "None",
      list_name:["None","None","None","None","None"],
      list_id:["None","None","None","None","None"],
      list_stt:["None","None","None","None","None"]
    };
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
      if(cmd["FUNC"] == "LISTSYS"){
        this.setState({sys:this.state.msg})
        len = cmd["DATA"].length
        var loop = 0
        var temp_name = this.state.list_name.slice()
        for(loop = 0; loop < 5; loop++) {
          temp_name[loop] = "None"
        }
        for(loop = 0; loop < len; loop++) {
          temp_name[loop] = cmd["DATA"][loop]["NAME"]
        }
        this.setState({list_name:temp_name})

        var temp_id = this.state.list_id.slice()
        for(loop = 0; loop < 5; loop++) {
          temp_id[loop] = "None"
        }
        for(loop = 0; loop < len; loop++) {
          temp_id[loop] = cmd["DATA"][loop]["ID"]
        }
        this.setState({list_id:temp_id})

        var temp_stt = this.state.list_stt.slice()
        for(loop = 0; loop < 5; loop++) {
          temp_stt[loop] = "None"
        }
        for(loop = 0; loop < len; loop++) {
          temp_stt[loop] = cmd["DATA"][loop]["STATUS"]
        }
        this.setState({list_stt:temp_stt})
      }
      if(cmd["FUNC"] == "READ") {
        //alert(this.state.msg)
      }
    });
    this.sysPress = this.sysPress.bind(this);
  }
  componentWillMount() {
    this.setState({user:this.props.navigation.getParam('user','admin')})
    this.setState({password:this.props.navigation.getParam('password','admin')})
    this.setState({connection:this.props.navigation.getParam('connection','Disconnected')})
  }
  componentDidMount() {
    DeviceEventEmitter.addListener('StartListSys', () => {
      this.homeInterval = setInterval(() => {
        if (this.state.connection == "Connected") {
          frame["USER"] = this.state.user
          frame["PASS"] = this.state.password
          frame["FUNC"] = "LISTSYS"
          frame["DATA"] = "None"
          Sockets.write(JSON.stringify(frame));
        }
      }, 1000)
    })
    DeviceEventEmitter.emit('StartListSys')
  }
  componentWillUnmount() {
    clearInterval(this.homeInterval)
  }
  sysPress = (sysNum) => {
    clearInterval(this.homeInterval)
    if(this.state.list_id[sysNum] != "None") {
      this.props.navigation.navigate('Sys', {
        user: this.state.user,
        password: this.state.password,
        connection: this.state.connection,
        sys_name: this.state.list_name[sysNum],
        sys_id:this.state.list_id[sysNum]
      })
    }
    else {
      this.props.navigation.navigate('AddSys', {
        user: this.state.user,
        password: this.state.password,
        connection: this.state.connection,
        sys_name: "None"
      })
    }
  }
  render() {
    return (
      <View style={styles.container}>
        
        <TouchableOpacity
          onPress={() => this.sysPress(0)}
          style={styles.sysbox}
          >
          <Text> Name: {this.state.list_name[0]} {"\n"} ID: {this.state.list_id[0]} {"\n"} Status: {this.state.list_stt[0]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.sysPress(1)}
          style={styles.sysbox}
          >
          <Text> Name: {this.state.list_name[1]} {"\n"} ID: {this.state.list_id[1]} {"\n"} Status: {this.state.list_stt[1]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.sysPress(2)}
          style={styles.sysbox}
          >
          <Text> Name: {this.state.list_name[2]} {"\n"} ID: {this.state.list_id[2]} {"\n"} Status: {this.state.list_stt[2]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.sysPress(3)}
          style={styles.sysbox}
          >
          <Text> Name: {this.state.list_name[3]} {"\n"} ID: {this.state.list_id[3]} {"\n"} Status: {this.state.list_stt[3]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.sysPress(4)}
          style={styles.sysbox}
          >
          <Text> Name: {this.state.list_name[4]} {"\n"} ID: {this.state.list_id[4]} {"\n"} Status: {this.state.list_stt[4]}</Text>
        </TouchableOpacity>
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
      padding:20
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
    },
    logout: {
      marginRight:5
    }
});