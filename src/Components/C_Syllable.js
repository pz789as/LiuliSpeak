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

var Dimensions = require('Dimensions');
var totalWidth = Dimensions.get('window').width;
var totalHeight = Dimensions.get('window').height;
var fontSize = parseInt(totalWidth / 26)

const PUNCTUATION = [',', '', '', '“', '”'];//标点符号集(中文符号)

export default class Syllable extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            score:"000",
            color: '#434343',
        };
    }

    static defaultProps = {
        word: PropTypes.string,
        pinyin: PropTypes.string,
        style:PropTypes.object,
    };

    componentWillMount() {

        //解析 strWords 与 strPinyin ,字符'_'分词 字符' '区分拼音
    }
    setPingce(score){
        var zeroCount = 0;
        var tmpCol = "#434343";//默认颜色值
        if(score == "error"){
            tmpCol = "#ff0000";
            this.setState({score:score,color:tmpCol});
            return;
        }
        //..console.log("typeof(score):",typeof(score[0]));
        //console.log("value(score):",score[0]);
        for(var i=0;i<score[0].length;i++){             
            if(score[0].charAt(i)=="0"){
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
        this.setState({score:score,color:tmpCol});

        /*
        if (this.state.score >= 90) {
            color = '#49CD36';
        } else if(this.state.score>=60) {
            color = '#F2B225';
        } else{
            color = '#FF3B2F';
        }*/
        //..console.log("汉字评测:"+this.props.word +":"+ score);
    }
    render() {
        return (
            <View style={[this.props.style,styles.syllableContent]}>
                    <Text style={[styles.pinyin,{color:this.state.color}]}>{this.props.pinyin}</Text>
                    <Text style={[styles.word,{color:this.state.color}]}>{this.props.word}</Text>
                {/*<Text style={{fontSize:fontSize/2}}>{this.state.score}</Text>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    syllableContent: {
        //width: fontSize * 3,
        //marginHorizontal: fontSize / 2, //这两句注释替换掉下面的间距,就变成了固定间距的字符了
        height: fontSize * 2.8,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#ff000010',
        //marginHorizontal:0.4*fontSize,
        //borderWidth:1,
    },
    pinyin: {
        fontSize: fontSize * 0.75,
    },
    word: {
        fontSize: fontSize * 1.5,        
    },
})