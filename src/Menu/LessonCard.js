'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  PixelRatio,
  Image,
  Text,
  InteractionManager,
  Alert,
} from 'react-native';

import {
  serverUrl,
  getMp3FilePath,
} from '../Constant';

import {
	ImageRes,
} from '../Resources';

import Dimensions from 'Dimensions';
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
var minUnit = ScreenWidth/100;
var width = minUnit*80;
var height = ScreenHeight*0.7;

import IconButton from '../Common/IconButton';

class LessonCard extends Component {
	static defaultProps = {
		waitTime: 200,
	};
	constructor(props){
		super(props);
		this.progress = 1;
		this.state = {
	  		blnDraw: false,
			isDown: false,
			blnFresh: false,
	  	};
	  	if (this.props.waitTime == 0) {
	  		this.state.blnDraw = true;
		}
	}
	setFresh(){
		this.setState({
			blnFresh: !this.state.blnFresh,
		});
	}
	shouldComponentUpdate(nextProps, nextState) {
		if (nextState != this.state || nextProps != this.props) return true;
		else return false;
	}
	componentDidMount() {
		this.canExam();
		if (this.props.waitTime > 0) {
			InteractionManager.runAfterInteractions(()=>{
				this.timer = setTimeout(()=>{
					this.setState({
						blnDraw: true
					});
				},this.props.waitTime);
			});
		}
	}
	render() {
		if (!this.state.blnDraw) {
			return (
				<View style={[styles.back, this.props.style?this.props.style:{}, styles.border]}>
				</View>
			);
		}
		return (
			<View style={[styles.back, this.props.style?this.props.style:{}, styles.border]}>
				{/*上方图片*/}
				{this.drawImage()}
				{/*选项，标题，介绍等*/}
				<View style={[styles.msg, styles.border]}>
					<View style={styles.titleView}>
						<Text style={styles.lessonTitle}>Lesson{parseInt(this.props.rowID) + 1}</Text>
						<Text style={styles.lessonTitleCN}>{this.props.course.titleCN}</Text>
					</View>
					{this.drawButton()}
				</View>
				{/*下方其他信息
				<View style={[styles.bottom, styles.border]}>
				</View>*/}
			</View>
		);
	}
	drawImage(){
		var practice = app.getPracticeSave(app.temp.lesson.key, this.props.rowID);
		var star = app.getStarCount(practice.score);
		var score = practice.score + '分';
		if (practice.isPass){
			return (
				<View style={[styles.top, styles.border]}>
					<Image source={{uri:app.getImageUrl(this.props.course.ksimage)}}
						style={styles.imageView}>
						<View style={styles.topPassMsg}>
							<View style={styles.starAndScore}>
								<Image source={star>=1 ? ImageRes.icon_star_l_hit : ImageRes.icon_star_l} 
									style={styles.starImage} 
									resizeMode='contain' />
								<Image source={star>=2 ? ImageRes.icon_star_l_hit : ImageRes.icon_star_l}
									style={styles.starImage}
									resizeMode='contain' />
								<Image source={star>=3 ? ImageRes.icon_star_l_hit : ImageRes.icon_star_l}
									style={styles.starImage}
									resizeMode='contain' />
								<Text style={styles.scoreText}>{score}</Text>
							</View>
						</View>
					</Image>
				</View>
			);
		}else{
			return (
				<View style={[styles.top, styles.border]}>
					<Image source={{uri:app.getImageUrl(this.props.course.ksimage)}}
						style={styles.imageView}/>
				</View>
			);
		}
	}
	drawButton(){
		var practice = app.getPracticeSave(app.temp.lesson.key, this.props.rowID);
		if (practice.isLock) {
			return (
				<View style={styles.buttonView}>
					<Image source={ImageRes.icon_lock_l_normal} 
						style={styles.lockImage}
						resizeMode={'contain'}/>
				</View>
			);
		}else{
			return (
				<View style={styles.buttonView}>
					<IconButton	onPress={this.onPress1.bind(this)} 
							buttonStyle={styles.buttonStyle} 
							text={'修炼'}
							progress={this.progress}
							ref={'download'} />
					<IconButton onPress={this.onPress2.bind(this)} 
							buttonStyle={[styles.buttonStyle, 
								{
									marginTop:minUnit*2, 
									backgroundColor: this.state.isDown ? '#63D75C' : '#AAA'
								}]} 
							enable={this.state.isDown}
							text={'闯关'}/>
				</View>
			);
		}
	}
	componentWillMount(){
	}
	componentWillUnmount(){
		this.checkMp3Time && clearTimeout(this.checkMp3Time);
		this.clearProgressTime && clearTimeout(this.clearProgressTime);
		this.gotoNextTime && clearTimeout(this.gotoNextTime);
		this.timer && clearTimeout(this.timer);
		this.downloadTime && clearTimeout(this.downloadTime);
		this.stopDownloadOne();
	}
	onPress1(){
		app.menu && app.menu.setDownload(true);
		app.main && app.main.setLessonTime(app.temp.lesson.key);
		this.refs.download && this.refs.download.setProgross(0, true);
		var path = fs.DocumentDirectoryPath + getMp3FilePath(app.temp.lesson.key, this.props.rowID);
		logf(path);
		this.checkMp3Time = setTimeout(this.checkMp3.bind(this,path), 200);
	}
	onPress2(){
		if (this.state.isDown){
			app.main && app.main.setLessonTime(app.temp.lesson.key);
			this.props.onStart(parseInt(this.props.rowID), 1);
		}
	}
	onPress3(){
		this.props.onStart(parseInt(this.props.rowID), 2);
	}
	canExam(){
		var path = fs.DocumentDirectoryPath + getMp3FilePath(app.temp.lesson.key, this.props.rowID);
		fs.exists(path)
		.then((result)=>{
			if (result) {//路径存在
				this.readExam(path, 0);
			}
		})
		.catch((err)=>{
			console.log('err:', err);
		});
	}
	readExam(path, idx) {
		fs.stat(path+'/'+this.props.course.contents[idx].mp3)
		.then((resultFile)=>{
			if (resultFile.size == this.props.course.contents[idx].mp3size){
				console.log(idx);
				idx ++;
				if (idx == this.props.course.contents.length) {
					this.setState({
						isDown: true,
					});
				}else {
					this.readExam(path, idx);
				}
			}
		})
		.catch((err)=>{
			console.log('err', err);
		});
	}
 	checkMp3(path){
		fs.exists(path)
		.then((result)=>{
			if (result) {//路径存在
				if (this.state.isDown){
					this.gotoNext();
				}else{
					this.downLoadMp3(path);
				}
			}else{
				this.makeDir(path);
			}
		})
		.catch((err)=>{
			console.log('err:', err);
		});
	}
	makeDir(path){
		fs.mkdir(path)
		.then((result)=>{
			if (result[0]){
				this.downLoadMp3(path);
			}else{
				Alert.alert(
					'提示',
					'创建缓存文件出错，请重新再试！',
					[{
						text: '确定', 
						onPress: ()=>{
							app.menu && app.menu.setDownload(false);
							this.refs.download && this.refs.download.setProgross(0, false);
						}
					}]
				);
			}
		})
		.catch((err)=>{
			logf('err:', err);
		});
	}
	downLoadMp3(path){
		if (app.netState == 0){
			this.course = this.props.course;
			this.allIdx = this.course.contents.length;
			this.goIdx = 0;
			this.tmpLen = [];
			this.intIdx = 0;
			this.downLoadOne(path, this.intIdx);
		}else{
			Alert.alert(
				'提示',
				'当前网络未连接或不稳定，请检查网络，稍后再试！',
				[{
					text: '确定', 
					onPress: ()=>{
						app.menu && app.menu.setDownload(false);
						this.refs.download && this.refs.download.setProgross(0, false);
					}
				}]
			);
		}
	}
	stopDownloadOne(){
		if (this.downloadJobId){
			fs.stopDownload(this.downloadJobId);
			console.log('stop download: ', this.downloadJobId);
		}
	}
	downloadTimeout(){
		this.stopDownloadOne();
		Alert.alert(
			'网络超时',
			'下载失败，请稍后再试！',
			[{
				text: '确定', 
				onPress: ()=>{
					app.menu && app.menu.setDownload(false);
					this.refs.download && this.refs.download.setProgross(0, false);
				}
			}]
		);
	}
	downLoadOne(path, idx){
		var localPath = path + '/' + this.course.contents[idx].mp3;
		var fromUrl = serverUrl + '/LiuliSpeak/lessons/lesson' + 
						(parseInt(app.temp.lesson.key)) + '/' + 
						this.course.contents[idx].mp3;
		logf(fromUrl);
		logf(localPath);
		this.downloadTime = setTimeout(this.downloadTimeout.bind(this), 9000);
		this.downloadJobId = null;
		fs.downloadFile({
			fromUrl: fromUrl,
			toFile: localPath,
			begin: this.downLoadBegin.bind(this),
			progress: this.downloadProgress.bind(this),
		})
		.then((response)=>{
			this.downloadJobId = null;
			this.downloadTime && clearTimeout(this.downloadTime);
			if (response.statusCode == 200){//下载成功
				this.intIdx++;
				if (this.intIdx == this.allIdx){//全部下载完毕之后
					this.clearProgressTime = setTimeout(this.clearProgress.bind(this), 100);
				}else{
					this.downLoadOne(path, this.intIdx);
				}
			}else{
				Alert.alert(
					'提示',
					'下载资源出错，请稍后再试！',
					[{
						text: '确定', 
						onPress: ()=>{
							app.menu && app.menu.setDownload(false);
							this.refs.download && this.refs.download.setProgross(0, false);
						}
					},]
				);
			}
		})
		.catch((err)=>{
			this.downloadJobId = null;
			this.downloadTime && clearTimeout(this.downloadTime);
			Alert.alert(
				'提示',
				'网络信号不好，请稍后再试！',
				[{
					text: '确定', 
					onPress: ()=>{
						app.menu && app.menu.setDownload(false);
						this.refs.download && this.refs.download.setProgross(0, false);
					}
				}]
			);
		});
	}
	downLoadBegin(result){
		this.downloadJobId = result.jobId;
		this.tmpLen[result.jobId] = 0;
	}
	downloadProgress(result){
		this.goIdx += (result.bytesWritten - this.tmpLen[result.jobId])/result.contentLength;
		this.tmpLen[result.jobId] = result.bytesWritten;
		logf(this.goIdx);
		this.refs.download && this.refs.download.setProgross(this.goIdx/this.allIdx, true);
	}
	clearProgress(){
		this.refs.download && this.refs.download.setProgross(0, false);
		this.setState({
			isDown: true,
		});
		this.gotoNextTime = setTimeout(this.gotoNext.bind(this), 200);
	}
	gotoNext(){
		app.menu && app.menu.setDownload(false);
		this.props.onStart(parseInt(this.props.rowID), 0);
	}
}

