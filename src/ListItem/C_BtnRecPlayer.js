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
export default class C_BtnRecPlayer extends Component {
    constructor(props) {
        super(props);
        this.pcmListener = null;
        this.audioCurrentTime = 0;
        this.audioTime = 0;
        // 初始状态
        this.state = {
            playerState: 0,//0:等待播放,1:播放中,2暂停播放
            scaleAnim: this.props.blnAnimate ? new Animated.Value(0) : new Animated.Value(1),
            progress:0,
        };
    }

    static defaultProps = {
        blnAnimate: PropTypes.bool,//是否有出现动画
        animateDialy: PropTypes.number,//如果blnAnimate为true,必须设置该值               
        recordName: PropTypes.string,//录音文件名
        btnCallback: PropTypes.func,
    };

    time = null;

    playerAudio = ()=> {//开始播放声音
        this.PlayPcm();
        this.time=setInterval(this.getNowTime, 100);
        this.setState({
            playerState: 1,
            progress:0,
        });
    }

    pauseAudio = ()=> {//暂停播放声音
        this.PausePcm();
        clearInterval(this.time);
        this.time = null;
        this.setState({
            playerState: 2,
        });
    }

    audioPlayerEnd = ()=> {//声音播放完毕时调用
        if(this.time == null)return;
        clearInterval(this.time);
        this.time = null;
        this.props.btnCallback("over");
        this.setState({
            playerState: 0,
            progress:0,//..解决再次播放进度条不归零问题
        });
    }
    stopAudio = ()=> {//强制停止声音播放--当播放时外界出现其他操作强行停止播放时调用
        if (this.state.playerState != 0) {//只有当已经启动播放后 此函数才起作用
            this.StopPcm();
            clearInterval(this.time);
            this.time = null;
            this.setState({
                playerState: 0,
                progress:0,//..解决再次播放进度条不归零问题
            });
        }
    }
    _onPress = ()=> {//发送点击事件
        if (this.state.playerState != 1) {
            this.props.btnCallback("play");
        } else {
            this.props.btnCallback("pause");
        }
    }
    
    updateFile(){
        this.pcmListener.remove();
        this.pcmListener = RCTDeviceEventEmitter.addListener('playCallback', this.playCallback.bind(this));
        this.InitPcm(this.props.recordName);
    }
    
    getNowTime = ()=> {
        this.GetCurrentTime();
    }

    async GetCurrentTime(){
        try{
            this.audioCurrentTime = await XFiseBridge.getPcmCurrentTime();
            if (this.time == null) return;
            this.setState({progress:this.audioCurrentTime/this.audioTime});

        }catch(error){
            console.log("GetCurrentTime", error);
        }
    }
    async InitPcm(filePath){
        var initInfo = {
            FILE_PATH: filePath,
            SAMPLE_RATE: '16000',
        };
        console.log("PCM filePath:",filePath);
        try{
            var ret = await XFiseBridge.initPcm(initInfo);
            this.audioCurrentTime = 0;
            this.audioTime  = ret;
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
        this.InitPcm(this.props.recordName);

        if (this.props.blnAnimate) {
            Animated.timing(this.state.scaleAnim, {
                toValue: 1,
                duration: 300,
                delay: this.props.animateDialy
            }).start(()=>{this.props.btnCallback("AnimOver")});
        }
    }

    componentWillUnmount() {
        this.pcmListener.remove();
        clearInterval(this.time);
        this.time = null;
    }

    shouldComponentUpdate(nextProps,nextStates) {
        var blnUpdate = false;

        if(nextStates.playerState != this.state.playerState){
            blnUpdate = true;
        }
        if(nextStates.scaleAnim != this.state.scaleAnim){
            blnUpdate = true;
        }
        if(nextStates.progress != this.state.progress){
            blnUpdate = true;
        }
        return blnUpdate;
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
        console.log("Render BtnRecPlayer");
        return (
            <Animated.View style={{transform:[{scale:this.state.scaleAnim}]}}>
                <TouchableOpacity onPress={this._onPress.bind(this)} activeOpacity={0.5}>
                    {/*上一句是为了仿流利说把点击效果取消,没有Touchwihtout是方便日后修改*/}
                    <View style={[styles.container]}>
                        {this.state.playerState != 0 &&
                        <Progress.Circle style={styles.progress} thickness={2} borderWidth={0}
                                         progress={this.state.progress} size={btnSize+4} color="#4ACE35"/>
                        }
                        {this.drawBtnPlayRecord()}
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }
    
    
}

const styles = StyleSheet.create({
    container: {//主背景
        width: btnSize+4,
        height: btnSize+4,
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

