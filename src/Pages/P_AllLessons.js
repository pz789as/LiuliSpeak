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
  Alert,
} from 'react-native';

import {
  styles,
} from '../Styles';

import {
  Consts,
  Scenes,
  serverUrl,
} from '../Constant';

import TopBar from '../AllLessons/C_AllLessonsTop';
import ListBody from '../AllLessons/C_AllLessonsBody';
import Waiting from '../Common/Waiting';

export default class P_AllLessons extends Component {
  constructor(props){
    super(props);
    this.state={
      blnLoading: true,
    };
  }
  componentWillMount(){
  }
  componentDidMount(){
    this.getAllLessons();
  }
  componentWillUnmount(){
  }
  BackToMain(){
    this.props.PopPage();
  }
  doSearchLessons(){

  }
  async getAllLessons(){
    try{
      let response = await fetch(serverUrl + '/LiuliSpeak/getAllLessons.jsp');
      console.log(response);
    }catch(error){
      console.log(error);
      this.setState({
        blnLoading: false,
      });
      Alert.alert('网络错误', '服务器忙或网络有问题，请稍后再试！', [
        {text:'重新连接', onPress:()=>{
          this.setState({
            blnLoading: true,
          });
          this.getAllLessons();
        }},
        {text:'取消'},
      ]);
    }
  }
  render() {
    return (
      <View style={[styles.fill, styles.lessonsBack]}>
        <View style={styles.studyTopBar}>
          <TopBar onPressBack={this.BackToMain.bind(this)}
            doSearchLessons={this.doSearchLessons.bind(this)}/>
        </View>
        {this.drawBody()}
      </View>
    );
  }
  drawBody(){
    if (this.state.blnLoading){
      return <Waiting />
    }else{

    }
  }
}

