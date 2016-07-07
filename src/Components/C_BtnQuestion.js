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
    PixelRatio,
    Image,
}from 'react-native'
import {
    ImageRes
} from '../Resources';
import* as Progress from 'react-native-progress';//安装的第三方组件,使用方法查询:https://github.com/oblador/react-native-progress

var Dimensions = require('Dimensions');
var totalWidth = Dimensions.get('window').width;
var totalHeight = Dimensions.get('window').height;
var fontSize = parseInt(totalWidth / 26)
var btnSize = fontSize * 4;
var radioSize = btnSize;
export default class BtnPlayerRecording extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {            
            scaleAnim: this.props.blnAnimate ?new Animated.Value(0) : new Animated.Value(1),
        };
    }

    static defaultProps = {
        blnAnimate: PropTypes.bool,//是否有出现动画
        animateDialy: PropTypes.number,//如果blnAnimate为true,必须设置该值
    };

    _onPress = ()=> {//发送点击事件

    }

    componentWillMount() {
        if (this.props.blnAnimate) {
            Animated.timing(this.state.scaleAnim, {
                toValue: 1,
                duration: 300,
                delay: this.props.animateDialy
            }).start();
        }
    }

    render() {       
        return (
            <Animated.View style={{transform:[{scale:this.state.scaleAnim}]}}>
                <TouchableOpacity disabled={this.state.recordState!=0} onPress={this._onPress} activeOpacity={0.5}>
                    {/*上一句是为了仿流利说把点击效果取消,没有Touchwihtout是方便日后修改
                    <View style={[styles.container]}>                        
                         <Text style={styles.content}>提问</Text>
                    </View>*/}
                    <Image style={styles.btnImg} source={ImageRes.line_avatar_128}>
                        <Text style={styles.content}>提问</Text>
                    </Image>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {//主背景     
        width:btnSize,
        height:btnSize,
        borderRadius:(btnSize)/2,
        borderWidth:1,
        borderColor:'#E6E6E6',
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal: fontSize / 2,
    },
    content:{
        fontSize:fontSize,
        color:'#969696'
    },
    btnImg:{
        width: radioSize,
        height: radioSize,
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal: fontSize / 2,
    },
})

