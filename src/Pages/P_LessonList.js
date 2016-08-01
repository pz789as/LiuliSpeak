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
  InteractionManager,
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
  serverUrl,
  LessonListKind,
} from '../Constant';

import {
  ImageRes,
} from '../Resources';

import PageTop from '../Common/PageTop';
import Waiting from '../Common/Waiting';
import CardItem from '../Common/CardItem';

export default class P_LessonList extends Component {
  constructor(props){
    super(props);
    this.state = {
      blnLoading: true,
      lessonDataSource: new ListView.DataSource({
        rowHasChanged:(oldRow, newRow)=>{oldRow !== newRow}
      }),
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state) return true;
    return false;
  }
  componentWillMount(){
  }
  componentDidMount(){
    if (this.props.freshType == Consts.REFRESH) {
      InteractionManager.runAfterInteractions(()=>{
        this.getlessons = setTimeout(this.getLessonListData.bind(this), 1500);
      });
    }else {
      InteractionManager.runAfterInteractions(()=>{
        this.showList = setTimeout(this.showListInfo.bind(this), 500);
      });
    }
  }
  componentWillUnmount(){
    this.getlessons && clearTimeout(this.getlessons);
  }
  showListInfo(){
    this.setState({
        lessonDataSource:this.state.lessonDataSource.cloneWithRows(this.props.listData),
      });
    this.setState({
      blnLoading: false,
    });
  }
  onPressBack(){
    app.PopPage();
  }
  onSelectLesson(index){
    app.temp.lesson = this.props.listData[index];
    var blnAdd = app.lessonIsAdd(app.temp.lesson.key);
    if (blnAdd){//如果已经添加的课程，选中课程之后直接跳转到Menu中去。
      app.GotoPage(Consts.NAVI_PUSH, Scenes.MENU, {});
    }else{
      app.GotoPage(Consts.NAVI_PUSH, Scenes.LESSONINFO, {});
    }
  }
  render() {
    return (
      <View style={[styles.fill, {backgroundColor: '#EEE'}]}>
        <View style={styles.studyTopBar}>
          <PageTop mainTitle={this.props.mainTitle}
            onPressBack={this.onPressBack.bind(this)}/>
        </View>
        {this.drawBody()}
      </View>
    );
  }
  drawBody(){
    if (this.state.blnLoading){
      return <Waiting />;
    }else{
      return (
        <View style={[styles.fill, {backgroundColor: '#EEE'}]}>
          <ListView initialListSize={1}
            pageSize={1}
            scrollRenderAheadDistance={minUnit}
            dataSource={this.state.lessonDataSource}
            renderRow={this.renderRow.bind(this)}
            style={styles.fill}
            enableEmptySections={true} />
        </View>
      );
    }
  }
  renderRow(lesson, sectionID, rowID){
    return (
        <CardItem image={ImageRes.me_icon_normal}
          renderData={lesson}
          blnAdd={false}
          blnNew={false}
          blnMain={false}
          onTouch={this.onSelectLesson.bind(this, rowID)}/>
    );
  }
  getLessonListData(){
    this.setState({
      blnLoading: false,
    });
  }
}

