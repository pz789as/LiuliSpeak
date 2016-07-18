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
    ImageRes,
    ImageIcon,
} from '../Resources';

import {
    getAudioFilePath,
    getMp3FilePath,

} from '../Constant';

import BtnPlayer from './ListItem/C_BtnPlayer';
import BtnRecord from './ListItem/C_BtnRecording';
import BtnQuestion from './ListItem/C_BtnQuestion';
import BtnRecPlayer from './ListItem/C_BtnRecPlayer';
import Sentence from './ListItem/C_Sentence';
import RNFS from 'react-native-fs'
var Dimensions = require('Dimensions');
var totalWidth = Dimensions.get('window').width;
var totalHeight = Dimensions.get('window').height;
var fontSize = parseInt(totalWidth / 26);
var spacing = fontSize * 1;//内容之间的间距

const ITEM_STATUS = {
    HIDDEN: 0, //隐藏:就是没有被选中的状态
    NORMAL: 1,//正常:被选中的状态,等待操作
    PLAYAUDIO: 2,//播放音频文件
    PAUSEAUDIO: 3,//暂停播放音频文件
    RECORDING: 4,//正在录音
    PLAYRECORD: 5,//播放录音
    PAUSERECORD: 6,//暂停播放录音
};

export default class ListItem extends Component {
    height = 0;

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            score: this.props.itemScore,
            coins: this.props.itemCoins,
            blnLow: false,
            disabled: (this.props.itemBlnSelect),
            blnHaveRecord: false,
        };
        this.blnPcmPlayAnim = true;//用一个变量记录播放录音按钮在render时是否有动画,用在录音从无到有时,后面两个按钮跳过动画直接显示
        if (this.props.itemBlnSelect) {
            this.itemStatus = ITEM_STATUS.NORMAL;
        } else {
            this.itemStatus = ITEM_STATUS.HIDDEN;
        }
        this.userIcon = this.props.user == 1 ? ImageIcon.user1 : ImageIcon.user2;
        this.recordFileName = getAudioFilePath(this.props.dialogInfo.lesson, this.props.dialogInfo.course, this.props.dialogInfo.dIndex);
    }

    myLayout = null;//记录item的位置
    contentLayout = null;//记录item中的内容部分view的位置
    blnInTouch = false;//一个标记,判断自己是否属于手势控制范围
    static defaultProps = {
        itemWordCN: PropTypes.object,//中文教学内容
        itemWordEN: PropTypes.string,//教学内容的英文翻译
        itemShowType: PropTypes.number,//当前item展示类型(0只显示中文,1只显示英文,2都显示 默认应该为2的)
        itemBlnSelect: PropTypes.bool,//当前的item是否被选中了
        itemScore: PropTypes.number,//从数据库中获取的分数
        itemCoins: PropTypes.number,//从数据库中获取的金币数量
        audio: PropTypes.string,
        playNext: PropTypes.func,//调用父组件的播放下一个的函数
        blnInAutoplay: PropTypes.bool,//判断父组件是否在自动播放
        user: PropTypes.number,//跟头像显示有关
        dialogInfo: PropTypes.object,//对话信息
        itemIndex:PropTypes.number,
    };

    playDialogAudio() {//播放音频
        if (this.itemStatus == ITEM_STATUS.RECORDING) { //如果正在录音,强制关闭录音
            this.refs.btnRecord.stopRecord();
        } else if (this.itemStatus == ITEM_STATUS.PLAYRECORD) {//如果正在播放录音,强制关闭播放录音
            this.refs.btnRecPlay.stopAudio();
        }
        this.itemStatus = ITEM_STATUS.PLAYAUDIO;
        this.refs.btnPlay.playerAudio();
    }

    pauseDialogAudio() {//暂停播放音频
        if (this.itemStatus != ITEM_STATUS.PLAYAUDIO) { //如果不是在暂停状态,不应该调用这个函数
            console.log("pauseDialogAudio中出现状态异常,在非播放音频状态下,竟然暂停播放,当前状态:", this.itemStatus)
            return;
        }
        this.itemStatus = ITEM_STATUS.PAUSEAUDIO;
        this.refs.btnPlay.pauseAudio();
    }

    overDialogAudio() {//音频播放完毕
        if (this.itemStatus != ITEM_STATUS.PLAYAUDIO) {
            console.log("overDialogAudio,播放按钮通知我它播放完毕,此时item状态却不是播放状态,当前状态:", this.itemStatus);
            return;
        }
        this.itemStatus = ITEM_STATUS.NORMAL;
        if (this.props.blnInAutoplay) {
            this.props.playNext();
        }
    }

    startRecording() {//开始录音
        if (this.itemStatus == ITEM_STATUS.PLAYAUDIO || this.itemStatus == ITEM_STATUS.PAUSEAUDIO) {//如果在播放或暂停对话音频时
            this.refs.btnPlay.stopAudio();
        } else if (this.itemStatus == ITEM_STATUS.PLAYRECORD || this.itemStatus == ITEM_STATUS.PAUSERECORD) {//如果在播放或暂停录音时
            this.refs.btnRecPlay.stopAudio();
        }
        this.itemStatus = ITEM_STATUS.RECORDING;
        this.startRecord();
    }

    stopRecording() {//停止录音
        if (this.itemStatus != ITEM_STATUS.RECORDING) {
            console.log("stopRecording中出现状态异常,在非录音的状态下,竟然停止录音,当前状态:", this.itemStatus);
            return;
        }
        this.itemStatus = ITEM_STATUS.NORMAL;
        this.refs.btnRecord.stopRecord();
    }

    overRecording(data, num) {//录音结束
        if (this.itemStatus != ITEM_STATUS.RECORDING) {
            console.log("overRecording,录音按钮给我返回正确结果,此时item状态却不是播放状态,当前状态:", this.itemStatus);
            return;
        }
        this.itemStatus = ITEM_STATUS.NORMAL;
        console.log("CallBackRecord Result:", num);
        var pcResult = {blnSuccess: true, score: num, syllableScore: data};
        console.log("检查pcResult.syllable:", pcResult.syllableScore);
        this.setPingceResult(pcResult);
        if (this.state.blnHaveRecord) {
            this.refs.btnRecPlay.updateFile();
            //通知录音按钮更新录音文件
        } else {
            this.existsRecordFile();
        }
    }

    startRecord() {
        const {itemWordCN, dialogInfo} = this.props;
        var testText = itemWordCN.words;//获取text
        var fileName = this.recordFileName;
        testText = testText.replace(/_/g, "");
        //console.log(testText + " " + dialogInfo.dIndex + " " + dialogInfo.gategory);
        this.refs.btnRecord.StartISE(testText,
            dialogInfo.gategory,
            fileName);
    }

    playRecordAudio() {
        if (this.itemStatus == ITEM_STATUS.PLAYAUDIO || this.itemStatus == ITEM_STATUS.PAUSEAUDIO) {
            this.refs.btnPlay.stopAudio();
        } else if (this.itemStatus == ITEM_STATUS.RECORDING) {
            this.refs.btnRecord.stopRecord();
        }
        this.itemStatus = ITEM_STATUS.PLAYRECORD;
        this.refs.btnRecPlay.playerAudio();
    }

    pauseRecordAudio() {
        if (this.itemStatus != ITEM_STATUS.PLAYRECORD) {
            console.log("pauseRecordAudio中出现状态异常,在非播放录音的状态下,竟然暂停播放,当前状态", this.itemStatus);
            return;
        }
        this.itemStatus = ITEM_STATUS.PAUSERECORD;
        this.refs.btnRecPlay.pauseAudio();
    }

    overRecordAudio() {
        if (this.itemStatus != ITEM_STATUS.PLAYRECORD) {
            console.log("overRecordAudio中出现状态异常,播放录音按钮通知我播放结束,但此时却不是播放录音状态,当前状态:", this.itemStatus);
            return;
        }
        this.itemStatus = ITEM_STATUS.NORMAL;
    }

    callbackBtnPlay = (msg)=> {
        if(this.itemStatus == ITEM_STATUS.HIDDEN)return;
        if (msg == "play") {
            this.playDialogAudio();
        } else if (msg == "pause") {
            this.pauseDialogAudio();
        } else if (msg == "over") {
            this.overDialogAudio();
        } else if (msg == "AnimOver") {

        }
    }

    callbackBtnRecord(msg, num) {
        if(this.itemStatus == ITEM_STATUS.HIDDEN)return;
        if (msg == "record") {
            this.startRecording();
        } else if (msg == "stop") {
            this.stopRecording();
        } else if (msg == "error") {
            this.overRecording(msg, num);//如果出现异常,参数这样传
        } else if (msg == "result") {
            this.overRecording(num.syllableScore, num.sentenctScore);//这样处理貌似不太合理,先凑合用吧~~
        }else if(msg == "AnimOver"){
             if(this.state.blnHaveRecord == false){
                 this.itemStatus = ITEM_STATUS.PLAYAUDIO;
                 this.setState({disabled:false});
                 this.refs.btnPlay.playerAudio();
                 this.blnPcmPlayAnim = false;//如果此次结束动画是在录音按钮动画播完,则将此变量置为false;
             }
        }
    }

    callbackBtnRecPlay = (msg)=> {
        if(this.itemStatus == ITEM_STATUS.HIDDEN)return;
        if (msg == "play") {
            this.playRecordAudio();
        } else if (msg == "pause") {
            this.pauseRecordAudio();
        } else if (msg == "over") {
            this.overRecordAudio();
        } else if (msg == "AnimOver"){

        }
    }

    callbackBtnQuestion = (msg)=>{
        if(this.itemStatus == ITEM_STATUS.HIDDEN)return;
        console.log("itemIndex:",this.props.itemIndex);
        if(msg == "AnimOver"){
            this.itemStatus = ITEM_STATUS.PLAYAUDIO;
            this.setState({disabled:false});
            this.refs.btnPlay.playerAudio();
        }
    }

    _onAutoplay = ()=> { //接收到父组要调用自动播放的指令
        if (this.itemStatus == ITEM_STATUS.RECORDING) { //如果正在录音,强制关闭录音
            this.refs.btnRecord.stopRecord();
        } else if (this.itemStatus == ITEM_STATUS.PLAYRECORD) {//如果正在播放录音,强制关闭播放录音
            this.refs.btnRecPlay.stopAudio();
        }
        this.itemStatus = ITEM_STATUS.PLAYAUDIO;
        this.refs.btnPlay.replayAudio();
    }

    _onStopAutoplay = ()=> {//接收到父组件调用暂停自动播放的指令
        this.refs.btnPlay.stopAudio();
        this.itemStatus = ITEM_STATUS.NORMAL;
    }

    componentWillMount() {
        this.existsRecordFile();//检查是否有录音文件
    }

    shouldComponentUpdate(nextProps, nextStates) {
        var blnUpdate = false;
        if(nextProps.itemBlnSelect != this.props.itemBlnSelect){
            blnUpdate = true;
        }
        if(nextProps.blnInAutoplay != this.props.blnInAutoplay){
            blnUpdate = true;
        }

        if(nextStates.score != this.state.score){
            blnUpdate = true;
        }
        if(nextStates.coins != this.state.coins){
            blnUpdate = true;
        }
        if(nextStates.blnLow != this.state.blnLow){
            blnUpdate = true;
        }
        if(nextStates.disabled != this.state.disabled){
            blnUpdate = true;
        }
        if(nextStates.blnHaveRecord != this.state.blnHaveRecord){
            blnUpdate = true;
        }
        /*
        if(blnUpdate){
            console.log("nowProps:",this.props);
            console.log("nextProps:",nextProps);
            console.log("nowState:",this.state);
            console.log("nextState:",nextStates);
        }*/
        return blnUpdate;
    }

    render() {
        const {itemIndex, itemWordCN, itemWordEN, itemShowType, itemBlnSelect, blnInAutoplay, dialogInfo} = this.props;//获取属性值
        //console.log("Render ListIndex:",this.props.itemIndex);
        return (
            <View pointerEvents={(blnInAutoplay || this.state.disabled)?"none":"auto"}
                  style={[styles.container,{backgroundColor:itemBlnSelect?'#FFFFFF':'#EBEBEB'}]}
                  onLayout={this._onLayout.bind(this)}>
                <View style={styles.leftView}>
                    <Image style={styles.iconImage} source={this.userIcon}/>
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
                            <BtnPlayer blnAnimate={true} animateDialy={0}
                                       audioName={getMp3FilePath(dialogInfo.lesson, dialogInfo.course) + '/' + this.props.audio}
                                       btnCallback={this.callbackBtnPlay.bind(this)} rate={1} ref={'btnPlay'}/>

                             <BtnRecord blnAnimate={true} animateDialy={100} startRecord={this.startRecord.bind(this)}
                             ref={'btnRecord'} btnCallback={this.callbackBtnRecord.bind(this)}/>
                             {this.state.blnHaveRecord && <BtnRecPlayer blnAnimate={this.blnPcmPlayAnim } animateDialy={150}
                             btnCallback={this.callbackBtnRecPlay.bind(this)}
                             recordName={getAudioFilePath(dialogInfo.lesson, dialogInfo.course, dialogInfo.dIndex)}
                             ref={'btnRecPlay'}/>}
                             {this.state.blnHaveRecord && <BtnQuestion blnAnimate={this.blnPcmPlayAnim } animateDialy={200}
                             btnCallback = {this.callbackBtnQuestion.bind(this)} ref={'btnQuestion'}
                             />}
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

    existsRecordFile = ()=> {
        var basePath = RNFS.CachesDirectoryPath + '/';
        var fileName = this.recordFileName;
        var path = basePath + fileName;
        RNFS.exists(path).then((result)=> {
            if (result === true) {
                this.setState({blnHaveRecord: true});
            } else {
                this.setState({blnHaveRecord: false});
            }
        })
    }

    getScoreViewColor = function () {//通过当前分数获取 "分数"背景色
        let color = 'white';
        if (this.state.score >= 80) {
            color = '#49CD36';
        } else if (this.state.score >= 60) {
            color = '#F2B225';
        } else {
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
        if (!this.state.blnHaveRecord) return;
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


    setPingceResult(result) {//唐7-11
        console.log("运行C_listITEM 的 setPingceResult:" + result.blnSuccess + result.score + result.syllableScore);
        syllableScore
        const {blnSuccess, score, syllableScore, errorMsg} = result;
        if (blnSuccess) {
            this.refs.mySentence.setPingce(syllableScore); //评测打分..
            var rndScore = Math.min(95, score) - 3 + parseInt(Math.random() * 6);
            if (syllableScore < 60) { //如果没及格,就别给随机分数了
                rndScore = syllableScore;
            }
            this.setState({score: rndScore}); //评测打分..
        } else {
            if (errorMsg == 0) {
                console.log("未知的异常");
            } else {
                console.log("讯飞返回的错误代码:", errorMsg);
            }
            this.refs.mySentence.setPingce("error");
            this.setState({score: 0});
        }
    }

    _onSelectItem = ()=> {//选中item时调用
        //this.blnPcmPlayAnim = true;//用一个变量记录播放录音按钮在render时是否有动画,用在录音从无到有时,后面两个按钮跳过动画直接显示
        this.itemStatus = ITEM_STATUS.NORMAL;
        this.setState({disabled: true});
    }

    _onHiddenItem = ()=> {//item由选中到非选中时调用
        this.itemStatus = ITEM_STATUS.HIDDEN;
    }

    _onPreviousPage = ()=>{//当P_Practice页面点击"返回上一级"时"当前选中的item"调用此函数
        if(this.itemStatus == ITEM_STATUS.PLAYAUDIO || this.itemStatus == ITEM_STATUS.PAUSEAUDIO){
            this.refs.btnPlay.stopAudio();
        }
        if(this.itemStatus == ITEM_STATUS.RECORDING){
            this.refs.btnRecord.stopRecord();
        }
        if(this.itemStatus == ITEM_STATUS.PLAYRECORD || this.itemStatus == ITEM_STATUS.PAUSERECORD){
            this.refs.btnRecPlay.stopAudio();
        }
    }

    //------------------播放音频end------------------------------------


    _callbackRecord(data, num) {
        if (data == 'status') {
            if (num == 1) {//此时接收到录音按钮开始工作
                if (this.itemStatus == ITEM_STATUS.PLAYAUDIO || this.itemStatus == ITEM_STATUS.PAUSEAUDIO) {
                    //如果此时item正在播放音频,将音频结束
                    this.refs.btnPlay.stopAudio();
                } else if (this.itemStatus == ITEM_STATUS.PLAYRECORD || this.itemStatus == ITEM_STATUS.PAUSERECORD) {
                    this.refs.btnRecPlay.stopAudio();
                }
                this.itemStatus = ITEM_STATUS.RECORDING;
            } else if (num == 2) {
                if (this.itemStatus == ITEM_STATUS.RECORDING) {

                }
            }
        } else if (data == 'error') {//返回错误
            var pcResult = {blnSuccess: false, score: '0', syllableScore: '', errorMsg: num};
            this.setPingceResult(pcResult);
            if (this.itemStatus == ITEM_STATUS.RECORDING) {
                this.itemStatus = ITEM_STATUS.NORMAL;
            } else {
                console.log("注意监视此时状态,可能会有冲突", this.itemStatus);
            }
            if (this.state.blnHaveRecord) {
                this.refs.btnRecPlay.updateFile();
                //通知录音按钮更新录音文件
            } else {
                this.existsRecordFile();
            }
        } else {//正确获得结果之后
            console.log("CallBackRecord Result:", data, num);
            var pcResult = {blnSuccess: true, score: num, syllableScore: data};
            console.log("检查pcResult.syllable:", pcResult.syllableScore);
            this.setPingceResult(pcResult);
            if (this.itemStatus == ITEM_STATUS.RECORDING) {
                this.itemStatus = ITEM_STATUS.NORMAL;
            } else {
                console.log("注意监视此时状态,可能会有冲突", this.itemStatus);
            }

            if (this.state.blnHaveRecord) {
                this.refs.btnRecPlay.updateFile();
                //通知录音按钮更新录音文件
            } else {
                this.existsRecordFile();
            }
        }
    }

    _callbackPlayRecord = (btnStatus)=> {
        if (btnStatus == 0) { //告诉ListItem 我播放完了或者被手动停了
            if (this.itemStatus == ITEM_STATUS.PLAYRECORD) {
                this.itemStatus = ITEM_STATUS.NORMAL;
            } else {
                console.log("状态冲突:如果不在播放状态,接受到播放按钮传过来说停止播放");
            }
        } else if (btnStatus == 1) { //告诉ListItem 要开始播放音频了
            if (this.itemStatus == ITEM_STATUS.NORMAL || this.itemStatus == ITEM_STATUS.PAUSERECORD) {
                this.itemStatus = ITEM_STATUS.PLAYAUDIO;
            } else if (this.itemStatus == ITEM_STATUS.PLAYAUDIO || this.itemStatus == ITEM_STATUS.PAUSEAUDIO) {
                this.refs.btnPlay.stopAudio();
            } else if (this.itemStatus == ITEM_STATUS.RECORDING) {//如果此时录音按钮正在工作
                this.refs.btnRecord.stopRecord();
                this.itemStatus = ITEM_STATUS.PLAYRECORD;
            } else if (this.itemStatus == ITEM_STATUS.PLAYRECORD) {
                console.log("状态冲突:如果已经处于播放音频状态了,却又收到播放按钮传过来的播放状态");
            }
        } else if (btnStatus == 2) { //告诉ListItem 暂停播放音频了
            if (this.itemStatus != ITEM_STATUS.PLAYRECORD) {
                console.log("状态冲突:如果不在播放音频状态,却收到一个播放按钮传来的暂停播放");
            } else {
                this.itemStatus = ITEM_STATUS.PAUSERECORD;
            }
        }
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