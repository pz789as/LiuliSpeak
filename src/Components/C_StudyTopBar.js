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
  StatusBar,
} from 'react-native';

import {
  styles,
} from '../Styles';

import {
  Consts,
  Scenes,
} from '../Constant';

export default class C_StudyTopBar extends Component {
  constructor(props){
    super(props);
    this.state={
      statusHeight:StatusBar.currentHeight,
    };
    console.log(StatusBar.currentHeight);
    // if (StatusBar != null) {
    //   StatusBar.getHeiht((height)=>{
    //     this.setState({
    //       statusHeight: height,
    //     });
    //   });
    // }
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  onSelected(selected){

  }
  render() {
    return (
      <View style={[styles.studyTopView, ]}>
        <TouchableOpacity>
          <Text style={styles.studyTopLeftText}>排行榜</Text>
        </TouchableOpacity>
        
          <Text style={styles.studyTopMiddleText}>我的课程</Text>
        
        <TouchableOpacity>
          <Text style={styles.studyTopRightText}>已完成</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

