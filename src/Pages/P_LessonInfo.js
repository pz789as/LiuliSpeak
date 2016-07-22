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
  Alert,
  ScrollView,
  InteractionManager,
  TouchableOpacity,
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
} from '../Constant';

import {
  ImageRes,
} from '../Resources';

import PageTop from '../Common/PageTop';
import Waiting from '../Common/Waiting';

export default class P_LessonInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      blnLoading: true,
      blnMoreList: false,
      isAdd: false,
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state && nextProps != this.props) return true;
    return false;
  }
  componentWillMount(){
  }
  componentDidMount(){
    InteractionManager.runAfterInteractions(()=>{
      this.getlesson = setTimeout(this.getLessonInfo.bind(this), 500);
    });
  }
  componentWillUnmount(){
    this.getlesson && clearTimeout(this.getlesson);
  }
  onPressBack(){
    if (this.state.blnMoreList){
      this.setState({
        blnMoreList: false,
      });
    }else{
      this.props.PopPage();
    }
  }
  showMore(){
    this.setState({
      blnMoreList: true,
    });
  }
  render() {
    return (
      <View style={[styles.fill, styles.lessonsBack]}>
        <View style={styles.studyTopBar}>
          <PageTop mainTitle={this.state.blnMoreList ? '课程列表' : '课程详情'}
            onPressBack={this.onPressBack.bind(this)}/>
        </View>
        {this.drawBody()}
        {this.drawButtom()}
      </View>
    );
  }
  drawButtom(){
    // if (!this.state.blnLoading && !this.state.blnMoreList){
    //   return (
    //     <TouchableOpacity style={ss.addBotton}>
    //       <Text style={ss.addText}>添加课程</Text>
    //     </TouchableOpacity>
    //   );
    // }
  }
  drawBody(){
    if (this.state.blnLoading){
      return <Waiting />;
    }else{
      if (this.state.blnMoreList) {
        return this.drawMoreList();
      }else{
        return this.drawMsg();
      }
    }
  }
  drawMoreList(){
    return (
      <View style={[styles.fill, styles.lessonsBack]}>
        <ScrollView >
          {this.drawList(1)}
        </ScrollView>
      </View>
    );
  }
  drawMsg(){
    return (
      <View style={{width:ScreenWidth, height:ScreenHeight*0.9}}>
        <View style={{height:ScreenHeight*0.8}}>
          <ScrollView>
            <View style={ss.topMsgStyle}>
              <View style={ss.topContent}>
                <Image source={ImageRes.me_icon_normal} style={ss.topImage} 
                  resizeMode='stretch'/>
                <View style={ss.topTextContainer}>
                  <Text style={ss.topTextTitle}>{this.props.lesson.title}</Text>
                  <Text style={ss.topTextTitleEN}>this is fu biao ti</Text>
                  <Text style={[ss.topTextTitleEN, {marginTop: minUnit * 6}]}>
                    来源: xxx</Text>
                  <Text style={[ss.topTextTitleEN, {marginTop: minUnit * 6}]}>
                    难度: xxx</Text>
                  <Text style={[ss.topTextTitleEN, {marginTop: minUnit * 3}]}>
                    分类：xxxx</Text>
                  <View style={ss.topTextPriceContainer}>
                    <Text style={ss.topTextPrice}>11111</Text>
                    <Image source={ImageRes.icon_store_diamond} style={ss.topPriceIcon}/>
                  </View>
                </View>
              </View>
              <View style={ss.topTextDetailContainer}>
                <Text style={ss.topTextDetailTitle}>课程简介</Text>
                <Text style={[ss.topTextTitleEN, {marginTop: minUnit}]}>
                  这是罗里吧嗦的课程简介，看好了，对~就是简介，你妹看错。哔哩哔哩巴拉巴拉，魔法在燃烧。怎么没有对齐呢？
                </Text>
              </View>
            </View>
            <View style={styles.boardLine} />
            {this.drawList(0)}
          </ScrollView>
        </View>
        <TouchableOpacity style={[ss.addBotton, this.state.isAdd ? ss.subBottonColor : ss.addButtonColor]}>
          <Text style={ss.addText}>{this.state.isAdd ? '移除课程' : '添加课程'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  drawList(type){
    var count = type == 0 ? 6 : 10;//10为实际的课程数量
    var arr = [];
    for(var i=0;i<count;i++){
      if (type == 0 && i==0){
        arr.push(<View style={[styles.fill, {paddingHorizontal: minUnit * 5,}]} key={i}>
          <View style={ss.listItemContainer}>
            <Text style={ss.listTopTitle}>共15个单元，已发布148个关卡</Text>
            <TouchableOpacity style={ss.listMoreButton} onPress={this.showMore.bind(this)}>
              <Text style={ss.listMoreText}>查看更多</Text>
              <Image source={ImageRes.ic_chevron_right} style={ss.listMoreIcon}/>
            </TouchableOpacity>
          </View>
        </View>
        );
      }else{
        if (type == 0 && i - 1 >= 5){//这里5要根据这个课程的关卡数或者单元数决定，本页最多显示5个，多余的需要到更多里面查看
          break;
        }else{
          arr.push(<View style={[styles.fill, ss.listOtherContainer]} key={i}>
            <View style={ss.listOtherView}>
              <Text style={ss.listIndex}>{type == 0 ? i : i+1}</Text>
              <Text style={[ss.listIndex, {marginLeft: minUnit*6}]}>
                关卡{i}{'\n'}
                <Text style={{color:'#888'}}>guan qia {type == 0 ? i : i+1}</Text>
              </Text>
            </View>
          </View>
          );
        }
      }
    }
    return arr;
  }
  async getLessonInfo(){
    try{
      //这里需要改成实际的文件名字，课程（lesson1.json, lesson2.json)
      var url = serverUrl + '/LiuliSpeak/getLessonInfo.jsp?filename=lesson1.json';
      let response = await fetch(url);
      if (response.ok == false){
        var title = '出错';
        var msg = '未知错误，请稍后再试！';
        if (response.status == 404) {
          title = '页面不存在 404';
          msg = '您访问的页面不存在，请稍后再试！';
        }else if (response.status == 500){
          title = '服务器错误 500';
          msg = '服务器出错，请稍后再试！';
        }
        Alert.alert(title, msg, [
          {text: '刷新', onPress:()=>{ this.getLessonInfo();}},
          {text: '取消', onPress:()=>{ this.setState({ blnLoading: false,});}},
        ]);
      } else {
        response.text().then((text)=>{
          //这里得到返回的正确结果.
          this.setState({ blnLoading: false,});
          var result = text.replace(/[\r\n\t]/g,'');
          var obj = eval('(' + result + ')');
          console.log(obj);
          // console.log(result);
          //-------------------
        }).catch((error)=>{
          this.setState({ blnLoading: false,});
          Alert.alert('数据出错', msg, [
            {text: '刷新', onPress:()=>{ this.getLessonInfo();}},
            {text: '取消', onPress:()=>{ this.setState({ blnLoading: false,});}},
          ]);
        });
      }
    } catch(error){
      console.log(error);
      this.setState({ blnLoading: false,});
      Alert.alert('访问出错', '服务器忙或网络有问题，请稍后再试！', [
        {text:'重新连接', onPress:()=>{ 
          this.setState({ blnLoading: true,});
          this.getLessonInfo();}},
        {text:'取消' },
      ]);
    }
  }
}

let ss = StyleSheet.create({
  bodyContainer:{
    flex: 1,
    height: ScreenHeight * 0.8,
    backgroundColor: 'white',
  },
  topMsgStyle: {
    width: ScreenWidth,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: minUnit * 5,
  },
  topContent:{
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  topImage:{
    width: minUnit*30,
    height: minUnit*40,
    borderRadius: minUnit * 2,
    backgroundColor: 'green',
  },
  topTextContainer:{
    width: minUnit * 55,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: minUnit * 5,
  },
  topTextTitle:{
    fontSize: minUnit * 6, 
    color:'#000',
  },
  topTextTitleEN:{
    fontSize: minUnit * 3, 
    color:'#888',
  },
  topTextPriceContainer:{
    flexDirection: 'row', 
    marginTop: minUnit * 6, 
    alignItems: 'center'
  },
  topTextPrice:{
    fontSize: minUnit * 4, 
    color:'#8E8',
  },
  topPriceIcon:{
    width: minUnit * 3.5, 
    height: minUnit * 3.5, 
    marginLeft: minUnit,
  },
  topTextDetailContainer:{
    width: minUnit * 90,
    marginTop: minUnit * 8,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  topTextDetailTitle:{
    fontSize: minUnit * 4, 
    color: '#000'
  },
  listItemContainer:{
    width: minUnit * 90,
    flexDirection: 'row',
    marginVertical: minUnit * 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listTopTitle:{
    width: minUnit * 65,
    fontSize: minUnit * 4,
    color: '#888',
  },
  listMoreButton:{
    width: minUnit * 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  listMoreText:{
    fontSize:minUnit*3,
    color:'#777',
  },
  listMoreIcon:{
    width: minUnit*5, 
    height:minUnit*5,
  },
  listOtherContainer:{
    paddingHorizontal: minUnit * 5, 
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  listOtherView:{
    width: minUnit * 90,
    flexDirection: 'row',
    marginVertical: minUnit * 5,
    alignItems: 'flex-start',
  },
  listIndex:{
    fontSize: minUnit * 3,
    color: '#000',
  },
  addBotton:{
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: ScreenHeight * 0.1,
    width: ScreenWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonColor:{
    backgroundColor: 'rgb(255,102,0)',
  },
  subBottonColor:{
    backgroundColor: 'rgb(209,0,21)',
  },
  addText:{
    fontSize: minUnit*6,
    color: 'white',
  },
});