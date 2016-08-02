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
import StudyTopBar from '../Main/C_StudyTopBar';

export default class P_Main extends Component {
  constructor(props){
    super(props);
    this.realCourseList = new Array();
    this.lessonCount = this.realCourseList.length;
    this.state = {
      courseDataSource: new ListView.DataSource({
        rowHasChanged:(oldRow, newRow)=>{oldRow !== newRow}
      }),
    };
    app.main = this;
    app.loadData(this.loadOk.bind(this));
  }
  loadOk(){
    var init = false;
    for(var i=0;i<app.save.lessons.length;i++){
      if (app.save.lessons[i].isAdd){
        var l = this.getLessonForAllLesson(app.save.lessons[i].key);
        this.realCourseList.push(l);
        init = true;
      }
    }
    if (init){
      this.lessonCount = this.realCourseList.length;
      this.setState({
        courseDataSource:this.state.courseDataSource.cloneWithRows(this.realCourseList),
      });
    }
  }
  selectListItem(rowID){
    app.temp.lesson = this.realCourseList[rowID];
    app.temp.lessonID = rowID;
    app.GotoPage(Consts.NAVI_PUSH, Scenes.MENU, {});
  }
  componentWillUpdate(){
    // console.log('will update');
  }
  componentWillMount(){
    // for(var i=0;i<5;i++){
    //   this.realCourseList.push(lesson1)
    // }
    // this.setState({
    //   courseDataSource:this.state.courseDataSource.cloneWithRows(this.realCourseList),
    // });
  }
  componentWillUnmount(){
  }
  getLessonForAllLesson(key){
    for(var i=0;i<app.allLesson.length;i++){
      if (app.allLesson[i].key == key){
        return app.allLesson[i];
      }
    }
    return null;
  }
  getIndexForRealList(key){
    for(var i=0;i<this.realCourseList.length;i++){
      if (this.realCourseList[i].key == key){
        return i;
      }
    }
    return -1;
  }
  addNewLesson(key){
    var l = this.getLessonForAllLesson(key);
    if (l){
      this.realCourseList.push(l);
      app.saveLessons(key, true);
    }
  }
  subOldLesson(key){
    var pos = this.getIndexForRealList(key);
    if (pos >= 0){
      this.realCourseList.splice(pos, 1);
      app.saveLessons(key, false);
    }
  }
  addLesson(){
    // app.GotoPage(Consts.NAVI_PUSH, Scenes.ALLLESSON, {});//实际应该是进入课程分类展示页面
    app.GotoPage(Consts.NAVI_PUSH, Scenes.LESSONLIST, {//临时设置，进入全部课程列表
      listData: app.allLesson,
      freshType: Consts.NOREFRESH,
      mainTitle: '添加课程',
    });
  }
  downloadAll(){
    
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.lessonCount != this.realCourseList.length){
      this.lessonCount = this.realCourseList.length;
      console.log('should update', this.lessonCount);
      this.setState({
        courseDataSource:this.state.courseDataSource.cloneWithRows(this.realCourseList),
      });
      return false;
    }
    if (nextState != this.state) return true;
    return false;
  }
  render() {
    return (
      <View style={styles.fill}>
        {this.drawBody()}
        <View style={[styles.mainBottomBar, ]}>
          <MainButtomBar />
        </View>
      </View>
    );
  }
  drawBody(){
    return (
      <View style={styles.fill}>
        <View style={styles.studyTopBar}>
          <StudyTopBar />
        </View>
        <MainStudyView selectListItem={this.selectListItem.bind(this)}
          courseDataSource={this.state.courseDataSource}
          addLesson={this.addLesson.bind(this)} />
      </View>
    );
  }
}

