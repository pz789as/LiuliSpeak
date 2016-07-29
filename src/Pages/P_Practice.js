'use strict';

import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    Text,
    PanResponder,
    InteractionManager,
} from 'react-native';

import {
    Consts,
    Scenes,
    getAudioFilePath,
} from '../Constant';

import {
    styles,
    ScreenWidth,
    ScreenHeight,
    UtilStyles,
    minUnit,
    MinWidth,
} from '../Styles';

import Sound from 'react-native-sound'

// import Practice from '../Components/C_Practice';

import {
    TopBar,
    ProgressBar,
    ViewList,
    BottomBar,
    ListView,
} from '../Practice';

class P_Practice extends Component {
    myLayout = null;//..
    blnInTouch = false;//..
    showKind = 2;
    speedKind = 1;
    constructor(props) {
        super(props);
        this.play_k = 0;
        this.gold = 0;
        // 初始状态     
        this.state = {
            touch: {blnTouch: false, tx: 0, ty: 0},
            // listDataSource: new ListView.DataSource({
            //     rowHasChanged:(oldRow, newRow)=>{oldRow !== newRow}
            // }),
            blnDraw:true,
        };
        this.useTime = new Date();
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState != this.state) return true;
        return false;
    }
    componentWillMount() {
        var time = new Date();
        logf("P_Parctice Will Mount:",time - this.useTime);
        this.useTime = time;
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

        // this.setState({
        //   listDataSource:this.state.listDataSource.cloneWithRows(this.props.dialogData),
        // });
    }

    componentDidMount() {
        var time = new Date();
        logf("P_Parctice Did Mount:",time - this.useTime);
        InteractionManager.runAfterInteractions(()=>{if(!this.state.blnDraw){this.setState({blnDraw:true})}})
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
        this.blnTouchPartice({tx:x, ty:y}); //将touch 对象往子组件中传递
    }
    levelPractice = (x, y)=> {//..
        this.refs.practice.setMoveEnd();
    }

    _onLayout = (event)=>{
        this.myLayout = event.nativeEvent.layout;//..获取当前组件的layout
    }

    blnTouchPartice = (touch)=>{ //..
        //判断当前的touch是否在自己的位置
        if(this.blnInTouch){
            if(!this.blnInRange(touch)){//如果touch在自己的位置
                //logf("手指离开了此区域");
                this.blnInTouch = false;
            }
            this.refs.ViewList.collisionItems(touch);//判断此手势是否在当前item的"句子"子组件上
        }else{
            if(this.blnInRange(touch)){//如果touch在自己的位置
                //logf("触碰我这儿了");
                this.refs.ViewList.collisionItems(touch);
                this.blnInTouch = true;
            }
        }
        return this.blnInTouch;
    }

    blnInRange=(touch)=>{//通过手势位置和本身位置,计算"碰撞" //..
        var layout = this.myLayout;
        let tx = touch.tx;
        let ty = touch.ty;
        if(ty > layout.y && ty < layout.y + layout.height){
            if(tx > layout.x && tx < layout.x + layout.width){
                return true;
            }
        }
        return false;
    }
    setMoveEnd = ()=>{//..
        this.blnInTouch = false;
        for(var i=0;i<this.props.dialogData.length;i++){
            if(this.refs[i].getTouchState()){
                this.refs[i].setMoveEnd();
            }
        }
    }
    /*<View style={ming.container} onLayout={this._onLayout.bind(this)} {...this._panResponder.panHandlers} >
     <TopBar onPressBack={this._onPressBack.bind(this)} />

     <ProgressBar GoldAllNum={this.getAllGold()} ref='ProgressBar' />

     <ViewList dialogData={this.props.dialogData} lessonID={this.props.lessonID}
     courseID={this.props.courseID} showKind={this.showKind} speedKind={this.speedKind} ref={'ViewList'}
     getGold={this.getGold.bind(this)} parents={this}
     />

     <BottomBar showKind={this.showKind} speedKind={this.speedKind}
     onPlay={this._onPlay.bind(this)} onPause={this._onPause.bind(this)}
     onStart={this._onStart.bind(this)}
     changePlayKind={this._changePlayK.bind(this)}
     changeOption={this._changeOption.bind(this)} ref={'BottomBar'} />
     </View>*/
    render() {
        logf('Hello Practice!');
        return (

            <View style={ming.container} onLayout={this._onLayout.bind(this)} {...this._panResponder.panHandlers} >
                {this.state.blnDraw&&
             <TopBar onPressBack={this._onPressBack.bind(this)} />}

                {this.state.blnDraw&&<ProgressBar GoldAllNum={this.getAllGold()} ref='ProgressBar' />}

                {this.state.blnDraw&&<ViewList dialogData={this.props.dialogData} 
                     showKind={this.showKind} speedKind={this.speedKind} ref={'ViewList'}
             getGold={this.getGold.bind(this)} parents={this}
             />}

                {this.state.blnDraw&&<BottomBar showKind={this.showKind} speedKind={this.speedKind}
             onPlay={this._onPlay.bind(this)} onPause={this._onPause.bind(this)}
             onStart={this._onStart.bind(this)}
             changePlayKind={this._changePlayK.bind(this)}
             changeOption={this._changeOption.bind(this)} ref={'BottomBar'} />}
             </View>
        );        
    }
    getAllGold(){
        return 20;
        var sum = 0;
        for(var i=0;i<this.props.dialogData.length;i++){
            sum += this.props.dialogData[i].gold;
        }
        return sum;
    }

    _onPressBack() {
        this._onPause();
        app.PopPage();
    }

    _onPlay() {
        this.refs.ViewList.setAutoplay(true);
        // this.refs.ViewList.onPlay();
    }

    _onPause() {
        this.refs.ViewList.setAutoplay(false);
        // this.refs.ViewList.onPause();
    }

    changePause() {
        this.refs.BottomBar._onPause();
    }

    _changePlayK(kind) {
        // 播放方式 0，播放一次 1，循环播放
        logf("kind: "+kind);
        this.refs.ViewList.setLoop(kind);
    }

    _onStart() {
        app.GotoPage(Consts.NAVI_PUSH, Scenes.EXAM,
            {
                dialogData: this.props.dialogData,   
                
            });
    }

    _changeOption(index, select) {
        this.refs.ViewList.changeShow(index, select);
    }
    // 添加金币（this.gold保存金币数，调用progressbar的getgold更新进度条）
    getGold(num) {
        this.gold += num;
        this.refs.ProgressBar.getGold(num);
    }

}

const ming = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
});

export default P_Practice;