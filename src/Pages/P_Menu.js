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
    // this.lessonSave = app.getLessonFromSave(tempLesson.key);
    // if (!this.lessonSave) logf('存档错误:', tempLesson.key);
    // if (!this.lessonSave.practices ){//如果没存档没有数据，则生成新的存档数据
    //   this.lessonSave.practices = [];
    //   for(var i=0;i<tempLesson.practices.length;i++){
    //     var p = {
    //       isLock: i==0 ? false : true,//是否解锁
    //       contents: [],//没一个章节保存的分数
    //     };
    //     for(var j=0;j<tempLesson.practices[i].contents.length;j++){
    //       p.contents.push({
    //         p_score: 0,//修炼分数信息
    //         e_Score: 0,//闯关分数
    //         p_SyllableScore:[],//练习中每一句音阶分数
    //         e_SyllableScore:[],//闯关中每一句音阶分数
    //       });
    //     }
    //     this.lessonSave.practices.push(p);
    //   }
    //   logf("初始化存档数据:",this.lessonSave.practices)
    //   app.saveData();//保存存档
    // }else{       
    //   logf("成功获取存档数据:",this.lessonSave.practices)
    // }
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
          ref={'menu'} />
    );
  }
  setFresh(id){
    this.refs.menu.setFresh(id);
  }
  cancelMore(){
    this.setState({
      blnMoreMenu:false,
    });
  }
}

export default P_Menu;