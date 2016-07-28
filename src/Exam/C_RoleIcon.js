/**
 * Created by tangweishu on 16/7/22.
 */
/**
 * Created by tangweishu on 16/7/20.
 */
import React, {Component, PropTypes} from 'react'
import {View, Image, StyleSheet, Animated} from 'react-native'
import {
    ImageIcon
} from '../Resources';
import {
    minUnit,
} from '../Styles';
import* as Progress from 'react-native-progress';//安装的第三方组件,使用方法查询:https://github.com/oblador/react-native-progress
 
var fontSize = parseInt(minUnit*4);
var radioSize = fontSize * 5;

export default class RoleIcon extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            progress: 0,
            imgSource: this.props.imgSourceName[0],
            roateYAnim:new Animated.Value(1),
        };
        this.nowIndex = 0;
    }

    static propTypes = {
        imgSourceName: PropTypes.array,
        isExamRole:PropTypes.func,
    };

    hiddenIcon = (roleIndex)=> {
        this.nowIndex = roleIndex;
        Animated.timing(this.state.roateYAnim, {
            toValue: 0,
            duration: 250,
        }).start(()=>{this.setState({imgSource:this.props.isExamRole()?"user0":this.props.imgSourceName[this.nowIndex]})})
    }

    showIcon = ()=>{
        Animated.timing(this.state.roateYAnim, {
            toValue: 1,
            duration: 250,
        }).start()
    }

    setProgress = (value)=> {
        this.setState({progress: value})
    }

    componentDidUpdate(pProps,pStates) {
        if(pStates.progress == this.state.progress){//这个逻辑比较搞~~
            this.showIcon();
        }
    }

    render() {
        return (

            <Animated.View style={[styles.container,{transform:[{rotateY:
            this.state.roateYAnim.interpolate({inputRange:[0,1],outputRange:['90deg','0deg']})
            }]}]}>
                {this.state.progress > 0 && <Progress.Circle style={styles.progress} thickness={2} borderWidth={0}
                                                             progress={this.state.progress} size={radioSize+4}
                                                             color="#4ACE35"/>}
                <Image style={styles.icon} source={ImageIcon[this.state.imgSource]}></Image>
            </Animated.View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: radioSize + 4,
        height: radioSize + 4,
    },
    icon: {
        width: radioSize,
        height: radioSize,
        borderRadius: radioSize / 2,
        backgroundColor: '#CCCCCC',
    },
    progress: {
        position: 'absolute',
        left: -2,
        top: -2,
    },
});