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
    //logf(StatusBar.currentHeight);
    // if (StatusBar != null) {
    //   StatusBar.getHeiht((height)=>{
    //     this.setState({
    //       statusHeight: height,
    //     });
    //   });
    // }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state || nextProps != this.props) return true;
    return false;
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  onSelected(selected){

  }
  render() {
    //临时设置，没有排行榜和已完成
    return (
      <View style={[styles.studyTopView, {justifyContent:'center'}]}>
        <Text style={styles.studyTopMiddleText}>我的课程</Text>
      </View>
    );

    // return (
    //   <View style={[styles.studyTopView, ]}>
    //     <TouchableOpacity>
    //       <Text style={styles.studyTopLeftText}>排行榜</Text>
    //     </TouchableOpacity>
    //     <Text style={styles.studyTopMiddleText}>我的课程</Text>
    //     <TouchableOpacity>
    //       <Text style={styles.studyTopRightText}>已完成</Text>
    //     </TouchableOpacity>
    //   </View>
    // );
  }
}

