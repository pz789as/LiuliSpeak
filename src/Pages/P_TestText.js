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
  PanResponder,
  PixelRatio,
} from 'react-native';

// import {
//   styles,
// } from '../Styles';

import {
  Consts,
  Scenes,
} from '../Constant';

var Dimensions = require('Dimensions');
var totalWidth = Dimensions.get('window').width;
var totalHeight = Dimensions.get('window').height;
var fontSize = parseInt(totalWidth / 26);

var CIRCLE_SIZE = 80;
var REACT_SIZE = fontSize * 1.5;

export default class P_TestText extends Component {
  constructor(props){
    super(props);
    this._panResponder = {};
    this.rect = null;
    this.state={
      text: '你们好呀。啊啊！啊啊，啊啊啊啊啊啊啊啊，啊啊啊啊啊啊啊啊，啊啊啊啊啊啊啊啊，啊啊啊啊啊啊啊啊，啊啊啊啊啊啊啊啊，啊啊啊啊啊啊啊啊，啊啊啊啊啊啊啊啊，啊啊啊啊啊啊啊啊，啊',
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state) return true;
    return false;
  }
  componentWillMount(){
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder.bind(this),
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder.bind(this),
      onPanResponderGrant: this._handlePanResponderGrant.bind(this),
      onPanResponderMove: this._handlePanResponderMove.bind(this),
      onPanResponderRelease: this._handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
    });
    this._rectLeft = -1000;
    this._rectTop = 84;
    this._rectStyles = {
      style:{
        left: this._rectLeft,
        top: this._rectTop,
        width: REACT_SIZE,
        height: REACT_SIZE,
        backgroundColor: '#CCC',
      }
    }
    this.touchMsg = {
      lx: 0, ly: 0, px: 0, py: 0,
      obj: null,
    };
  }
  _handleStartShouldSetPanResponder(event, gesture){
    return true;
  }
  _handleMoveShouldSetPanResponder(event, gesture){
    return true;
  }
  _handlePanResponderGrant(event, gesture){
    // logf(event, gesture);
    
    this.touchMsg.lx = event.nativeEvent.locationX;
    this.touchMsg.ly = event.nativeEvent.locationY;
    this.touchMsg.px = event.nativeEvent.pageX;
    this.touchMsg.py = event.nativeEvent.pageY;
    // logf(this.touchMsg);
  }
  _handlePanResponderMove(event, gesture){
    // logf(event, gesture);
    // this._rectStyles.style.left = this._rectLeft + gesture.dx;
    // this._rectStyles.style.top = this._rectTop + gesture.dy;

    this._updateNativeStyles();
  }
  _handlePanResponderEnd(event, gesture){
    // logf(event, gesture);
    // this._rectLeft += gesture.dx;
    // this._rectTop += gesture.dy;
  }
  componentDidMount(){
    this._updateNativeStyles();
  }
  componentWillUnmount(){
  }
  GotoLogin(){
    app.PopPage();
  }
  render() {
    return (
      <View style={[styles.container, {borderWidth:1,borderColor:'red'}]}>
        <View ref={(rect)=>{this.rect = rect;}} style={styles.rect} />
        <Text style={styles.welcome} 
          {...this._panResponder.panHandlers}
          onLayout={this._textLayout.bind(this)}
          onPress={this._textPress.bind(this)}>
          {this.state.text}
        </Text>
      </View>
    );
  }
  _textLayout(event){
    // logf(event.nativeEvent);
    this.touchMsg.obj = event.nativeEvent.layout;
  }
  _textPress(){
    // logf(this.touchMsg);
    var ratio = 1;//PixelRatio.get();
    var newIdx = [];
    var totalAdd = 0;
    var lineValue = parseInt(this.touchMsg.obj.width / (REACT_SIZE * ratio));
    for(var i=0;i<this.state.text.length;i++){
      if (i+1 < this.state.text.length && 
          (i+1)%lineValue == (lineValue - totalAdd)%lineValue &&
          !this.checkChinese(this.state.text[i+1]) && 
          this.checkChinese(this.state.text[i]) ){
            totalAdd = (totalAdd+1)%lineValue;
            newIdx.push(-1);
            newIdx.push(i);
      }else{
        newIdx.push(i);
      }
    }

    var length = parseInt(this.state.text.length * REACT_SIZE * ratio);
    var x = parseInt(this.touchMsg.lx / (REACT_SIZE * ratio));
    var y = parseInt(this.touchMsg.ly / (REACT_SIZE * ratio));
    var index = x + y * lineValue;
    var dx = this.touchMsg.lx - this.touchMsg.px;
    var dy = this.touchMsg.ly - this.touchMsg.py;
    var px = x * REACT_SIZE;
    var py = y * REACT_SIZE;
    // if ((index+1) < this.state.text.length){
    //   if ((index+1) % lineValue == )
    //   if (this.checkChinese(this.state.text[index])){

    //   }
    // }
    var realIdx = newIdx[index];
    if (realIdx < this.state.text.length && realIdx >= 0) {
      //logf('touch ', index, ' syllable!');
      this._rectStyles.style.left = px - dx;
      this._rectStyles.style.top = py - dy + y*1.1;
      this._updateNativeStyles(); 
    }else{
      this._rectStyles.style.left = -1000;
      this._updateNativeStyles();
    }
  }
  _updateNativeStyles(){
    this.rect && this.rect.setNativeProps(this._rectStyles);
  }
  checkChinese(text){
    var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
    return reg.test(text);
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: REACT_SIZE,
    backgroundColor: '#0000',
  },
  rect:{
    width: REACT_SIZE,
    height: REACT_SIZE,
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: '#CCC',
  },
});

