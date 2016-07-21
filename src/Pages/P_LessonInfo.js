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
} from 'react-native';

import {
  styles,
} from '../Styles';

import {
  Consts,
  Scenes,
} from '../Constant';

export default class P_LessonInfo extends Component {
  constructor(props){
    super(props);
  }
  componentWillMount(){
    setTimeout(this.GotoLogin.bind(this), 3000);
  }
  componentWillUnmount(){
  }
  GotoLogin(){
    this.props.PopPage();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>中文说</Text>
        <Text style={styles.instructions}>开启中文之旅</Text>
      </View>
    );
  }
}

