/**
 * Created by tangweishu on 16/7/29.
 */
import React, {Component, PropTypes} from 'react'
import {View, Text, Image, ListView, StyleSheet, TouchableOpacity, NativeModules, ProgressViewIOS} from 'react-native'

import {
    getExamFilePath,
    getMp3FilePath,
    Consts,
    Scenes,
} from '../Constant';
import {
    ImageRes,
} from '../Resources';
import {
    minUnit,
    ScreenWidth,
    ScreenHeight,
    MinWidth,
} from '../Styles';
import Sentence from '../ListItem/C_NewSentence';
import ScoreCircle from '../Common/ScoreCircle'

fontSize = minUnit * 4;

export default class ExamResultList extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态         
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(this.props.dialogData),
            blnAutoPlay: false,
        };
        this.selectIndex = -1;
        this.arrList = [];
        this.time = new Date();

    }

    static propTypes = {
        dialogData: PropTypes.array,
        arrSyllableScore: PropTypes.array,
        arrSentenceScore: PropTypes.array,
        Score: PropTypes.number,
    }
    static defaultProps = {}
    renderTopBar = ()=> {
        return (
            <View style={styles.topBar}>
                <TouchableOpacity onPress={()=>{app.PopPage(Consts.POP_ROUTE, Scenes.MENU)}}>
                    <Image style={styles.backImg} source={ImageRes.ic_back}/>
                </TouchableOpacity>
                <Text style={styles.textTitle}>闯关结果</Text>
                <ScoreCircle score={this.props.Score}/>
            </View>
        );
    }

    _onPressBtn = ()=> {
        if (this.state.blnAutoPlay) {
            this.arrList[this.selectIndex].stopAudio();
            this.selectIndex = -1;
            this.setState({blnAutoPlay: false});
        } else {
            if (this.selectIndex != -1) {
                this.arrList[this.selectIndex].stopAudio();
            }
            this.selectIndex = 0;
            this.setState({blnAutoPlay: true});
        }
    }

    renderBottomBar = ()=> {
        return (
            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={this._onPressBtn.bind(this)}>
                     <Image style={styles.playImg} source={this.state.blnAutoPlay?ImageRes.btn_pause:ImageRes.btn_playing}/>
                </TouchableOpacity>
                <Text style={styles.textTitle}>播放成绩单</Text>
            </View>
        );
    }

    itemCallback = (msg, index)=> {
        nowSelect = index;
        preSelect = this.selectIndex;

        if (msg == "play") {
            if (this.selectIndex >= 0) {
                this.arrList[preSelect].stopAudio();
            }
            //..this.arrList[nowSelect].playerAudio();
            this.arrList[nowSelect].InitPcm();
            this.selectIndex = index;
        } else if (msg == "stop") {
            if (this.selectIndex >= 0) {
                this.arrList[nowSelect].stopAudio();
                this.selectIndex = -1;
            } else {
                logf("itemCallback 出现异常:", this.selectIndex, index);
            }
        } else if (msg == "over") {
            if (this.state.blnAutoPlay) {
                if(this.selectIndex < this.props.dialogData.length-1){
                    this.selectIndex += 1;
                    this.arrList[this.selectIndex]._onPress();
                }else{
                    this.selectIndex = -1;
                    this.setState({blnAutoPlay:false})
                }
            } else {
                if (this.selectIndex >= 0) {
                    this.selectIndex = -1;
                } else {
                    logf("itemCallback 出现异常:", this.selectIndex, index);
                }
            }
        }
    }

    renderItem = (rowData, sectionID, rowID, highlightRow)=> {
        var index = Number(rowID);
        var refName = "item" + rowID;
        return (<ResultItem ref={(ref)=>{this.arrList[index]=ref}} itemIndex={index} itemWords={rowData.cn.words}
                            itemPinyins={rowData.cn.pinyins} itemEN={rowData.en}
                            arrSyllableScore={this.props.arrSyllableScore[index]}
                            sentenceScore={this.props.arrSentenceScore[index]}
                            itemCallback={this.itemCallback.bind(this)}
                            recordName={getExamFilePath(app.temp.lesson.key, app.temp.courseID, index)}
        />);
    }

    componentDidMount() {
        logf("--P_ExamResultList Did Mount:--", this.time - new Date());
    }

    componentWillUpdate(nProps, nStates) {
        if (nStates.blnAutoPlay != this.state.blnAutoPlay) {
            if (nStates.blnAutoPlay) {
                this.arrList[this.selectIndex].InitPcm();
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderTopBar()}
                <ListView
                    ref="list"
                    //initialListSize={6}
                    //pageSize={1}
                    scrollRenderAheadDistance={minUnit}
                    removeClippedSubviews={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderItem.bind(this)}

                />
                {this.renderBottomBar()}
            </View>
        );
    }
}


