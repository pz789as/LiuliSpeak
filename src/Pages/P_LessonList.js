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

import ListTop from '../LessonList/C_LessonListTop';
import Waiting from '../Common/Waiting';
import CardItem from '../Common/CardItem';

export default class P_LessonList extends Component {
  constructor(props){
    super(props);
    this.state = {
      blnLoading: props.freshType == Consts.REFRESH ? true : false,
      lessonDataSource: new ListView.DataSource({
        rowHasChanged:(oldRow, newRow)=>{oldRow !== newRow}
      }),
    };
  }
  componentWillMount(){
  }
  componentDidMount(){
    if (this.props.freshType == Consts.REFRESH) {
      InteractionManager.runAfterInteractions(()=>{
        this.getlessons = setTimeout(this.getLessonListData.bind(this), 1500);
      });
    }else {
      this.setState({
        lessonDataSource:this.state.lessonDataSource.cloneWithRows(this.props.listData),
      });
    }
  }
  componentWillUnmount(){
    this.getlessons && clearTimeout(this.getlessons);
  }
  onPressBack(){
    this.props.PopPage();
  }
  onSelectLesson(index){
    // console.log('select lesson: ' + index, this.props.listData[index]);
    this.props.GotoPage(Consts.NAVI_PUSH, Scenes.LESSONINFO, {
      lesson: this.props.listData[index],
    });
  }
  render() {
    return (
      <View style={[styles.fill, {backgroundColor: '#EEE'}]}>
        <View style={styles.studyTopBar}>
          <ListTop mainTitle={this.props.mainTitle}
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
          <ListView dataSource={this.state.lessonDataSource}
            renderRow={this.renderRow.bind(this)}
            style={styles.fill} />
        </View>
      );
    }
  }
  renderRow(lesson, sectionID, rowID){
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={this.onSelectLesson.bind(this, rowID)}>
        <View style={[styles.fill, styles.studySpacing]}>
          <CardItem image={ImageRes.me_icon_normal}
            renderData={lesson}
            renderRight={this.renderRight.bind(this)}/>
        </View>
      </TouchableOpacity>
    );
  }
  renderRight(data){
    return (
      <View style={{margin: 10*MinWidth, padding: 20*MinWidth, flex: 1,}}>
        <Text style={{fontSize: minUnit*6, color: '#11171D',}}>
          {data.title}
        </Text>
      </View>
    );
  }
  getLessonListData(){
    this.setState({
      blnLoading: false,
    });
  }
}

