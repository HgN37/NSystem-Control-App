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

export default class Rule extends Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Rule',
        headerLeft:  <HeaderBackButton
        onPress={() => {
          DeviceEventEmitter.emit('startDevList')
          navigation.goBack()
        }}
        />
    });
    constructor() {
        super()
        this.state = {
          user:"",
          password:"",
          connection:"Connected",
          sys_name:"",
          sys_id:"",
          rule_list:[],
          dev_list:[]
        }
        this.delRule = this.delRule.bind(this)
    }
    componentWillMount() {
      this.setState({user:this.props.navigation.getParam('user','admin')})
      this.setState({password:this.props.navigation.getParam('password','admin')})
      this.setState({sys_name:this.props.navigation.getParam('sys_name','None')})
      this.setState({sys_id:this.props.navigation.getParam('sys_id','None')})
      this.setState({dev_list:this.props.navigation.getParam('dev_list',[])})
    }
    componentDidMount() {
      DeviceEventEmitter.addListener('startRuleList', () => {
        frame["USER"] = this.state.user
        frame["PASS"] = this.state.password
        frame["FUNC"] = "RULE"
        frame["DATA"] = this.state.sys_id
        Sockets.write(JSON.stringify(frame));
        this.ruleInterval = setInterval( () => {
          frame["USER"] = this.state.user
          frame["PASS"] = this.state.password
          frame["FUNC"] = "RULE"
          frame["DATA"] = this.state.sys_id
          Sockets.write(JSON.stringify(frame));
        }, 2000)
      })
      DeviceEventEmitter.emit('startRuleList')
      this.ruleListener = DeviceEventEmitter.addListener('socketClient_data', (payload) => {
        this.setState({msg:payload.data.replace(/'/g,'"')})
        let cmd
        try {
          cmd = JSON.parse(this.state.msg)
        }
        catch(err) {
          alert(this.state.msg)
          while(1);
        }
        if(cmd["FUNC"] == "RULE") {
          let data = cmd["DATA"]
          this.setState({rule_list:[]})
          let rule_list_t = this.state.rule_list.slice()
          if(data["FILE"] == "RULELIST") {
            let k
            let rule_temp = {}
            for(k in data) {
              if (k == "FILE") continue;
              if (k == "RASPID") continue;
              rule_temp["id"] = data[k]["ID"]
              rule_temp["dev1"] = data[k]["DEV1"]
              rule_temp["dev2"] = data[k]["DEV2"]
              rule_temp["value"] = data[k]["VALUE"]
              rule_temp["under"] = data[k]["UNDER"]
              rule_temp["over"] = data[k]["OVER"]
              let clone = Object.assign({}, rule_temp)
              rule_list_t.push(clone)
            }
            this.setState({rule_list:rule_list_t})
          }
        }
      })
    }
    componentWillUnmount() {
      clearInterval(this.ruleInterval)
      this.ruleListener.remove()
    }
    buttonAddRule = () => {
      clearInterval(this.ruleInterval)
      this.props.navigation.navigate('AddRule', {
        user: this.state.user,
        password: this.state.password,
        connection: this.state.connection,
        sys_name: this.state.sys_name,
        sys_id: this.state.sys_id,
        dev_list: this.state.dev_list,
        rule_list:this.state.rule_list
      })
    }
    delRule = (id) => {
      mqtt_frame['ADDR'] = this.state.sys_id
      mqtt_frame['FUNC'] = "DELRULE"
      mqtt_frame['DATA']['4'] = id
      frame["USER"] = this.state.user
      frame["PASS"] = this.state.password
      frame["FUNC"] = "WRITE"
      frame["DATA"] = mqtt_frame
      Sockets.write(JSON.stringify(frame));
    }
    render() {
        return(
            <View style={styles.container}>
              <Text style={styles.welcome}>Rule {this.state.sys_name}</Text>
              <FlatList
              data={this.state.rule_list}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={()=>this.delRule(item.id)} 
                  style={styles.sysbox}>
                <Text>ID: {item.id}{"\n"}Dev1: {item.dev1} => Data: {item.value}{"\n"}Dev2: {item.dev2} {"\n"}Lower threshold: {item.under}{"\n"}Upper threshold: {item.over}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <Button
              onPress={this.buttonAddRule}
              title="Add rule"
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