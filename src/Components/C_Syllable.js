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
        this.state = {};
    }

    static defaultProps = {
        word: PropTypes.string,
        pinyin: PropTypes.string,
        style:PropTypes.object,
    };

    componentWillMount() {

        //解析 strWords 与 strPinyin ,字符'_'分词 字符' '区分拼音
    }

    render() {
        return (
            <View style={[this.props.style,styles.syllableContent]}>
                <View style={{backgroundColor:'#00ff0000'}}>
                    <Text style={styles.pinyin}>{this.props.pinyin}</Text>
                </View>
                <View style={{backgroundColor:'#00ffff00'}}>
                    <Text style={styles.word}>{this.props.word}</Text>
                </View>
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
        color: '#434343',
    },
    word: {
        fontSize: fontSize * 1.5,
        color: '#434343',
        backgroundColor: '#ffffff00',
    },
})