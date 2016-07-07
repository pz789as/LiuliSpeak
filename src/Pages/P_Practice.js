'use strict';

import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    PanResponder,
} from 'react-native';

import {
    Consts,
    Scenes,
} from '../Constant';

import {
    styles,
} from '../Styles';

import Practice from '../Components/C_Practice';

class P_Practice extends Component {
    play_k = 0;
    showKind = 2;
    speedKind = 2;
    gold = 0;

    constructor(props) {
        super(props);
        // 初始状态     
        this.state = {
            touch: {blnTouch: false, tx: 0, ty: 0},
        }
    }

    componentWillMount() {
        this._panResponder = null;
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (event, gestureState) =>false,
            onStartShouldSetPanResponderCapture: (event, gestureState) =>false,
            onMoveShouldSetPanResponder: (event, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (event, gestureState) => false,

            // 开始手势操作
            onPanResponderGrant: (event, gestureState) => {
                this.onWatchStart(event, gestureState);
            },
            // 移动操作
            onPanResponderMove: (event, gestureState) => {
                this.onWatchMove(event, gestureState);
            },
            // 释放手势
            onPanResponderRelease: (event, gestureState) => {
                this.onWatchEnd(event, gestureState);
            }
        });
    }

    onWatchStart = (event, gestureState)=> {
        let x = event.nativeEvent.pageX;
        let y = event.nativeEvent.pageY;
        this.collisionPractice(x, y);
        //..this.setState({touch: {blnTouch: true, tx: x, ty: y}});//如果显示手指位置,这个也不用了,下面几个也是,提升效率
    }
    onWatchMove = (event, gestureState)=> {
        let x = event.nativeEvent.pageX;
        let y = event.nativeEvent.pageY;
        this.collisionPractice(x, y);
        //..this.setState({touch: {blnTouch: true, tx: x, ty: y}});
    }
    onWatchEnd = (event, gestureState)=> {
        let x = this.state.touch.x;
        let y = this.state.touch.y;
        //..this.setState({touch: {blnTouch: false, tx: x, ty: y}});
        this.levelPractice(x, y);
    }
    collisionPractice = (x, y)=> { //..
        this.refs.practice.blnTouchPartice({tx:x, ty:y}); //将touch 对象往子组件中传递
    }
    levelPractice = (x, y)=> {//..
        this.refs.practice.setMoveEnd();
    }

    render() {
        return (
            <View {...this._panResponder.panHandlers} style={{flex:1}} >
                <Practice
                    ref={'practice'}
                    onPressBack={this._onPressBack.bind(this)}
                    onPlay={this._onPlay.bind(this)}
                    onPause={this._onPause.bind(this)}
                    changePlayKind={this._changePlayK.bind(this)}
                    onStart={this._onStart.bind(this)}
                    showKind={this.showKind}
                    speedKind={this.speedKind}
                    changeOption={this._changeOption.bind(this)}
                    gold={this.gold}
                    GoldAllNum={this.getAllGold()}
                    getGold={this.getGold.bind(this)}
                    dialogData={this.props.dialogData}
                    startRecord={this.startRecord.bind(this)}
                    stopRecord={this.stopRecord.bind(this)}/>
                {this.state.touch.blnTouch && <View style={{position:"absolute",top:this.state.touch.ty - 10, left:this.state.touch.tx - 10,
                        width:20,height:20,borderRadius:10,backgroundColor:'#ff000031',}}/>}
            </View>

        );
    }
    getAllGold(){
        var sum = 0;
        for(var i=0;i<this.props.dialogData.length;i++){
            sum += this.props.dialogData[i].gold;
        }
        return sum;
    }

    _onPressBack() {
        this.props.PopPage();
    }

    _onPlay() {
    }

    _onPause() {
    }

    _changePlayK(kind) {
        // 播放方式 0，播放一次 1，循环播放
    }

    _onStart() {
    }

    _changeOption(index, select) {
        // 显示，播放速度设置
        if (index == 0) {
            // 显示设置 0，中文  1，英文  2，中/英文
            this.showKind = select;
        } else {
            // 播放速度 0，0.6x  1，1x  2，1.4x
            this.speedKind = select;
        }
    }

    getGold(num) {
        this.gold = num;
    }

    startRecord(i){
        var testText = this.props.dialogData[i].cn.words;
        testText = testText.replace(/_/g, "");
        // console.log(testText + " " + i + " " + this.props.dialogData[i].Category);
        this.props.App.StartISE(testText, this.props.dialogData[i].Category, this.callback.bind(this));
    }
    stopRecord(i){
        this.props.App.Cancel();
    }
    stopRecordAuto(){
        this.refs.practice.stopRecordAuto();
    }
    callback(data, num){
        // console.log(data, num);
        if (data == 'error') {//返回错误
            this.stopRecordAuto();
        }else if (data == 'volume') {//返回音量
            console.log(num);
            this.refs.practice.recordVolume(num);
        }else {//正确获得结果之后
            console.log(data, num);
        }
    }
}

export default P_Practice;