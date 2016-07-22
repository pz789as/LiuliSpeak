/**
 * Created by tangweishu on 16/7/19.
 */
import React, {Component, PropTypes} from 'react'
import {View, Text, StyleSheet, Image,TouchableOpacity, Animated, Easing, InteractionManager} from 'react-native'

import Sentence from '../ListItem/C_Sentence';
import RoleIcon from '../Exam/C_RoleIcon';
import BtnRecord from '../ListItem/C_BtnRecording'
import Countdown from '../Exam/C_Countdown'
import GreenPoint from '../Exam/C_GreenPoint'
import ExamPause from  '../Exam/C_ExamPause';
import Sound from 'react-native-sound';
import {
    getExamFilePath,
    getMp3FilePath,
} from '../Constant';
import {
    ImageRes,
} from '../Resources';

var Dimensions = require('Dimensions');
var totalWidth = Dimensions.get('window').width;
var totalHeight = Dimensions.get('window').height;
var fontSize = parseInt(totalWidth / 26);
var ScentenceSpace = fontSize * 6;
var AnimTransfromY = ScentenceSpace * 3 / 2;
export default class P_Exam extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            opacityAnim: new Animated.Value(1),
            translateYAnim: new Animated.Value(0),
            nowIndex: 0,
            blnCountdown: true,//倒计时ing...
            blnChangeRole: false,
            blnExamPause:false,
        };
        this.dialogLength = 0;
        this.words = [];
        this.pinyins = [];
        this.audio = [];
        this.category = []
        this.dialogRole = [];//记录每句话都由哪个角色说的
        this.Roles = [];//获取对话中所有的角色信息
        this.getDialogData(this.props.dialogData);
        this.time = null;//获取播放时间的计时器
        this.dialogSound = null;//音频
        this.audioCurrentTime = 0;//当前时间
        this.audioTimes = 0;//音频总时间
        this.blnShowBtnRecord = false;
        this.examRoleIndex = Math.min((this.Roles.length - 1), 1);
        this.examRole = this.Roles[this.examRoleIndex];//标记当前考试的Role,如果有多个角色,从第1个来
        this.blnShowPoint = false;
    }

    static propTypes = {
        dialogData: PropTypes.array,
        lessonID: PropTypes.string,
        courseID: PropTypes.number,
    };

    getDialogData = (data)=> {
        this.dialogLength = data.length;
        for (var i = 0; i < this.dialogLength; i++) {
            this.words[i] = data[i].cn.words;
            this.pinyins[i] = data[i].cn.pinyins;
            this.audio[i] = getMp3FilePath(this.props.lessonID, this.props.courseID) + '/' + data[i].mp3;
            this.category[i] = data[i].Category;
            this.dialogRole[i] = 'user' + (i % 2);//数据中还没有,先留个变量
            this.setRoles(this.dialogRole[i]);
        }
    }

    setRoles = (role)=> {//判断当前传进来的角色,是否已经在角色数组中,如果没有则添加一个
        var blnHave = false;
        for (var i = 0; i < this.Roles.length; i++) {
            if (this.Roles[i] == role) {
                blnHave = true;
                break;
            }
        }
        if (!blnHave) {
            this.Roles[this.Roles.length] = role;
        }
    }

    _onStartIconAnim = ()=> {//控制两个头像的动画
        if (this.state.nowIndex < this.dialogLength) {
            this.refs.roleIcon.hiddenIcon(this.state.nowIndex);
        }
    }

    handleInitAudio = (error)=> {
        if (error != null) {
            console.log('failed to load the sound! ', error.message);
        } else {
            this.audioCurrentTime = 0;
            this.audioTimes = this.dialogSound.getDuration();//初始化成功就播放
            this.playerAudio();
        }
    }
    initAudio = (index)=> {
        if (this.dialogSound != null) {
            this.releaseDialog();
        }
        console.log("initDialog:", this.audio[index]);
        this.dialogSound = new Sound(this.audio[index], Sound.DOCUMENT, this.handleInitAudio.bind(this));
    }

    getNowTime = ()=> { //获取当前播放时间,当获取成功后,设置进度条数值
        this.dialogSound.getCurrentTime(
            (time)=> {
                if (this.time) {
                    this.audioCurrentTime = time;
                    var progress = this.audioCurrentTime / this.audioTimes;//..调用设置icon的设置 Progress
                    this.refs.roleIcon.setProgress(progress);
                }
            })
    }

    playerAudio = ()=> {//开始播放声音
        this.dialogSound.play(this.audioPlayerEnd);
        this.time = setInterval(this.getNowTime.bind(this), 100);
    }

    audioPlayerEnd = ()=> {//声音播放完毕时调用
        if (this.time == null) return;
        clearInterval(this.time);
        this.time = null;
        this.refs.roleIcon.setProgress(0);
        this.onDialogOver();
        //..播放结束调用下一条啦
    }

    stopAudio = ()=> {//暂停按钮被按下时
        if (this.time != null) {
            clearInterval(this.time);
            this.time = null;
            this.refs.roleIcon.setProgress(0);
            this.dialogSound.stop();
        }
    }

    releaseDialog = ()=> {
        this.stopAudio();
        if (this.dialogSound) {
            this.dialogSound.release();//释放掉音频
            this.dialogSound = null;
        }
    }

    initRecord = (index)=> {
        var testText = this.words[index];//获取text
        var category = this.category[index];
        var fileName = getExamFilePath(this.props.lessonID, this.props.courseID, index);
        testText = testText.replace(/_/g, "");
        //console.log(testText + " " + dialogInfo.dIndex + " " + dialogInfo.gategory);
        this.refs.btnRecord.StartISE(testText, category, fileName);
    }

    showBtnRecord = ()=> {//将录音按钮显示出来
        this.blnShowBtnRecord = true;
        this.refs.btnRecord.setOpacityAnim(1);
    }

    hideBtnRecord = ()=> { //将录音按钮隐藏
        this.blnShowBtnRecord = false;
        this.refs.btnRecord.setOpacityAnim(0);
    }

    pauseRecord = ()=>{//暂停时调用此函数,将录音暂停
        if(this.refs.btnRecord){
            this.refs.btnRecord.stopRecord();
        }
    }

    callbackBtnRecord(msg, num) {
        if (msg == "record") {
            this.initRecord(this.state.nowIndex);
        } else if (msg == "stop") {
            this.refs.btnRecord.stopRecord();
        } else if (msg == "error") {
            this.refs.btnRecord.stopRecord();
            //弹出一个提示框
            //this.overRecording(msg, num);//如果出现异常,参数这样传
        } else if (msg == "result") {
            this.hideBtnRecord();
            //..this.overRecording(num.syllableScore, num.sentenctScore);//这样处理貌似不太合理,先凑合用吧~~
        } else if (msg == "AnimOver") {
            if (this.blnShowBtnRecord) {
                this.initRecord(this.state.nowIndex);
            } else {
                this.onDialogOver();
            }
        }
    }

    onDialogOver = ()=> {
        this.setState({nowIndex: this.state.nowIndex + 1});
    }

    onNextDialog = ()=> {
        if (this.blnShowPoint) {
            this.refs.greenPoint.startAnim();
            return;
        }
        if(this.state.blnExamPause){
            return;
        }
        if (this.state.nowIndex == this.dialogLength) {
            this.changeRole();
        } else {
            if (this.dialogRole[this.state.nowIndex] != this.examRole) {
                this.initAudio(this.state.nowIndex);
            } else {
                this.showBtnRecord();
            }
        }
    }

    changeRole = ()=> {
        if (this.examRoleIndex == 0) {
            console.log("exam is over");
        } else {
            this.setState({blnChangeRole: true});
        }
    }

    setChangeRole = ()=> {
        this.examRoleIndex = (this.examRoleIndex + 1) % (this.Roles.length);//获取下一个角色
        this.examRole = this.Roles[this.examRoleIndex];//标记当前考试的Role,如果有多个角色,从第1个来
        this.blnShowPoint = true;
        this.setState({nowIndex: 0, blnChangeRole: false});
    }

    componentDidMount() {
        if (this.state.blnCountdown) return;
        var timing = Animated.timing;
        InteractionManager.runAfterInteractions(()=> {
            Animated.parallel(['opacityAnim', 'translateYAnim'].map(parallel => {
                return timing(this.state[parallel], {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.linear,
                })
            })).start(this.onNextDialog)
        })
    }

    endOfCountdown = (type)=> {
        console.log("endofcountdown type:", type);
        if (type == 0) {
            this.setState({blnCountdown: false});
        } else if (type == 1) {
            this.blnShowPoint = false;
            this.onNextDialog();
        }
    }


    componentDidUpdate(pProps, pStates) {
        if (this.state.blnCountdown) return;
        if (pStates.blnChangeRole != this.state.blnChangeRole) {
            if (this.state.blnChangeRole) {
                this.state.opacityAnim.setValue(0);
                Animated.timing(this.state.opacityAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                }).start(this.setChangeRole.bind(this))
                return;
            }
        }

        if(pStates.blnExamPause != this.state.blnExamPause){
            if(this.state.blnExamPause){

            }else{
                this.onNextDialog();
            }
            return ;
        }

        if (pStates != this.state) {
            var timing = Animated.timing;
            this.state.opacityAnim.setValue(0);
            this.state.translateYAnim.setValue(0);
            Animated.parallel(['opacityAnim', 'translateYAnim'].map(parallel => {
                return timing(this.state[parallel], {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.linear,
                })
            })).start(this.onNextDialog)
            if (this.state.nowIndex > 0) {
                this._onStartIconAnim();
            }
        }
    }

    componentWillUnMount() {
        this.releaseDialog();
    }

    renderTop = ()=> {
        if (this.state.blnCountdown) return;
        return (
            <View style={styles.top}>
                <RoleIcon ref="roleIcon" imgSourceName={this.dialogRole}/>
            </View>
        );
    }

    renderContent = ()=> {
        if (this.state.blnCountdown) return;
        return (
            <View style={styles.content}>
                {this.state.nowIndex > 0 &&
                <Animated.View style={{
                        position:'absolute',
                        opacity:this.state.opacityAnim.interpolate({inputRange:[0,1],outputRange:[1,0]}),
                        transform:[{
                            translateY:this.state.translateYAnim.interpolate({
                                inputRange:[0,1],outputRange:[0,-AnimTransfromY]
                            })
                        }]
                    }}>
                    <Sentence ref="mySentence" style={styles.Sentence} words={this.words[this.state.nowIndex-1]}
                              pinyins={this.pinyins[this.state.nowIndex-1]}
                    />
                </Animated.View>
                }

                {this.state.nowIndex < this.dialogLength &&
                <Animated.View style={{
                        opacity:this.state.opacityAnim.interpolate({inputRange:[0,1],outputRange:[0.5,1]}),
                        transform:[{
                            translateY:this.state.translateYAnim.interpolate({
                                inputRange:[0,1],outputRange:[AnimTransfromY,0]
                            })
                        }]
                    }}>
                    {this.blnShowPoint && <GreenPoint ref="greenPoint" callback={this.endOfCountdown.bind(this)}/>}
                    <Sentence ref="mySentence" style={styles.Sentence} words={this.words[this.state.nowIndex]}
                              pinyins={this.pinyins[this.state.nowIndex]}
                    />
                </Animated.View>
                }
                {
                    this.state.nowIndex < this.dialogLength - 1 &&
                    <Animated.View style={{
                        opacity:this.state.opacityAnim.interpolate({inputRange:[0,1],outputRange:[0.5,0.5]}),
                        transform:[{
                            translateY:this.state.translateYAnim.interpolate({
                                inputRange:[0,1],outputRange:[AnimTransfromY,0]
                            })
                        }]
                    }}>
                        <Sentence ref="mySentence" style={styles.Sentence} words={this.words[this.state.nowIndex+1]}
                                  pinyins={this.pinyins[this.state.nowIndex+1]}
                        />
                    </Animated.View>
                }
            </View>
        );
    }

    renderBottom = ()=> {
        if (this.state.blnCountdown) return;
        return (
            <View style={styles.bottom}>
                <View style = {{transform:[{scale:1.35}]}}>
                    <BtnRecord blnOpacityAnimate={true} ref={'btnRecord'}
                               btnCallback={this.callbackBtnRecord.bind(this)}/>
                </View>
                <TouchableOpacity onPress = {this._onPressPause.bind(this)}>
                    <Image style={styles.btnPause} source={ImageRes.circle_btn_pause_26}/>
                </TouchableOpacity>
            </View>
        );
    }

    renderChangeRole = ()=> {
        if (this.state.blnChangeRole) {
            return (
                <Animated.Text style={[styles.changeText,{opacity:this.state.opacityAnim.interpolate({
                    inputRange:[0,0.4,0.5,0.6,1],outputRange:[0,1,1,1,0]
                })}]}>交换角色</Animated.Text>
            );
        }
    }

    renderPause = ()=>{
        if(this.state.blnExamPause){
            return <ExamPause callback = {this.callBackPause.bind(this)}/>
        }
    }

    _onPressPause = ()=>{
        this.stopAudio();
        this.pauseRecord();
        this.setState({blnExamPause:true});
    }

    restartExam = ()=>{
        this.blnShowBtnRecord = false;
        this.examRoleIndex = Math.min((this.Roles.length - 1), 1);
        this.examRole = this.Roles[this.examRoleIndex];//标记当前考试的Role,如果有多个角色,从第1个来
        this.blnShowPoint = false;
        this.state.opacityAnim.setValue(0);
        this.state.translateYAnim.setValue(0);
        this.setState({
            nowIndex: 0,
            blnCountdown: true,//倒计时ing...
            blnChangeRole: false,
            blnExamPause:false,
        })
    }

    callBackPause = (id)=>{
        if(id == 0){//退出
            this.props.PopPage();
        }else if(id == 1){//重来
            this.restartExam();
        }else if(id == 2){//继续
            this.setState({blnExamPause:false});
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderTop()}
                {this.renderContent()}
                {this.renderBottom()}
                {this.state.blnCountdown && <Countdown callback={this.endOfCountdown.bind(this)}/>}
                {this.renderChangeRole()}
                {this.renderPause()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: fontSize,
        justifyContent: 'space-between',
    },
    top: {
        //backgroundColor: '#ffff0011',
        width: totalWidth - fontSize * 2,
        height: fontSize * 8,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    content: {
        width: totalWidth - fontSize * 2,
        height: totalHeight - fontSize * 22,
        //backgroundColor: '#ff000011',
        paddingTop: fontSize * 1,
        overflow: 'hidden',
    },
    bottom: {
        //backgroundColor: '#ffff00',
        width: totalWidth - fontSize * 2,
        height: fontSize * 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnRecord: {
        width: fontSize * 6,
        height: fontSize * 6,
        borderRadius: fontSize * 3,
        backgroundColor: 'green',
    },
    btnPause: {
        width: fontSize * 3,
        height: fontSize * 3,
        //borderRadius: fontSize*1.5,
        //backgroundColor: 'gray',
        position: 'absolute',
        left: (totalWidth) / 2 - fontSize * 4,
        top: -fontSize * 2,
    },
    Sentence: {
        marginBottom: ScentenceSpace,
    },
    changeText: {
        fontSize: fontSize * 1.5,
        color: '#434343',
        position: 'absolute',
        width: 10 * fontSize ,
        height: fontSize * 2,
        top: (totalHeight - fontSize * 2) / 2,
        left: (totalWidth - 10 * fontSize) / 2,
        textAlign: 'center',
    }
});