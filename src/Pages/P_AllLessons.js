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
  Alert,
  ScrollView,
  InteractionManager,
} from 'react-native';

import {
  styles,
} from '../Styles';

import {
  Consts,
  Scenes,
  serverUrl,
} from '../Constant';

import {
  kindList,
  lessonList,
} from '../Resources';

import TopBar from '../AllLessons/C_AllLessonsTop';
import LessonsBoard from '../AllLessons/C_LessonsBoard';
import Waiting from '../Common/Waiting';
import KindBoard from '../AllLessons/C_KindBoard';

export default class P_AllLessons extends Component {
  constructor(props){
    super(props);
    this.state={
      blnLoading: true,
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state || nextProps != this.props) return true;
    return false;
  }
  componentWillMount(){
  }
  componentDidMount(){
    InteractionManager.runAfterInteractions(()=>{
      this.getlessons = setTimeout(this.getAllLessons.bind(this), 500);
    });
  }
  componentWillUnmount(){
    this.getlessons && clearTimeout(this.getlessons);
  }
  BackToMain(){
    this.props.PopPage();
  }
  doSearchLessons(){

  }
  kindOnSelected(kind){
    console.log('selected kind ', kindList[kind]);
    this.props.GotoPage(Consts.NAVI_PUSH, Scenes.LESSONLIST, {
      freshType: Consts.REFRESH,
      listKind: kind,
      mainTitle: kindList[kind].name,
    });
  }
  lessonOnSelected(list, idx){
     if (idx == -1) {//查看更多，也就是跳转到该类的列表里面去，人为的在里面控制传出来的值
       this.props.GotoPage(Consts.NAVI_PUSH, Scenes.LESSONLIST, {
         listData: list.lessons,
         freshType: Consts.NOREFRESH,
         mainTitle: list.title,
       });
     }else{//选中某一个课程查看详情
      var configure = Consts.PushFromRight; 
      if (idx % 3 < 2) { //根据位置不同，跳转的方式有一些区别
        configure = Consts.FloatFromBottom;
      }
      this.props.GotoPage(Consts.NAVI_PUSH, Scenes.LESSONINFO, {
        lesson: list.lessons[idx],
        configure: configure,
      });
     }
  }
  render() {
    return (
      <View style={[styles.fill, styles.lessonsBack]}>
        <View style={styles.studyTopBar}>
          <TopBar onPressBack={this.BackToMain.bind(this)}
            doSearchLessons={this.doSearchLessons.bind(this)}/>
        </View>
        {this.drawBody()}
      </View>
    );
  }
  drawBody(){
    if (this.state.blnLoading){
      return <Waiting />;
    }else{
      var arrlb = [];
      for(var i = 0; i < 8; i++){
        if (i%2 == 0) {
          arrlb.push(<View style={styles.boardLine} key={i}/>);
        } else {
          arrlb.push(<LessonsBoard boardData={lessonList[parseInt(i/2)]} 
            lessonOnSelected={this.lessonOnSelected.bind(this)}
            key={i}/>
          );
        }
      }
      return (
        <ScrollView style={styles.lesssonsScrollView}>
          <KindBoard kindList={kindList} 
            kindOnSelected={this.kindOnSelected.bind(this)}/>
          {arrlb}
        </ScrollView>
      );
    }
  }
  async getAllLessons(){
    try{
      let response = await fetch(serverUrl + '/LiuliSpeak/getAllLessons.jsp');
      if (response.ok == false){
        var title = '出错';
        var msg = '未知错误，请稍后再试！';
        if (response.status == 404) {
          title = '页面不存在';
          msg = '您访问的页面不存在，请稍后再试！';
        }else if (response.status == 500){
          title = '服务器错误';
          msg = '服务器出错，请稍后再试！';
        }
        Alert.alert(title, msg, [
          {text: '刷新', onPress:()=>{ this.getAllLessons();}},
          {text: '取消', onPress:()=>{ this.setState({ blnLoading: false,});}},
        ]);
      } else {
        response.text()
        .then((text)=>{
          //得到最终结果
          this.setState({ blnLoading: false,});
          var result = text.replace(/[\r\n\t]/g,'');
          var obj = eval('(' + result + ')');
          console.log(obj);
          //-----------------
        })
        .catch((error)=>{
          this.setState({ blnLoading: false,});
          Alert.alert('数据出错', msg, [
            {text: '刷新', onPress:()=>{ this.getAllLessons();}},
            {text: '取消', onPress:()=>{ this.setState({blnLoading: false,});}},
          ]);
        });
      }
    }catch(error){
      this.setState({ blnLoading: false,});
      Alert.alert('访问出错', '服务器忙或网络有问题，请稍后再试！', [
        {text:'重新连接', onPress:()=>{ 
          this.setState({ blnLoading: true,});
          this.getAllLessons();
        }},
        {text:'取消'},
      ]);
    }
  }
}

