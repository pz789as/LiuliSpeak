/**
 * Created by tangweishu on 16/7/25.
 */
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
    
}from 'react-native'
import {
    minUnit,
    MinWidth,    
    ScreenWidth,
    ScreenHeight,
} from '../Styles';
var aspectRatio = ScreenWidth/ScreenHeight;
var fontSize = aspectRatio>0.6?parseInt(minUnit*3):parseInt(minUnit*4);
//var fontSize = parseInt(minUnit*4);
 
const PUNCTUATION = ['，', '。', '？', '“', '”', '！', '：', '（', '）', '；'];//标点符号集(中文符号)


export default class Sentence extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            blnRefresh:false,
        };
        this.wordCount = 0;
        this.arrWordStart = [];
        this.arrWordLength = [];
        this.arrSyllableWord = [];
        this.arrSyllablePY = [];
        this.arrSyllableColor = [];
        this.arrSyllableScore = [];
        this.setSyllable(this.props.words,this.props.pinyins);
        this.setSyllableColor(this.props.arrScore);
    }

    static propTypes = {
        words: PropTypes.string,
        pinyins: PropTypes.string,        
        touch: PropTypes.object,
        arrScore:PropTypes.oneOfType([PropTypes.string,PropTypes.array]),
    };
    static defaultProps = {       
        touch: null,
        arrScore:[],
    };

    setSyllable = (words,pinyins)=>{
        var dataSentWords = words;
        var dataSentPys = pinyins; //先获取到数据中的数值
        var sentWords = dataSentWords.split("_");//汉字内容第一层解析
        var sentPys = dataSentPys.split("_");//拼音内容第一层解析
        var syllCount = 0;
        if(sentWords.length != sentPys.length){//检查词汇格式是否匹配
            logf("句子的词汇数与拼音数据中不符");
        }else{
            this.wordCount = sentWords.length;//记录本句词汇的数量
            for(var i=0;i<sentWords.length;i++){
                var words = sentWords[i];//获取到句子中的每个词汇
                var pys = sentPys[i].split(" ");//拼音数据的第二层解析
                var wordsLength = words.length - this.getPunctuationCount(words);//获取除标点以外的词汇实际长度
                if(wordsLength != pys.length){//检查词汇中汉字与拼音是否一样多
                    logf("词汇中的字数与拼音数据中不符");
                }else{
                    this.arrWordStart[i] = syllCount;
                    this.arrWordLength[i] = words.length;//记录下当前词汇的长度
                    for(var j=0;j<words.length;j++){
                        var syllWord = words[j];
                        var syllPy = '';
                        var punctuationCount = 0;
                        if(PUNCTUATION.indexOf(words[j])>=0){
                            syllPy = '\n';
                            punctuationCount += 1;//跳过标点符号
                        }else{
                            syllPy = pys[j-punctuationCount] + '\n';
                        }
                        this.arrSyllableWord[syllCount] = syllWord;
                        this.arrSyllablePY[syllCount] = syllPy;
                        syllCount += 1;
                    }
                }
            }
        }
    }

    setSyllableColor = (arrScore)=>{
        //logf("arrScore:",arrScore);
        if(arrScore.length == 0){//给默认的颜色值
            for(var i=0;i<this.arrSyllablePY.length;i++){
                this.arrSyllableColor[i] = '#434343';
            }
        }else if(arrScore == "error"){
            var tmpIndex = 0;
            for(var i=0;i<this.arrSyllablePY.length;i++){
                if(this.arrSyllablePY[i] == '\n'){
                    this.arrSyllableColor[i] = '#434343';
                }else{
                    this.arrSyllableColor[i] = '#ff0000';
                    tmpIndex += 1;
                }
            }
        }else{
            //先检测实际汉字和分数数据的长度是否匹配
            var tmpWord = this.props.words;
            tmpWord = tmpWord.replace(/[，_。！？；“”‘’：]/g, "");
            //logf("tmpWord:",tmpWord);
            if(tmpWord.length != arrScore.length){
                logf("检测到分数和实际字数不符");
            }else{
                var tmpIndex = 0;
                for(var i=0;i<this.arrSyllablePY.length;i++){
                    if(this.arrSyllablePY[i] == '\n'){
                        this.arrSyllableColor[i] = '#434343';
                        this.arrSyllableScore[i] = ' '
                    }else{
                        this.arrSyllableColor[i] = this.getColor(arrScore[tmpIndex]);
                        this.arrSyllableScore[i] = arrScore[tmpIndex];
                        tmpIndex += 1;
                    }
                }
            }
        }

    }

    getColor = (score)=>{
        var zeroCount = 0;
        var tmpCol = "#434343";//默认颜色值
        if(score == "error"){
            return "#ff0000";
        }

        for(var i=0;i<score.length;i++){
            if(score.charAt(i)=="0"){
                zeroCount+=1;
            }
        }
        if(zeroCount == 3){ //3个0 红色
            tmpCol = "#ff0000";
        }else if(zeroCount == 2){//2个0 绿色
            tmpCol = "#434343";
        }else if(zeroCount == 1){
            tmpCol = "#F2B225"
        }else{
            tmpCol = '#49CD36';
        }
        return tmpCol;
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
            if (this.blnInRange(touch, colLayout)) {
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
    getTouchState = ()=> {
        return this.blnInTouch;
    }
    setMoveEnd = ()=> {
        this.blnInTouch = false;//手指离开屏幕时调用这个
        for (var i = 0; i < this.wordCount; i++) {
            var refName = "word" + i;
            if (this.refs[refName].getTouchState()) {
                this.refs[refName].setMoveEnd()
            }
        }
    }

    shouldComponentUpdate(nProps,nStates) {
        if(nStates.blnRefresh == true){
            return true;
        }
        if(nProps.words != this.props.words){
            this.setSyllable(nProps.words,nProps.pinyins);
            this.setSyllableColor(this.props.arrScore);
            return true;
        }
        return false;
    }    

    getSyllable = (index)=>{
        var arrWord = [];
        for(var i=0;i<this.arrWordLength[index];i++){
            var startIndex = this.arrWordStart[index];
            arrWord.push(
                <Text key={startIndex + i} style={[styles.pinyin,{color:this.arrSyllableColor[startIndex+i]}]}>
                    {this.arrSyllablePY[startIndex + i]}
                    <Text style={styles.word}>{this.arrSyllableWord[startIndex+i]}</Text>
                    <Text >{'\n'}{this.arrSyllableScore[startIndex+i]}</Text>
                </Text>
            );
        }
        return arrWord;
    }

    renderSentence = ()=>{
        var arrSentence = [];
        for(var i=0;i<this.wordCount;i++){
            arrSentence.push(
                <View key={i} style={styles.words}>
                    {this.getSyllable(i)}
                </View>
            )
        }
        return arrSentence;
    }    

    getPunctuationCount = (str)=> {
        var length = str.length;
        var count = 0;
        for (var i = 0; i < length; i++) {
            if (PUNCTUATION.indexOf(str[i]) >= 0) {
                count += 1;
            }
        }
        return count;
    }

    setPingce = (arrScore)=>{
        //logf("Sentence setPingce:",arrScore);
        this.setSyllableColor(arrScore);
        this.setState({blnRefresh:true});
    }

    render() {
        //logf("Render Sentence");
        return (
            <View onLayout={this._onLayout.bind(this)}
                  style={[styles.container] }> 
                {this.renderSentence()}
            </View>
        );
    }    

    componentDidUpdate() {
        if(this.state.blnRefresh){
            this.setState({blnRefresh:false});
        }
    }
}


const styles = StyleSheet.create({
    container: {//主背景
        //backgroundColor:'#11001111',
        flexDirection: 'row',
        flexWrap: 'wrap',
        
    },
    words: {
        //backgroundColor:'#ff000011',
        flexDirection: 'row',
        marginHorizontal: fontSize*0.25,
    },
    pinyin: {
        fontSize: fontSize * 0.70,
        textAlign: 'center',
        marginHorizontal: MinWidth,
    },
    word: {
        fontSize: fontSize * 1.5,
    },
})