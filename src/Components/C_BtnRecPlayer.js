/**
 * Created by tangweishu on 16/6/28.
 */

'use strict';
import React, {Component, PropTypes} from 'react';
import ReactNative, {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Animated,
    PixelRatio,
    NativeModules,
}from 'react-native'
import {
    ImageRes
} from '../Resources';
import* as Progress from 'react-native-progress';//安装的第三方组件,使用方法查询:https://github.com/oblador/react-native-progress

var XFiseBridge = NativeModules.XFiseBridge;
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

var Dimensions = require('Dimensions');
var totalWidth = Dimensions.get('window').width;
var totalHeight = Dimensions.get('window').height;
var fontSize = parseInt(totalWidth / 26);
var radioSize = fontSize * 4;
var btnSize = radioSize + 4;
export default class BtnPlayerRecording extends Component {
    constructor(props) {
        super(props);
        this.pcmListener = null;
        // 初始状态
        this.state = {
            playerState: 0,//0:等待播放,1:播放中,2暂停播放
            scaleAnim: this.props.blnAnimate ? new Animated.Value(0) : new Animated.Value(1),
            audioCurrentTime:0,//当前时间
            audioTimes:0,//音频总时间
        };
    }

    static defaultProps = {
        blnAnimate: PropTypes.bool,//是否有出现动画
        animateDialy: PropTypes.number,//如果blnAnimate为true,必须设置该值
        playerType: PropTypes.oneOf([0, 1]),//播放的类型:0:音频 1:录音
        audioName: PropTypes.string,//音频文件名
        recordName: PropTypes.string,//录音文件名
        playEnd:PropTypes.func,
    };

    dialogSound = null;//定义一个播放对象
    time = null;
    blnReady = false;
    blnPlay = false;
    blnStop = false;

    playerAudio = ()=> {//开始播放声音
        if (!this.blnReady) {
            this.blnPlay = true;
            return;
        }
        this.setState({
            playerState: 1,
        });
        this.blnStop = false;
        this.PlayPcm();
        this.time=setInterval(this.getNowTime, 100);
    }

    pauseAudio = ()=> {//暂停播放声音
        this.setState({
            playerState: 2,
        });
        this.PausePcm();
        clearInterval(this.time);
    }

    audioPlayerEnd = ()=> {//声音播放完毕时调用
        this.setState({
            playerState: 0,
            audioCurrentTime:0,//..解决再次播放进度条不归零问题
        });
        clearInterval(this.time);
        if (this.props.playerType == 0){
            this.props.playEnd();
        }
        this.blnStop = true;
    }
    stopAudio = ()=> {//强制停止声音播放--当播放时外界出现其他操作强行停止播放时调用
        if (this.state.playerState != 0) {//只有当已经启动播放后 此函数才起作用
            this.setState({
                playerState: 0,
                audioCurrentTime:0,//..解决再次播放进度条不归零问题
            });
            this.StopPcm();
            clearInterval(this.time);
            this.blnStop = true;
        }
    }
    _onPress = ()=> {//发送点击事件
        if (this.state.playerState != 1) {
            this.playerAudio();
        } else {
            this.pauseAudio();
        }
    }
    getNowTime = ()=> {
        this.GetCurrentTime();
    }

