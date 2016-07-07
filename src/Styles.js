/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  PixelRatio,
} from 'react-native';

import Dimensions from 'Dimensions';
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
let MinWidth = 1/PixelRatio.get();

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 40,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  registerInput:{
    width:ScreenWidth * 0.9,
    height: 35,
    fontSize: 14,
    marginHorizontal: ScreenWidth*0.05,
  },
  registerUnderLine:{
    width: ScreenWidth*0.9,
    height: 1,
    backgroundColor: '#808080',
    marginHorizontal: ScreenWidth*0.05,
  },

  //上面是测试用样式。。华丽分界线
  mainBottomBar:{
    backgroundColor: 'white',
    height: ScreenHeight * 0.1,
    borderTopWidth: 1,
    borderColor: '#CCC'
  },
  mainBottomView:{
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mainBottomButton:{
    width: ScreenHeight * 0.1,
    height: ScreenHeight * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainBottomIcon:{
    width: ScreenHeight * 0.06,
    height: ScreenHeight * 0.06,
    marginTop: ScreenHeight * 0.005,
  },
  mainBottomText:{
    marginTop: ScreenHeight * 0.005,
    width: ScreenHeight * 0.1,
    height: ScreenHeight * 0.03,
    fontSize: ScreenHeight * 0.03 * 0.7,
    textAlign:'center',
    color:'#CCC',
  },
  studyView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#F5F5F5',
  },
  studyTopBar:{
    height: ScreenHeight * 0.1,
    borderColor: '#CCC',
    borderBottomWidth: 1,
  },
  studyTopView:{
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: ScreenWidth * 0.03,
    marginTop: 20,
  },
  studyTopLeftText:{
    fontSize:20,
    color: '#AAA',
    textAlign: 'left',
  },
  studyTopRightText:{
    fontSize:20,
    color: '#AAA',
    textAlign: 'right',
  },
  studyTopMiddleText:{
    fontSize:24,
    color: '#888',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  studyList:{
    flex: 1,
    alignItems:'center',
    backgroundColor: '#EEEEEE'
  },
  fill:{
    flex: 1,
  },
  border:{
    borderColor:'#F25019',
    borderWidth: 1/PixelRatio.get(),
  },
  center:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  studySpacing:{
    marginVertical: 10,
  },
  horizontalList:{
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

var minUnit = ScreenWidth/100;
var UtilStyles = StyleSheet.create({
  back: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#0D220E',
  },
  font: {
    fontSize: minUnit*6,
    color: '#5E6261',
  },
  fontSmall: {
    fontSize: minUnit*4.5,
    color: '#202222',
  },
  shade: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: ScreenWidth,
    height: ScreenHeight,
    backgroundColor: 'rgba(10,10,10,0.3)',
  },
});

module.exports = {
    styles,
    ScreenWidth,
    ScreenHeight,
    UtilStyles,
    minUnit,
};