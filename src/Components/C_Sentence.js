/**
 * Created by tangweishu on 16/6/29.
 */
/**
 * Created by tangweishu on 16/6/29.
 */
/**
 * Created by tangweishu on 16/6/28.
 */

'use strict';
import React, {Component, PropTypes} from 'react';
import ReactNative, {
    StyleSheet,
    View,
    Text,
    PixelRatio,
}from 'react-native'

import Word from './C_Word'
var Dimensions = require('Dimensions');
var totalWidth = Dimensions.get('window').width;
var totalHeight = Dimensions.get('window').height;
var fontSize = parseInt(totalWidth / 26)

//..const PUNCTUATION = [',','','','“','”'];//标点符号集(中文符号)

export default class Sentence extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    static defaultProps = {
        words: PropTypes.string,
        pinyins: PropTypes.string,
        style: PropTypes.object,
        touch: PropTypes.object,
    };
    wordCount = 0;//记录一下这句话中有多少组词汇

    setPingce = (arrScore)=>{
        var strWord = this.props.words;
        strWord = strWord.replace(/[，。！？；“”‘’：]/g, "");
        var strPinYin = this.props.pinyins;
        var wordArr = strWord.split("_");
        var pinyinArr = strPinYin.split("_"); //字符'_'分词 字符' '区分拼音
        if (wordArr.length != pinyinArr.length) {
            console.log("句子的词汇数与拼音数据中不符");
        } else {
            var index = 0;
            for (var i = 0; i < wordArr.length; i++) {
                var length = wordArr[i].length;
                //..console.log("第"+i+"个词的评测情况:"+ wordArr[i]+":"+arrScore.slice(index,index+length));

                if(arrScore == "error"){                     
                    this.refs["word"+i].setPingce("error");
                }else{
                    this.refs["word"+i].setPingce(arrScore.slice(index,index+length));
                }
                
                index += length;
            }
        }
    }
    drawArrWords = ()=> {
        var arrWords = [];
        var strWord = this.props.words;
        var strPinYin = this.props.pinyins;
        var wordArr = strWord.split("_");
        var pinyinArr = strPinYin.split("_"); //字符'_'分词 字符' '区分拼音
        if (wordArr.length != pinyinArr.length) {
            console.log("句子的词汇数与拼音数据中不符");
        } else {
            for (var i = 0; i < wordArr.length; i++) {
                arrWords.push(<Word ref={"word"+i} style={styles.word} words={wordArr[i]} pinyins={pinyinArr[i]} key={i}
                />);
            }
        }
        this.wordCount = wordArr.length;
        return arrWords;
    }
    myLayout = null;
    blnInTouch = false;
    _onLayout = (event)=> {
        this.myLayout = event.nativeEvent.layout;             
    }
    blnTouchSentence = (touch, fatherLayout)=> {
        var colLayout = {
            x: this.myLayout.x + fatherLayout.x,
            y: this.myLayout.y + fatherLayout.y,
            w: this.myLayout.width,
            h: this.myLayout.height,
        };
        if (this.blnInTouch) {
            if (this.blnInRange(touch, colLayout)) {
                
            } else {
                this.blnInTouch = false;
            }
            for (var i = 0; i < this.wordCount; i++) {
                var refName = "word" + i;
                if (this.refs[refName].blnTouchWord(touch, colLayout)) {
                    break;
                }
            }
        } else {
            if(this.blnInRange(touch,colLayout)){
                this.blnInTouch = true;                 
                for (var i = 0; i < this.wordCount; i++) {
                    var refName = "word" + i;
                    if (this.refs[refName].blnTouchWord(touch, colLayout)) {                        
                        break;
                    }
                }
            }
        }
        
        return this.blnInTouch;
    }
    blnInRange = (touch, layout)=> {//判断手指是否在layout 区域内
        let tx = touch.tx;
        let ty = touch.ty;        
        if (ty > layout.y && ty < (layout.y + layout.h)) {            
            if (tx > layout.x && tx < layout.x + layout.w) {                
                return true;
            }
        }
        return false;
    }
    getTouchState = ()=>{
        return this.blnInTouch;
    }
    setMoveEnd = ()=> {
        this.blnInTouch = false;//手指离开屏幕时调用这个
        for(var i=0;i<this.wordCount;i++){
            var refName = "word"+i;
            if(this.refs[refName].getTouchState()){
                this.refs[refName].setMoveEnd()
            }
        }
    }

    render() {        
        return (
            <View onLayout={this._onLayout.bind(this)}
                  style={[this.props.style,styles.container,this.state.blnSelect&&{backgroundColor:'#C5D6E6'}] }>
                {this.drawArrWords()}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {//主背景
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    word: {
        marginHorizontal: 0.3 * fontSize,
        marginBottom:0.5*fontSize,//唐7-12 解决句子换行显示垂直方向挤在一块的问题
    }
})