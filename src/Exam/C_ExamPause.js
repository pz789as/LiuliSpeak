/**
 * Created by tangweishu on 16/7/22.
 */
import React, {Component, PropTypes} from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'

var Dimensions = require('Dimensions');
var totalWidth = Dimensions.get('window').width;
var totalHeight = Dimensions.get('window').height;
var fontSize = parseInt(totalWidth / 26);
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
            console.log("on Press", id);
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
        width: fontSize * 10,
        height: fontSize * 2,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical:2,
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
        fontSize:fontSize,
    },
    fontColBlack:{
        color:'#434343',
        textAlign: 'center',
        fontSize:fontSize,
    }

});