const styles = StyleSheet.create({
	back: {
		width: width,
		height: height,
		borderRadius: minUnit*3,
		backgroundColor: '#FDFFFF',
		overflow: 'hidden',
	},
	border: {
		// borderWidth: 1,
		// borderColor: '#252525'
	},
	top: {
		height: height*0.4,
		borderBottomWidth: 1/PixelRatio.get(),
		borderColor: '#C7C7C7',
	},
	imageView:{
		height: height * 0.4,
		width: width,
		justifyContent: 'center',
		alignItems: 'center',
	},
	topPassMsg:{
		height: height * 0.4,
		width: width,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FA08'
	},
	starAndScore:{
		flexDirection: 'row',
		height: minUnit * 15,
		justifyContent: 'center',
		alignItems: 'flex-end',
	},
	starImage:{
		width: minUnit*18,
		height: minUnit*15,
	},
	scoreText:{
		fontSize: minUnit*5,
		color: 'white',
	},
	msg: {
		flex: 1,
		// flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleView:{
		marginTop:minUnit*2,
		height:minUnit*10,
		width:width,
		alignItems:'center',
		justifyContent:'center',
	},
	buttonView:{
		flex:1,
		width:width,
		alignItems:'center',
		justifyContent:'center',
	},
	lessonTitle:{
		fontSize:minUnit*3,
		width:width,
		marginTop: minUnit*3,
		textAlign:'center',
	},
	lessonTitleCN:{
		fontSize:minUnit*6,
		marginTop: minUnit*3,
		width:width,
		textAlign:'center',
	},
	bottom: {
		height: height*0.1,
		borderTopWidth: 1/PixelRatio.get(),
		borderColor: '#C7C7C7',
	},
	buttonStyle: {
		width: width*0.6,
	},
	lockImage:{
		width: width*0.25,
		height: width*0.25,
	},
	passView:{
		height: height*0.4,
		backgroundColor: '#CC0',
		justifyContent: 'center',
		alignItems: 'center',
	},
});


export default LessonCard;