/**
 * Created by tangweishu on 16/7/25.
 */
import React, {Component, PropTypes}from 'react'
import {View, Animated, StyleSheet, InteractionManager, TouchableOpacity, Text}from 'react-native'

import BtnPlayer from './C_BtnPlayer';
import BtnRecord from './C_BtnRecording';
import BtnQuestion from './C_BtnQuestion';
import BtnRecPlayer from './C_BtnRecPlayer';

import {
    getAudioFilePath,
    getMp3FilePath,
} from '../Constant';
import {
    MinWidth,
    minUnit,
    ScreenWidth,
    ScreenHeight,
} from '../Styles';

const RATE = [0.6, 1, 1.4];
import RNFS from 'react-native-fs'

var fontSize = parseInt(minUnit * 4);

const BUTTON_STATUS = {
    NORMAL: 1,//正常:被选中的状态,等待操作
    PLAYAUDIO: 2,//播放音频文件
    PAUSEAUDIO: 3,//暂停播放音频文件
    RECORDING: 4,//正在录音
    PLAYRECORD: 5,//播放录音
    PAUSERECORD: 6,//暂停播放录音
};

export default class AllBottons extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.btnCount = this.props.blnHaveRecord?3:2
        this.arrBtn = function (count) {
            var arr = [0, 1, 2, 3];
            return arr.slice(0, count)
        }(this.btnCount)
        this.state = {
            anim: this.arrBtn.map(()=>new Animated.Value(0)),
            blnDrawTmp: false,//设置一个临时显示状态,当显示的按钮数量突然发生改变时,以这个形式显示
            isVisible: false,
            comRect: {},
        };
        this.myLayout = {};
        this.blnAnim = false;
        this.blnRelease = false;
        this.buttonStatus = BUTTON_STATUS.NORMAL;
        this.recordFileName = getAudioFilePath(app.temp.lesson.key, app.temp.courseID, this.props.itemIndex);
    }

    static propTypes = {
        blnHaveRecord: PropTypes.bool,
        dialogInfo: PropTypes.object,
        btnCallback: PropTypes.func,
        getRate: PropTypes.func,
        itemIndex:PropTypes.number,
    };

    static defaultProps = {
        blnHaveRecord: false,
    };

    startAnim = ()=> {
        if (this.blnRelease)return;
        this.blnAnim = true;
        var timing = Animated.timing;
        //..logf("-----startAnim-----", this.props.itemIndex, this.blnRelease)
        Animated.parallel(this.state.anim.map(
            (parallel, i)=> {
                return timing(parallel, {toValue: 1, duration: 200, delay: i * 50})
            }
        )).start(this.endAnimated)
    }

    stopAnim = ()=> {
        if (this.blnAnim) {
            this.state.anim.map((anim, i)=> {
                anim.stopAnimation()
            })
            this.blnAnim = false;
        }
    }

    endAnimated = ()=> {
        if (this.blnRelease)return;
        this.blnAnim = false;
        this.buttonStatus = BUTTON_STATUS.PLAYAUDIO;
        this.refs.btnPlay.playerAudio(RATE[this.props.getRate()]);
    }

    componentWillReceiveProps(nProps) {
        if (nProps.blnHaveRecord != this.props.blnHaveRecord) {
            this.btnCount = nProps.blnHaveRecord?3:2
            this.setState({
                blnDrawTmp: true,
            })
        }
    }

    componentDidMount() {
        this.startAnim();
    }

    componentWillUnmount() {
        this.releaseComponent();
    }

    stopAllWork = ()=>{
        if (this.buttonStatus == BUTTON_STATUS.PLAYAUDIO || this.buttonStatus == BUTTON_STATUS.PAUSEAUDIO) {
            this.refs.btnPlay.stopAudio();
        }
        if (this.buttonStatus == BUTTON_STATUS.RECORDING) {
            this.refs.btnRecord.stopRecord();
        }
        if (this.buttonStatus == BUTTON_STATUS.PLAYRECORD || this.buttonStatus == BUTTON_STATUS.PAUSERECORD) {
            this.refs.btnRecPlay.stopAudio();
        }
        this.buttonStatus = BUTTON_STATUS.NORMAL
    }

    _onInactive = ()=>{
        if(this.buttonStatus == BUTTON_STATUS.PLAYAUDIO){
            this.refs.btnPlay.pauseAudio();
        }
        if(this.buttonStatus == BUTTON_STATUS.RECORDING){
            this.refs.btnRecord.stopRecord();
        }
        if (this.buttonStatus == BUTTON_STATUS.PLAYRECORD ) {
            this.refs.btnRecPlay.pauseAudio();
        }
    }

    releaseComponent = ()=> {
        this.blnRelease = true;
        this.stopAnim();
        this.stopAllWork()
    }

    playDialogAudio() {//播放音频
        if (this.buttonStatus == BUTTON_STATUS.RECORDING) { //如果正在录音,强制关闭录音
            this.refs.btnRecord.stopRecord();
        } else if (this.buttonStatus == BUTTON_STATUS.PLAYRECORD ) {//如果正在播放录音,强制关闭播放录音
            logf("打断了录音播放")
            this.refs.btnRecPlay.stopAudio();
        }
        this.buttonStatus = BUTTON_STATUS.PLAYAUDIO;
        this.refs.btnPlay.playerAudio(RATE[this.props.getRate()]);
    }

    pauseDialogAudio() {//暂停播放音频
        if (this.buttonStatus != BUTTON_STATUS.PLAYAUDIO) { //如果不是在暂停状态,不应该调用这个函数
            logf("pauseDialogAudio中出现状态异常,在非播放音频状态下,竟然暂停播放,当前状态:", this.buttonStatus)
            return;
        }
        this.buttonStatus = BUTTON_STATUS.PAUSEAUDIO;
        this.refs.btnPlay.pauseAudio();
    }

    overDialogAudio() {//音频播放完毕
        logf("音频播放完毕");
        if (this.buttonStatus != BUTTON_STATUS.PLAYAUDIO) {
            logf("overDialogAudio,播放按钮通知我它播放完毕,此时item状态却不是播放状态,当前状态:", this.buttonStatus);
            return;
        }
        this.buttonStatus = BUTTON_STATUS.NORMAL;
        this.props.btnCallback("btnPlay", "playover");
        /*
         logf("blnInAutoplay:", this.props.partents.blnAutoplay);
         if (this.props.partents.blnAutoplay) {
         this.props.partents.playNext();
         }*/
    }


    startRecording() {//开始录音
        if (this.buttonStatus == BUTTON_STATUS.PLAYAUDIO || this.buttonStatus == BUTTON_STATUS.PAUSEAUDIO) {//如果在播放或暂停对话音频时
            this.refs.btnPlay.stopAudio();
        } else if (this.buttonStatus == BUTTON_STATUS.PLAYRECORD || this.buttonStatus == BUTTON_STATUS.PAUSERECORD) {//如果在播放或暂停录音时
            this.refs.btnRecPlay.stopAudio();
        }
        this.buttonStatus = BUTTON_STATUS.RECORDING;
        this.startRecord();
    }

    stopRecording() {//停止录音
        if (this.buttonStatus != BUTTON_STATUS.RECORDING) {
            logf("stopRecording中出现状态异常,在非录音的状态下,竟然停止录音,当前状态:", this.buttonStatus);
            return;
        }
        //..this.buttonStatus = BUTTON_STATUS.NORMAL;
        this.refs.btnRecord.stopRecord();
    }

    overRecording(msg,score,data,index) {//录音结束
        if (this.buttonStatus != BUTTON_STATUS.RECORDING) {
            logf("overRecording,录音按钮给我返回正确结果,此时item状态却不是录音状态,当前状态:", this.buttonStatus);
            logf("可能是在录音评测阶段被其他操作给打断了,可结果还是被异步的返回了");
            //..return;
        }else{
            this.buttonStatus = BUTTON_STATUS.NORMAL;//只有在状态没被打断时才将状态置回
        }

        var blnSuccess = true;
        if(msg == 'error'){
            blnSuccess = false;
        }
        var pcResult = {blnSuccess: blnSuccess, score: score, syllableScore: data,index:Number(index)};
        logf("检查pcResult.syllable:",index, pcResult.syllableScore);
        //..this.setPingceResult(pcResult);
        this.props.btnCallback("btnRecord", pcResult);
        if (this.btnCount == 3) {
            if(index == this.props.itemIndex){//只有在当前返回结果正是此组件需要的结果时才需要更新录音音频
                this.refs.btnRecPlay.updateFile();
            }
            //通知录音按钮更新录音文件
        } else {
            logf("显示播放录音的按钮咧")
            //this.existsRecordFile();
        }
    }

    startRecord() {
        const {dialogInfo,itemIndex} = this.props;

        var testText = dialogInfo.cn.words;//获取text
        var fileName = this.recordFileName;
        testText = testText.replace(/_/g, "");
        logf(testText + " " + itemIndex + " " + dialogInfo.Category);
        this.refs.btnRecord.StartISE(testText,
            dialogInfo.Category,
            fileName,this.props.itemIndex);
    }

    playRecordAudio() {
        if (this.buttonStatus == BUTTON_STATUS.PLAYAUDIO ) {
            this.refs.btnPlay.stopAudio();
        } else if (this.buttonStatus == BUTTON_STATUS.RECORDING) {
            this.refs.btnRecord.stopRecord();
        }
        this.buttonStatus = BUTTON_STATUS.PLAYRECORD;
        this.refs.btnRecPlay.playerAudio();
    }

    pauseRecordAudio() {
        if (this.buttonStatus != BUTTON_STATUS.PLAYRECORD) {
            logf("pauseRecordAudio中出现状态异常,在非播放录音的状态下,竟然暂停播放,当前状态", this.buttonStatus);
            return;
        }
        this.buttonStatus = BUTTON_STATUS.PAUSERECORD;
        this.refs.btnRecPlay.pauseAudio();
    }

    overRecordAudio() {
        if (this.buttonStatus != BUTTON_STATUS.PLAYRECORD) {
            logf("overRecordAudio中出现状态异常,播放录音按钮通知我播放结束,但此时却不是播放录音状态,当前状态:", this.buttonStatus);
            return;
        }
        this.buttonStatus = BUTTON_STATUS.NORMAL;
    }

    callbackBtnPlay = (msg)=> {
        if (this.blnRelease)return;
        if (msg == "play") {
            this.playDialogAudio();
        } else if (msg == "pause") {
            this.pauseDialogAudio();
        } else if (msg == "over") {
            this.overDialogAudio();
        }
    }

    callbackBtnRecord(msg, score,data,index) {
        if (this.blnRelease)return;
        if (msg == "record") {
            this.startRecording();
        } else if (msg == "stop") {
            this.stopRecording();
        } else if (msg == "error") {
            this.overRecording(msg,score,data,index);//如果出现异常,参数这样传
        } else if (msg == "result") {
            this.overRecording(msg,score,data,index);//这样处理貌似不太合理,先凑合用吧~~
        }
    }

    callbackBtnRecPlay = (msg)=> {
        if (this.blnRelease)return;
        if (msg == "play") {
            this.playRecordAudio();
        } else if (msg == "pause") {
            this.pauseRecordAudio();
        } else if (msg == "over") {
            this.overRecordAudio();
        }
    }

    callbackBtnQuestion = (msg)=> {

    }

    autoplay = ()=> { //接收到父组要调用自动播放的指令
        if (this.buttonStatus == BUTTON_STATUS.RECORDING) { //如果正在录音,强制关闭录音
            this.refs.btnRecord.stopRecord();
        } else if (this.buttonStatus == BUTTON_STATUS.PLAYRECORD) {//如果正在播放录音,强制关闭播放录音
            this.refs.btnRecPlay.stopAudio();
        }
        this.buttonStatus = BUTTON_STATUS.PLAYAUDIO;
        this.refs.btnPlay.replayAudio(RATE[this.props.getRate()]);
    }

    stopAutoplay = ()=> {//接收到父组件调用暂停自动播放的指令        
        if (this.refs.btnPlay) {
            this.refs.btnPlay.stopAudio();
            this.buttonStatus = BUTTON_STATUS.NORMAL;
        }
    }
 
    renderButton = (i)=> {
        const {dialogInfo,itemIndex} = this.props;
        if (i == 0) {
            return <BtnPlayer key={0} ref="btnPlay"
                              audioName={getMp3FilePath(app.temp.lesson.key, app.temp.courseID) + '/' + dialogInfo.mp3}
                              btnCallback={this.callbackBtnPlay.bind(this)} rate={()=>1}/>
        }
        if (i == 1) {
            return <BtnRecord key={1} ref={"btnRecord"} btnCallback={this.callbackBtnRecord.bind(this)}/>
        }
        if (i == 2) {
            return <BtnRecPlayer key={2} ref="btnRecPlay"
                                 recordName={getAudioFilePath(app.temp.lesson.key, app.temp.courseID, itemIndex)}
                                 btnCallback={this.callbackBtnRecPlay.bind(this)}/>
        }
        if (i == 3) {
            return <BtnQuestion key={3} ref="btnQuestion" btnCallback={this.callbackBtnQuestion.bind(this)}/>
        }
    }

    renderTmp = ()=> {
        var arrBtn = [];
        for (var i = 0; i < this.btnCount; i++) {
            arrBtn.push(this.renderButton(i));
        }
        return arrBtn;
    }

    render() {
        var views = this.state.anim.map(
            ((value, i)=> <Animated.View key={i} style={{transform:[{scale:value}]}}>
                {this.renderButton(i)}
            </Animated.View>).bind(this)
        )
        //var displayArea = {x:this.myLayout.x,y:this.myLayout.y,width:this.myLayout.width,height:this.myLayout.height*2}
         
        return (
            <View style={styles.container}>
                {!this.state.blnDrawTmp && views}
                {this.state.blnDrawTmp && this.renderTmp()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: ScreenWidth - fontSize * 6,//唐7-12
        height: fontSize * 6,
        flexDirection: 'row',
        //backgroundColor: '#ffff0022',
        alignItems: 'center',
    },
    popoverContent: {
        width: fontSize * 4,
        height: fontSize * 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffff00'
    },
    popoverText: {
        fontSize: fontSize * 1.75,
        color: '#00ffff'
    },

});