/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  Alert,
  AppRegistry,
  NativeModules,
  StatusBar,
  Navigator,
  Platform,
  NetInfo,
} from 'react-native';

import {
  Scenes,
  Consts,
  serverUrl,
} from './Constant';

var XFiseBridge = NativeModules.XFiseBridge;

import SceneList from './SceneList';
import Storage from 'react-native-storage';
import fs from 'react-native-fs';

var testData = [
    require('../data/lesson1.json'),
    require('../data/lesson2.json'),
    require('../data/lesson3.json'),
    require('../data/lesson4.json'),
    require('../data/lesson5.json'),
    require('../data/lesson6.json'),
    require('../data/lesson7.json'),
    require('../data/lesson8.json'),
    require('../data/lesson9.json'),
    require('../data/lesson10.json'),
];
var ErrorMsg = require('../data/errMsg.json');
let saveKey = 'save';

var getNewSave = function(key, isAdd, isComplete){
  return {
    key: key,
    isAdd: isAdd,
    isComplete: isComplete,
    opTime: (new Date()).getTime(),
  };
};

export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
      appStatus: Scenes.MAIN,//可以根据状态去做一些处理，比如顶部的状态栏显示与否。
      //初始化场景，调整其他界面时，可以更改为其他界面，通过该上面的值
    };
    this.save = {};//本地数据存储
    this.temp = {};//临时数据
    //包含： lesson 选择的课程
    //lessonID 选择课程的index，相对于main里面的列表，目前应该不用这个，用lesson里面的key标识
    //courseID 选择课程中的章节index

    this.allLesson = testData;//所有课程列表，临时得到
    global.app = this;
    global.logf = this.Logf.bind(this);
    global.fs = fs;
    if (Platform.OS == 'ios'){
      Text.defaultProps.allowFontScaling = false;//设置文字不受机器字体放大缩小的影响，这里是全局设定
    }
    this.createStorage();//创建存储句柄
    
    global.deleteFile = this.deleteFile.bind(this);

    XFiseBridge.initISE({"APPID": "57562d34"});//57562d34 5743f74a

    this.netState = 0;
  }
  getStatus(){
    return this.state.appStatus;
  }
  shouldComponentUpdate(nextProps, nextState) {
    //如果要比较js对象如：
    // var {List, Map} = Immutable;
    // var Component = React.createClass({
	  // getInitialState(){
	  // 	return {
		//   	…
		// 	  data: Immutable.fromJS({
		// 		  valueobj:{
		// 			  v1: ‘v1’,
		// 			  v2: ‘v2’,
		// 		  }
		// 	  })
		//   }
	  // }
    // shouldComponentUpdate(nextProps, nextState){
    //     return (
    //       return next.Props.data !== this.props.data;
    //     );
    //   }
    // });
    console.log('shouldComponentUpdate');
    if (nextState != this.nextState) return true;
    return false;
  }
  getLessonFromSave(key){
    if (this.save.lessons){
      for(var i=0;i<this.save.lessons.length; i++){
        if (this.save.lessons[i].key == key){
          return this.save.lessons[i];
        }
      }
      var nls = getNewSave(key, false, false);
      this.save.lessons.push(nls);
      this.saveData();
      return nls;
    }
    return null;
  }
  getLessonSaveIndex(key){
    if (this.save.lessons){
      for(var i=0;i<this.save.lessons.length; i++){
        if (this.save.lessons[i].key == key){
          return i;
        }
      }
      var nls = getNewSave(key, false, false);
      this.save.lessons.push(nls);
      this.saveData();
      return this.save.lessons.length - 1;
    }
    return -1;
  }
  lessonIsAdd(key){
    var sl = this.getLessonFromSave(key);
    if (sl) return sl.isAdd;
    return false;
  }
  lessonIsComplete(key){
    var sl = this.getLessonFromSave(key);
    if (sl) return sl.isComplete;
    return false;
  }
  getLessonData(key){
    for(var i=0;i<this.allLesson.length;i++){
      if (this.allLesson[i].key == key){
        return this.allLesson[i];
      }
    }
    return null;
  }
  orderLessonSave(){
    this.save.lessons && this.save.lessons.sort(function(a, b){
      return b.opTime - a.opTime;
    });
  }
  loadData(loadOk){
    // this.removeSave();
    storage.load({
      key: saveKey,
    }).then((ret)=>{
      this.save = ret;
      this.orderLessonSave();
      loadOk();
    }).catch((err) => {
      var lessons = [];
      for(var i=0;i<this.allLesson.length;i++){
        lessons.push(getNewSave(this.allLesson[i].key, false, false));
      }
      this.save.lessons = lessons;
      this.orderLessonSave();
      this.saveData();
      loadOk();
      logf(err);
    });
  }
  saveLessons(key, isAdd){
    var lessonSave = this.getLessonFromSave(key);
    lessonSave.isAdd = isAdd;
    lessonSave.opTime = (new Date()).getTime();
    this.saveData();
    return lessonSave;
  }
  saveData(){
    storage.save({
      key: saveKey,
      rawData: this.save,
      expires: null,
    });
  }
  removeSave(){
    storage.remove({
      key: saveKey,
    });
  }
  getPracticeListSave(key){
    var tempLesson = this.getLessonData(key);
    var lessonSave = this.getLessonFromSave(tempLesson.key);
    if (!lessonSave) {
      logf('存档错误:', tempLesson.key);
      return;
    }
    if (!lessonSave.practices){//如果没存档没有数据，则生成新的存档数据
      this.createPracticeStorage(tempLesson, lessonSave);
      this.saveData();
    }
    return lessonSave.practices;
  }
  //根据章节ID获取章节章节存档，前提是已经选中课程
  getPracticeSave(key, practiceID){
    var listPractise = this.getPracticeListSave(key);
    return listPractise[practiceID];
  }
  //创建章节存档，不需要使用，如果要使用先@郭
  createPracticeStorage(lesson, lessonSave){
    lessonSave.practices = [];
    for(var i=0;i<lesson.practices.length;i++){
      var p = {
        isLock: i==0 ? false : true,//是否解锁
        isPass: false,//是否通过闯关
        score: 0,//闯关分数，平均分数
        contents: [],//每个章节保存的分数
      };
      for(var j=0;j<lesson.practices[i].contents.length;j++){
        p.contents.push({
          p_score: 0,//修炼分数信息
          e_Score: 0,//闯关分数
          p_SyllableScore:[],//练习中每一句音阶分数
          e_SyllableScore:[],//闯关中每一句音阶分数
        });
      }
      lessonSave.practices.push(p);
    }
    logf("初始化存档数据:", lessonSave.practices)
  }
  //保存某个对话信息，不需要传递key和章节id，因为已经保存在app的temp中了。
  //dialogID: 对话id  //kind: 修炼/闯关（0、修炼；1、闯关)  
  //score: 评分  //syllableScore: 单个音节信息
  saveSingleScore(dialogID, kind, score, syllableScore){
    var practice = this.getPracticeSave(this.temp.lesson.key, this.temp.courseID);
    if (kind == 0){
      practice.contents[dialogID].p_score = score;
      practice.contents[dialogID].p_SyllableScore = syllableScore;
    }else{
      practice.contents[dialogID].e_Score = score;
      practice.contents[dialogID].e_SyllableScore = syllableScore;
    }
    app.saveData();//保存存档
  }
  getMainLessonInfo(key){
    var tempLesson = this.getLessonData(key);

    var count = tempLesson.practices.length;
    var info = {
      star: 0,//获得星星数量
      starAll: 3 * count,//总星星数量
      averageScore: 0,//平均分数
      passCount: 0,//过关的关卡数量
      allCount: count,//总关卡数量
      blnSuccess: false,
    };
    var lessonSave = this.getLessonFromSave(key);
    if (!lessonSave){
      return info;
    }
    var practice = this.getPracticeSave(key, 0);
    info.blnSuccess = true;
    for(var i=0;i<count;i++){
      practice = lessonSave.practices[i];
      if (practice.isPass){
        info.passCount++;
        info.averageScore += practice.score;
        info.star += this.getStarCount(practice.score);
      }
    }
    if (info.passCount > 0){
      info.averageScore /= info.passCount;
      info.averageScore = parseInt(info.averageScore);
    }
    return info;
  }
  getStarCount(score){
    if (score >= 85){
      return 3;
    }else if (score >= 70){
      return 2;
    }else if (score >= 60) {
      return 1;
    }else{
      return 0;
    }
  }
  setLessonSaveTime(key){
    var lessonSave = this.getLessonFromSave(key);
    lessonSave.opTime = (new Date()).getTime();
    this.saveData();
    return lessonSave;
  }
  componentWillMount(){
  }
  componentDidMount(){
    NetInfo.addEventListener(
      'change',
      this._handleConnectionInfoChange.bind(this)
    );
  }
  componentWillUnmount(){
    NetInfo.removeEventListener(
      'change',
      this._handleConnectionInfoChange.bind(this)
    );
    NetInfo.fetch().done((connectionInfo)=>{
      this.setNetState(connectionInfo);
    });
  }
  _handleConnectionInfoChange(connectionInfo){
    this.setNetState(connectionInfo);
  }
  setNetState(state){
    console.log(state);
    if (state == 'none' || state == 'NONE'){
      this.netState = -1;
      Alert.alert(
        '提示',
        '网络未连接，请打开网络！',
        [{
          text: '确定', 
          onPress: ()=>{
            app.menu && app.menu.isInDownload && app.menu.setDownload(false);
          }
        },]
      );
    }else if (state == 'unknown' || state == 'UNKNOWN'){
      this.netState = -2;
      Alert.alert(
        '提示',
        '当前网络不稳定，请检查网络！',
        [{
          text: '确定', 
          onPress: ()=>{
            app.menu && app.menu.isInDownload && app.menu.setDownload(false);
          }
        },]
      );
    }else{
      this.netState = 0;
    }
  }
  configureScene(route, routeStack){
    let configure = Navigator.SceneConfigs.PushFromRight;
    switch(route.configure){
      case Consts.FloatFromLeft:
        configure = Navigator.SceneConfigs.FloatFromLeft;
        break;
      case Consts.FloatFromBottom:
        configure = Navigator.SceneConfigs.FloatFromBottom;
        break;
      case Consts.FloatFromBottomAndroid:
        configure = Navigator.SceneConfigs.FloatFromBottomAndroid;
        break;
      case Consts.FadeAndroid:
        configure = Navigator.SceneConfigs.FadeAndroid;
        break;
      case Consts.HorizontalSwipeJump:
        configure = Navigator.SceneConfigs.HorizontalSwipeJump;
        break;
      case Consts.HorizontalSwipeJumpFromRight:
        configure = Navigator.SceneConfigs.HorizontalSwipeJumpFromRight;
        break;
      case Consts.VerticalUpSwipeJump:
        configure = Navigator.SceneConfigs.VerticalUpSwipeJump;
        break;
      case Consts.VerticalDownSwipeJump:
        configure = Navigator.SceneConfigs.VerticalDownSwipeJump;
        break;
    }
    return configure;
  }
  renderScene(route, navigator){
    this._navigator = navigator;
    return <route.Component {...route.params} navigator={navigator} />;
  }
  render(){
    if (StatusBar != null) {
      StatusBar.setHidden(!SceneList[this.state.appStatus].showStatusBar);
    }
    return (
      <Navigator initialRoute={{
          Component: SceneList[this.state.appStatus].Component,
          name: SceneList[this.state.appStatus].name,
          index: SceneList[this.state.appStatus].index,
          configure: SceneList[this.state.appStatus].configure,
        }}
        onDidFocus={(route)=>{}}
        onWillFocus={(route)=>{
          this.setState({
            appStatus: route.index,
          });
        }}
        configureScene={this.configureScene.bind(this)}
        renderScene={this.renderScene.bind(this)} />
    );
  }
  GotoPage(kind, index, params){
    var arrRoutes = this._navigator.getCurrentRoutes();//可以获取到所有压入栈中的界面
    for(var i=0;i<arrRoutes.length;i++){//主要作用是判断页面栈中是否已经存在了这个页面
      if (arrRoutes[i].index == index){
        if (i == arrRoutes.length - 1){
          logf('gotopage', '两次进入同一个界面啦！注意处理');
          return;//如果要跳转的页面和当前页面是一样，在不做跳转处理
        }else{
          var configureTmp = SceneList[index].configure;
          if (params.configure && params.configure >= Consts.PushFromRight){
            configureTmp = params.configure;
          }
          this.setState({
            appStatus: index,
          });
          this._navigator.jumpTo(arrRoutes[i]);
          return;
        }
      }
    }
    var configureType = SceneList[index].configure;
    if (params.configure && params.configure >= Consts.PushFromRight){
      configureType = params.configure;
    }
    this.setState({
      appStatus: index,
    });
    if (kind == Consts.NAVI_REPLACE){
      this._navigator.replace({
        Component: SceneList[index].Component,
        name: SceneList[index].name,
        index: SceneList[index].index,
        configure: configureType,
        params: params,
      });
    }else if (kind == Consts.NAVI_PUSH){
      this._navigator.push({
        Component: SceneList[index].Component,
        name: SceneList[index].name,
        index: SceneList[index].index,
        configure: configureType,
        params: params,
      });
    }else if (kind == Consts.NAVI_RESET) {
      this._navigator.resetTo({
        Component: SceneList[index].Component,
        name: SceneList[index].name,
        index: SceneList[index].index,
        configure: configureType,
        params: params,
      });
    }
  }
  PopPage(){
    var arrRoutes = this._navigator.getCurrentRoutes();//可以获取到所有压入栈中的界面。
    if (arguments.length == 0 || arguments[0] == Consts.POP){
      if (arrRoutes.length >= 2) {
        this.upDateStatus(arrRoutes[arrRoutes.length - 2]);
      }
      this._navigator.pop();
    }else if (arguments[0] == Consts.POP_ROUTE){
      var bln = true;
      if (arguments[1]){
        for(var i=arrRoutes.length - 1;i>=0;i--){
          if (arrRoutes[i].index == arguments[1]) {//找到要跳转的route的index
            this.upDateStatus(arrRoutes[i]);
            this._navigator.popToRoute(arrRoutes[i]);
            bln = false;
            break;
          }
        }
      }
      if (bln){//如果没有找到，就只跳到最上面的
        if (arrRoutes.length >= 2) {
          this.upDateStatus(arrRoutes[arrRoutes.length - 2]);
        }
        this._navigator.pop();
      }
    }else if (arguments[0] == Consts.POP_POP){
      this.upDateStatus(arrRoutes[0]);
      this._navigator.popToTop();
    }
  }
  GetLastPage(i){
    var arrRoutes = this._navigator.getCurrentRoutes();
    if (arrRoutes.length >= i + 1){
      return arrRoutes[arrRoutes.length - (i + 1)].index;
    }
    return arrRoutes[arrRoutes.length - 1].index;
  }
  upDateStatus(route){
    this.setState({
      appStatus: route.index,//index标识，也可以作为状态使用，两者是一样的值
    });
  }
  Logf(message, ...optionalParams) {
    // var args = arguments.length;
    console.log(message, ...optionalParams);
  }
  createStorage(){
    var storage = new Storage({
      size: 1000,    // 最大容量，默认值1000条数据循环存储
      defaultExpires: null,// 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
      enableCache: true,// 读写时在内存中缓存数据。默认启用。
      // 如果storage中没有相应数据，或数据已过期，
      // 则会调用相应的sync同步方法，无缝返回最新数据。
      sync : {
        // 同步方法的具体说明会在后文提到
      }
    });
    // 最好在全局范围内创建一个（且只有一个）storage实例，方便直接调用
    // 对于web
    // window.storage = storage;
    // 对于react native
    global.storage = storage;
    // 这样在之后的任意位置即可以直接调用storage
  }
  deleteFile(file){
    // fs.stat(file)
    // .then((result)=>{
    //   if (result.isFile()){//如果是文件，则删除该文件
    //   }else if (result.isDirectory()){//如果是路径，则删除里面全部文件
    //   }
    // }).catch((error)=>{
    //   logf(error);
    // });
    //删除时不需要检查文件，如果删除的是路径会自动删除全部文件和路径。
    fs.unlink(file)
    .spread((success, path)=>{
      logf('FILE DELETED', success, path);
    }).catch((err) => {
      logf(err.message);
    });
  }
  getImageUrl(name){
    return serverUrl + '/LiuliSpeak/lessons/images/' + name;
  }
  getErrorMsg(key){
      console.log("错误key:",key,"错误value:",ErrorMsg[key].value);
      return ErrorMsg[key].display;
  }
}
