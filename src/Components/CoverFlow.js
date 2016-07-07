'use strict';

import React, {
	Component
} from 'react';

import {
	StyleSheet,
	View,
	Animated,
	PanResponder,
} from 'react-native';

/*	
	属性说明：
	style: 				可以修改显示
	frameSpace: 		要移动的每个元素的间距
	horizontal: 		标记是水平移动还是竖直移动
	SelectId:			初始化当前位置
	getSelectIndex: 	回调函数，返回当前位置
*/

class CoverFlow extends Component {
	move = 0;
	constructor(props) {
	  	super(props);
	
	  	this.state = {
	  		translate: new Animated.Value(0),	//控制显示时的移动动画
	  	};
	  	this.move = this.props.SelectId*this.props.frameSpace;
	  	this.state.translate.setValue(-this.move);
	}
	static propTypes = {
		frameSpace: React.PropTypes.number,
		horizontal: React.PropTypes.bool,
		getSelectIndex: React.PropTypes.func,	//得到当前位置
		SelectId: React.PropTypes.number,
	};
	static defaultProps = {
		style: {},			//背景
		frameSpace: 200,	//每个元素的宽带
		horizontal: true,	//是否水平显示
		SelectId: 0,
		getSelectIndex: (num)=>{console.log('SelectId: '+num)}
	};
	// 手势处理
	componentWillMount() {
		this._panResponder = null;
		this._panResponder = PanResponder.create({
      		onStartShouldSetPanResponder: ()=>true,
      		onMoveShouldSetPanResponder: ()=>true,
      		onPanResponderGrant: this.panResponderStart,
      		onPanResponderMove: this.panResponderMove.bind(this),
      		onPanResponderRelease: this.panResponderRelease.bind(this),
    	});
	}
	panResponderStart() {
	}
	// 移动中
	panResponderMove(evt, {dx, dy, vx, vy}) {
		if (this.props.horizontal) {
			// 水平移动
			this.state.translate.setValue(0 - (this.move-dx));
		} else {
			// 竖直移动
			this.state.translate.setValue(0 - (this.move-dy));
			console.log('move: '+(0-(this.move-dy)));
		}
	}
	// 松开
	panResponderRelease(evt, {dx, dy, vx, vy}) {
		var {
			children,
			frameSpace,
			horizontal,
			SelectId,
		} = this.props;

		if (horizontal) {
			// 水平移动
			this.move -= dx+vx*frameSpace;
		} else {
			// 竖直移动
			this.move -= dy+vy*frameSpace;
		}
		// 范围判断，超出显示范围的处理
		var min = 0;
		var max = (children.length-1)*frameSpace;
		if (this.move < min) {
			this.move = min;
		} else if (this.move > max) {
			this.move = max;
		}
		// 偏移处理，移动距离为framespace的倍数
		var _num = this.move%frameSpace;
		this.move -= _num;
		if (_num > frameSpace/2) {
			this.move += frameSpace;
		}
		// 返回当前选中位置
		SelectId = this.move/frameSpace;
		this.props.getSelectIndex(SelectId);
		this.changeAnimated(this.move);
	}

	render() {
		var {
			children,
			frameSpace,
			horizontal,
		} = this.props;
		return (
			<View style={[styles.background, horizontal&&styles.horizontal, this.props.style]} {...this._panResponder.panHandlers}>
				{children.map((child,i)=>{
					// 尺寸变化
					var scale = this.state.translate.interpolate({
						inputRange: [-(frameSpace*(i+1)+1), -(frameSpace*(i+1)), -(frameSpace*i), -(frameSpace*(i-1)), -(frameSpace*(i-1)-1)],
						outputRange: [0.8, 0.8, 1, 0.8, 0.8]
					});
					var translateX = 0;
					var translateY = 0;
					// 移动方式
					if (horizontal) translateX = this.state.translate;
					else translateY = this.state.translate;
					return(
						<Animated.View style={{transform:[{translateX}, {translateY}]}} key={i} >
							<Animated.View style={{transform:[{scale}]}}>
								{child}
							</Animated.View>
						</Animated.View>
					);
				})}
			</View>
		);
	}
	// 移动控制
	changeAnimated(dis) {
		Animated.timing(this.state.translate, {
			toValue: -dis,
		}).start();
	}
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
	},
	horizontal: {
		flexDirection: 'row',
	}
});

export default CoverFlow;