'use strict';

/*
	该页面需要实现的回调函数，传入的参数设置
	onPressBack()					返回按键回调 
	onPlay()						播放按钮，开始播放录音
	onPause()						录音停止按钮
	changePlayKind(kind)			改变播放设置（传入参数为播放类型（0，单次播放	1，循环播放））
	onStart()						开始闯关
	showKind						设置中的初始显示设置（0，中文	1，英文	2，中/英文）
	speedKind						设置中的播放速度设置（0，慢		1，正常	2，快）
	changeOption(index, select)		设置中选项处理（index，标记是显示设置还是速度设置		select，当前选中项）
	gold 							当前金币数量
	GoldAllNum 						总金币数量
	getGold							获得当前的金币数
	dialogData						对话数据
*/

import React, {
	Component
} from 'react';

import {
	StyleSheet,
	View,
	PixelRatio,
	Text,
	ProgressViewIOS,
	Image,
	Animated,
	TouchableOpacity,
	ScrollView,
} from 'react-native';

import {
	UtilStyles,
	ScreenWidth,
	ScreenHeight,
	minUnit,
} from '../Styles';

import {
  ImageRes
} from '../Resources';

import * as Progress from 'react-native-progress';
import IconButton from './IconButton.js';
import ListItem from './C_ListItem';

class c_practice extends Component {
	scrollY = 0;
	scrollHeight = 0;
	myLayout = null;//..
	scrollLayout = null;//..
	listItemLayout = [];//..
	blnInTouch = false;//..
	constructor(props) {
		super(props);

		this.state = {
			blnSet: false,
			optionW: new Animated.Value(0),
			optionH: new Animated.Value(0),
			showKind: this.props.showKind,
			speedKind: this.props.speedKind,
			blnAutoplay: false,//自动播放的标志
			playKind: 0,
			goldNum: this.props.gold,
			select: 0,
		};

	}

