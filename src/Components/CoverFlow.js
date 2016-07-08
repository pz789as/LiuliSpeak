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
	old = 0;
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
		SelectId: React.PropTypes.number,
		getSelectIndex: React.PropTypes.func,	//得到当前位置

		// Animation Config
		overshootSpringConfig: React.PropTypes.any,
		momentumDecayConfig: React.PropTypes.any,
		// springOriginConfig: React.PropTypes.any,
		directionLockDistance: React.PropTypes.number,
		overshootReductionFactor: React.PropTypes.number,
	};
	static defaultProps = {
		style: {},			//背景
		frameSpace: 200,	//每个元素的宽带
		horizontal: true,	//是否水平显示
		SelectId: 0,
		getSelectIndex: (num)=>{console.log('SelectId: '+num)},

		// Animation Config
		overshootSpringConfig: {
			friction: 7,
			tension: 40
		},
		momentumDecayConfig: {
			deceleration: 0.993
		},
		// springOriginConfig: {
		// 	friction: 7,
		// 	tension: 40
		// },
		overshootReductionFactor: 3,
		directionLockDistance: 10,
	};
	// 手势处理
	componentWillMount() {
		this._panResponder = null;
		this._panResponder = PanResponder.create({
      		onStartShouldSetPanResponder: ()=>true,
      		onMoveShouldSetPanResponder: ()=>true,
      		onPanResponderGrant: this.panResponderStart.bind(this),
      		onPanResponderMove: this.panResponderMove.bind(this),
      		onPanResponderRelease: this.panResponderRelease.bind(this),
    	});
	}
	panResponderStart() {
		var anim = this.state.translate;
		this.old = anim._value;
	}
	// 移动中
	panResponderMove(evt, {dx, dy, vx, vy}) {
		var anim = this.state.translate;
		if (this.props.horizontal) {
			// 水平移动
			var val = this.old + dx;
		} else {
			// 竖直移动
			var val = this.old + dy;
		}

		var {
			children,
			frameSpace,
		} = this.props;
		var min = 0-(children.length-1)*frameSpace;
		var max = 0;
		if (val > max) {
			val = max + (val - max) / this.props.overshootReductionFactor;
		}
		if (val < min) {
			val = min - (min - val) / this.props.overshootReductionFactor;
		}
		this.state.translate.setValue(val);
	}
	// 松开
	panResponderRelease(evt, {vx, vy}) {
		var {
			children,
			frameSpace,
			horizontal,
			SelectId,
		} = this.props;

		var anim = this.state.translate;
		var min = 0-(children.length-1)*frameSpace;
		var max = 0;
		var velocity = vx;
		if (!horizontal) velocity = vy;
		var endX = 0;
		anim.flattenOffset();
		// 结束时的处理
		if (anim._value < min) {
			Animated.spring(anim, {
				...this.props.overshootSpringConfig,
				toValue: min,
				velocity,
			}).start();
			endX = min;
		} else if (anim._value > max) {
			Animated.spring(anim, {
				...this.props.overshootSpringConfig,
				toValue: max,
				velocity,
			}).start();
			endX = max;
		} else {
			endX = this.momentumCenter(anim._value, velocity, frameSpace);
			endX = Math.max(endX, min);
			endX = Math.min(endX, max);
			var bounds = [endX - frameSpace / 2, endX + frameSpace / 2];
			var endV = this.velocityAtBounds(anim._value, velocity, bounds);

			this._listener = anim.addListener(({
				value
			}) => {
				if (value > bounds[0] && value < bounds[1]) {
					Animated.spring(anim, {
						toValue: endX,
						velocity: endV,
					}).start();
				} else if (value < min) {
					Animated.spring(anim, {
						...this.props.overshootSpringConfig,
						toValue: min,
						endV,
					}).start();
				} else if (value > max) {
					Animated.spring(anim, {
						...this.props.overshootSpringConfig,
						toValue: max,
						endV,
					}).start();
				}
			});

			Animated.decay(anim, {
				...this.props.momentumDecayConfig,
				velocity,
			}).start(() => {
				anim.removeListener(this._listener);
			});
		}
		SelectId = -(endX/frameSpace);
		this.props.getSelectIndex(SelectId);
	}
	// 保证中心位置
	closestCenter(x, spacing) {
		var plus = (Math.abs(x % spacing)) < spacing / 2 ? 0 : spacing;
		var endX = (parseInt(x / spacing)) * spacing - plus;
		// return Math.floor(x / spacing) * spacing + plus;
		return endX;
	}
	// 确定结束位置
	momentumCenter(x0, vx, spacing) {
		var t = 0;
		var deceleration = this.props.momentumDecayConfig.deceleration || 0.997;
		var x1 = x0;
		var x = x1;

		while (true) {
			t += 16;
			x = x0 + (vx / (1 - deceleration)) *
				(1 - Math.exp(-(1 - deceleration) * t));
			if (Math.abs(x - x1) < 0.1) {
				x1 = x;
				break;
			}
			x1 = x;
		}
		return this.closestCenter(x1, spacing);
	}
	// 结束速度
	velocityAtBounds(x0, vx, bounds) {
		var t = 0;
		var deceleration = this.props.momentumDecayConfig.deceleration || 0.997;
		var x1 = x0;
		var x = x1;
		var vf;
		while (true) {
			t += 16;
			x = x0 + (vx / (1 - deceleration)) *
				(1 - Math.exp(-(1 - deceleration) * t));
			vf = (x - x1) / 16;
			if (x > bounds[0] && x < bounds[1]) {
				break;
			}
			if (Math.abs(vf) < 0.1) {
				break;
			}
			x1 = x;
		}
		return vf;
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
	},
	text: {
		alignItems: 'center',
		height: 50,
	}
});

export default CoverFlow;