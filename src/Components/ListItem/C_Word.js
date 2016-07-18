/**
 * Created by tangweishu on 16/6/29.
 */

'use strict';
import React, {Component, PropTypes} from 'react';
import ReactNative, {
    StyleSheet,
    View,
    Text,
    PixelRatio,
}from 'react-native'
import Syllable from './C_Syllable';
var Dimensions = require('Dimensions');
var totalWidth = Dimensions.get('window').width;
var totalHeight = Dimensions.get('window').height;
var fontSize = parseInt(totalWidth / 26)

const PUNCTUATION = ['，','。','？','“','”','！','：','（','）','；'];//标点符号集(中文符号)

export default class Word extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            blnSelect:false,
        };
    }

    static defaultProps = {
        words:PropTypes.string,
        pinyins:PropTypes.string,
        style:PropTypes.object,
        panX:PropTypes.number,
        panY:PropTypes.number,
    };
    //arrSyllable = [];
    myLayout = null;
    componentWillMount() {
        //this.setArrSyllable();
    }
    setPingce(arrScore){
        console.log("Word setPingce:",arrScore);
        var strWord = this.props.words;
        var strPinYin = this.props.pinyins;
        var wordLength = strWord.length - this.getPunctuationCount(strWord);
        var pinyinArr = strPinYin.split(" "); //字符'_'分词 字符' '区分拼音
        if(wordLength != pinyinArr.length){
            console.log("词汇中的字数与拼音数据中不符");
        }else{
            var punctuationCount=0;
            var index = 0;
            for(var i=0;i<strWord.length;i++){
                if(PUNCTUATION.indexOf(strWord[i])>=0){
                    punctuationCount+=1;//跳过标点符号
                }else{
                    //..console.log("第"+i+"个汉字的评测情况:"+strWord[i]+":"+arrScore.slice(index,index+1));
                    if(arrScore == "error"){                        
                        this.refs["syllable"+i].setPingce("error");
                    }else{
                        this.refs["syllable"+i].setPingce(arrScore.slice(index,index+1));
                    }

                    index += 1;
                    //this.arrSyllable.push(<Syllable style={[styles.syllable]} word={strWord[i]} pinyin={pinyinArr[i-punctuationCount]} key={i}/>);
                }
            }
        }
    }
    /*
    setArrSyllable=()=>{
        var strWord = this.props.words;
        var strPinYin = this.props.pinyins;
        var wordLength = strWord.length - this.getPunctuationCount(strWord);
        var pinyinArr = strPinYin.split(" "); //字符'_'分词 字符' '区分拼音
        if(wordLength != pinyinArr.length){
            console.log("词汇中的字数与拼音数据中不符");
        }else{
            var punctuationCount=0;
            for(var i=0;i<strWord.length;i++){
                if(PUNCTUATION.indexOf(strWord[i])>=0){
                    this.arrSyllable.push(<Syllable style={[styles.syllable]} word={strWord[i]} pinyin={' '} key={i}/>);
                    punctuationCount+=1;
                }else{
                    this.arrSyllable.push(<Syllable style={[styles.syllable]} word={strWord[i]} pinyin={pinyinArr[i-punctuationCount]} key={i}/>);
                }
            }
        }
    }//因为要给<Syllable>添加 ref,所以只能以draw形式显示  */
    drawArrSyllable=()=>{
        var arrSyllable = []
        var strWord = this.props.words;
        var strPinYin = this.props.pinyins;
        var wordLength = strWord.length - this.getPunctuationCount(strWord);
        var pinyinArr = strPinYin.split(" "); //字符'_'分词 字符' '区分拼音
        if(wordLength != pinyinArr.length){
            console.log("词汇中的字数与拼音数据中不符");
        }else{
            var punctuationCount=0;
            var index = 0;
            for(var i=0;i<strWord.length;i++){
                if(PUNCTUATION.indexOf(strWord[i])>=0){
                    arrSyllable.push(<Syllable style={[styles.syllable]} word={strWord[i]} pinyin={' '} key={i}/>);
                    punctuationCount+=1;//跳过标点符号
                }else{
                    arrSyllable.push(<Syllable ref={"syllable"+index} style={[styles.syllable]} word={strWord[i]}
                                                    pinyin={pinyinArr[i-punctuationCount]} key={i}/>);
                    index += 1;
                }
            }
        }
        return arrSyllable;
    }
    getPunctuationCount=(str)=>{
        var length=str.length;
        var count=0;
        for(var i=0;i<length;i++){
            if(PUNCTUATION.indexOf(str[i])>=0){
                count+=1;
            }            
        }
        return count;
    }
    _onLayout = (event)=>{
        this.myLayout = event.nativeEvent.layout;
    }

    blnTouchWord = (touch,fatherLayout)=>{
        //判断当前的touch是否在自己的位置
        var colLayout = {
            x:this.myLayout.x + fatherLayout.x,
            y:this.myLayout.y + fatherLayout.y,
            w:this.myLayout.width,
            h:this.myLayout.height,
        };
        
        if(this.state.blnSelect){
            if(this.blnInRange(touch,colLayout)){//如果touch在自己的位置
                return true;
            }else{
                this.setState({blnSelect:false});
            }
        }else{
            if(this.blnInRange(touch,colLayout)){//如果touch在自己的位置
                this.setState({blnSelect:true});
                return true;
            }
        }
        return false;
    }

    blnInRange=(touch,layout)=>{
        let tx = touch.tx;
        let ty = touch.ty;
        if(ty > layout.y && ty < layout.y + layout.h){
            if(tx > layout.x && tx < layout.x + layout.w){
                return true;
            }
        }
        return false;
    }
    getTouchState = ()=>{
        return this.state.blnSelect;
    }
    setMoveEnd = ()=> {
        this.setState({blnSelect:false});
        console.log("弹出一个框框,内容是:",this.props.words);
        //..弹出一个框框
    }

    render() {
        return (
            <View style={[this.props.style,styles.wordContene,this.state.blnSelect&&{backgroundColor:'#C5D6E6'}]}
                  onLayout={this._onLayout.bind(this)}>
                {this.drawArrSyllable()}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    wordContene: {//主背景
        flexDirection:'row',
        //borderBottomWidth:1,
        
    },
    syllable:{
        marginHorizontal:0*fontSize,
    }
})