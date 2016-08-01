'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ListView,
} from 'react-native';

import {
  Consts,
  Scenes,
} from '../Constant';

import {
  styles,
  ScreenWidth,
  ScreenHeight,
  UtilStyles,
  minUnit,
} from '../Styles';

import LessonMenu from '../Menu/C_LessonMenu';

class P_Menu extends Component {
  constructor(props){
    super(props);
    var tempLesson = app.temp.lesson;
    this.realPractices = tempLesson.practices;
    this.state = {
      listDataSource: new ListView.DataSource({
        rowHasChanged:(oldRow, newRow)=>{oldRow !== newRow}
      }),
      blnMoreMenu: false,
    };
    this.lessonSave = app.getLessonFromSave(tempLesson.key);
    if (!this.lessonSave) logf('存档错误:', tempLesson.key);
    if (!this.lessonSave.practices){//如果没存档没有数据，则生成新的存档数据
      this.lessonSave.practices = [];
      for(var i=0;i<tempLesson.practices.length;i++){
        var p = {
          isLock: i==0 ? false : true,//是否解锁
          contents: [],//没一个章节保存的分数
        };
        for(var j=0;j<tempLesson.practices[i].contents.length;j++){
          p.contents.push({
            score: 0,//分数信息
          });
        }
        this.lessonSave.practices.push(p);
      }
      app.saveData();//保存存档
    }
  }
  componentWillMount(){
    this.setState({
      listDataSource:this.state.listDataSource.cloneWithRows(this.realPractices),
    });
  }
  componentWillUnmount(){
  }
  onCancel() {
  	app.PopPage();
  }
  gotoMore() {
    this.setState({
      blnMoreMenu: true,
    });
    this.refs.menu.AnimatedInt();
  }
  gotoMorePage(){

  }
  selectListItem(rowID, kind){
    app.temp.courseID = rowID;
    var pageIdx = Scenes.PRACTICE;
    if (kind == 0) {
      pageIdx = Scenes.PRACTICE;
    }else if(kind == 1){
      pageIdx = Scenes.EXAM;
    }
    app.GotoPage(Consts.NAVI_PUSH, pageIdx, 
        {
          dialogData: this.realPractices[rowID].contents,
        });
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state) return true;
    return false;
  }
  render() {
    logf("Hello Menu!");
    return (
      <LessonMenu onClose={this.onCancel.bind(this)}
          onMore={this.gotoMore.bind(this)}
          CardNum={this.realPractices.length}
          listDataSource={this.state.listDataSource}
          selectListItem={this.selectListItem.bind(this)}
          blnMoreMenu={this.state.blnMoreMenu}
          cancelMore={this.cancelMore.bind(this)}
          gotoMorePage={this.gotoMorePage.bind(this)}
          ref={'menu'} />
    );
  }
  cancelMore(){
    this.setState({
      blnMoreMenu:false,
    });
  }
}

export default P_Menu;