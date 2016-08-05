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
import Sentence from '../ListItem/C_NewSentence';
import AllBotton from  '../ListItem/C_AllButtons';
import RNFS from 'react-native-fs'


import Toast from 'react-native-root-toast';

var totalWidth = ScreenWidth;
var fontSize = parseInt(minUnit * 4);
var spacing = fontSize * 1;//内容之间的间距

export default class ListItem extends Component {
    height = 0;

    constructor(props) {
        super(props);
        // 初始状态
        this.itemIndex = this.props.dialogInfo.itemIndex;
        this.state = {
            score: this.props.itemScore,
            //coins: this.props.itemCoins,
            blnLow: false,
            blnSelect: (this.itemIndex == 0),
            showType: this.props.itemShowType,//默认的显示类型由属性传递
            btnCount: 2,
        };
        this.syllableScore = [];
        this.useTime = new Date();
        var strUser = "user" + this.props.dialogInfo.user;
        //logf("strUser:", strUser);
        this.userIcon = ImageIcon[strUser];
        this.recordFileName = getAudioFilePath(this.props.dialogInfo.lesson, this.props.dialogInfo.course, this.props.dialogInfo.itemIndex);
    }

    myLayout = null;//记录item的位置
    contentLayout = null;//记录item中的内容部分view的位置
    blnInTouch = false;//一个标记,判断自己是否属于手势控制范围
    static propTypes = {
        itemShowType: PropTypes.number,//当前item展示类型(0只显示中文,1只显示英文,2都显示 默认应该为2的)
        itemScore: PropTypes.number,//从数据库中获取的分数
        //itemCoins: PropTypes.number,//从数据库中获取的金币数量
        dialogInfo: PropTypes.object,//对话信息
        playNext: PropTypes.func,
        getRate: PropTypes.func,
        blnAutoplay: PropTypes.bool,
    };

    _onAutoplay = ()=> { //接收到父组要调用自动播放的指令        
        this.refs.allBotton.autoplay();
    }

    _onStopAutoplay = ()=> {//接收到父组件调用暂停自动播放的指令
        this.refs.allBotton.stopAutoplay();
    }

    componentWillMount() {
        var time = new Date();
        //logf("C_ListItem WillMount User time:", this.itemIndex, time - this.useTime);
        this.useTime = time;
        //logf("WillMount:", this.itemIndex, "当前时间:", this.useTime.getTime());
        //..this.existsRecordFile();//检查是否有录音文件

        var practiceSave = app.getPracticeSave(app.temp.lesson.key,app.temp.courseID);
        //logf("C_ListItem PracticeSave:", practiceSave);

        this.syllableScore = practiceSave.contents[this.itemIndex].p_SyllableScore;
        //logf("C_ListItem syllableScore:", this.syllableScore);
        var saveSocre = practiceSave.contents[this.itemIndex].p_score;
        //logf("C_ListItem p_Score:", saveSocre);
        var blnHaveRecord = this.syllableScore.length > 0
        this.setState({score: saveSocre, btnCount: blnHaveRecord ? 3 : 2});
    }

    componentDidMount() {
        var time = new Date();
        logf("C_ListItem DidMount User time:", this.itemIndex, time - this.useTime);
        this.useTime = time;
        logf("DidMount:", this.itemIndex, "当前时间:", this.useTime.getTime());
    }

    shouldComponentUpdate(nextProps, nextStates) {
        var blnUpdate = false;
        if (nextStates != this.state) {
            //..logf("nextState:",nextStates);
            //..logf("this.state:",this.state);
            blnUpdate = true;
        }
        return blnUpdate;
    }

    callbackAllBtn = (btn, msg)=> {
        if (btn == "btnPlay") {
            if (msg == "playover") {
                this.props.playNext();
            }
        } else if (btn == "btnRecord") {
            this.setPingceResult(msg);
        } else if (btn == "btnRecPlay") {

        } else if (btn == "btnQuestion") {

        }
    }