    getProgressValue = ()=> {//获取播放进度
        return this.state.audioCurrentTime / this.state.audioTimes;
    }
    async GetCurrentTime(){
        try{
            var ret = await XFiseBridge.getPcmCurrentTime();

            // console.log('current time:' + ret);
            if (this.blnStop) return;
            this.setState({audioCurrentTime: ret});
        }catch(error){
            console.log("GetCurrentTime", error);
        }
    }
    async InitPcm(filePath){
        var initInfo = {
            FILE_PATH: filePath,
            SAMPLE_RATE: '16000',
        };
        try{
            var ret = await XFiseBridge.initPcm(initInfo);
            
            // console.log('total time:' + ret);

            this.setState({
                audioCurrentTime : 0,
                audioTimes : ret,
            });
            this.blnReady = true;
            if (this.blnPlay) {
                this.playerAudio();
                this.blnPlay = false;
            }
        }catch(error){
            console.log('InitPcm', error);
        }
    }
    PlayPcm(){
        XFiseBridge.playPcm();
    }
    StopPcm(){
        XFiseBridge.stopPcm();
    }
    PausePcm(){
        XFiseBridge.pausePcm();
    }
    playCallback(data){
        if (data.status == XFiseBridge.PCM_TOTALTIME){
            
        }else if (data.status == XFiseBridge.PCM_PLAYOVER){
            console.log('play over! ' + data.msg);
            this.audioPlayerEnd();
        }else if (data.status == XFiseBridge.PCM_CURRENTTIME){
            
        }else if (data.status == XFiseBridge.PCM_ERROR){
            
        }
    }
    
    componentDidMount() {
        this.pcmListener = RCTDeviceEventEmitter.addListener('playCallback', this.playCallback.bind(this));
        this.InitPcm(this.props.audioName);

        if (this.props.blnAnimate) {
            Animated.timing(this.state.scaleAnim, {
                toValue: 1,
                duration: 300,
                delay: this.props.animateDialy
            }).start();
        }
        this.blnReady = false;
    }

    componentWillUnmount() {
        this.pcmListener.remove();
        clearInterval(this.time);
    }
    drawBtnPlayAudio=()=>{ //0:等待播放,1:播放中,2暂停播放
        if(this.state.playerState == 0){
            return(<Image style={styles.btnImg} source = {ImageRes.btn_play}/>);
        }else if(this.state.playerState == 1){
            return(<Image style={styles.btnImg} source = {ImageRes.btn_pause}/>);
        }else{
            return(<Image style={styles.btnImg} source = {ImageRes.btn_playing}/>);
        }
    }
    drawBtnPlayRecord=()=>{
        if(this.state.playerState == 0){
            return(
                <View style={styles.radio} overflow="hidden">
                    <Image style={[styles.btnImg,]} source={ImageRes.default_avatar}/>
                    <Image style={[styles.btnImg,{position:"absolute",left:0,top:0}]} source={ImageRes.icon_play_light_m}/>
                </View> );
        }else if(this.state.playerState == 1){
            return(
                <View style={styles.radio} overflow="hidden">
                    <Image style={[styles.btnImg,]}source={ImageRes.default_avatar}/>
                    <Image style={[styles.btnImg,{position:"absolute",left:0,top:0}]} source={ImageRes.icon_pause_light_m}/>
                </View> );
        }else{
            return(
                <View style={styles.radio} overflow="hidden">
                    <Image style={[styles.btnImg,]}source={ImageRes.default_avatar}/>
                    <Image style={[styles.btnImg,{position:"absolute",left:0,top:0}]} source={ImageRes.icon_play_light_m}/>
                </View> );
        }
    }
    render() {
        return (
            <Animated.View style={{transform:[{scale:this.state.scaleAnim}]}}>
                <TouchableOpacity onPress={this._onPress.bind(this)} activeOpacity={1}>
                    {/*上一句是为了仿流利说把点击效果取消,没有Touchwihtout是方便日后修改*/}
                    <View style={[styles.container]}>
                        {this.state.playerState != 0 &&
                        <Progress.Circle style={styles.progress} thickness={1} borderWidth={0}
                                         progress={this.getProgressValue()} size={btnSize} color="#4ACE35"/>
                        }

                        {this.props.playerType!=1?this.drawBtnPlayAudio():this.drawBtnPlayRecord()}
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}



const styles = StyleSheet.create({
    container: {//主背景
        width: btnSize,
        height: btnSize,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: fontSize/2,
        //backgroundColor:'#00000035'
    },
    progress: {
        position: 'absolute',
        left: 0,
        top: 0,
    },
    radio: {
        width: radioSize,
        height: radioSize,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#CCCCCC',
        borderRadius: (radioSize / 2),
    },
    btnImg:{
        width: radioSize,
        height: radioSize,
    },

})