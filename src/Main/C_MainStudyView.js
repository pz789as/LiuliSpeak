/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
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

// 主菜单 当前闯关信息
const msg = [
  '还没有开始闯关',
  '闯关中...',
  '不错，闯关成功!',
];
import * as Progress from 'react-native-progress';

export default class C_MainStudyView extends Component {
  cardSelect = -1;
  cardList = [];
  constructor(props) {
    super(props);
    app.studyView = this;
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
    console.log('studyView');
    return (
      <View style={styles.fill}>
        <View style={styles.studyList}>
          <ListView key={this.props.realList}
            renderRow={this.renderListItem.bind(this)}
            scrollEnabled={true}
            ref={'MainListView'}
            onScroll={this.selectBack.bind(this)}
            style={[styles.fill, {overflow: 'hidden'}]}
            dataSource={this.props.courseDataSource}
            enableEmptySections={true} />
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
        image={course.kcimage}
        renderData={course}
        renderRight={this.renderMsg.bind(this)}
        blnCanMove={true}
        parents={this}
        index={rowID}
        deleteBack={(key)=>{this.delectCard(key)}}
        ref={(ref)=>{this.cardList[rowID] = ref}}
        onTouch={()=>{this.props.selectListItem(rowID)}}/>
    );
  }
  delectCard(key) {
    app.main.subOldLesson(key);
    app.main.Refresh();
    this.cardSelect = -1;
  }
  selectBack() {
    if (this.cardSelect >= this.props.courseDataSource.length) {
      this.cardSelect = -1;
    }
    if (this.cardSelect != -1) {
      this.cardList[this.cardSelect].AnimatedBack();
      this.cardSelect = -1;
    }
  }
  setSelect(index) {
    if (this.cardSelect == index) return;
    if (index == -1) return;
    if (this.cardSelect != -1) {
      this.cardList[this.cardSelect].AnimatedBack();
    }
    this.cardSelect = index;
  }
  renderMsg(course) {
    app.getMainLessonInfo(1);
    return (
      <View style={[styles.fill, styles.cardFrame]}>
        {this.renderText([styles.cardFontName, styles.cardWordBottom], course.titleCN)}
        {this.drawProgress(0.3)}
        {this.renderText([styles.cardFontSmall, styles.cardWordH], msg[0])}
        {this.drawStar(course, 5)}
      </View>
    );
  }
  renderText(style, text) {
    if (text == '') return null;
    return (
      <Text style={style}>{text}</Text>
    );
  }
  // 进度条（progress父组件传入）
  drawProgress(progress) {
    return (
      <Progress.Bar
        style={styles.cardWordH}
        progress={progress}
        unfilledColor='#C0C0C0'
        borderWidth={1}
        borderColor='#C0C0C0'
        borderRadius={minUnit*1}
        color='#19E824'
        height={minUnit*2}
        width={minUnit*50}/>
    );
  }
  drawStar(course, star_n) {
    size = course.practices.length;
    return (
      <View style={[Mingstyles.starPosition, ]}>
        <Image
          style={Mingstyles.starImg}
          source={ImageRes.ic_star_yellow} />
        <Text style={[styles.cardFontSmall, ]}>
          {star_n}/{size*3}
        </Text>
      </View>
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

const Mingstyles = StyleSheet.create({
  starPosition: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: minUnit*4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  starImg: {
    width: minUnit*4,
    height: minUnit*4,
    marginRight: minUnit,
  },
});
