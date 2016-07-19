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
} from '../Styles';

import {
  Consts,
  Scenes,
} from '../Constant';

import {
  ImageRes,
} from '../Resources';

import StudyTopBar from './C_StudyTopBar';
import StudyLesson from './StudyLesson';
import IconButton from '../Common/IconButton';

export default class C_MainStudyView extends Component {
  constructor(props){
    super(props);
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
          <StudyLesson image={ImageRes.me_icon_normal} name={course.name} msg={course.msg} time={course.time}/>
        </View>
      </TouchableOpacity>
    );
  }
};


