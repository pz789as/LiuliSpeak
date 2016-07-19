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

export default class C_AllLessonsBody extends Component {
  constructor(props){
    super(props);
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }
}

