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
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {
  styles,
  ScreenWidth,
} from '../Styles';

import {
  Consts,
  Scenes,
} from '../Constant';

export default class P_Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      phones: '',
      password: '',
    }
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
        <TouchableOpacity onPress={this.onCancel.bind(this)}>
          <Text style={styles.welcome}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.gotoRegister.bind(this)}>
          <Text style={styles.welcome}>注册</Text>
        </TouchableOpacity>
        <View style={[styles.registerUnderLine, {width:ScreenWidth}]} />
        <TextInput style={styles.registerInput}
            placeholder='请输入手机号（仅支持大陆号码）'
            onChangeText={(text)=>{this.setState({phones: text})}} />
        <View style={styles.registerUnderLine} />
        <TextInput style={styles.registerInput}
            placeholder='请输入密码（不少于6位）'
            onChangeText={(text)=>{this.setState({password: text})}} />
        <View style={[styles.registerUnderLine, {width:ScreenWidth}]} />
        <TouchableOpacity onPress={this.onLogin.bind(this)}>
          <Text style={styles.welcome}>登录</Text>
        </TouchableOpacity>
      </View>
    );
  }
  onCancel(){
    app.PopPage();
  }
  gotoRegister(){
    app.GotoPage(Consts.NAVI_PUSH, Scenes.REGISTER, {});
  }
  onLogin(){
    app.GotoPage(Consts.NAVI_RESET, Scenes.MAIN, {
      phones: this.state.phones,
      password: this.state.password,
    });
  }
}

