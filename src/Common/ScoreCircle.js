/**
 * Created by tangweishu on 16/7/29.
 */
import React, {Component, PropTypes} from 'react'
import {View, Text, Image, StyleSheet} from 'react-native'

import {
    ImageRes,
} from '../Resources';

import {
    minUnit,
} from '../Styles';

export default class ScoreCircle extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state = {};
    }
    static propTypes = {
        score:PropTypes.number,
    };

    getColor = (score)=>{
        let color = '#FF3B2F';
        if (score >= 80) {
            color = '#49CD36';
        } else if (score >= 60) {
            color = '#F2B225';
        }
        return color;
    }

    renderScore = (score)=>{
        return (
          <Text style={styles.text}>{score}</Text>
        );

    }

    renderBad = ()=>{
        return (
            <Image style={styles.container}  source = {ImageRes.icon_bad}>
                <Text>{this.props.score}</Text>
            </Image>
        );
    }
    render(){
        return (
            <View style={[styles.container,{backgroundColor:this.getColor(this.props.score)}]}>
                {this.props.score >= 60?this.renderScore(this.props.score):this.renderBad()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width:minUnit*8,
        height:minUnit*8,
        borderRadius:minUnit*4,
        justifyContent:'center',
        alignItems:'center'
        //..backgroundColor:'green'
    },
    circle:{
        width:minUnit*5,
        height:minUnit*5,
        borderRadius:minUnit*2.5,
    },
    text:{
        fontSize:minUnit*4,
        color:'#F0FFE7',
        textAlign:'center',
    },
})

/* if (this.state.score >= 60) {
 return (
 <View style={[styles.scoreView,{backgroundColor:this.getScoreViewColor()}]}>
 <Text style={{fontSize:fontSize,color:'#F0FFE7'}}>{this.state.score}</Text>
 </View>
 );
 } else {
 return (
 <Image  style={styles.badImage} source={ImageRes.icon_bad}/>
 )
 }*/