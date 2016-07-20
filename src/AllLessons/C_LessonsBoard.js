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
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {
  styles,
  ScreenWidth,
  minUnit,
} from '../Styles';

import {
  Consts,
  Scenes,
} from '../Constant';

import {
  ImageRes,
} from '../Resources';

export default class C_LessonBoard extends Component {
  constructor(props){
    super(props);
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  lessonOnSelected(index){
    if (this.props.boardData.kind == 1){//懂你中文特殊处理，点击都是进入课程详情
      this.props.lessonOnSelected(this.props.boardData, 0);
    }else {
      this.props.lessonOnSelected(this.props.boardData, index);
    }
  }
  render() {
    return (
      <View style={styles.lessonsBoardView}>
        <View style={{
          width: ScreenWidth - minUnit * 10,
          flexDirection:'row', 
          justifyContent:'space-between',
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: minUnit * 5,
            color: 'black',
            fontWeight: 'bold',
          }}>{this.props.boardData.title}</Text>
          <TouchableOpacity onPress={this.lessonOnSelected.bind(this, -1)}
            style={{
              flexDirection:'row',
              alignItems:'center',
              justifyContent:'center',
            }}>
            <Text style={{
              fontSize: minUnit * 3,
              color: 'rgb(30,30,30)',
            }}>{this.props.boardData.secondTitle}</Text>
            <Image source={ImageRes.ic_chevron_right}
              style={{
                width: minUnit * 5,
                height: minUnit * 5,
              }}/>
          </TouchableOpacity>
        </View>
        {this.drawContent()}
      </View>
    );
  }
  drawContent(){
    if (this.props.boardData.kind == 1){//懂你中文，只有一个课程，特殊类型
      return (
        <TouchableOpacity onPress={this.lessonOnSelected.bind(this, 0)}> 
          <View style={{
            width: ScreenWidth - minUnit * 10,
            height: minUnit * 40,
            backgroundColor: 'black',
            marginTop: minUnit * 4,
            borderRadius: minUnit * 3,
          }}>
          </View>
        </TouchableOpacity>
      );
    }else if (this.props.boardData.kind == 2){//最新课程，只有三个子课程显示
      var arrlb = [];
      for(var i = 0; i < 3; i++){
        arrlb.push(
          this.getBoardItem(i, this.props.boardData.lessons[i])
        );
      }
      return (
        <View style={{
          width: ScreenWidth - minUnit * 10,
          marginTop: minUnit * 4,
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
          {arrlb}
        </View>
      );
    }else if (this.props.boardData.kind == 3){//推荐和猜你喜欢，里面有六个子课程显示
      var arrlb = [];
      for(var i = 0; i < 6; i++){
        arrlb.push(
          this.getBoardItem(i, this.props.boardData.lessons[i])
        );
      }
      return (
        <View style={{
          width: ScreenWidth - minUnit * 10,
          marginTop: minUnit * 4,
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
          {arrlb}
        </View>
      );
    }
  }
  getBoardItem(idx, lesson){
    return (
      <TouchableOpacity onPress={this.lessonOnSelected.bind(this, idx)}
        style={{
          justifyContent: 'center',
        }} key={idx}>
        <View style={{
          width: (ScreenWidth - minUnit * 10) / 3 - minUnit * 4,
          height: minUnit * 40,
          backgroundColor: 'black',
          borderRadius: minUnit * 3,
          marginTop: minUnit * (idx >= 3 ? 3 : 0),
        }}>
        </View>
        <Text style={{
          fontSize: minUnit*4,
          width: (ScreenWidth - minUnit * 10) / 3 - minUnit * 4,
          color: 'black',
          marginTop: minUnit,
        }}>
          {lesson.title}
        </Text>
      </TouchableOpacity>
    );
  }
}

