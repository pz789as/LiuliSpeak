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
    this.realPractices = new Array();
    this.state = {
      listDataSource: new ListView.DataSource({
        rowHasChanged:(oldRow, newRow)=>{oldRow !== newRow}
      }),
      blnMoreMenu: false,
    };
  }
  componentWillMount(){
    for(let i=0;i<this.props.lessonData.length;i++){
      this.realPractices.push(this.props.lessonData[i]);
    }
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
    app.lesson.courseID = rowID;
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