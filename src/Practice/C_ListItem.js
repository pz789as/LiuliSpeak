/**
 * Created by tangweishu on 16/6/27.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Image,
}from 'react-native'
import {
    ImageRes,
    ImageIcon,
} from '../Resources';
import {
    ScreenWidth,
    minUnit,
    MinWidth,
} from '../Styles';
import {
    getAudioFilePath,
    getMp3FilePath,
} from '../Constant';

import ScoreCircle from '../Common/ScoreCircle'
import Sentence from './C_NewSentence';
import AllBotton from  './C_AllButtons';


import Toast from 'react-native-root-toast';

var totalWidth = ScreenWidth;
var fontSize = parseInt(minUnit * 4);
var spacing = fontSize * 1;//内容之间的间距

export default class ListItem extends Component {
    height = 0;

    constructor(props) {
        super(props);
        this.itemIndex = this.props.itemIndex;
        this.state = {};
        this.useTime = new Date();
        var strUser = "user" + this.props.dialogInfo.user;

        this.userIcon = ImageIcon[strUser];
        this.recordFileName = getAudioFilePath(app.temp.lesson.key, app.temp.courseID, this.itemIndex);
    }

    myLayout = null;//记录item的位置
    contentLayout = null;//记录item中的内容部分view的位置
    blnInTouch = false;//一个标记,判断自己是否属于手势控制范围

    static propTypes = {
        itemShowType: PropTypes.number,//当前item展示类型(0只显示中文,1只显示英文,2都显示 默认应该为2的)
        itemScore: PropTypes.number,//从数据库中获取的分数
        dialogInfo: PropTypes.object,//对话信息
        getRate: PropTypes.func,
        blnSelect:PropTypes.bool,
        blnHaveRecord:PropTypes.bool,
        //blnAutoplay: PropTypes.bool,
        //playNext: PropTypes.func,
        //itemCoins: PropTypes.number,//从数据库中获取的金币数量
    };

    _onAutoplay = ()=> { //接收到父组要调用自动播放的指令        
        this.refs.allBotton.autoplay();
    }

    _onStopAutoplay = ()=> {//接收到父组件调用暂停自动播放的指令
        this.refs.allBotton.stopAutoplay();
    }

    _onStopAllWork = ()=>{
        if(this.refs.allBotton){
            this.refs.allBotton.stopAllWork();
        }
    } 
    
    _onInactive = ()=>{
        if(this.refs.allBotton){
            this.refs.allBotton._onInactive();
        }
    }

    componentWillMount() {
        /*var time = new Date();
        this.useTime = time;
        var practiceSave = app.getPracticeSave(app.temp.lesson.key,app.temp.courseID);
        this.syllableScore = practiceSave.contents[this.itemIndex].p_SyllableScore;
        var saveSocre = practiceSave.contents[this.itemIndex].p_score;
        var blnHaveRecord = this.syllableScore.length > 0
        this.setState({score: saveSocre, btnCount: blnHaveRecord ? 3 : 2});*/
    }

    componentDidMount() {
        var time = new Date();
        //..logf("C_ListItem DidMount User time:", this.itemIndex, time - this.useTime);
        //this.useTime = time;
        //logf("DidMount:", this.itemIndex, "当前时间:", this.useTime.getTime());
    } 

    callbackAllBtn = (btn, msg)=> {
        if (btn == "btnPlay") {
            if (msg == "playover") {
                this.props.itemCallback(this.itemIndex,"playover")
            }
        } else if (btn == "btnRecord") {
            this.setPingceResult(msg);
        } else if (btn == "btnRecPlay") {

        } else if (btn == "btnQuestion") {

        }
    }

    _onPress = ()=>{
        if(practiceInAutoplay)return
        this.props.itemCallback(this.itemIndex,"select");
    }

    render() {
        const {dialogInfo} = this.props;//获取属性值
        //console.log("dialogInfo",this.itemIndex,dialogInfo);
        var itemWordCN = dialogInfo.cn;
        var itemWordEN = dialogInfo.en;
        //..logf("render item:", this.itemIndex);

        return (
            <TouchableOpacity  activeOpacity={1} ref="item"
                onPress={this._onPress.bind(this)}
                //pointerEvents={this.props.blnAutoplay?"box-only":"auto"}
                style={[styles.container,{backgroundColor:this.props.blnSelect?'#FFFFFF':'#EBEBEB'}]}
                onLayout={this._onLayout.bind(this)}>

                <Image style={styles.iconImage} source={this.userIcon}/>
                <View style={styles.contentView} onLayout={this._onLayoutContentView.bind(this)}>
                    {(this.props.itemShowType != 1) &&
                    <Sentence ref="mySentence" words={itemWordCN.words}
                              pinyins={itemWordCN.pinyins}
                              touch={this.state.touch}
                              arrScore={this.props.syllableScore}
                              clickEvent = {this._onPress.bind(this)}
                              touchDisabled = {false}
                    /> }

                    {(this.props.itemShowType != 0) && <Text style={[styles.textWordEN]}>{itemWordEN}</Text>}

                    {this.props.blnSelect && <AllBotton ref="allBotton"
                                                        blnHaveRecord={this.props.blnHaveRecord}
                                                        dialogInfo={dialogInfo}
                                                        itemIndex = {this.itemIndex}
                                                        btnCallback={this.callbackAllBtn.bind(this)}
                                                        getRate={this.props.getRate.bind(this)}/>
                    }
                </View>
                {this.drawScore()}
            </TouchableOpacity>
        );
    }

    setPointEvent = (value)=> {
        this.refs.item.setNativeProps({pointerEvents: value});
    }

    _onLayout = (event)=> {
        this.myLayout = event.nativeEvent.layout;
    }

    getLayout =()=>{
        return this.myLayout
    }

    _onLayoutContentView = (event)=> {
        this.contentLayout = event.nativeEvent.layout;//获取contentView的位置,这个是要传递给子组件"句子".
    }
    /*
    existsRecordFile = ()=> {
        var basePath = RNFS.CachesDirectoryPath + '/';
        var fileName = this.recordFileName;
        var path = basePath + fileName;

        RNFS.exists(path).then((result)=> {
            if (result === true) {
                this.setState({btnCount: 4});
            } else {
                this.setState({btnCount: 2});
            }
        })
    }*/


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
                //logf("手指离开了此区域");
                this.blnInTouch = false;
            }
            this.collisionSentence(touch, colLayout);//判断此手势是否在当前item的"句子"子组件上
        } else {
            if (this.blnInRange(touch, colLayout)) {//如果touch在自己的位置
                //logf("触碰我这儿了");
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
        if (!this.props.blnHaveRecord)return;
        return (<ScoreCircle score={this.props.itemScore}/>)
    }

    setPingceResult(result) {//唐7-11
        logf("运行C_listITEM 的 setPingceResult:" + result.blnSuccess + result.score + result.syllableScore + "--Index--",result.index);
        const {blnSuccess, score, syllableScore,index} = result;
        logf("评测返回的分数:",score);
        if (blnSuccess) {
            //..this.refs.mySentence.setPingce(syllableScore); //评测打分..
            var rndScore = Math.min(95, score) - 3 + parseInt(Math.random() * 6);
            if (score < 63) { //如果没及格,就别给随机分数了
                rndScore = score;
            }
            app.saveSingleScore(index, 0, rndScore, syllableScore)
            this.props.itemCallback(index,"PingCe",rndScore,syllableScore)
            //..app.saveSingleScore(this.itemIndex, 0, rndScore, syllableScore)
            //..this.props.itemCallback(this.itemIndex,"PingCe",rndScore,syllableScore)
        } else {
            if (syllableScore == 0) {
                logf("未知的异常");
            } else {
                var errKey = syllableScore.slice(0,5);
                logf("练习中讯飞返回的错误代码:", errKey);
                var errMessage = app.getErrorMsg(errKey);
                this.showToast(errMessage)
            }
            app.saveSingleScore(index, 0, score, "error")
            this.props.itemCallback(index,"PingCe",score,"error")
            // app.saveSingleScore(this.itemIndex, 0, score, "error")
            // this.props.itemCallback(this.itemIndex,"PingCe",score,"error")
        }
    }
    // setPingceResult(result) {//唐7-11
    //     logf("运行C_listITEM 的 setPingceResult:" + result.blnSuccess + result.score + result.syllableScore + "--Index--",result.index);
    //     const {blnSuccess, score, syllableScore,index} = result;
    //     if (blnSuccess) {
    //         this.syllableScore = syllableScore;
    //         //..this.refs.mySentence.setPingce(syllableScore); //评测打分..
    //         var rndScore = Math.min(95, score) - 3 + parseInt(Math.random() * 6);
    //         if (score < 63) { //如果没及格,就别给随机分数了
    //             rndScore = score;
    //         }
    //         app.saveSingleScore(index, 0, rndScore, this.syllableScore)
    //         this.props.itemCallback(index,"PingCe",rndScore,this.syllableScore)
    //         //..app.saveSingleScore(this.itemIndex, 0, rndScore, this.syllableScore)
    //         //..this.props.itemCallback(this.itemIndex,"PingCe",rndScore,this.syllableScore)
    //     } else {
    //         if (syllableScore == 0) {
    //             logf("未知的异常");
    //         } else {
    //             var errKey = syllableScore.slice(0,5);
    //             logf("练习中讯飞返回的错误代码:", errKey);
    //             var errMessage = app.getErrorMsg(errKey);
    //             this.showToast(errMessage)
    //         }
    //         this.syllableScore = "error";
    //         app.saveSingleScore(index, 0, score, "error")
    //         this.props.itemCallback(index,"PingCe",score,"error")
    //         // app.saveSingleScore(this.itemIndex, 0, score, "error")
    //         // this.props.itemCallback(this.itemIndex,"PingCe",score,"error")
    //     }
    // }
    
    
    toast = null;    
    showToast = (message)=> {
        //let message = '录音时间过短\n请对着麦克风再次朗读';
        //message = '网络出现异常 \n 请稍候再试'

        this.toast && this.toast.destroy();         
        this.toast = Toast.show(message, {
            duration: 2000,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: 'rgba(0,0,0,88)',
            shadowColor: '#000000',
            textColor: 'white',
            fontSize:fontSize*1.5,
            padding:fontSize*1.5,
            onHidden: () => {
                this.toast.destroy();
                this.toast = null;
            }
        });
    }
    

    _onJumpPage = ()=> {//当P_Practice页面点击"返回上一级"时"当前选中的item"调用此函数
        this.refs.allBotton.releaseComponent();
    }
}

const styles = StyleSheet.create({
    container: {//主背景
        flexDirection: 'row',
        width: totalWidth,
        borderBottomWidth: MinWidth*2,
        borderBottomColor: '#CBCBCB',
        paddingVertical: spacing*0.5,//给个1个汉字大小的内边距
        paddingHorizontal: spacing / 4,
        overflow: 'hidden',
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

    textWordEN: {//英文翻译的样式
        fontSize: fontSize,
        color: '#757575',
        //marginBottom: spacing,
        marginLeft: fontSize / 2,
        marginVertical: spacing / 2,
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
        backgroundColor: 'red',
        width: fontSize * 2.5,
        height: fontSize * 2.5,
        borderRadius: fontSize * 2.5 / 2,
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
        fontSize: fontSize,
        width: fontSize * 2,
        color: '#757575',
        right: fontSize / 2,
        bottom: fontSize / 2,

        //backgroundColor:'white',
    },
    coinImage: {//金币图标样式
        width: fontSize * 0.7,
        height: fontSize * 0.7,
        borderRadius: fontSize * 0.35,
        backgroundColor: '#EF911D',
        top: fontSize / 2 - 2 * MinWidth,
        left: fontSize / 2,
    },

});