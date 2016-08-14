/**
 * Created by tangweishu on 16/8/11.
 */
import React, {Component, PropTypes} from 'react'
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native'

import {
    MinWidth,
    minUnit,
    ScreenWidth,
    ScreenHeight,
} from '../Styles';
fontSize = parseInt(minUnit * 4);
export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showType: this.props.showType,
            playerRate: this.props.playerRate,
        };
        this.canOpition = true;
        this.timer = null;
    }

    static propTypes = {
        showType: PropTypes.number,
        playerRate: PropTypes.number,
        setCallback: PropTypes.func,
    }
    static defaultProps = {
        showType: 2,
        playerRate: 1,
    }

    _onClose = ()=> {        
        this.props.setCallback(this.state.showType, this.state.playerRate);
    }

    _onPressSet = (index, id)=> {
        if (!this.canOpition) return;

        if (index == 0) {
            if (this.state.showType != id) {
                this.canOpition = false;//处理疯狂重复按键可能导致的BUG
                this.setState({
                    showType: id,
                })
            }

        } else if (index == 1) {
            if (this.state.playerRate != id) {
                this.canOpition = false;
                this.setState({
                    playerRate: id,
                })
            }
        }
    }

    componentDidUpdate() {
        this.timer = setTimeout(
            this._onClose,
            100
        );
    }

    componentWillUnMount() {
        clearTimeout(this.timer);
        this.timer = null;
    }

    renderOpitionTitle = (index)=> {
        var title = ["切换中/英文显示", "变速播放"]
        return (
            <Text style={styles.title}>{title[index]}</Text>
        );
    }
    renderOpition = (index)=> {
        var word = [["中", "英", "中/英"], ["慢 0.6x", "正常 1x", "快 1.4x"]];
        var opition = [];
        for (var i = 0; i < 3; i++) {
            var blnSelect = false;
            if (index == 0) {
                if (i == this.state.showType) {
                    blnSelect = true;
                }
            } else {
                if (i == this.state.playerRate) {
                    blnSelect = true;
                }
            }

            opition.push(
                <TouchableOpacity style={[styles.opition,i==1&&styles.borderLR,blnSelect&&{backgroundColor:'#ccc'}]}
                                  key={i} onPress={this._onPressSet.bind(this,index,i)}>
                    <Text style={[styles.word,blnSelect&&{color:'green'}]}>{word[index][i]}</Text>
                </TouchableOpacity>
            )
        }
        return (
            <View style={styles.allOpition}>
                {opition}
            </View>
        );
    }

    render() {
        return (
            <TouchableOpacity disabled={!this.canOpition} style={styles.container} onPress={this._onClose.bind(this)}>
                <TouchableOpacity style={styles.contentBack} activeOpacity={1} >
                    <View style={[styles.content,styles.centerLine]}>
                        {this.renderOpitionTitle(0)}
                        {this.renderOpition(0)}
                    </View>
                    <View style={styles.content}>
                        {this.renderOpitionTitle(1)}
                        {this.renderOpition(1)}
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flex: 1,
        top: 0,
        left: 0,
        width: ScreenWidth,
        height: ScreenHeight - fontSize * 4,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    contentBack: {
        position: 'absolute',
        width: ScreenWidth * 0.75,
        height: ScreenHeight * 0.35,
        borderRadius: minUnit * 3,
        backgroundColor: '#fff',
        bottom: minUnit * 4,
        right: minUnit * 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        //backgroundColor:'#ffff0011',
        width: ScreenWidth * 0.75,
        height: ScreenHeight * 0.15,
        paddingHorizontal: fontSize / 2,
        paddingVertical: fontSize,
    },
    centerLine: {
        borderBottomWidth: MinWidth,
        borderBottomColor: '#ccc'
    },
    title: {
        fontSize: fontSize,
        color: '#000',

    },
    allOpition: {
        width: fontSize * 18,
        height: fontSize * 3,
        backgroundColor: '#fff',
        borderRadius: fontSize * 2,
        borderWidth: MinWidth,
        borderColor: '#ccc',
        marginVertical: fontSize * 0.5,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    opition: {
        width: fontSize * 6,
        height: fontSize * 3,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    borderLR: {
        borderLeftWidth: MinWidth,
        borderLeftColor: '#ccc',
        borderRightWidth: MinWidth,
        borderRightColor: '#ccc',
    },
    word: {
        fontSize: fontSize,
        color: '#464646'
    },
})