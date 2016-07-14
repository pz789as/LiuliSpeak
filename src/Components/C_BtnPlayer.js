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
}from 'react-native'
import {
    ImageRes
} from '../Resources';
import* as Progress from 'react-native-progress';//安装的第三方组件,使用方法查询:https://github.com/oblador/react-native-progress
import Sound from 'react-native-sound';
var Dimensions = require('Dimensions');
var totalWidth = Dimensions.get('window').width;
var totalHeight = Dimensions.get('window').height;
var fontSize = parseInt(totalWidth / 26);
var radioSize = fontSize * 4;
var btnSize = radioSize + 4;
export default class BtnPlayerRecording extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            playerStatus: 0,//0:等待播放,1:播放中,2暂停播放
            scaleAnim: this.props.blnAnimate ? new Animated.Value(0) : new Animated.Value(1),
            progress: 0,//进度条
        };
        this.dialogSound = null;
        this.time = null;
        this.audioCurrentTime = 0;//当前时间
        this.audioTimes = 0;//音频总时间
    }

    static defaultProps = {
        blnAnimate: PropTypes.bool,//是否有出现动画
        animateDialy: PropTypes.number,//如果blnAnimate为true,必须设置该值
        audioName: PropTypes.string,//音频文件名
        btnCallBack: PropTypes.func,
        rate: PropTypes.number,
    };

    handleInitDialog = (error)=> {
        if (error != null) {
            console.log('failed to load the sound! ', error.message);
        } else {
            console.log('success to load the sound');
            this.audioCurrentTime = 0;
            this.audioTimes = this.dialogSound.getDuration();
        }
    }
    initDialog = ()=> {
        var locFile = '/Users/guojicheng/Desktop/ReactNative/Projects/LiuliSpeak/sound/';
        locFile = '/Users/tangweishu/Desktop/mywork3/React-Native/LiuliSpeak/sound/'
        var path = locFile + this.props.audioName;
        console.log("this.props.audioName:", this.props.audioName);
        this.dialogSound = new Sound(this.props.audioName, Sound.DOCUMENT, this.handleInitDialog.bind(this));
    }
    releaseDialog = ()=> {
        clearInterval(this.time);
        this.stopAudio();
        if (this.dialogSound) {
            this.dialogSound.release();//释放掉音频
        }
    }

    playerAudio = ()=> {//开始播放声音
        this.setState({
            playerStatus: 1,
        });
        /*this.props.btnCallBack(1);
         this.dialogSound.setRate(this.props.rate);
         this.dialogSound.play(this.audioPlayerEnd);
         this.time=setInterval(this.getNowTime.bind(this),100);*/ //..状态到1时调用
    }

    pauseAudio = ()=> {//暂停播放声音


        this.setState({
            playerStatus: 2,
        });
        /*this.props.btnCallBack(2)
         this.dialogSound.pause();
         clearInterval(this.time);*/ //..状态到2时调用
    }

    audioPlayerEnd = ()=> {//声音播放完毕时调用

        clearInterval(this.time);
        this.time = null;
        this.setState({
            playerStatus: 0,
            progress: 0,//..解决再次播放进度条不归零问题
        });
        /*
         this.props.btnCallBack(0)
         clearInterval(this.time);
         */ //..状态到0时调用
    }
    stopAudio = ()=> {//强制停止声音播放--当播放时外界出现其他操作强行停止播放时调用
        if (this.state.playerStatus != 0) {//只有当已经启动播放后 此函数才起作用

            clearInterval(this.time);
            this.time = null;
            this.dialogSound.stop();
            this.setState({
                playerStatus: 0,
                progress: 0,//..解决再次播放进度条不归零问题
            });
            /*
             clearInterval(this.time);
             this.props.btnCallBack(0)
             */ //..状态到0时调用
        }
    }

    replayAudio = ()=> {//父组件中,接收到自动播放指令时,当前的item会调用这个播放函数
        if(this.state.playerStatus == 0){
            this.playerAudio();
        }else if(this.state.playerStatus == 1){
            this.dialogSound.setCurrentTime(0);
        }else{
            this.playerAudio();
        }
    }

    _onPress = ()=> {//发送点击事件        
        if (this.state.playerStatus != 1) {
            this.playerAudio();
        } else {
            this.pauseAudio();
        }
    }

    getNowTime = ()=> { //获取当前播放时间,当获取成功后,设置进度条数值

        this.dialogSound.getCurrentTime(
            (time)=> {
                //console.log("setState 4", this.props.audioName, this.blnRelease);
                if (!this.blnRelease) {
                    this.audioCurrentTime = time;
                    this.setState({progress: this.audioCurrentTime / this.audioTimes});
                }else{
                    console.log("要了亲命了,到底咋回事");
                }
            })
    }

    componentWillMount() {
        this.blnRelease = false;
        this.initDialog();
        if (this.props.blnAnimate) {
            Animated.timing(this.state.scaleAnim, {
                toValue: 1,
                duration: 300,
                delay: this.props.animateDialy
            }).start();
        }
    }

    componentDidUpdate(preProps, preStates) {
        if (preStates.playerStatus == this.state.playerStatus) return;
        if (this.state.playerStatus == 0) {
            this.props.btnCallBack(0)
        } else if (this.state.playerStatus == 1) {
            this.props.btnCallBack(1);
            this.dialogSound.setRate(this.props.rate);
            this.dialogSound.play(this.audioPlayerEnd);
            this.time = setInterval(this.getNowTime.bind(this), 100);
        } else if (this.state.playerStatus == 2) {
            this.props.btnCallBack(2);
            clearInterval(this.time);
            this.dialogSound.pause();
        }
    }

    componentWillUnmount() {

        this.blnRelease = true;
        //console.log("是不是在这里被release", this.props.audioName, this.blnRelease);
        this.releaseDialog();
    }

    drawBtnPlayAudio = ()=> { //0:等待播放,1:播放中,2暂停播放
        if (this.state.playerStatus == 0) {
            return (<Image style={styles.btnImg} source={ImageRes.btn_play}/>);
        } else if (this.state.playerStatus == 1) {
            return (<Image style={styles.btnImg} source={ImageRes.btn_pause}/>);
        } else {
            return (<Image style={styles.btnImg} source={ImageRes.btn_playing}/>);
        }
    }

    render() {
        return (
            <Animated.View style={{transform:[{scale:this.state.scaleAnim}]}}>
                <TouchableOpacity onPress={this._onPress.bind(this)} activeOpacity={1}>
                    {/*上一句是为了仿流利说把点击效果取消,没有Touchwihtout是方便日后修改*/}
                    <View style={[styles.container]}>
                        {this.state.playerStatus != 0 && this.state.progress > 0 &&
                        <Progress.Circle style={styles.progress} thickness={1} borderWidth={0}
                                         progress={this.state.progress} size={btnSize} color="#4ACE35"/>
                        }
                        {this.drawBtnPlayAudio()}
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
        marginHorizontal: fontSize / 2,
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
        backgroundColor: '#CCCCCC',
        borderRadius: (radioSize / 2),
    },
    btnImg: {
        width: radioSize,
        height: radioSize,
    },
})