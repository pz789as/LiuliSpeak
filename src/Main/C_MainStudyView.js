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
  Alert,
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
  '已完成40%,平均分54分',
  '不错，闯关成功!',
];
import * as Progress from 'react-native-progress';

export default class C_MainStudyView extends Component {
  cardSelect = -1;
  cardList = [];
  constructor(props) {
    super(props);
    app.studyView = this;
    this.timer = setInterval(()=>{
      this.getMainLessonInfo();
    }, 100);
  }
  getMainLessonInfo() {
    var info = app.getMainLessonInfo(1);
    if (info.blnSuccess) {
      for (var i=0;i<this.cardList.length;i++) {
        if (this.cardList[i]) {
          this.cardList[i].Refresh();
        }
      }
      this.timer && clearInterval(this.timer);
    }
  }
  Refresh(key) {
    var index = app.main.getIndexForRealList(key);
    this.cardList[index].Refresh();
  }
  shouldComponentUpdate(nextProps, nextState) {
    // logf('study view', nextProps != this.props);
    if (app.getStatus() != Scenes.MAIN) return false;
    if (nextState != this.state || nextProps != this.props) return true;
    return false;
  }
  componentWillMount(){
  }
  componentWillUnmount(){
    this.timer && clearInterval(this.timer);
    app.studyView = null;
  }
  onSelected(selected){

  }
  render() {
    return (
      <View style={styles.fill}>
        <View style={styles.studyList}>
          <ListView key={this.props.realList}
            renderRow={this.renderListItem.bind(this)}
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
    // logf('course item:', course.titleCN);
    // logf('course image:', course.kcimage);
    return (
      <CardItem
        image={course.kcimage}
        renderData={course}
        renderRight={this.renderMsg.bind(this)}
        blnCanMove={true}
        blnRenderCom={true}
        parents={this}
        index={rowID}
        deleteBack={(key)=>{
          // this.delectCard(key)
          Alert.alert(
            '删除课程',
            '确定删除该课程吗？',
            [
              {text: '取消', onPress: ()=>{}},
              {text: '确定', onPress: ()=>{this.delectCard(key)}},
            ]
          );
        }}
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
    if (this.cardSelect != -1) {
      var index = app.main.getIndexForRealList(this.cardSelect);
      if (index >= 0) {
        this.cardList[index].AnimatedBack();
        this.cardSelect = -1;
      }
    }
  }
  setSelect(key) {
    if (this.cardSelect == key) return;
    if (this.cardSelect == -1) this.cardSelect = key;
    var index = app.main.getIndexForRealList(this.cardSelect);
    if (index >= 0) {
      this.cardList[index].AnimatedBack();
      this.cardSelect = key;
    }
  }
  renderMsg(course) {
    var info = app.getMainLessonInfo(course.key);
    var progress = info.passCount / info.allCount;
    return (
      <View style={[styles.fill, styles.cardFrame]}>
        {this.renderText([styles.cardFontName, styles.cardWordBottom], course.titleCN)}
        {this.drawProgress(progress)}
        {this.renderProgressMsg(progress, info.averageScore)}
        {this.drawStar(course, info.star, info.starAll)}
      </View>
    );
  }
  renderProgressMsg(progress, score) {
    if (score == 0) {
      return (
        <View>
          {this.renderText([styles.cardFontSmall, styles.cardWordH], '还没有开始闯关')}
        </View>
      );
    } else {
      var msg = '已完成'+parseInt(progress*100)+'%,平均分'+score+'分';
      return (
        <View>
          {this.renderText([styles.cardFontSmall, styles.cardWordH], msg)}
        </View>
      );
    }
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
  drawStar(course, star_n, star_all) {
    size = course.practices.length;
    return (
      <View style={[Mingstyles.starPosition, ]}>
        <Image
          style={Mingstyles.starImg}
          source={ImageRes.ic_star_yellow} />
        <Text style={[styles.cardFontSmall, ]}>
          {star_n}/{star_all}
        </Text>
      </View>
    );
  }

  closeScrollMove() {
    this.refs.MainListView.setNativeProps({
      canCancelContentTouches: false,
    });
  }
  openScrollMove() {
    this.refs.MainListView.setNativeProps({
      canCancelContentTouches: true,
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
