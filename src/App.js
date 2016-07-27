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

export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
      appStatus: Scenes.MAIN,//可以根据状态去做一些处理，比如顶部的状态栏显示与否。
      //初始化场景，调整其他界面时，可以更改为其他界面，通过该上面的值
    };
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
    if (arrRoutes.length >= 2) {
      this.setState({
        appStatus: arrRoutes[arrRoutes.length-2].index,//index标识，也可以作为状态使用，两者是一样的值
      });
    }
    this._navigator.pop();
  }
}
