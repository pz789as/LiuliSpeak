/**
 * Created by tangweishu on 16/6/27.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import ReactNative, {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    PixelRatio,
    Image,
}from 'react-native'
import {
    ImageRes
} from '../Resources';

import BtnPlayer from './C_BtnPlayer';
import BtnRecord from './C_BtnRecording';
import BtnQuestion from './C_BtnQuestion';
import Sentence from './C_Sentence';
import BtnRecPlayer from './C_BtnRecPlayer';

var Dimensions = require('Dimensions');
var totalWidth = Dimensions.get('window').width;
var totalHeight = Dimensions.get('window').height;
var fontSize = parseInt(totalWidth / 26);
var spacing = fontSize * 1;//内容之间的间距

export default class ListItem extends Component {
    height = 0;
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            score: this.props.itemScore,
            coins: this.props.itemCoins,//
            blnLow: false,
        };
    }

    myLayout = null;//记录item的位置
    contentLayout = null;//记录item中的内容部分view的位置
    blnInTouch = false;//一个标记,判断自己是否属于手势控制范围
    static defaultProps = {
        //itemIndex:PropTypes.number,//当前item在列表中的位置
        itemWordCN: PropTypes.object,//中文教学内容
        itemWordEN: PropTypes.string,//教学内容的英文翻译
        itemShowType: PropTypes.number,//当前item展示类型(0只显示中文,1只显示英文,2都显示 默认应该为2的)
        itemBlnSelect: PropTypes.bool,//当前的item是否被选中了
        itemScore: PropTypes.number,//从数据库中获取的分数
        itemCoins: PropTypes.number,//从数据库中获取的金币数量
        audio: PropTypes.string,
        startRecord: PropTypes.func,
        playEnd: PropTypes.func,
    };
    _onLayout = (event)=> {
        this.myLayout = event.nativeEvent.layout;
        var getHeight = this.myLayout.height;
        this.height = getHeight;
        //console.log('height:', getHeight)
        //console.log('6*fontSize', 6 * fontSize);
        if (getHeight < 5 * fontSize) { //当内容很少时,为了适配右下角金币显示的位置而做的特殊处理
            console.log('低于最小高度了亲...');
            this.setState({
                blnLow: true,
            });
        }
    }
    _onLayoutContentView = (event)=> {
        this.contentLayout = event.nativeEvent.layout;//获取contentView的位置,这个是要传递给子组件"句子".
    }
    callPlayStart = ()=> {
        this.refs.btnPlay.playerAudio();
    }
    callPlayStop = ()=> {
        this.refs.btnPlay.stopAudio();
        this.refs.btnRecPlay.stopAudio();
    }
    getScoreViewColor = function () {//通过当前分数获取 "分数"背景色
        let color = 'white';
        if (this.state.score >= 90) {
            color = '#49CD36';
        } else if(this.state.score>=60) {
            color = '#F2B225';
        } else{
            color = '#FF3B2F';
        }
        return color;
    }

    blnTouchItem = (touch, fatherLayout)=> { //从外面传递进来的手势位置 //..
        //判断当前的touch是否在自己的位置
        var colLayout = {
            x: this.myLayout.x + fatherLayout.x,
            y: this.myLayout.y + fatherLayout.y,
            w: this.myLayout.width,
            h: this.myLayout.height,
        };
        if (this.blnInTouch) {
            if (!this.blnInRange(touch, colLayout)) {//如果touch在自己的位置
                //console.log("手指离开了此区域");                               
                this.blnInTouch = false;
            }
            this.collisionSentence(touch, colLayout);//判断此手势是否在当前item的"句子"子组件上
        } else {
            if (this.blnInRange(touch, colLayout)) {//如果touch在自己的位置
                //console.log("触碰我这儿了");               
                this.collisionSentence(touch, colLayout);
                this.blnInTouch = true;
            }
        }

        return this.blnInTouch;
    }
    blnInRange = (touch, layout)=> {//通过手势位置和本身位置,计算"碰撞"
        let tx = touch.tx;
        let ty = touch.ty;
        if (ty > layout.y && ty < layout.y + layout.h) {
            if (tx > layout.x && tx < layout.x + layout.w) {
                return true;
            }
        }
        return false;
    }
    getTouchState = ()=> { //留给父组件调用的,判断当前组件是否被手指点中
        return this.blnInTouch;
    }
    setMoveEnd = ()=> {//留给父组件调用,手指离开屏幕时调用这个
        this.blnInTouch = false;
        if (this.refs.mySentence.getTouchState()) {
            this.refs.mySentence.setMoveEnd();
        }
    }
    collisionSentence = (touch, itemColLayout)=> {//将自己的layout以参数形式传递给子组件
        var layout = {
            x: itemColLayout.x + this.contentLayout.x,
            y: itemColLayout.y + this.contentLayout.y,
            wdith: itemColLayout.w,
            height: itemColLayout.h,
        }
        this.refs.mySentence.blnTouchSentence(touch, layout);//调用子组件的判断碰撞函数,将touch对象和myLayout传递给子组件
    }
    drawScore = ()=> {
        if (this.state.score >= 60) {
            return (
                <View style={[styles.scoreView,{backgroundColor:this.getScoreViewColor()}]}>
                    <Text style={{fontSize:fontSize,color:'#F0FFE7'}}>{this.state.score}</Text>
                </View>
            );
        } else {
            return (
                <View style={[styles.scoreView,{backgroundColor:this.getScoreViewColor()}]}>
                    <Image style={styles.badImage} source={ImageRes.icon_bad}>
                    <Text style={{fontSize:fontSize/2,color:'#F0FFE7'}}>{this.state.score}</Text>{/*唐7-12*/}
                    </Image>
                </View>
            );
        }
    }

    setRecordButtonVolume(volume){
        this.refs.btnRecord.setVolume(volume);
    }     
    
    stopRecordAuto(){
        this.refs.btnRecord.stopRecordAuto();
    }
    setPingceResult(result){//唐7-11
        //..console.log("运行C_listITEM 的 setPingceResult:"+result.blnSuccess + result.score+result.syllableScore);syllableScore
        const {blnSuccess,score,syllableScore,errorMsg} = result;
        if(blnSuccess){
            this.refs.mySentence.setPingce(syllableScore);
            var rndScore = Math.min(95,score) - 3 + parseInt(Math.random()*6);
            if(syllableScore < 60){ //如果没及格,就别给随机分数了
                rndScore = syllableScore;
            }
            this.setState({score:rndScore});
        }else{
            if(errorMsg == 0){
                console.log("未知的异常");
            }else{
                console.log("讯飞返回的错误代码:",errorMsg);
            }
            this.refs.mySentence.setPingce("error");
            this.setState({score:0});
        }
        
    }
    render() {
        const {itemIndex, itemWordCN, itemWordEN, itemShowType, itemBlnSelect} = this.props;//获取属性值

        return (
            <View style={[styles.container,{backgroundColor:itemBlnSelect?'#FFFFFF':'#EBEBEB'}]}
                  onLayout={this._onLayout.bind(this)}>
                <View style={styles.leftView}>
                    <View style={styles.iconImage}/>
                </View>
                <View style={styles.contentView} onLayout={this._onLayoutContentView.bind(this)}>
                    {/*当属性showType不为只显示英文时,显示这个text*/}

                    {(itemShowType != 1) &&
                    <Sentence ref="mySentence" style={styles.textWordCN} words={itemWordCN.words}
                              pinyins={itemWordCN.pinyins}
                              touch={this.state.touch}/> }
                    {/*当属性showType不为只显示中文时,显示这个text*/}
                    {(itemShowType != 0) && <Text style={[styles.textWordEN]}>{itemWordEN}</Text>}

                    
                    {itemBlnSelect &&
                    <View style={styles.operateView}>
                        <BtnPlayer blnAnimate={true} animateDialy={0} playerType={0} audioName={this.props.audio}
                                   playEnd={this.props.playend} ref={'btnPlay'}/>
                        <BtnRecord blnAnimate={true} animateDialy={100} startRecord={this.props.startRecord}
                                ref={'btnRecord'} stopRecord={this.props.stopRecord}/>
                        <BtnRecPlayer blnAnimate={true} animateDialy={150} playerType={1} audioName={this.props.recAudio}
                                ref={'btnRecPlay'}/>
                        <BtnQuestion blnAnimate={true} animateDialy={200}/>
                    </View>}
                     
                </View>

                <View style={styles.rightView}>
                    {this.drawScore()}
                </View>

                {(this.state.coins > 0) &&
                <View style={[styles.coinView,this.state.blnLow&&{bottom:2/PixelRatio.get()}]}>
                    <Text style={styles.coinText}>{this.state.coins}</Text>
                    <Image style={styles.coinImage} source={ImageRes.icon_coin_s}/>
                </View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {//主背景
        flexDirection: 'row',
        width: totalWidth,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#CBCBCB',
        paddingTop: spacing,//给个1个汉字大小的内边距
        //justifyContent:'space-between',
    },
    leftView: {
        //backgroundColor:'blue',
        width: 3 * fontSize,//唐7-12
        alignItems: 'center',
        marginBottom: spacing,
    },
    contentView: {//中间的内容栏
        //backgroundColor:'yellow',
        width: totalWidth - fontSize * 6,//唐7-12
        justifyContent: 'space-between',
        paddingRight: 0.5 * fontSize,
    },
    rightView: {//右侧的信息栏,显示分数和金币信息的
        //backgroundColor:'blue',
        width: 3 * fontSize,//唐7-12
        alignItems: 'center',
        marginBottom: spacing,
    },
    textWordCN: {//汉语内容的样式        
        marginBottom: spacing,
    },
    textWordEN: {//英文翻译的样式
        fontSize: fontSize,
        color: '#757575',
        marginBottom: spacing,
    },
    operateView: {//操作按钮的背景界面
        //height: 3 * fontSize,
        flexDirection: 'row',
        //backgroundColor:'yellow',
        marginBottom: spacing,
        alignItems: 'center',
    },
    iconImage: {
        width: fontSize * 2.5,
        height: fontSize * 2.5,
        borderRadius: fontSize * 2.5 / 2,
        backgroundColor: 'gray',
    },
    scoreView: {//分数情况
        width: fontSize * 2.5,
        height: fontSize * 2.5,
        borderRadius: fontSize * 2.5 / 2,
        //backgroundColor:'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badImage: {
        width: fontSize * 2.5,
        height: fontSize * 2.5,
        alignItems: 'center',//唐7-12
        justifyContent: 'center',//唐7-12
    },
    coinView: {//金币背景
        position: 'absolute',
        right: fontSize / 2,
        bottom: fontSize / 2,
        flexDirection: 'row',
        width: fontSize * 1.2,
        height: fontSize,
        //backgroundColor:'yellow',
    },
    coinText: {//金币的数量样式
        position: 'absolute',
        fontSize: fontSize / 2,
        width: fontSize / 2,
        color: '#757575',
        left: 2 / PixelRatio.get(),
        top: fontSize / 2 - 4 / PixelRatio.get(),
        //backgroundColor:'white',
    },
    coinImage: {//金币图标样式
        width: fontSize / 2,
        height: fontSize / 2,
        borderRadius: fontSize / 4,
        backgroundColor: '#EF911D',
        top: fontSize / 2 - 2 / PixelRatio.get(),
        left: fontSize / 2,
    },

});