/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  NativeModules,
  StatusBar,
  Navigator,
} from 'react-native';

import {
  Scenes,
  Consts,
} from './Constant';

import SceneList from './SceneList';

var XFiseBridge = NativeModules.XFiseBridge;
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

export default class App extends Component {
  constructor(props){
    super(props);
    this.listener = null;
    this.volumeListener = null;
    // this.pcmListener = null;
    this.speechStatus = XFiseBridge.SPEECH_STOP;
    this.category = 'read_syllable';
    this.pingceBack = null;
    this.state={
      appStatus: Scenes.MAIN,//可以根据状态去做一些处理，比如顶部的状态栏显示与否。
      //初始化场景，调整其他界面时，可以更改为其他界面，通过该上面的值
    };
  }
  componentDidMount(){
    this.listener = RCTDeviceEventEmitter.addListener('iseCallback', this.iseCallback.bind(this));
    this.volumeListener = RCTDeviceEventEmitter.addListener('iseVolume', this.iseVolume.bind(this));
    // this.pcmListener = RCTDeviceEventEmitter.addListener('playCallback', this.playCallback.bind(this));
  }
  componentWillUnmount(){
    this.listener.remove();
    this.volumeListener.remove();
    // this.pcmListener.remove();
  }
  configureScene(route, routeStack){
    let configure = Navigator.SceneConfigs.PushFromRight;
    switch(route.configure){
      case 1:
        configure = Navigator.SceneConfigs.FloatFromLeft;
        break;
      case 2:
        configure = Navigator.SceneConfigs.FloatFromBottom;
        break;
      case 3:
        configure = Navigator.SceneConfigs.FloatFromBottomAndroid;
        break;
      case 4:
        configure = Navigator.SceneConfigs.FadeAndroid;
        break;
      case 5:
        configure = Navigator.SceneConfigs.HorizontalSwipeJump;
        break;
      case 6:
        configure = Navigator.SceneConfigs.HorizontalSwipeJumpFromRight;
        break;
      case 7:
        configure = Navigator.SceneConfigs.VerticalUpSwipeJump;
        break;
      case 8:
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
          params:{
            GotoPage: this.GotoPage.bind(this),
            PopPage: this.PopPage.bind(this),
          }
        }}
        configureScene={this.configureScene.bind(this)}
        renderScene={this.renderScene.bind(this)} />
    );
  }
  GotoPage(kind, index, params){
    params.GotoPage = this.GotoPage.bind(this);
    params.PopPage = this.PopPage.bind(this);
    params.App = this;
    this.setState({
      appStatus: index,
    });
    if (kind == Consts.NAVI_REPLACE){
      this._navigator.replace({
        Component: SceneList[index].Component,
        name: SceneList[index].name,
        index: SceneList[index].index,
        configure: SceneList[index].configure,
        params: params,
      });
    }else if (kind == Consts.NAVI_PUSH){
      this._navigator.push({
        Component: SceneList[index].Component,
        name: SceneList[index].name,
        index: SceneList[index].index,
        configure: SceneList[index].configure,
        params: params,
      });
    }else if (kind == Consts.NAVI_RESET) {
      this._navigator.resetTo({
        Component: SceneList[index].Component,
        name: SceneList[index].name,
        index: SceneList[index].index,
        configure: SceneList[index].configure,
        params: params,
      });
    }
  }
  PopPage(){
    var arrRoutes = this._navigator.getCurrentRoutes();//可以获取到所有压入栈中的界面。
    if (arrRoutes.length >= 2) {
      this.setState({
        appStatus: arrRoutes[arrRoutes.length-2].index,//index标识，也可以作为状态使用，两者是一样的值
      });
    }
    this._navigator.pop();
  }



  StartISE(msg, category, callback, fileName){
    this.category = category;
    this.Start(msg, category, fileName);
    this.pingceBack = callback;
  }
  Start(msg, category, fileName){
    if (this.speechStatus == XFiseBridge.SPEECH_STOP){
      // this.setState({tips:'正在倾听...'});
      var startInfo = {
        SAMPLE_RATE:'16000',
        TEXT_ENCODING : 'utf-8',
        ISE_RESULT_TYPE : 'xml',
        VAD_BOS : '5000',//静音超时时间，即用户多长时间不说话则当做超时处理vad_bos 毫秒 ms
        VAD_EOS : '1800',//后端点静音检测时间，即用户停止说话多长时间内即认为不再输入，自动停止录音 毫秒 ms
        ISE_CATEGORY : category,//read_syllable（单字，汉语专有）、read_word（词语）、read_sentence（句子）
        LANGUAGE : 'zh_cn',//en_us（英语）、zh_cn（汉语）
        ISE_RESULT_LEVEL : 'complete',
        SPEECH_TIMEOUT : '10000',//录音超时，录音达到时限时自动触发vad，停止录音，默认-1（无超时）
        TEXT : msg,//需要评测的内容
        ISE_AUDIO_PATH: fileName,
      };
      XFiseBridge.start(startInfo);
    }else if (this.speechStatus == XFiseBridge.SPEECH_WORK){
      XFiseBridge.stop();
    }else if (this.speechStatus == XFiseBridge.SPEECH_START){
      this.Cancel();
    }else if (this.speechStatus == XFiseBridge.SPEECH_RECOG){
      XFiseBridge.stop();
    }
  }
  Cancel(){
    if (this.speechStatus != XFiseBridge.SPEECH_STOP){
      XFiseBridge.cancel();
      this.speechStatus = XFiseBridge.SPEECH_STOP;
    }
  }
  iseVolume(data){
    var intV = parseInt(data.volume);
    if (this.pingceBack) {
        this.pingceBack('volume', intV);
      }
  }
  iseCallback(data){
    if (data.code == XFiseBridge.CB_CODE_RESULT){
      // this.setState({tips:'点击话筒开始说话'});
      this.resultParse(data.result);
      this.speechStatus = XFiseBridge.SPEECH_STOP;
    }
    else if (data.code == XFiseBridge.CB_CODE_ERROR){
      // this.setState({tips:'点击话筒开始说话'});
      // console.log(data.result);
      if (this.pingceBack) {
        // var arr = data.result.split('_');
        this.pingceBack('error', 0);
      }
      this.speechStatus = XFiseBridge.SPEECH_STOP;
    }
    else if (data.code == XFiseBridge.CB_CODE_STATUS){
      if (data.result == XFiseBridge.SPEECH_START){
        // this.setState({tips:'正在倾听...'});
      }else if (data.result == XFiseBridge.SPEECH_WORK){
        // this.setState({tips:'正在倾听...'});
      }else if (data.result == XFiseBridge.SPEECH_STOP){
        // this.setState({tips:'点击话筒开始说话'});
      }else if (data.result == XFiseBridge.SPEECH_RECOG){
        // this.setState({tips:'正在分析...'});
      }
      this.speechStatus = data.result;
    }
    else {
      console.log(data.result);
    }
  }
  InitPcm(filePath){
    var initInfo = {
      FILE_PATH: filePath,
    };
    XFiseBridge.initPcm(initInfo);
  }
  PlayPcm(){
    XFiseBridge.playPcm();
  }
  StopPcm(){
    XFiseBridge.stopPcm();
  }
  playCallback(data){
    if (data.status == XFiseBridge.PCM_TOTALTIME){
      console.log('total time:' + data.msg);
    }else if (data.status == XFiseBridge.PCM_PLAYOVER){
      console.log('play over! ' + data.msg);
    }else if (data.status == XFiseBridge.PCM_CURRENTTIME){
      console.log('current time:' + data.msg);
    }else if (data.status == XFiseBridge.PCM_ERROR){
      console.log('pcm error:' + data.msg);
    }
  }

  resultParse(result){
    var obj = eval('(' + result + ')');
    var isLost = false;
    var pointCount = 0;//总点数 = 字数X3；3表示声母，韵母，声调。详细规则可以再探讨
    var lostPoint = 0;
    if (this.category == 'read_syllable'){
      var syllable = obj.sentences[0].words[0].syllables[0];
      pointCount += 3;
      lostPoint += 3;
      if (Math.abs(syllable.shengmu.wpp) > 2){
        lostPoint--;
      }
      if (Math.abs(syllable.yunmu.wpp) > 2){
        lostPoint--;
      }
      if (Math.abs(syllable.yunmu.tgpp) > 1){
        lostPoint--;
      }
    }else if(this.category == 'read_word') {
      var word = obj.sentences[0].words[0];
      for(var idx=0;idx<word.syllables.length;idx++) {
        var syllable = word.syllables[idx];
        if (syllable.pDpMessage == '正常') {
          pointCount += 3;
          lostPoint += 3;
          if (Math.abs(syllable.shengmu.wpp) > 2){
            lostPoint--;
          }
          if (Math.abs(syllable.yunmu.wpp) > 2){
            lostPoint--;
          }
          if (Math.abs(syllable.yunmu.tgpp) > 1.6){
            lostPoint--;
          }
        }else if (syllable.pDpMessage == '漏读'){
          pointCount += 3;
        }else {
          if (syllable.pDpMessage == '增读') {
            lostPoint -= 1;
          }else if (syllable.pDpMessage == '回读') {
            lostPoint -= 1;
          }else if (syllable.pDpMessage == '替换') {
            lostPoint -= 1;
          }
        }
      }
    }else if (this.category == 'read_sentence') {
      var sentence = obj.sentences[0];
      for (var j=0;j<sentence.words.length;j++){
        var word = sentence.words[j];
        for(var idx=0;idx<word.syllables.length;idx++) {
          var syllable = word.syllables[idx];
          if (syllable.pDpMessage == '正常') {
            pointCount += 3;
            lostPoint += 3;
            if (Math.abs(syllable.shengmu.wpp) > 2){
              lostPoint--;
            }
            if (Math.abs(syllable.yunmu.wpp) > 2){
              lostPoint--;
            }
            if (Math.abs(syllable.yunmu.tgpp) > 1){
              lostPoint--;
            }
          }else if (syllable.pDpMessage == '漏读'){
            pointCount += 3;
          }else {
            if (syllable.pDpMessage == '增读') {
              lostPoint -= 1;
            }else if (syllable.pDpMessage == '回读') {
              lostPoint -= 1;
            }else if (syllable.pDpMessage == '替换') {
              lostPoint -= 1;
            }
          }
        }
      }
    }

    if (lostPoint < 0) lostPoint = 0;
    var score = lostPoint / pointCount * 100;
    console.log("score: " + score);

    this.pingceBack(obj, score);

    // this.setState({
    //   result:textResult,
    // });
  }
}
