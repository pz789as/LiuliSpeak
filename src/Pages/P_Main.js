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
  ListView,
} from 'react-native';

import {
  styles,
} from '../Styles';

import {
  Consts,
  Scenes,
} from '../Constant';

import MainButtomBar from '../Main/C_MainBottomBar';
import MainStudyView from '../Main/C_MainStudyView';

let lesson1 = require('../../data/lesson1.json');

export default class P_Main extends Component {
  constructor(props){
    super(props);
    this.realCourseList = new Array();
    this.state = {
      courseListDataSource: new ListView.DataSource({
        rowHasChanged:(oldRow, newRow)=>{oldRow !== newRow}
      }),
    };
  }
  selectListItem(rowID){
    app.lesson.lessonID = rowID;
    app.GotoPage(Consts.NAVI_PUSH, Scenes.MENU, 
        {
          lessonData:lesson1.practices,
        });
  }
  componentWillMount(){
    for(var i=0;i<5;i++){
      this.realCourseList.push(lesson1)
    }
    this.setState({
      courseListDataSource:this.state.courseListDataSource.cloneWithRows(this.realCourseList),
    });
  }
  componentWillUnmount(){
  }
  addLesson(){
    app.GotoPage(Consts.NAVI_PUSH, Scenes.ALLLESSON, {});
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state) return true;
    return false;
  }
  render() {
    return (
      <View style={styles.fill}>
        {/*除底框以外的显示范围*/}
        <View style={styles.fill}>
          <MainStudyView selectListItem={this.selectListItem.bind(this)}
              courseListDataSource={this.state.courseListDataSource}
              addLesson={this.addLesson.bind(this)}
              />
        </View>
        {/*底框*/}
        <View style={[styles.mainBottomBar, ]}>
          <MainButtomBar />
        </View>
      </View>
    );
  }
}