	_onLayout = (event)=>{
		this.myLayout = event.nativeEvent.layout;//..获取当前组件的layout
	}
	_onLayoutScrollView = (event)=>{
		this.scrollLayout = event.nativeEvent.layout;//..获取整个ScrollView的layout
		//console.log("scrollLayout :",this.scrollLayout);
	}
	_onLayoutItem =(index,event)=>{
		this.listItemLayout[index] = event.nativeEvent.layout;//..获取每个item在父组件中的位置
		//console.log("TouchOpiact layout:",event.nativeEvent.layout);
	}
	blnTouchPartice = (touch)=>{ //..
		//判断当前的touch是否在自己的位置
		if(this.blnInTouch){
			if(!this.blnInRange(touch)){//如果touch在自己的位置
				//console.log("手指离开了此区域");
				this.blnInTouch = false;
			}
			this.collisionItems(touch);//判断此手势是否在当前item的"句子"子组件上
		}else{
			if(this.blnInRange(touch)){//如果touch在自己的位置
				//console.log("触碰我这儿了");
				this.collisionItems(touch);
				this.blnInTouch = true;
			}
		}
		return this.blnInTouch;
	}
	blnInRange=(touch)=>{//通过手势位置和本身位置,计算"碰撞" //..
		var layout = this.myLayout;
		let tx = touch.tx;
		let ty = touch.ty;
		if(ty > layout.y && ty < layout.y + layout.height){
			if(tx > layout.x && tx < layout.x + layout.width){
				return true;
			}
		}
		return false;
	}
	collisionItems=(touch)=>{//..
		for(var i=0;i<this.props.dialogData.length;i++){
			var colLayout = {
				x:this.listItemLayout[i].x+this.scrollLayout.x + this.myLayout.x,
				y:this.listItemLayout[i].y+this.scrollLayout.y + this.myLayout.y,
				w:this.listItemLayout[i].width,
				h:this.listItemLayout[i].height,
			};
			if(this.refs[i].blnTouchItem(touch,colLayout)){
				break;
			}
		}
	}
	setMoveEnd = ()=>{//..
		this.blnInTouch = false;
		for(var i=0;i<this.props.dialogData.length;i++){
			if(this.refs[i].getTouchState()){
				this.refs[i].setMoveEnd();
			}
		}
	}
	render() {
		return (
			<View style={UtilStyles.back} onLayout={this._onLayout.bind(this)}>
			{/* //.. */}
			{/*上 名称，返回，进度条*/}
			<View style={styles.top}>
				<View style={[styles.name, UtilStyles.center, ]}>
					<IconButton	style={styles.backButton} icon={ImageRes.ic_back} onPress={this.props.onPressBack}/>
					<Text style={UtilStyles.font}>
						修炼
					</Text>
				</View>
				{/*进度条*/}
				<View style={[styles.progress, UtilStyles.center, styles.line]}>
					<Progress.Bar
						progress={this.state.goldNum/this.props.GoldAllNum}
						unfilledColor='#C0C0C0'
						borderWidth={1}
						borderColor='#C0C0C0'
						borderRadius={minUnit*2.5}
						color='#E8BB4B'
						height={minUnit*2.4}
						width={minUnit*85}/>
					<View style={[styles.progressText, UtilStyles.center,]}>
						<Text style={styles.progressFont}>
							{this.state.goldNum}/{this.props.GoldAllNum}
						</Text>
					</View>
				</View>
			</View>
			{/*中间列表*/}
			<View style={[styles.list, styles.line]} onLayout={this._onLayoutScrollView.bind(this)}>
				{/* //.. */}
				<ScrollView
					ref={'ScrollView'}
					onLayout={(event)=>{this.scrollHeight = event.nativeEvent.layout.height;}}
					showsVerticalScrollIndicator={false}
				  	contentContainerStyle={styles.contentContainer}
				  	style={[styles.scrollView, ]}>
				  	{this.drawScrollView(this.state.select)}
				</ScrollView>
			</View>
			{this.renderOption()}
			{/*下方 按钮选项*/}
			{this.renderBottom()}
		</View>
		);
	}
	showMsg() {
		console.log("Hello World!");
	}
	// 列表显示
	drawScrollView(select) {
		var array = [];
		for (var i=0;i<this.props.dialogData.length;i++) {
			var dialogInfo = {lesson:this.props.lessonID,course:this.props.courseID,dIndex:i,gategory:this.props.dialogData[i].Category}
			array.push(
				<TouchableOpacity
					disabled={this.state.blnAutoplay}
					onPress={this.touchView.bind(this,i)}
					activeOpacity={1}
					key={i}
					onLayout = {this._onLayoutItem.bind(this,i)}>
					<ListItem itemWordCN={this.props.dialogData[i].cn} 
							itemWordEN={this.props.dialogData[i].en} 
							audio={this.props.dialogData[i].mp3}
							itemShowType={this.state.showKind}
							itemBlnSelect={i==select?true:false}
							itemScore={0}
							itemCoins={this.props.dialogData[i].gold}
							ref={i}
							playNext={this.playNext.bind(this)}
							blnInAutoplay={this.state.blnAutoplay}
							user = {i%2}
							dialogInfo={dialogInfo}
							/>
					
                </TouchableOpacity>
				);
		}
		return array;
	}
	// 列表中选中处理
	touchView(_id) {
		if (_id != this.state.select){
			//..this.listItemPlayStop();
			//..this.stopRecord(_id);

			this.setState({
				select: _id
			});
		}
	}

	componentWillUpdate(nextProps,nextState){
		if(nextState.select != this.state.select){
			this.refs[this.state.select]._onHiddenItem();//通知ListItem被关闭了
			this.refs[nextState.select]._onSelectItem();//通知ListItem被选中,改变它的itemStatus值
		}
	}

	// 播放结束（主要处理下方按钮中的整体播放，根据是否整体播放，决定是否播放下一条）

