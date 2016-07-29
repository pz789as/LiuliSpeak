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
} from 'react-native';

import {
  Scenes,
  Consts,
} from './Constant';

import SceneList from './SceneList';
import Storage from 'react-native-storage';
import fs from 'react-native-fs';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
      appStatus: Scenes.MAIN,//可以根据状态去做一些处理，比如顶部的状态栏显示与否。
      //初始化场景，调整其他界面时，可以更改为其他界面，通过该上面的值
    };
    global.logf = this.Logf.bind(this);
    global.fs = fs;
    if (Platform.OS == 'ios'){
      Text.defaultProps.allowFontScaling = false;//设置文字不受机器字体放大缩小的影响，这里是全局设定
    }
    this.createStorage();
    global.deleteFile = this.deleteFile.bind(this);
    global.app = this;
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
    if (nextState != this.nextState) return true;
    return false;
  }
  componentDidMount(){
  }
  componentWillUnmount(){
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
        configureScene={this.configureScene.bind(this)}
        renderScene={this.renderScene.bind(this)} />
    );
  }
  GotoPage(kind, index, params){
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
      size: 9999,    // 最大容量，默认值1000条数据循环存储
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
}
