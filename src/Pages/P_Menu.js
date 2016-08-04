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
    app.menu = this;
    this.lessonSave = app.getLessonFromSave(tempLesson.key);
    this.initPage = 0;
    for(var i=0;i<this.lessonSave.practices.length;i++){
      if (!this.lessonSave.practices[i].isLock){
        this.initPage = i;
      }
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
    if (this.props.popRoute) {
      app.PopPage(Consts.POP_ROUTE, this.props.popRoute);
    } else {
      app.PopPage();
    }
  }
  gotoMore() {
    this.setState({
      blnMoreMenu: true,
    });
    this.refs.menu.AnimatedInt();
  }
  gotoMorePage(){
    app.GotoPage(Consts.NAVI_PUSH, Scenes.LESSONINFO, {});
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
          initPage={this.initPage}
          ref={'menu'} />
    );
  }
  setFresh(id){
    this.refs.menu.setFresh(id);
  }
  setMoveTo(index){
    this.refs.menu.setMoveTo(index);
  }
  cancelMore(){
    this.setState({
      blnMoreMenu:false,
    });
  }
}

export default P_Menu;