var XFiseBridge = NativeModules.XFiseBridge;
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

class ResultItem extends Component {
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
            playerState: 0,//0:等待播放,1:播放中
        };
    }

    static propTypes = {
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
        this.setState({
            playerState: 1,
            progress: 0,
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
        if (this.time == null)return;
        clearInterval(this.time);
        this.time = null;
        this.props.itemCallback("over", this.props.itemIndex);
        this.setState({
            playerState: 0,
            progress: 0,//..解决再次播放进度条不归零问题
        });
    }
    stopAudio = ()=> {//强制停止声音播放--当播放时外界出现其他操作强行停止播放时调用
        if (this.state.playerState != 0) {//只有当已经启动播放后 此函数才起作用
            this.StopPcm();
            clearInterval(this.time);
            this.time = null;
            this.setState({
                playerState: 0,
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
        /*this.InitPcm(this.props.recordName);*/
    }

    componentWillUnmount() {
        this.pcmListener.remove();
        clearInterval(this.time);
        this.time = null;
    }

    _onPress = ()=> {
        if (this.state.playerState == 1) {
            this.props.itemCallback("stop", this.props.itemIndex);
        } else {
            this.props.itemCallback("play", this.props.itemIndex);
        }
    }

    render() {
        return (
            <TouchableOpacity style={styles.itemView} onPress={this._onPress.bind(this)} activeOpacity={0.5}>
                <View style={styles.itemContent}>
                    <Sentence words={this.props.itemWords} pinyins={this.props.itemPinyins}
                              arrScore={this.props.arrSyllableScore}/>
                    <Text
                        style={{fontSize:fontSize,color:'#757575',marginTop:fontSize*0.4,marginLeft:fontSize/2}}>{this.props.itemEN}</Text>
                </View>
                {this.state.progress>0&&<ProgressViewIOS style={styles.progress} progress={this.state.progress} progressTintColor="#4ACE35"/>}
                <ScoreCircle score={this.props.sentenceScore}/>
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    topBar: {
        flexDirection: 'row',
        width: ScreenWidth,
        height: fontSize * 4,
        //backgroundColor: '#ffff0022',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: fontSize,
        paddingHorizontal: fontSize,
        borderBottomWidth: MinWidth,
        borderBottomColor: '#CBCBCB',
    },
    backImg: {
        width: minUnit * 9,
        height: minUnit * 9,
        //backgroundColor:'#ff0000'
    },
    textTitle: {
        textAlign: 'center',
        color: '#787878',
        fontSize: fontSize * 1.25,
    },
    bottomBar: {
        position: 'absolute',
        flexDirection: 'row',
        width: ScreenWidth,
        height: fontSize * 4,
        left: 0,
        top: ScreenHeight - fontSize * 4,
        backgroundColor: '#ffffff',
        //justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: MinWidth,
        borderTopColor: '#CBCBCB',
        paddingHorizontal: fontSize,
    },
    playImg: {
        width: minUnit * 9,
        height: minUnit * 9,
        marginRight: minUnit,
    },
    itemView: {
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