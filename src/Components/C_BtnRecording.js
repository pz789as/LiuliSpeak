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
    Image,
    Animated,
    PixelRatio,
}from 'react-native'
import {
    ImageRes
} from '../Resources';
import* as Progress from 'react-native-progress';//安装的第三方组件,使用方法查询:https://github.com/oblador/react-native-progress

var Dimensions = require('Dimensions');
var totalWidth = Dimensions.get('window').width;
var totalHeight = Dimensions.get('window').height;
var fontSize = parseInt(totalWidth / 26)
var btnSize = fontSize * 5;
var radioSize = btnSize;
export default class BtnPlayerRecording extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            recordState: 0,//0:等待录音,1:录音中,2手动停止录音
            recordVolum: 0,//录音音量
            scaleAnim: this.props.blnAnimate ?new Animated.Value(0) : new Animated.Value(1),
        };
    }

    static defaultProps = {
        blnAnimate: PropTypes.bool,//是否有出现动画
        animateDialy: PropTypes.number,//如果blnAnimate为true,必须设置该值
        startRecord: PropTypes.func,
    };

    _onPress = ()=> {//发送点击事件
        var state = (this.state.recordState + 1) % 2;
        this.setState({
            recordState : state
        });
        if (state == 1){
            this.props.startRecord();
        }else if (state == 0){
            this.props.stopRecord();
        }
    }
    stopRecordAuto(){
        var state = this.state.recordState;
        if (state == 1){
            state = 0;
            this.setState({
                recordState: state,
            });
        }
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
    drawBtnRecord = ()=>{//0:等待录音,1:录音中,2手动停止录音
        if(this.state.recordState ==0){
            return (
                <Image style={styles.radio} source={ImageRes.bg_mic}/>
            );
        }else if(this.state.recordState == 1){
            return (
                <Image style={styles.radio} source={ImageRes.bg_mic_highlight_l}/>
            );
        }
        // else{
        //     return (
        //         <Image style={styles.radio} source={ImageRes.bg_mic_highlight_l_hit}/>
        //     );
        // }
    }
    setVolume(volume){
        var v = volume / 100;
        if (this.state.recordState == 0){
            v = 0;
        }
        v = v > 1 ? 1: v;
        this.setState({
            recordVolum: v,
        });
    }
    render() {
        //const {} = this.props;
        // console.log(this.props);
        return (
            <Animated.View style={{transform:[{scale:this.state.scaleAnim}]}}>
                <TouchableOpacity onPress={this._onPress} activeOpacity={0.5}>
                    {/*上一句是为了仿流利说把点击效果取消,没有Touchwihtout是方便日后修改*/}
                    <View style={[styles.container]}>
                        {/*<View style={styles.radio}>
                            <Text>录</Text>
                            {这里先用text意思意思,后面要换成图片组件}
                        </View>*/}
                        {this.drawBtnRecord()}
                        {this.state.playerState != 0 &&
                        <Progress.Circle style={styles.progress} thickness={2} 
                                        borderWidth={0} progress={this.state.recordVolum}
                                         size={btnSize-2} color="#3FA214"/>
                        }
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {//主背景
        width: btnSize,
        height: btnSize,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: fontSize/2,
        //backgroundColor:'#00000035'
    },
    progress: {
        position: 'absolute',
        left: 2/PixelRatio.get(),
        top: 2/PixelRatio.get(),
    },
    radio: {
        width: radioSize,
        height: radioSize,
    },
})