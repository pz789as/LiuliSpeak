'use strict';
/*
	图标按钮组件
	属性：
	style：				背景样式
	icon：				图标（可以传入一个图标icon：{}，也可传入多个图标icon：{【，，，】}）
	iconWidth：			要显示图标的宽度
	iconHeight：			要显示图标的高度
	onPress：			按键触发函数（当iocn有多个图标时，可以有返回值，返回id，点击按钮更改图标）

	//以下属性为没有图标传入时的按钮处理（会根据传入的buttonStyle样式显示按钮）
	buttonStyle：		按钮样式
	text：				按钮上要显示的文字内容
	fontStyle：			按钮上要显示的文字字体样式
*/
import React, {
	Component
} from 'react';

import {
	StyleSheet,
	View,
	TouchableOpacity,
	Image,
	Text,
	InteractionManager,
	PixelRatio,
} from 'react-native';

import * as Progress from 'react-native-progress';

import Dimensions from 'Dimensions';
var screenWidth = Dimensions.get('window').width;

var minUnit = screenWidth/100;
var width = minUnit*11;
var height = minUnit*11;

// 透明度（点击后的变化）
var opacity = 0.5;

class IconButton extends Component {
	constructor(props) {
		super(props);

		this.state = {
			icon_k: 0,
			progress: 0,
			blnProgress: false,
			blnDraw: false,
		};
	}
	setProgross(v, bln){
		if (v > 1) v = 1;
		this.setState({
			progress: v,
			blnProgress: bln,
		});
	}
	render() {
		if (!this.state.blnDraw) {
			return (
				<View style={[styles.center, this.props.style?this.props.style:{}, styles.border]}>
					{this.renderButton()}
				</View>
			);
		}
		return (
			<TouchableOpacity
				style={[styles.center, this.props.style?this.props.style:{}, styles.border]}
				onPress={this.keyPress.bind(this)}
				activeOpacity={opacity}>
				{this.renderButton()}
			</TouchableOpacity>
		);
	}
	componentDidMount() {
		InteractionManager.runAfterInteractions(()=>{
			this.setState({
				blnDraw: true,
			});
		});
	}
	keyPress() {
		var kind = this.props.onPress();
		if (kind != undefined) {
			if (kind != this.state.icon_k) {
				this.setState({
					icon_k: kind
				});
			}
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		if (nextState != this.state) return true;
		if (nextProps != this.props) return true;
		return false;
	}
	renderButton() {
		if (this.props.icon) {
			return (
				<Image style = {
					{
						width: this.props.iconWidth ? this.props.iconWidth : width,
						height: this.props.iconHeight ? this.props.iconHeight : height,
					}
				}
				source = {
					this.setImage()
				}/>
			);
		} else if (this.props.progress){
			var pg = this.state.blnProgress ? <Progress.Bar style={{flex:1}}
						progress={this.state.progress}
						unfilledColor='#C0C0C000'
						color='rgb(69,175,62)'
						borderWidth={0}
						borderRadius={height/2}
						width={this.pw}
						height={height}/> : null;
			return (
				<View style={[styles.center, styles.button, this.props.buttonStyle?this.props.buttonStyle:{}]}
							onLayout={(event)=>{this.pw = event.nativeEvent.layout.width;}} >
					{pg}
					<View style={[styles.newFont,styles.center]}>
						{this.renderText()}
					</View>
				</View>
			);
		} else {
			return (
				<View style={[styles.center, styles.button, this.props.buttonStyle?this.props.buttonStyle:{}]}>
					{this.renderText()}
				</View>
			);
		}
	}
	renderText() {
		if (this.props.text) {
			return (
				<Text style={[styles.font,this.props.fontStyle?this.props.fontStyle:{}]}>
				 	{this.props.text}
				</Text>
			);
		}
	}
	// componentDidMount(){
	// 	this.updatep = setInterval(this.updateProgress.bind(this), 1000);
	// }
	// updateProgress(){
	// 	var v = (this.state.progress + 0.1) % 1;
	// 	logf(v);
	// 	this.setState({
	// 		progress: v,
	// 	});
	// }
	// componentWillUnmount(){
	// 	this.updatep && clearInterval(this.updatep);
	// }
	setImage() {
		if (typeof(this.props.icon) == 'number') {
			return this.props.icon;
		} else if (typeof(this.props.icon) == 'object') {
			var _index = this.state.icon_k;
			if (this.props.icon.length > _index) {
				return this.props.icon[_index];
			}
		}
	}
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#63D75C',
		width: width,
		height: height,
		borderRadius: width / 2,
	},
	center: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	border: {
		// borderWidth: 1 / PixelRatio.get(),
		// borderColor: '#424142',
	},
	font: {
		fontSize: minUnit*6,
		color: '#F2FEF5',
	},
	newFont:{
		position:'absolute',
		left:0,
		top:0,
		right:0,
		bottom:0,
		backgroundColor:'#0000'
	},
});


export default IconButton;