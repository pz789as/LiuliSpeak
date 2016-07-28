/**
 * Created by tangweishu on 16/7/22.
 */
import React, {Component, PropTypes} from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {
    minUnit,
    ScreenWidth,
    ScreenHeight,
} from '../Styles';
 
var totalWidth = ScreenWidth;
var totalHeight = ScreenHeight;
var fontSize = parseInt(minUnit*4);
export default class ExamPause extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    static propTypes = {
        callback: PropTypes.func,
    }

    static defaultProps = {
        callback: (id)=> {
            logf("on Press", id);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.props.callback.bind(this,0)}>
                    <View style = {[styles.button,styles.bgWhite]}>
                        <Text style={[styles.fontColBlack]}>退出</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.callback.bind(this,1)}>
                    <View style = {[styles.button,styles.bgGreen]}>
                        <Text style={[styles.fontColWhite]}>重来</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.callback.bind(this,2)}>
                    <View style = {[styles.button,styles.bgGreen]}>
                        <Text style={[styles.fontColWhite]}>继续</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position:'absolute',
        width:totalWidth,
        height:totalHeight,
        top:0,
        left:0,
        backgroundColor: '#00000088',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: fontSize * 14,
        height: fontSize * 4,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical:6,
    },
    bgWhite: {
        backgroundColor: '#ffffff',
    },
    bgGreen: {
        backgroundColor: '#4ACE35',
    },
    fontColWhite:{
        color:'#ffffff',
        textAlign: 'center',
        fontSize:fontSize*1.5,
    },
    fontColBlack:{
        color:'#434343',
        textAlign: 'center',
        fontSize:fontSize*1.5,
    }

});