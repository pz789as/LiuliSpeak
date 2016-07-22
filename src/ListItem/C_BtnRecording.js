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
} from '../Resources'
import* as Progress from 'react-native-progress';//安装的第三方组件,使用方法查询:https://github.com/oblador/react-native-progress
var XFiseBridge = NativeModules.XFiseBridge;
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';


var Dimensions = require('Dimensions');
var totalWidth = Dimensions.get('window').width;
var totalHeight = Dimensions.get('window').height;
var fontSize = parseInt(totalWidth / 26)
var btnSize = fontSize * 5;
var radioSize = btnSize;
export default class BtnRecording extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            recordState: 0,//0:等待录音,1:录音中,2计算成绩
            progress: 0,//录音音量
            scaleAnim: this.props.blnScaleAnimate ? new Animated.Value(0) : new Animated.Value(1),
            opacityAnim:this.props.blnOpacityAnimate?new Animated.Value(0) : new Animated.Value(1),
        };
        this.listener = null;
        this.volumeListener = null;
        this.speechStatus = XFiseBridge.SPEECH_STOP;
        this.btnDisabled = false;

    }

    static propTypes = {
        blnScaleAnimate: PropTypes.bool,//是否有出现动画
        blnOpacityAnimate:PropTypes.bool,//是否有出现动画
        animateDialy: PropTypes.number,//如果blnAnimate为true,必须设置该值              
        btnCallback: PropTypes.func,

    };
    
    static defaultProps = {
        blnScaleAnimate:false,
        animateDialy:0,
        blnOpacityAnimate:false,
        
    };

    componentWillUnmount() {
        this.cancelRecord();
        this._releaseRecordListener();
    }

    _releaseRecordListener = ()=> {
        this.listener.remove();
        this.listener = null;
        this.volumeListener.remove();
        this.volumeListener = null;
    }

    _onPress = ()=> {//发送点击事件      
        if(this.state.recordState == 0){
            this.props.btnCallback("record");
        }else if(this.state.recordState == 1){
            this.props.btnCallback("stop");
        }              
    }

    componentWillMount() {
        if (this.props.blnScaleAnimate) {
            Animated.timing(this.state.scaleAnim, {
                toValue: 1,
                duration: 300,
                delay: this.props.animateDialy,
            }).start(()=>{this.props.btnCallback("AnimOver")});
        }
        this.listener = RCTDeviceEventEmitter.addListener('iseCallback', this.iseCallback.bind(this));
        this.volumeListener = RCTDeviceEventEmitter.addListener('iseVolume', this.iseVolume.bind(this));
    }

    drawBtnRecord = ()=> {//0:等待录音,1:录音中,2手动停止录音
        if (this.state.recordState == 0) {
            return (
                <Image style={styles.radio} source={ImageRes.bg_mic}/>
            );
        } else if (this.state.recordState == 1) {
            return (
                <Image style={styles.radio} source={ImageRes.bg_mic_highlight_l}/>
            );
        }
    }

    setProgress(volume) {//设置当前的音量progress
        if(this.volumeListener == null) return;
        volume += 12 + parseInt(Math.random() * 5);
        var v = volume / 50;
        if (this.state.recordState == 0) {
            v = 0;
        }
        v = v > 1 ? 1 : v;
        this.setState({
            progress: v,
        });
    }
    
    setOpacityAnim = (toValue)=>{
        Animated.timing(this.state.opacityAnim,{toValue:toValue,duration:300}).start(()=>{this.props.btnCallback("AnimOver")})
    }

    recordEnd() {//录音结束时调用
        //..console.log("手动停止录音");
        var state = this.state.recordState;
        if (state == 1) {
            state = 0;
            this.setState({
                recordState: state,
                progress: 0,//唐7-12
            });
        }
    }

    shouldComponentUpdate(nextProps,nextStates) {
        var blnUpdate = false;

        if(nextStates.recordState != this.state.recordState){
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

    render() {
        return (
            <Animated.View style={{transform:[{scale:this.state.scaleAnim}],opacity:this.state.opacityAnim}}>
                <TouchableOpacity onPress={this._onPress} activeOpacity={0.5}>
                    {/*上一句是为了仿流利说把点击效果取消,没有Touchwihtout是方便日后修改*/}
                    <View style={[styles.container]}>
                        {/*<View style={styles.radio}>
                         <Text>录</Text>
                         {这里先用text意思意思,后面要换成图片组件}
                         </View>*/}
                        {this.drawBtnRecord()}
                        {this.state.playerState != 0 && this.state.progress > 0&&
                        <Progress.Circle style={styles.progress} thickness={5}
                                         borderWidth={0} progress={this.state.progress}
                                         size={btnSize-2} color="#3FA214" animated={true}/>
                        }
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    StartISE(msg, category, fileName) {
        console.log("ISE msg:",msg);
        console.log("ISE category:",category);
        console.log("ISE fileName:",fileName);
        this.category = category;
        this.startRecord(msg, category, fileName);
    }

    startRecord(msg, category, fileName) {
        if (this.speechStatus == XFiseBridge.SPEECH_STOP) {            
            var startInfo = {
                SAMPLE_RATE: '16000',
                TEXT_ENCODING: 'utf-8',
                ISE_RESULT_TYPE: 'xml',
                VAD_BOS: '5000',//静音超时时间，即用户多长时间不说话则当做超时处理vad_bos 毫秒 ms
                VAD_EOS: '1800',//后端点静音检测时间，即用户停止说话多长时间内即认为不再输入，自动停止录音 毫秒 ms
                ISE_CATEGORY: category,//read_syllable（单字，汉语专有）、read_word（词语）、read_sentence（句子）
                LANGUAGE: 'zh_cn',//en_us（英语）、zh_cn（汉语）
                ISE_RESULT_LEVEL: 'complete',
                SPEECH_TIMEOUT: '10000',//录音超时，录音达到时限时自动触发vad，停止录音，默认-1（无超时）
                TEXT: msg,//需要评测的内容
                ISE_AUDIO_PATH: fileName,
            };
            XFiseBridge.start(startInfo);
        } else if (this.speechStatus == XFiseBridge.SPEECH_WORK) {
            XFiseBridge.stop();
        } else if (this.speechStatus == XFiseBridge.SPEECH_START) {
            this.Cancel();
        } else if (this.speechStatus == XFiseBridge.SPEECH_RECOG) {
            XFiseBridge.stop();
        }
    }

    stopRecord=()=>{
        if (this.speechStatus != XFiseBridge.SPEECH_STOP) {
            XFiseBridge.stop();
            this.speechStatus = XFiseBridge.SPEECH_STOP;
        }
    }

    cancelRecord=()=>{
        if (this.speechStatus != XFiseBridge.SPEECH_STOP) {
            XFiseBridge.cancel();
            this.speechStatus = XFiseBridge.SPEECH_STOP;
        }
    }    

    iseVolume(data) {//接收到讯飞引擎传来的录音音量
        this.setProgress(parseInt(data.volume));
    }

    iseCallback(data) {//接受到讯飞原生传过来的数据,包含引擎当前状态和数值 data={code:,result:}
        console.log("iseCallback:", data.code, XFiseBridge.CB_CODE_RESULT);
        if (data.code == XFiseBridge.CB_CODE_RESULT) {
            console.log("录音结束,返回结果,调用 this.resultParse");
            this.resultParse(data.result);//录音结束返回结果数据去前端解析,并调用btnCallback将结果给父组件
            this.speechStatus = XFiseBridge.SPEECH_STOP;
        }
        else if (data.code == XFiseBridge.CB_CODE_ERROR) {
            this.props.btnCallback('error',data.result);//返回讯飞给的评测异常错误
            this.recordEnd();
            this.speechStatus = XFiseBridge.SPEECH_STOP;
        }
        else if (data.code == XFiseBridge.CB_CODE_STATUS) {//正在录音
            if (data.result == XFiseBridge.SPEECH_START) {//已经开始
                this.setState({recordState: 1});
                //..this.props.btnCallback('status',1);//通知父组件开始录音了
            } else if (data.result == XFiseBridge.SPEECH_WORK) {//工作中...

            } else if (data.result == XFiseBridge.SPEECH_STOP) {//手动停止
                this.recordEnd();

            } else if (data.result == XFiseBridge.SPEECH_RECOG) {//识别中...
                this.recordEnd();//..
            }
            this.speechStatus = data.result;
        }
        else {//..真的是未知的错误
            console.log('传回其他参数', data.result);
            this.recordEnd();
            this.props.btnCallback('error',0);//返回未知的错误
            this.speechStatus = XFiseBridge.SPEECH_STOP;
        }
    }

    resultParse(result) { //唐7-11 根据结果计算分数
        var obj = eval('(' + result + ')');
        var isLost = false;
        var pointCount = 0;//总点数 = 字数X3；3表示声母，韵母，声调。详细规则可以再探讨
        var lostPoint = 0;
        var syllablesScore = [];//每个字的评测情况
        if (this.category == 'read_syllable') {
            var syllable = obj.sentences[0].words[0].syllables[0];
            pointCount += 3;
            lostPoint += 3;
            var temPoint = "111";
            if (Math.abs(syllable.shengmu.wpp) > 2) {
                tmpPoint[0] = '0';
                lostPoint--;
            }
            if (Math.abs(syllable.yunmu.wpp) > 2) {
                tmpPoint[1] = '0';
                lostPoint--;
            }
            if (Math.abs(syllable.yunmu.tgpp) > 1) {
                tmpPoint[2] = '0';
                lostPoint--;
            }
            syllablesScore.push(tmpPoint);
        } else if (this.category == 'read_word') {
            var word = obj.sentences[0].words[0];
            for (var idx = 0; idx < word.syllables.length; idx++) {
                var syllable = word.syllables[idx];
                if (syllable.pDpMessage == '正常') {
                    pointCount += 3;
                    lostPoint += 3;
                    var temPoint = "";
                    if (Math.abs(syllable.shengmu.wpp) > 2) {
                        tmpPoint.concat('0');
                        lostPoint--;
                    } else {
                        tmpPoint.concat('1');
                    }
                    if (Math.abs(syllable.yunmu.wpp) > 2) {
                        tmpPoint.concat('0');
                        lostPoint--;
                    } else {
                        tmpPoint.concat('1');
                    }
                    if (Math.abs(syllable.yunmu.tgpp) > 1.6) {
                        tmpPoint.concat('0');
                        lostPoint--;
                    } else {
                        tmpPoint.concat('1');
                    }
                    syllablesScore.push(tmpPoint);
                } else if (syllable.pDpMessage == '漏读') {
                    pointCount += 3;
                    syllablesScore.push('000');
                } else {
                    if (syllable.pDpMessage == '增读') {
                        lostPoint -= 1;
                    } else if (syllable.pDpMessage == '回读') {
                        lostPoint -= 1;
                    } else if (syllable.pDpMessage == '替换') {
                        lostPoint -= 1;
                    }
                }
            }
        } else if (this.category === 'read_sentence') {
            var sentence = obj.sentences[0];
            for (var j = 0; j < sentence.words.length; j++) {
                var word = sentence.words[j];
                for (var idx = 0; idx < word.syllables.length; idx++) {
                    var syllable = word.syllables[idx];
                    if (syllable.pDpMessage == '正常') {
                        pointCount += 3;
                        lostPoint += 3;
                        var tmpPoint = '';
                        if (Math.abs(syllable.shengmu.wpp) > 2) {

                            lostPoint--;
                            tmpPoint = tmpPoint.concat('0');
                        } else {
                            tmpPoint = tmpPoint.concat('1');
                        }
                        if (Math.abs(syllable.yunmu.wpp) > 2) {
                            tmpPoint = tmpPoint.concat('0');
                            lostPoint--;
                        } else {
                            tmpPoint = tmpPoint.concat('1');
                        }
                        if (Math.abs(syllable.yunmu.tgpp) > 1) {
                            tmpPoint = tmpPoint.concat('0');
                            lostPoint--;
                        } else {
                            tmpPoint = tmpPoint.concat('1');
                        }
                        syllablesScore.push(tmpPoint);
                    } else if (syllable.pDpMessage == '漏读') {
                        syllablesScore.push('000');
                        pointCount += 3;
                    } else {
                        if (syllable.pDpMessage == '增读') {
                            lostPoint -= 1;
                        } else if (syllable.pDpMessage == '回读') {
                            lostPoint -= 1;
                        } else if (syllable.pDpMessage == '替换') {
                            lostPoint -= 1;
                        }
                    }
                }
            }
        }

        if (lostPoint < 0) lostPoint = 0;
        var score = lostPoint / pointCount * 100;
        console.log("评测分数: " + score);
        console.log("每个汉字情况:" + syllablesScore);
        this.props.btnCallback("result",{syllableScore:syllablesScore,sentenctScore: parseInt(score)});

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
        left: 2 / PixelRatio.get(),
        top: 2 / PixelRatio.get(),
    },
    radio: {
        width: radioSize,
        height: radioSize,
    },
})