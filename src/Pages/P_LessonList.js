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
  InteractionManager,
} from 'react-native';

import {
  styles,
} from '../Styles';

import {
  Consts,
  Scenes,
  serverUrl,
  LessonListKind,
} from '../Constant';

import ListTop from '../LessonList/C_LessonListTop';
import Waiting from '../Common/Waiting';

export default class P_LessonList extends Component {
  constructor(props){
    super(props);
    this.state = {
      blnLoading: props.freshType == LessonListKind.REFRESH ? true : false,
    };
  }
  componentWillMount(){
  }
  componentDidMount(){
    if (this.props.freshType == LessonListKind.REFRESH) {
      InteractionManager.runAfterInteractions(()=>{
        this.getlessons = setTimeout(this.getLessonListData.bind(this), 1500);
      });
    }else {
      
    }
  }
  componentWillUnmount(){
    this.getlessons && clearTimeout(this.getlessons);
  }
  onPressBack(){
    this.props.PopPage();
  }
  render() {
    return (
      <View style={[styles.fill, styles.lessonsBack]}>
        <View style={styles.studyTopBar}>
          <ListTop mainTitle={this.props.mainTitle}
            onPressBack={this.onPressBack.bind(this)}/>
        </View>
        {this.drawBody()}
      </View>
    );
  }
  drawBody(){
    if (this.state.blnLoading){
      return <Waiting />;
    }else{
      
    }
  }
  getLessonListData(){
    this.setState({
      blnLoading: false,
    });
  }
}