	playNext() {
		if (this.state.blnAutoplay) {
			var index = (this.state.select+1)%this.props.dialogData.length;
			// 单次播放的 跳出

			/*
			if (index == 0 && this.state.playKind == 0) {
				this._onPause();
				return;
			}*/

			this.touchView(index);
			//this.listItemPlayStart();
			this.moveScrollView();
		}
	}
	// 控制列表移动（主要是自动播放时，根据当前选中项，判断列表是否移动）
	moveScrollView() {
		var height = this.scrollY;
		var moveY = 0;
		for (var i=0;i<this.state.select;i++) {
			height += this.refs[i].height;
		}
		if (height < 0) {
			moveY = height;
		} else {
			height += this.refs[this.state.select].height;
			if (height > this.scrollHeight) {
				moveY = height - this.scrollHeight;
			}
		}
		this.refs.ScrollView.scrollTo({
			y: moveY
		});
	}
	 
	// 金币获得
	addGold(num) {
		if (this.state.goldNum < this.props.GoldAllNum) {
			this.setState({
				goldNum: this.state.goldNum + num
			});
			this.props.getGold(this.state.goldNum+num);
		}
	}


	// 下方按钮显示处理
	renderBottom() {
		if (this.state.blnAutoplay) {
			return (
				<View style={[styles.bottom, styles.line]}>
				<IconButton icon={ImageRes.pause} onPress={this._onPause.bind(this)}/>
				<IconButton buttonStyle={[styles.playSet, this.state.playKind==1&&styles.playSetColor]} onPress={this._onPlayset.bind(this)}
					fontStyle={[UtilStyles.fontSmall, this.state.playKind==1&&styles.fontColor]} text={this.state.playKind?'循环播放':'单次播放'}/>
			</View>
			);
		} else {
			return (
				<View style={[styles.bottom, styles.line]}>
				<IconButton icon={[ImageRes.play, ImageRes.pause]} onPress={this._onPlay.bind(this)}/>
				<IconButton buttonStyle={[styles.start, UtilStyles.center]} onPress={this._onStart.bind(this)} text='开始闯关'/>
				<IconButton icon={ImageRes.more} onPress={this._onMoreSet.bind(this)}/>
			</View>
			);
		}
	}
	// 下方按键处理（播放，暂停，开始闯关，设置）
	_onPlay() {
		if (this.state.blnSet) {
			this._onMoreSet();
		}
		this.setState({
			blnAutoplay: true,
		});
		this.refs[this.state.select]._onAutoplay();
	}
	_onPause() {
		this.setState({
			blnAutoplay: false
		});
		this.refs[this.state.select]._onStopAutoplay();
	}
	_onPlayset() {
		if (this.state.playKind == 0) {
			this.setState({
				playKind: 1
			});
		} else {
			this.setState({
				playKind: 0
			});
		}
		this.props.changePlayKind(this.state.playKind);
	}
	_onStart() {
		this.props.onStart();
		if (this.state.blnSet) {
			this._onMoreSet();
		}
	}
	// 设置选项 弹出设置界面
	_onMoreSet() {
		this.setState({
			blnSet: !this.state.blnSet
		});
		this.appearAni();
	}
	// 设置界面
	renderOption() {
		if (this.state.blnSet) {
			return (
				<View style={UtilStyles.shade}>
				<TouchableOpacity
					style={{flex: 1,}}
					onPress={this._onMoreSet.bind(this)}
					activeOpacity={1}
					>
				</TouchableOpacity>
				<Animated.View style={[styles.set, {width:this.state.optionW, height:this.state.optionH,}, ]}>
					{/*上下选项*/}
					{this.renderOptionTitle(0, '切换中/英文显示', ['中','英','中/英'], this.state.showKind)}
					{this.renderOptionTitle(1, '变速播放', ['慢 0.6x','正常 1x','快 1.4x'], this.state.speedKind)}
				</Animated.View>
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
				{this.drawButton(_id, _list, _select, _onPress)}
				</View>
			</View>
		);
	}
	// 设置中的按钮
	drawButton(_id, _list, _select, _onPress) {
		var array = [];
		for (var i = 0; i < _list.length; i++) {
			array.push(
				<TouchableOpacity
					onPress = {this.changeOption.bind(this,_id,i)}
					style={[styles.button, i==0&&styles.buttonLeft,i==2&&styles.buttonRight, i<_list.length-1&&styles.buttonLine, i==_select&&styles.buttonSelect]}
					key={i}>
					<Text style={[styles.buttonText, i==_select&&styles.textSelectColor]}>
					  	{_list[i]}
					</Text>
				</TouchableOpacity>
			);
		}
		return array;
	}
	changeOption(_id, select) {
		if (_id == 0) {
			this.setState({
				showKind: select
			});
		} else {
			this.setState({
				speedKind: select
			});
		}
		this.props.changeOption(_id, select);
	}
	// 设置界面出现动画
	appearAni() {
		this.state.optionW.setValue(20);
		Animated.timing(
			this.state.optionW, {
				toValue: minUnit*76,
				duration: 1,
			}
		).start();
		this.state.optionH.setValue(10);
		Animated.timing(
			this.state.optionH, {
				toValue: minUnit*50,
				duration: 1,
			}
		).start();
	}
}

const styles = StyleSheet.create({
	top: {
		marginTop: 20,
		height: minUnit*15,
	},
	name: {
		height: minUnit*10,
	},
	backButton: {
		position: 'absolute',
		left: 10 / PixelRatio.get(),
		top: 0 / PixelRatio.get(),
	},
	progress: {
		flex: 1,
	},
	list: {
		flex: 1,
		backgroundColor:'#E9E9E9'
	},
	bottom: {
		height: minUnit*14,
		paddingHorizontal: minUnit*2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor:'#FFFFFF',
	},
	start: {
		width: minUnit*34,
	},
	playSet: {
		width: minUnit*28,
		height: minUnit*9,
		borderRadius: minUnit*4.5,
		borderWidth: 1 / PixelRatio.get(),
		borderColor: '#919191',
	},
	playSetColor: {
		backgroundColor: '#898989',
	},
	line: {
		borderTopWidth: 1 / PixelRatio.get(),
		borderColor: '#6B7071',
	},
	set: {
		position: 'absolute',
		right: minUnit*4,
		bottom: minUnit*18,
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
		marginTop: minUnit*3,
		marginHorizontal: minUnit*2,
		height: minUnit*8,
		borderRadius: minUnit*8-2/PixelRatio.get(),
		borderWidth: 1 / PixelRatio.get(),
		borderColor: '#5D6464',
		flexDirection: 'row',
	},
	button: {
		flex: 1,
		height: minUnit*8-2/PixelRatio.get(),
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonLeft: {
		borderTopLeftRadius: minUnit*8-2/PixelRatio.get(),
		borderBottomLeftRadius: minUnit*8-2/PixelRatio.get(),
	},
	buttonRight: {
		borderTopRightRadius: minUnit*8-2/PixelRatio.get(),
		borderBottomRightRadius: minUnit*8-2/PixelRatio.get(),
	},
	buttonSelect: {
		backgroundColor: '#E8E8E8',
	},
	buttonLine: {
		borderRightWidth: 1 / PixelRatio.get(),
		borderColor: '#6B7071',
	},
	buttonText: {
		textAlign: 'center',
		fontSize: minUnit*4,
		color: '#2E2D2E',
	},
	textSelectColor: {
		color: '#34B621',
	},
	fontColor: {
		color: '#F2F2F2',
	},
	progressText: {
		position: 'absolute',
		left: 0,
		top: 0,
		backgroundColor:'rgba(10,10,10,0)',
		width: ScreenWidth,
		height: minUnit*4,
	},
	progressFont: {
		fontSize: minUnit*3,
		color: '#FFFFFF',
		letterSpacing: minUnit/2,
	},
	contentContainer: {
		paddingVertical: 0
	},
	scrollView: {
		flex: 1,
	},
});
export default c_practice;