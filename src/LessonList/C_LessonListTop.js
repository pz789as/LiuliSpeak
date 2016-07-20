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
} from 'react-native';

import {
  styles,
  ScreenWidth,
  minUnit,
  UtilStyles,
} from '../Styles';

import {
  Consts,
  Scenes,
} from '../Constant';

import {
  ImageRes
} from '../Resources';

import IconButton from '../Common/IconButton'; 

export default class C_LessonListTop extends Component {
  constructor(props){
    super(props);
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  render() {
    return (
      <View style={[styles.lessonsTopStyle, styles.line]}>
        <IconButton	icon={ImageRes.ic_back} 
            onPress={this.props.onPressBack}/>
        <Text style={UtilStyles.font}>{this.props.mainTitle}</Text>
        <View style={{width: minUnit * 10}}/>
      </View>
    );
  }
}

