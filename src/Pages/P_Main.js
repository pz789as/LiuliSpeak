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
    this.state = {
      courseDataSource: new ListView.DataSource({
        rowHasChanged:(oldRow, newRow)=>{ oldRow !== newRow}
      }),
      blnRefresh: false,
    };
    app.main = this;
    app.loadData(this.loadOk.bind(this));
  }
  loadOk(){
    var init = false;
    this.realCourseList.length = 0;
    for(var i=0;i<app.save.lessons.length;i++){
      if (app.save.lessons[i].isAdd){
        // if (!app.save.lessons[i].isComplete){
          var l = app.getLessonData(app.save.lessons[i].key);
          l.opTime = app.save.lessons[i].opTime;
          this.realCourseList.push(l);
          init = true;
        // }
      }
    }
    if (init){
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
  }
  componentWillMount(){
  }
  componentWillUnmount(){
    app.main = null;
  }
  getIndexForRealList(key){
    for(var i=0;i<this.realCourseList.length;i++){
      if (this.realCourseList[i].key == key){
        return i;
      }
    }
    return -1;
  }
  reorderList(){
    this.realCourseList.sort(function(a, b){
      return b.opTime - a.opTime;
    });
  }
  setLessonTime(key){//主要用于排序，当点击修炼或者闯关之后，选中课程要移动到最上端
    var l = app.getLessonData(key);
    if (l){
      var lessonSave = app.setLessonSaveTime(key);
      l.opTime = lessonSave.opTime;
      this.reorderList();
      this.setState({
        courseDataSource:this.state.courseDataSource.cloneWithRows(this.realCourseList),
      });
      // this.Refresh();
    }
  }
  addNewLesson(key){
    var l = app.getLessonData(key);
    if (l){
      var lessonSave = app.saveLessons(key, true);
      l.opTime = lessonSave.opTime;
      this.realCourseList.push(l);
      this.reorderList();
      this.setState({
        courseDataSource:this.state.courseDataSource.cloneWithRows(this.realCourseList),
      });
    }
  }
  subOldLesson(key){
    var pos = this.getIndexForRealList(key);
    if (pos >= 0){
      var lessonSave = app.saveLessons(key, false);
      this.realCourseList.splice(pos, 1);
      this.setState({
        courseDataSource:this.state.courseDataSource.cloneWithRows(this.realCourseList),
      });
    }
  }
  completeLesson(key){
    var pos = this.getIndexForRealList(key);
    if (pos >= 0){
      this.realCourseList.splice(pos, 1);
      this.setState({
        courseDataSource:this.state.courseDataSource.cloneWithRows(this.realCourseList),
      });
    }
  }
  Refresh() {
    this.setState({
      blnRefresh: !this.state.blnRefresh,
    });
  }
  addLesson(){
    app.studyView.selectBack();
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
    if (nextState != this.state) return true;
    return false;
  }
  render() {
    // return (
    //   <View style={styles.fill}>
    //     {this.drawBody()}
    //     <View style={[styles.mainBottomBar, ]}>
    //       <MainButtomBar />
    //     </View>
    //   </View>
    // );

    //临时设置，只有学习一个tab，其他的暂时不显示
    return (
      <View style={styles.fill}>
        {this.drawBody()}
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
          realList={this.realCourseList}
          parents={this}
          addLesson={this.addLesson.bind(this)} />
      </View>
    );
  }
}

