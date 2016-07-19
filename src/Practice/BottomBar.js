'use strict';

import React, { Component } from 'react';

import {
  	StyleSheet,
  	View,
  	Text,
  	TouchableOpacity,
  	InteractionManager,
} from 'react-native';

import {
	UtilStyles,
	ScreenWidth,
	ScreenHeight,
	minUnit,
	MinWidth,
} from '../Styles';

import {
  	ImageRes
} from '../Resources';

import IconButton from '../Common/IconButton';

var Height = minUnit*14;

class BottomBar extends Component {
	constructor(props) {
	  	super(props);
	
	 	this.state = {
	 		blnAutoplay: false,
	 		playKind: 0,
	 		blnSet: false,
	 		showKind: this.props.showKind,
	 		speedKind: this.props.speedKind,
	 	};
	}
	componentDidMount() {
	}
	shouldComponentUpdate(nextProps, nextState) {
		if (nextState != this.state) return true;
		else return false;
	}
  	render() {
  		if (this.state.blnAutoplay) {
  			return (
  				<View style={[styles.container, styles.line]}>
					<IconButton icon={ImageRes.pause} onPress={this._onPause.bind(this)}/>
					<IconButton buttonStyle={[styles.playSet, this.state.playKind==1&&styles.playSetColor]} onPress={this._onPlayset.bind(this)}
						fontStyle={[UtilStyles.fontSmall, this.state.playKind==1&&styles.fontColor]} text={this.state.playKind?'循环播放':'单次播放'}/>
  				</View>
			);
  		} else {
	    	return (
	      		<View style={[styles.container, styles.line]}>
	      			<IconButton icon={[ImageRes.play, ImageRes.pause]} onPress={this._onPlay.bind(this)}/>
	      			<IconButton buttonStyle={[styles.start, UtilStyles.center]} onPress={this._onStart.bind(this)} text='开始闯关'/>
	      			<IconButton icon={ImageRes.more} onPress={this._onSet.bind(this)}/>
	      			{this.renderSet()}
	      		</View>
	    	);
	    }
  	}
  	// 设置
  	renderSet() {
  		if (this.state.blnSet) {
  			return (
  				<View style={styles.shade}>
	  				<TouchableOpacity
						style={{flex: 1,}}
						onPress={this.cancelSet.bind(this)}
						activeOpacity={1} />
  					<View style={[styles.set, ]}>
  						{this.renderOptionTitle(0, '切换中/英文显示', ['中','英','中/英'], this.state.showKind)}
  						{this.renderOptionTitle(1, '变速播放', ['慢 0.6x','正常 1x','快 1.4x'], this.state.speedKind)}
  					</View>
  				</View>
  			);
  		}
  	}
  	// 设置选项
	renderOptionTitle(_id, _name, _list, _select, _onPress) {
		return (
			<View style={[styles.title, _id==1&&styles.line]}>
				<Text style={UtilStyles.fontSmall}>
					{_name}
				</Text>
				<View style={styles.buttonList}>
					{this.drawButton(_id, _list, _select)}
				</View>
			</View>
		);
	}
	// 选项中的3个图标
	drawButton(_id, _list, _select) {
		var array = [];
		for (var i=0;i<3;i++) {
			array.push(
				<TouchableOpacity
					key={i}
					style={[styles.button, i==0&&styles.buttonLeft, i==2&&styles.buttonRight, i==_select&&styles.buttonColor]}
					onPress={this.changeOption.bind(this, _id, i)}
					activeOpacity={1}>
					<View style={[styles.button, i!=2&&styles.space]} >
						<View style={styles.buttonView}>
							<Text style={styles.buttonText}>
								{_list[i]}
							</Text>
						</View>
					</View>
				</TouchableOpacity>
			);
		}
		return array;
	}

  	// 下方按键处理（播放，暂停，开始闯关，设置）
	_onPlay() {
		this.cancelSet();
		this.setState({
			blnAutoplay: true
		});
		this.props.onPlay();
	}
	_onPause() {
		this.setState({
			blnAutoplay: false
		});
		this.props.onPause();
	}
	// 播放设置（单次/循环）
	_onPlayset() {
		var index = (this.state.playKind+1)%2;
		this.setState({
			playKind: index
		});
		this.props.changePlayKind(index);
	}
	// 开始闯关
	_onStart() {
		this.props.onStart();
		this.cancelSet();
	}
	// 设置界面
	_onSet() {
		this.setState({
			blnSet: !this.state.blnSet
		});
	}
	// 设置界面关闭（有设置界面时点击其他位置关闭设置界面）
	cancelSet() {
		if (this.state.blnSet) {
			this.setState({
				blnSet: false
			});
		}
	}
	// 设置选项处理
	changeOption(_id, select) {
		this.props.changeOption(_id, select);
		if (_id == 0) {
            // 显示设置 0，中文  1，英文  2，中/英文
            this.setState({
                showKind: select
            });
        } else {
            // 播放速度 0，0.6x  1，1x  2，1.4x
            this.setState({
                speedKind: select
            });
        }
        this.timer = setTimeout(()=>{
        	this.cancelSet();
        },100);
	}
}

const styles = StyleSheet.create({
	container: {
		height: Height,
		paddingHorizontal: minUnit*2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	line: {
		borderTopWidth: 1*MinWidth,
		borderColor: '#6B7071'
	},
	start: {
		width: minUnit*34,
	},
	playSet: {
		width: minUnit*28,
		height: minUnit*9,
		borderRadius: minUnit*4.5,
		borderWidth: 1*MinWidth,
		borderColor: '#919191',
	},
	playSetColor: {
		backgroundColor: '#898989',
	},
	shade: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0-(ScreenHeight-Height),
		bottom: Height,
		backgroundColor: 'rgba(10,10,10,0.3)'
	},
	set: {
		position: 'absolute',
		right: minUnit*4,
		bottom: minUnit*4,
		width: minUnit*76,
		height: minUnit*50,
		backgroundColor: '#FFFFFF',
		borderRadius: minUnit*3,
		flex: 1,
	},
	title: {
		flex: 1,
		paddingHorizontal: minUnit*5,
		paddingVertical: minUnit*5,
	},
	buttonList: {
		marginTop: minUnit*4,
		marginHorizontal: minUnit*2,
		height: minUnit*8,
		borderRadius: minUnit*8,
		borderWidth: 1*MinWidth,
		borderColor: '#5D6464',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	button: {
		flex: 1,
	},
	space: {
		borderRightWidth: 1*MinWidth,
		borderColor: '#5D6464'
	},
	buttonLeft: {
		borderTopLeftRadius: minUnit*8,
		borderBottomLeftRadius: minUnit*8,
	},
	buttonRight: {
		borderTopRightRadius: minUnit*8,
		borderBottomRightRadius: minUnit*8,
	},
	buttonColor: {
		backgroundColor: '#E8E8E8',
	},
	buttonText: {
		fontSize: minUnit*4,
		color: '#2E2D2E',
	},
	buttonView: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}
});


export default BottomBar;