    render() {
        const {dialogInfo} = this.props;//获取属性值
        const {itemWordCN, itemWordEN} = dialogInfo;
        logf("render item:", this.itemIndex,this.props.blnAutoplay);

        return (
            <View
                ref="item"
                pointerEvents={this.props.blnAutoplay?"box-only":"auto"}
                style={[styles.container,{backgroundColor:this.state.blnSelect?'#FFFFFF':'#EBEBEB'}]}
                onLayout={this._onLayout.bind(this)}>

                <Image style={styles.iconImage} source={this.userIcon}/>
                <View style={styles.contentView} onLayout={this._onLayoutContentView.bind(this)}>
                    {(this.state.showType != 1) &&
                    <Sentence ref="mySentence" words={itemWordCN.words}
                              pinyins={itemWordCN.pinyins}
                              touch={this.state.touch}
                              arrScore={this.syllableScore}
                    /> }

                    {(this.state.showType != 0) && <Text style={[styles.textWordEN]}>{itemWordEN}</Text>}

                    {this.state.blnSelect && <AllBotton ref="allBotton"
                                                        btnCount={this.state.btnCount}
                                                        dialogInfo={dialogInfo}
                                                        btnCallback={this.callbackAllBtn.bind(this)}
                                                        getRate={this.props.getRate.bind(this)}/>
                    }
                </View>
                {this.drawScore()}
            </View>
        );
    }

    setPointEvent = (value)=> {
        this.refs.item.setNativeProps({pointerEvents: value});
    }

    _onLayout = (event)=> {
        this.myLayout = event.nativeEvent.layout;
        var getHeight = this.myLayout.height;
        this.height = getHeight;
        //logf('height:', getHeight)
        //logf('6*fontSize', 6 * fontSize);
        if (getHeight < 5 * fontSize) { //当内容很少时,为了适配右下角金币显示的位置而做的特殊处理
            logf('低于最小高度了亲...');
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
                this.setState({btnCount: 4});
            } else {
                this.setState({btnCount: 2});
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
        if (this.state.btnCount == 2)return;
        return (<ScoreCircle score={this.state.score}/>)
        //if (!this.state.blnHaveRecord) return;
        /*if (this.state.score >= 60) {
         return (
         <View style={[styles.scoreView,{backgroundColor:this.getScoreViewColor()}]}>
         <Text style={{fontSize:fontSize,color:'#F0FFE7'}}>{this.state.score}</Text>
         </View>
         );
         } else {
         return (
         <Image  style={styles.badImage} source={ImageRes.icon_bad}/>
         )
         }*/

    }

    setPingceResult(result) {//唐7-11
        logf("运行C_listITEM 的 setPingceResult:" + result.blnSuccess + result.score + result.syllableScore);

        const {blnSuccess, score, syllableScore} = result;
        if (blnSuccess) {
            this.syllableScore = syllableScore;
            this.refs.mySentence.setPingce(syllableScore); //评测打分..
            var rndScore = Math.min(95, score) - 3 + parseInt(Math.random() * 6);
            if (score < 63) { //如果没及格,就别给随机分数了
                rndScore = score;
            }
            app.saveSingleScore(this.itemIndex, 0, rndScore, this.syllableScore)
        } else {
            if (syllableScore == 0) {
                logf("未知的异常");
            } else {                
                var errKey = syllableScore.slice(0,5);
                logf("练习中讯飞返回的错误代码:", errKey);
                var errMessage = app.getErrorMsg(errKey);
                this.showToast(errMessage)
            }
            this.refs.mySentence.setPingce("error");
            app.saveSingleScore(this.itemIndex, 0, score, [])
        }
        if (this.state.btnCount == 2) {
            this.setState({score: rndScore, btnCount: 3}); //评测打分..
        } else {
            this.setState({score: rndScore}); //评测打分..
        }
    }
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

    _onSelectItem = ()=> {//选中item时调用        
        this.setState({blnSelect: true});
    }

    _onHiddenItem = ()=> {//item由选中到非选中时调用       
        this.setState({blnSelect: false});
    }

    _onChangeShowType = (type)=> {
        if (this.state.showType != type) {
            this.setState({showType: type});
        }
    }

    _onJumpPage = ()=> {//当P_Practice页面点击"返回上一级"时"当前选中的item"调用此函数
        this.refs.allBotton.releaseComponent();
    }
}

const styles = StyleSheet.create({
    container: {//主背景
        flexDirection: 'row',
        width: totalWidth,
        borderBottomWidth: MinWidth,
        borderBottomColor: '#CBCBCB',
        paddingVertical: spacing,//给个1个汉字大小的内边距
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