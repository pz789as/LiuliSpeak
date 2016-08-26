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


export default class BtnPlayer extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            playerStatus: 0,//0:等待播放,1:播放中,2暂停播放
            //scaleAnim: this.props.blnAnimate ? new Animated.Value(0) : new Animated.Value(1),
            progress: 0,//进度条
        };
        this.time = null;
        this.dialogSound = null;
        this.audioCurrentTime = 0;//当前时间
        this.audioTimes = 0;//音频总时间
        this.useTime = new Date();
        this.unLoadPlay = false;//判断是否在声音未载入时,就调用到播放函数
    }

    static propTypes = {
        //blnAnimate: PropTypes.bool,//是否有出现动画
        //animateDialy: PropTypes.number,//如果blnAnimate为true,必须设置该值
        audioName: PropTypes.string,//音频文件名
        btnCallback: PropTypes.func,
        rate: PropTypes.func,
    };

    static defaultProps = {
        //blnAnimate: false,
        rate: ()=>1,
        //animateDialy: 0,
    }

    handleInitDialog = (error)=> {
        if (error != null) {
            console.log('failed to load the sound! ', error.message);
        } else {
            console.log('success to load the sound');
            if (this.dialogSound != null) {
                this.audioCurrentTime = 0;
                this.audioTimes = this.dialogSound.getDuration();
                if (this.unLoadPlay) {
                    this.unLoadPlay = false;
                    this.playerAudio();
                }
            }
        }
    }
    initDialog = ()=> {
        this.dialogSound = new Sound(this.props.audioName, Sound.DOCUMENT, this.handleInitDialog.bind(this));
    }

    releaseDialog = ()=> {
        this.stopAudio();
        if (this.dialogSound) {
            this.dialogSound.release();//释放掉音频
            this.dialogSound = null;
        }
    }

    playerAudio = (rate = 1)=> {//开始播放声音
        if (this.audioTimes == 0) {//表示声音未被成功载入
            console.log("本次播放由于没有载入声音而未能成功")
            this.unLoadPlay = true;
            return;
        }
        console.log(" Run to playerAudio")
        this.dialogSound.setRate(rate);
        this.dialogSound.play(this.audioPlayerEnd);
        this.time = setInterval(this.getNowTime.bind(this), 100);
        this.setState({
            playerStatus: 1,
        });
    }

    pauseAudio = ()=> {//暂停播放声音
        clearInterval(this.time);
        this.time = null;
        this.dialogSound.pause();
        this.setState({
            playerStatus: 2,
        });
    }

    audioPlayerEnd = ()=> {//声音播放完毕时调用
        if (this.time == null) return;
        clearInterval(this.time);
        this.time = null;
        this.setState({
            playerStatus: 0,
            progress: 0,//..解决再次播放进度条不归零问题
        });
        this.props.btnCallback("over");
    }
    stopAudio = ()=> {//强制停止声音播放--当播放时外界出现其他操作强行停止播放时调用
        if (this.unLoadPlay) {
            console.log("应该是极小概率事件")
            this.unLoadPlay = false;
        }
        if (this.state.playerStatus != 0) {//只有当已经启动播放后 此函数才起作用
            clearInterval(this.time);
            this.time = null;
            this.dialogSound.stop();
            this.setState({
                playerStatus: 0,
                progress: 0,//..解决再次播放进度条不归零问题
            });
        }
    }

    replayAudio = (rate = 1)=> {//父组件中,接收到自动播放指令时,当前的item会调用这个播放函数
        logf("Going TO RelplayAudio", this.state.playerStatus);
        if (this.state.playerStatus == 0) {
            this.playerAudio(rate);
        } else if (this.state.playerStatus == 1) {
            this.dialogSound.setRate(rate);
            this.dialogSound.setCurrentTime(0);
            this.playerAudio(rate);
        } else {
            this.playerAudio(rate);
        }
    }

    _onPress = ()=> {//发送点击事件
        if (practiceInAutoplay)return;
        logf("onPress BtnPlayer:", this.state.playerStatus);
        if (this.state.playerStatus != 1) {
            this.props.btnCallback("play");
        } else {
            logf("onPress Pause:", this.audioCurrentTime, this.audioTimes)
            if (this.audioCurrentTime < this.audioTimes * 0.9) {
                this.props.btnCallback("pause");
            }

        }
    }

    getNowTime = ()=> { //获取当前播放时间,当获取成功后,设置进度条数值
        if (this.dialogSound) {
            this.dialogSound.getCurrentTime(
                (time)=> {
                    if (this.time) {
                        this.audioCurrentTime = time;
                        this.setState({progress: this.audioCurrentTime / this.audioTimes});
                    }
                })
        }
    }

    componentWillMount() {
        this.initDialog();
        /*
         if (this.props.blnAnimate) {
         Animated.timing(this.state.scaleAnim, {
         toValue: 1,
         duration: 300,
         delay: this.props.animateDialy
         }).start(()=> {
         this.props.btnCallback("AnimOver");
         });
         }*/
    }

    componentDidMount() {

    }

    componentDidUpdate(preProps, preStates) {

    }

    componentWillUnmount() {
        this.releaseDialog();
    }

    shouldComponentUpdate(nextProps, nextStates) {
        var blnUpdate = false;

        if (nextStates.playerStatus != this.state.playerStatus) {
            blnUpdate = true;
        }

        /*if (nextStates.scaleAnim != this.state.scaleAnim) {
         blnUpdate = true;
         }*/
        if (nextStates.progress != this.state.progress) {
            blnUpdate = true;
        }
        return blnUpdate;
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
            <TouchableOpacity style={[styles.container]} onPress={this._onPress.bind(this)} activeOpacity={1}>
                {this.state.playerStatus != 0 && this.state.progress > 0 &&
                <Progress.Circle style={styles.progress} thickness={2} borderWidth={0}
                                 progress={this.state.progress } size={btnSize+4} color="#4ACE35"/>
                }
                {this.drawBtnPlayAudio()}
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    container: {//主背景
        width: btnSize + 4,
        height: btnSize + 4,
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