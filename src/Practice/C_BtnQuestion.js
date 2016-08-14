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
    Animated,    
    Image,
}from 'react-native'
import {
    ImageRes
} from '../Resources';

var Dimensions = require('Dimensions');
var totalWidth = Dimensions.get('window').width;
var totalHeight = Dimensions.get('window').height;
var fontSize = parseInt(totalWidth / 26)
var btnSize = fontSize * 4;
var radioSize = btnSize;
export default class BtnQuestion extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};

    }

    static propTypes = {

        btnCallback: PropTypes.func,
    };

    static defaultProps = {};

    _onPress = ()=> {//发送点击事件

    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    shouldComponentUpdate(nextProps, nextStates) {
        return false;
    }

    /*<TouchableOpacity disabled={this.state.recordState!=0} onPress={this._onPress} activeOpacity={0.5}>

     <Image style={styles.btnImg} source={ImageRes.line_avatar_128}>
     <Text style={styles.content}>提问</Text>
     </Image>
     </TouchableOpacity> */
    render() {
        return (
            <Image style={styles.btnImg} source={ImageRes.line_avatar_128}>
                <Text style={styles.content}>提问</Text>
            </Image>
        );
    }
}

const styles = StyleSheet.create({
    container: {//主背景     
        width: btnSize,
        height: btnSize,
        borderRadius: (btnSize) / 2,
        borderWidth: 1,
        borderColor: '#E6E6E6',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: fontSize / 2,
    },
    content: {
        fontSize: fontSize,
        color: '#969696'
    },
    btnImg: {
        width: radioSize,
        height: radioSize,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: fontSize / 2,
    },
})

