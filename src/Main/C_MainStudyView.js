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
  ListView,
} from 'react-native';

import {
  styles,
  ScreenWidth,
  ScreenHeight,
  minUnit,
  MinWidth,
} from '../Styles';

import {
  Consts,
  Scenes,
} from '../Constant';

import {
  ImageRes,
} from '../Resources';

import StudyTopBar from './C_StudyTopBar';
import IconButton from '../Common/IconButton';
import CardItem from '../Common/CardItem';

export default class C_MainStudyView extends Component {
  constructor(props){
    super(props);
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
    return (
      <View style={styles.fill}>
        <View style={styles.studyTopBar}>
          <StudyTopBar />
        </View>
        <View style={styles.studyList}>
          <ListView renderRow={this.renderListItem.bind(this)}
            style={[styles.fill, ]}
            dataSource={this.props.courseListDataSource} />
        </View>
        <IconButton style={styles.addLessonBackStyle}
            buttonStyle={styles.addLessonButton}
            text={' + 添加课程'}
            fontStyle={styles.addLessonButtonFont}
            onPress={this.props.addLesson}/>
      </View>
    );
  }
  renderListItem(course, sectionID, rowID){
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={()=>{this.props.selectListItem(rowID)}}>
        <View style={[styles.fill, styles.studySpacing]}>
          <CardItem image={ImageRes.me_icon_normal}
            renderData={course}
            renderRight={this.renderRight.bind(this)}/>
        </View>
      </TouchableOpacity>
    );
  }
  renderRight(data){
    var message = {
      margin: 10*MinWidth,
      padding: 20*MinWidth,
      flex: 1,
    };
    var name = {
      fontSize: minUnit*6,
      color: '#11171D',
    };
    var tips = {
      fontSize: minUnit*4,
      color: '#53686A',
    };
    var time = {
      fontSize: minUnit*3,
      color: '#000000',
    };
    return (
      <View style={message}>
        <Text style={name}>
          {data.name}
        </Text>
        <Text style={tips}>
          {data.msg}
        </Text>
        <Text style={time}>
          {data.time}
        </Text>
      </View>
    );
  }
};


