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

import MainButtomBar from '../Components/C_MainBottomBar';
import MainStudyView from '../Components/C_MainStudyView';

let lesson1 = require('../../data/lesson1.json');

export default class P_Main extends Component {
  constructor(props){
    super(props);
    this.realCourseList = new Array();
    this.courseIdx = 0;
    this.state = {
      courseListDataSource: new ListView.DataSource({
        rowHasChanged:(oldRow, newRow)=>{oldRow !== newRow}
      }),
    };
  }
  selectListItem(rowID){
    this.courseIdx = rowID;
    console.log(rowID);
    this.props.GotoPage(Consts.NAVI_PUSH, Scenes.MENU, {lessonData:lesson1.practices});
  }
  componentWillMount(){
    for(var i=0;i<5;i++){
      this.realCourseList.push({
        name:'课程' + i,
        msg: '这是课程'+i+'的介绍',
        icon:'xxx.png',
        time:'2016.6.' + (i+1),
      })
    }
    this.setState({
      courseListDataSource:this.state.courseListDataSource.cloneWithRows(this.realCourseList),
    });
  }
  componentWillUnmount(){
  }
  render() {
    return (
      <View style={styles.fill}>
        {/*除底框以外的显示范围*/}
        <View style={styles.fill}>
          <MainStudyView selectListItem={this.selectListItem.bind(this)}
              courseListDataSource={this.state.courseListDataSource}
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

