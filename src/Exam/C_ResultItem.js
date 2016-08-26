/**
 * Created by tangweishu on 16/8/14.
 */
import React, {Component, PropTypes} from 'react'
import {View, Text, Image, ListView, StyleSheet, TouchableOpacity, NativeModules, ProgressViewIOS} from 'react-native'
/*
import {
    getExamFilePath,
    getMp3FilePath,
    Consts,
    Scenes,
} from '../Constant';
import {
    ImageRes,
} from '../Resources';*/
import {
    minUnit,
    ScreenWidth,
    ScreenHeight,
    MinWidth,
} from '../Styles';
import Sentence from '../Practice/C_NewSentence';
import ScoreCircle from '../Common/ScoreCircle'
var XFiseBridge = NativeModules.XFiseBridge;
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

var fontSize = parseInt(minUnit * 4);
export default class ResultItem extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.pcmListener = null;
        this.audioCurrentTime = 0;
        this.audioTime = 0;
        this.time = null;//定时器
        this.state = {
            progress: 0,
        };
        this.playerState = 0;//0:等待播放,1:播放中
    }

    static propTypes = {
        blnPlay:PropTypes.bool,
        blnReplay:PropTypes.bool,
        itemIndex: PropTypes.number,
        itemWords: PropTypes.string,
        itemPinyins: PropTypes.string,
        itemEN: PropTypes.string,
        arrSyllableScore: PropTypes.array,
        sentenceScore: PropTypes.number,
        recordName: PropTypes.string,//录音文件名
        itemCallback: PropTypes.func,
    };
    static defaultProps = {};


    playerAudio = ()=> {//开始播放声音
        logf("Run PlayerAudio:", this.audioTime);
        this.PlayPcm();
        this.time = setInterval(this.getNowTime, 50);
        this.playerState = 1;
        this.setState({
            progress: 0,
        });
    }

    pauseAudio = ()=> {//暂停播放声音
        this.PausePcm();
        clearInterval(this.time);
        this.time = null;
        this.playerState = 2;
    }

    audioPlayerEnd = ()=> {//声音播放完毕时调用
        if (this.time == null)return;
        clearInterval(this.time);
        this.time = null;
        this.playerState = 0;
        this.setState({
            progress: 0,//..解决再次播放进度条不归零问题
        });
        this.props.itemCallback("over", this.props.itemIndex);
    }
    stopAudio = ()=> {//强制停止声音播放--当播放时外界出现其他操作强行停止播放时调用
        if (this.playerState != 0) {//只有当已经启动播放后 此函数才起作用
            this.StopPcm();
            clearInterval(this.time);
            this.time = null;
            this.playerState = 0;
            this.setState({
                progress: 0,//..解决再次播放进度条不归零问题
            });
        }
    }

    getNowTime = ()=> {
        this.GetCurrentTime();
    }

    async GetCurrentTime() {
        try {
            this.audioCurrentTime = await XFiseBridge.getPcmCurrentTime();
            if (this.time == null) return;
            this.setState({progress: this.audioCurrentTime / this.audioTime});

        } catch (error) {
            logf("GetCurrentTime", error);
        }
    }

    async InitPcm() {
        var filePath = this.props.recordName;
        logf("PCM filePath:", this.props.itemIndex, filePath);
        var initInfo = {
            FILE_PATH: filePath,
            SAMPLE_RATE: '16000',
        };

        try {
            var ret = await XFiseBridge.initPcm(initInfo);
            this.audioCurrentTime = 0;
            this.audioTime = ret;
            this.playerAudio();
        } catch (error) {
            logf('InitPcm', error);
        }
    }

    PlayPcm() {
        XFiseBridge.playPcm();
    }

    StopPcm() {
        XFiseBridge.stopPcm();
    }

    PausePcm() {
        XFiseBridge.pausePcm();
    }

    playCallback(data) {
        if(!this.props.blnPlay)return;//阻止原生那边额外的回调
        if (data.status == XFiseBridge.PCM_TOTALTIME) {

        } else if (data.status == XFiseBridge.PCM_PLAYOVER) {
            logf('play over! ' + data.msg);
            this.audioPlayerEnd();
        } else if (data.status == XFiseBridge.PCM_CURRENTTIME) {

        } else if (data.status == XFiseBridge.PCM_ERROR) {

        }
    }

    componentDidMount() {
        this.pcmListener = RCTDeviceEventEmitter.addListener('playCallback', this.playCallback.bind(this));
        //this.InitPcm(this.props.recordName);
    }

    componentWillUnmount() {
        this.stopAudio();
        this.pcmListener.remove();
        this.pcmListener = null;
        //clearInterval(this.time);
        //this.time = null;
    }

    _onPress = ()=> {
        if (this.playerState == 1) {
            this.props.itemCallback("stop", this.props.itemIndex);
        } else {
            this.props.itemCallback("play", this.props.itemIndex);
        }
    }

    componentDidUpdate(pProps,pState) {
        /*if(pProps.blnPlay != this.props.blnPlay){
            if(this.props.blnPlay){
                logf("update player:",this.props.itemIndex);
                this.InitPcm()
            }else{
                logf("update stop:",this.props.itemIndex);
                this.stopAudio()
            }
        }else if(pProps.blnReplay != this.props.blnReplay){
            logf("replay record:",this.props.itemIndex);
            if(this.props.blnReplay){
                this.InitPcm();
            }
        }*/
    }

    componentWillReceiveProps(nProps) {
        if(nProps.blnPlay != this.props.blnPlay){
            if(nProps.blnPlay){
                logf("update player:",this.props.itemIndex);
                this.InitPcm()
            }else{
                logf("update stop:",this.props.itemIndex);
                this.stopAudio()
            }
        }else if(nProps.blnReplay != this.props.blnReplay){
            logf("replay record:",this.props.itemIndex);
            if(nProps.blnReplay){
                this.InitPcm();
            }
        }
    }

    getLayout = ()=>{
        return this.myLayout;
    }

    _onLayout = (event)=>{
        this.myLayout = event.nativeEvent.layout;
    }

    render() {
        return (
            <TouchableOpacity  style={[styles.container,{backgroundColor:this.props.blnPlay?'#EBEBEB':'#fff'}]}
                               onPress={this._onPress.bind(this)} activeOpacity={1} onLayout={this._onLayout.bind(this)}>
                <View style={styles.itemContent}>
                    <Sentence words={this.props.itemWords} pinyins={this.props.itemPinyins}
                              arrScore={this.props.arrSyllableScore}/>
                    <Text
                        style={{fontSize:fontSize,color:'#757575',marginTop:fontSize*0.4,marginLeft:fontSize/2}}>{this.props.itemEN}</Text>
                </View>
                {this.props.blnPlay>0&&<ProgressViewIOS style={styles.progress} progress={this.state.progress} progressTintColor="#4ACE35"/>}
                <ScoreCircle score={this.props.sentenceScore}/>
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    container: {        
        borderBottomWidth: MinWidth,
        borderBottomColor: '#CBCBCB',
        paddingHorizontal: fontSize,
        paddingVertical: fontSize * 0.5,
        width: ScreenWidth,
        flexDirection: 'row',
        overflow: 'hidden',
    },    
     
    itemContent: {
        width: ScreenWidth - minUnit * 16,
        //backgroundColor:'#00ff0011',
    },
    progress: {
        width: ScreenWidth,
        position: 'absolute',
        left: 0,
        bottom: 0,
    }
})