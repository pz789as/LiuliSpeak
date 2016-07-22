/**
 * Created by tangweishu on 16/7/22.
 */
import React, {Component, PropTypes} from 'react'
import {Animated, View, StyleSheet,}from 'react-native'

var Dimensions = require('Dimensions');
var totalWidth = Dimensions.get('window').width;

var fontSize = parseInt(totalWidth / 26);
var Space = fontSize/4;
var PointSize = fontSize/2;
export default class GreenPoint extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            anim: [1, 2, 3].map(()=>new Animated.Value(1))
        };
    }

    static propTypes = {
        callback:PropTypes.func,
    }

    componentDidMount() {

    }

    startAnim = ()=>{
        var timing = Animated.timing;
        Animated.parallel(this.state.anim.map(
            (parallel,i)=>{return timing(parallel,{toValue:0,duration:1000,delay:(2-i)*1000})}
        )).start(this.props.callback.bind(this,1))
    }

    render(){
        var views = this.state.anim.map(function (value,i) {
            return(
                <Animated.View key={i} style={[styles.point,
                {opacity:value}]} />
                    )
        })
        return (
            <View style={styles.container}>
                {views}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {       
        flexDirection:'row',
        //backgroundColor:'#ff000011',
        paddingLeft:fontSize/4,
        marginBottom:fontSize/4,
    },
    point:{
        width:PointSize,
        height:PointSize,
        borderRadius:PointSize/2,
        backgroundColor:'#4ACE35',
        marginRight:Space,
    },
})

