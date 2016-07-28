/**
 * Created by tangweishu on 16/7/21.
 */
import React, {Component, PropTypes} from 'react'
import {Image, Text, View, Animated, StyleSheet, Easing} from 'react-native'
import {
    minUnit,
    ScreenWidth,
    ScreenHeight,
} from '../Styles';
 
var totalWidth = ScreenWidth;
var totalHeight = ScreenHeight;
var fontSize = parseInt(minUnit*4);
var SIZE = fontSize * 8;
export default class Countdown extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            second: 3,//读秒显示的数字
            scaleAnim: new Animated.Value(0),
            opacityAnim:new Animated.Value(0),
        };
    }
    
    static propTypes = {
        callback:PropTypes.func,
    }

    componentDidMount() {
        Animated.timing(this.state.scaleAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            delay: 500,
        }).start(this.nextSecond.bind(this))
    }

    nextSecond = ()=> {
        if (this.state.second > 1) {
            this.setState({second: this.state.second - 1});
        } else {
            Animated.delay(1000);
            var timing = Animated.timing;
            this.state.opacityAnim.setValue(0);
            this.state.scaleAnim.setValue(0);
            Animated.parallel(['opacityAnim', 'scaleAnim'].map(parallel => {
                return timing(this.state[parallel], {
                    toValue: 0.5,
                    duration: 500,
                    easing: Easing.quad,
                    delay: 500,
                })
            })).start(this.props.callback.bind(this,0))
        }
    }

    shouldComponentUpdate(nProps, nStates) {
        if (nStates != this.state) {
            return true;
        }
        return false;
    }

    componentWillUpdate() {
        logf("Countdown Update");
        this.state.scaleAnim.setValue(0);
        Animated.delay(1000);
        Animated.timing(this.state.scaleAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.quad,
            delay: 500,
        }).start(this.nextSecond.bind(this))
    }

    render() {
        return (
            <View style={styles.container}>
                <Animated.View style={[styles.back,{opacity:this.state.opacityAnim.interpolate({
                    inputRange:[0,0.49,0.5],outputRange:[1,0,0]}),
                transform:[{scale:this.state.scaleAnim.interpolate(
                    {inputRange:[0,0.4,0.7,1],outputRange:[1,1.4,1,1]}
            )}]}]}>

                </Animated.View>
                <Text style={styles.text}>{this.state.second}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

        position: 'absolute',
        width: SIZE,
        height: SIZE,
        borderRadius: (SIZE) / 2,
        top: (totalHeight - SIZE) / 2,
        left: (totalWidth - SIZE) / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    back:{
        backgroundColor: '#4ACE35',
        position: 'absolute',
        width: SIZE,
        height: SIZE,
        top:-1,
        left:0,
        borderRadius: SIZE / 2,
    },
    text: {
        fontSize: SIZE * 0.6,
        color: 'white',
        textAlign: 'center',
        backgroundColor:"#ffffff00",
    }
});