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
  TouchableOpacity,
  Picker
} from 'react-native';
import Sockets from 'react-native-sockets';

var frame = {"USER":"","PASS":"","FUNC":"SIGNIN","DATA":""}
var mqtt_frame = {"ADDR":"000000008a8c7394", "FUNC":"WRITE","DEV1":"01","DEV2":"FF","DATA":{"1":"FF","2":"FF","3":"FF","4":"FF"}}

export default class AddRule extends Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Add rule',
        headerLeft:  <HeaderBackButton
        onPress={() => {
          DeviceEventEmitter.emit('startRuleList')
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
            dev_list:[],
            dev1_picker : [],
            dev2_picker : [],
            dev1_rule : 0,
            dev2_rule : 0,
            value_rule: 0,
            under_rule: 0,
            over_rule: 0
        }
        this.buttonAddRule = this.buttonAddRule.bind(this)
    }
    componentWillMount() {
      this.setState({user:this.props.navigation.getParam('user','admin')})
      this.setState({password:this.props.navigation.getParam('password','admin')})
      this.setState({dev_list:this.props.navigation.getParam('dev_list',[])})
      this.setState({sys_id:this.props.navigation.getParam('sys_id',"0")})
      this.setState({rule_list:this.props.navigation.getParam('rule_list',[])})
    }
    componentDidMount() {
      //alert(this.state.user)
      let key
      let dev1 = []
      let dev2 = []
      dev2.push({"name":"TIME","addr":0})
      for(key in this.state.dev_list) {
        if(this.state.dev_list[key]['hardware'] == 1) {
          let temp1 = {}
          temp1['name'] = this.state.dev_list[key]['name']
          temp1['addr'] = this.state.dev_list[key]['num']
          dev1.push(temp1)
        }
        let temp2 = {}
        temp2['name'] = this.state.dev_list[key]['name']
        temp2['addr'] = this.state.dev_list[key]['num']
        dev2.push(temp2)
      }
      this.setState({dev1_picker:dev1})
      this.setState({dev2_picker:dev2})
      this.setState({dev1_rule:dev1[0]['addr']})
      this.setState({dev2_rule:dev2[0]['addr']})
      //alert(JSON.stringify(this.state.rule_list))
    }
    buttonAddRule() {
      frame["USER"] = this.state.user
      frame["PASS"] = this.state.password
      frame["FUNC"] = "WRITE"
      mqtt_frame['ADDR'] = this.state.sys_id
      mqtt_frame['FUNC'] = "RULE"
      mqtt_frame['DEV1'] = this.state.dev1_rule
      mqtt_frame['DEV2'] = this.state.dev2_rule
      mqtt_frame['DATA']['1'] = this.state.value_rule.toString()
      mqtt_frame['DATA']['2'] = this.state.under_rule.toString()
      mqtt_frame['DATA']['3'] = this.state.over_rule.toString()
      var rule_id = 1
      for (let i = 0; i < this.state.rule_list.length; i++) {
        if(this.state.rule_list[i]['id'] == rule_id) {
          rule_id++
        }
      }
      //alert(rule_id)
      mqtt_frame['DATA']['4'] = rule_id.toString()
      frame["DATA"] = mqtt_frame;
      Sockets.write(JSON.stringify(frame))
      DeviceEventEmitter.emit('startRuleList')
      this.props.navigation.goBack()
    }
    render() {
        return(
            <View style={styles.container}>
              <Picker
                selectedValue={this.state.dev1_rule}
                style={{ height: 50, width: 200 }}
                onValueChange={(itemValue, itemIndex) => this.setState({dev1_rule: itemValue})}>
                { this.state.dev1_picker.map((item, key)=>(
                <Picker.Item label={item.name} value={item.addr} key={key} />)
                )}
              </Picker>
              <Picker
                selectedValue={this.state.dev2_rule}
                style={{ height: 50, width: 200 }}
                onValueChange={(itemValue, itemIndex) => this.setState({dev2_rule: itemValue})}>
                { this.state.dev2_picker.map((item, key)=>(
                <Picker.Item label={item.name} value={item.addr} key={key} />)
                )}
              </Picker>
              <Picker
                selectedValue={this.state.value_rule}
                style={{ height: 50, width: 200 }}
                onValueChange={(itemValue, itemIndex) => this.setState({value_rule: itemValue})}>
                <Picker.Item label={"ON"} value={100}/>
                <Picker.Item label={"OFF"} value={0}/>
              </Picker>
              <TextInput
                style={{ height: 50, width: 200 }}
                keyboardType='numeric'
                onChangeText={(text) => this.setState({under_rule:isNaN(parseInt(text))?0:parseInt(text)})}
                value={this.state.under_rule.toString()}
                />
              <TextInput
                style={{ height: 50, width: 200 }}
                keyboardType='numeric'
                onChangeText={(text) => this.setState({over_rule:isNaN(parseInt(text))?0:parseInt(text)})}
                value={this.state.over_rule.toString()}
                />
              <Button
                onPress={this.buttonAddRule}
                title="Add Rule"
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