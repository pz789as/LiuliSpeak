/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import {
  styles
} from '../Styles';

import {
  Consts,
  Scenes,
} from '../Constant';

export default class P_PrePage extends Component {
  constructor(props){
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state) return true;
    return false;
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.Register.bind(this)}>
          <Text style={styles.welcome}>注册</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.Login.bind(this)}>
          <Text style={styles.welcome}>登录</Text>
        </TouchableOpacity>
      </View>
    );
  }
  Register(){
    app.GotoPage(Consts.NAVI_PUSH, Scenes.REGISTER, {});
  }
  Login(){
    app.GotoPage(Consts.NAVI_PUSH, Scenes.LOGIN, {});
  }
}

