/**
 * Created by tangweishu on 16/7/19.
 */
import React, {Component,PropTypes} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'

import Sentence from '../ListItem/C_Sentence';
var Dimensions = require('Dimensions');
var totalWidth = Dimensions.get('window').width;
var totalHeight = Dimensions.get('window').height;
var fontSize = parseInt(totalWidth / 26);
export default class P_Exam extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {

        };
        console.log("this.props:",this.props);
        this.dialogLength = 0;
        this.nowExamIndex = 0;
        this.words = [];
        this.pinyins = [];
        this.getDialogData(this.props.dialogData);
    }

    static defaultProps = {
        dialogData:PropTypes.object,
        lessonID: PropTypes.number,
        courseID: PropTypes.number,
    };

    getDialogData = (data)=>{
        this.dialogLength = data.length;
        for(var i=0;i<this.dialogLength;i++){
            this.words[i] = data[i].cn.words;
            this.pinyins[i] = data[i].cn.pinyins;
        }
    }

    _onPressBtn = ()=>{

    }

    render(){
        return(
            <View style = {styles.container}>
                <View style = {styles.top}>

                </View>

                <View style = {styles.content}>
                    <Sentence ref="mySentence" style={styles.Sentence} words={this.words[this.nowExamIndex]}
                              pinyins={this.pinyins[this.nowExamIndex]}
                              />
                    <Sentence ref="mySentence" style={styles.Sentence} words={this.words[this.nowExamIndex+1]}
                              pinyins={this.pinyins[this.nowExamIndex+1]}
                    />
                </View>

                <View style = {styles.bottom}>
                    <TouchableOpacity onPress={this._onPressBtn.bind(this)}>
                        <View style = {styles.btnRecord}></View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style = {styles.btnPause}></View>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#ffffff',
        padding:fontSize,
    },
    top:{
        backgroundColor:'#ffff0011',
        width:totalWidth - fontSize*2,
        height:fontSize*4,
    },
    content:{
        width:totalWidth - fontSize*2,
        height:totalHeight - fontSize*18,
        backgroundColor:'#ff000011',
        marginTop:fontSize*2,
    },
    bottom:{
        position:'absolute',
        backgroundColor:'#ffff00',
        left:fontSize,
        top:totalHeight - fontSize*9,
        width:totalWidth - fontSize*2,
        height:fontSize*8,
    },
    btnRecord:{
        width:fontSize*6,
        height:fontSize*6,
        borderRadius:fontSize*3,
        backgroundColor:'green',
        position:'absolute',
        left:(totalWidth - fontSize*2 - fontSize*6)/2,
        top:fontSize*2,
    },
    btnPause:{
        width:fontSize*2,
        height:fontSize*2,
        borderRadius:fontSize,
        backgroundColor:'gray',
        position:'absolute',
        left:totalWidth - fontSize*2 - fontSize*2,
        top:fontSize*6,
    },
    Sentence:{
        marginBottom:fontSize*2,
         
    },
});