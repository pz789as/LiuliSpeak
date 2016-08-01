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
} from '../Constant';

import {
  ImageRes,
} from '../Resources';

import IconButton from '../Common/IconButton';
import CardItem from '../Common/CardItem';

export default class C_MainStudyView extends Component {
  constructor(props){
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state || nextProps != this.props) return true;
    return false;
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  onSelected(selected){

  }
  render() {
    return (
      <View style={styles.fill}>
        <View style={styles.studyList}>
          <ListView renderRow={this.renderListItem.bind(this)}
            scrollEnabled={true}
            ref={'MainListView'}
            style={[styles.fill, {overflow: 'hidden'}]}
            dataSource={this.props.courseDataSource} />
        </View>
        <IconButton style={styles.addLessonBackStyle}
            buttonStyle={styles.addLessonButton}
            text={' + 添加课程'}
            fontStyle={styles.addLessonButtonFont}
            onPress={this.props.addLesson}/>
      </View>
    );
  }
  renderListItem(course, sectionID, rowID){
    return (
      <CardItem
        image={ImageRes.me_icon_normal}
        renderData={course}
        parents={this}
        onTouch={()=>{this.props.selectListItem(rowID)}}/>
    );
  }
  closeScrollMove() {
    this.refs.MainListView.setNativeProps({
      scrollEnabled: false,
    });
  }
  openScrollMove() {
    this.refs.MainListView.setNativeProps({
      scrollEnabled: true,
    });
  }
};


