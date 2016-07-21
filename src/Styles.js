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
var minUnit = ScreenWidth/100;

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
    backgroundColor: 'white',
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
    borderWidth: 1,
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
  addLessonBackStyle:{
    position: 'absolute',
    right: minUnit * 2,
    bottom: minUnit * 2,
  },
  addLessonButton:{
    width: minUnit*26,
    height: minUnit*10,
    backgroundColor:'rgb(255,90,0)'
  },
  addLessonButtonFont:{
    fontSize: minUnit * 4,
    color: 'white',
  },
  lessonsBack:{
    backgroundColor: '#FFFF',
  },
  lessonsTopBar:{
    height: ScreenHeight * 0.1,
    borderColor: '#CCC',
    borderBottomWidth: 1,
  },
  lessonsTopStyle:{
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: ScreenWidth * 0.03,
    marginTop: 20,
  },
  lessonsTopSearchCancel:{
    backgroundColor:'#0000', 
    width:50,
  },
  lessonsTopSearchView:{
    width: minUnit * 60,
    height: minUnit * 10,
    borderRadius: minUnit * 2,
    backgroundColor: '#EEE',
    marginRight: minUnit,
    alignItems: 'center',
    flexDirection:'row',
  },
  lessonsTopSearchIconStyle:{
    width: minUnit * 9,
    height: minUnit * 9,
  },
  lessonsTopInputStyle:{
    flex:1,
  },
  waitingAllBack:{
    position:'absolute',
    top:0,
    left:0,
    width: ScreenWidth,
    height: ScreenHeight,
    // backgroundColor:'black',
  },
  waitingBack:{
    width: minUnit * 26,
    height: minUnit * 26,
    borderRadius: minUnit * 4,
    backgroundColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingImageStyle:{
    width: minUnit * 15,
    height: minUnit * 15,
  },
  kindBoardView:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:'space-around',
    alignItems: 'center',
    padding: minUnit,
    backgroundColor: 'white',
  },
  kindBoardItemView:{
    width: minUnit * 24,
    height: minUnit * 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kindBoardItemIcon:{
    width: minUnit*14,
    height: minUnit*14,
    borderRadius: minUnit*7,
  },
  lesssonsScrollView:{
    width: ScreenWidth,
    height: ScreenHeight * 0.9,
  },
  boardLine:{
    width: ScreenWidth + MinWidth * 2,
    height: minUnit * 4,
    borderWidth: MinWidth,
    borderColor:'rgb(240,240,240)',
    backgroundColor: 'rgb(220,220,220)',
  },
  boardUpLine:{
    borderTopWidth: MinWidth,
    borderColor: 'rgb(240,240,240)',
  },
  boardDownLine:{
    borderBottomWidth: MinWidth,
    borderColor: 'rgb(240,240,240)',
  },
  lessonsBoardView:{
    justifyContent:'center',
    alignItems: 'center',
    padding: minUnit * 4,
  },
});

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
    borderWidth: 3,
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
    MinWidth,
};