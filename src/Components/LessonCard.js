'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  PixelRatio,
  Image,
  Text,
  InteractionManager,
} from 'react-native';

var fs = require('react-native-fs');

import {
  serverUrl,
  getMp3FilePath,
} from '../Constant';

import Dimensions from 'Dimensions';
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
var minUnit = ScreenWidth/100;
var width = minUnit*80;
var height = ScreenHeight*0.7;

import IconButton from './IconButton';

class LessonCard extends Component {
	constructor(props){
		super(props);
		this.progress = 1;
	}
	render() {
		return (
		<View style={[styles.back, this.props.style?this.props.style:{}, styles.border]}>
			{/*上方图片*/}
			<View style={[styles.top, styles.border]}>
			</View>
			{/*选项，标题，介绍等*/}
			<View style={[styles.msg, styles.border]}>
						<View style={styles.titleView}>
							<Text style={styles.lessonTitle}>Lesson{parseInt(this.props.rowID) + 1}</Text>
							<Text style={styles.lessonTitleCN}>{this.props.course.titleCN}</Text>
						</View>
						<View style={styles.buttonView}>
							<IconButton	onPress={this.onPress1.bind(this)} 
									buttonStyle={styles.buttonStyle} 
									text={'修炼'}
									progress={this.progress}
									ref={'download'} />
							<IconButton	onPress={this.onPress2.bind(this)} 
									buttonStyle={[styles.buttonStyle, {marginTop:minUnit*2}]} 
									text={'闯关'}/>
						</View>
			</View>
			{/*下方其他信息*/}
			<View style={[styles.bottom, styles.border]}>
			</View>
		</View>
		);
	}
	componentWillMount(){
	}
	componentWillUnmount(){
		this.checkMp3Time && clearTimeout(this.checkMp3Time);
		this.clearProgressTime && clearTimeout(this.clearProgressTime);
		this.gotoNextTime && clearTimeout(this.gotoNextTime);
	}
	componentDidMount(){
	}
	onPress1(){
		this.refs.download && this.refs.download.setProgross(0, true);
		var path = fs.DocumentDirectoryPath + getMp3FilePath(this.props.lessonID,this.props.rowID);
		console.log(path);
		this.checkMp3Time = setTimeout(this.checkMp3.bind(this,path), 200);
	}
	onPress2(){
		this.props.onStart(parseInt(this.props.rowID), 1);
	}
	onPress3(){
		this.props.onStart(parseInt(this.props.rowID), 2);
	}
	checkMp3(path){
		fs.exists(path)
		.then((result)=>{
			if (result) {//路径存在
				var count = 0;
				var exits = 0;
				for(var idx=0; idx < this.props.course.contents.length; idx++){
					fs.exists(path+'/'+this.props.course.contents[0].mp3).
					then((resultFile)=>{
						count++;
						if (resultFile){//存在的文件
							exits++;
						}
						if (count == this.props.course.contents.length){
							if (exits == count){//文件都存在就可以正常跳转
								this.props.onStart(parseInt(this.props.rowID), 0);
							}else{//有文件不存在就要去下载
								this.downLoadMp3(path);
							}
						}
					})
					.catch((err)=>{
						console.log(err);
					});
				}
			}else{
				this.makeDir(path);
			}
		})
		.catch((err)=>{
			console.log(err);
		});
	}
	makeDir(path){
		fs.mkdir(path)
		.then((result)=>{
			if (result[0]){
				this.downLoadMp3(path);
			}else{
				console.log(result);
			}
		})
		.catch((err)=>{
			console.log(err);
		});
	}
	downLoadMp3(path){
		this.course = this.props.course;
		this.allIdx = this.course.contents.length;
		this.goIdx = 0;
		this.tmpLen = [];
		this.intIdx = 0;
		for(var idx=0; idx < this.allIdx; idx++){
			var localPath = path + '/' + this.course.contents[idx].mp3;
			var fromUrl = serverUrl + '/Other/LiuliSpeak/Lessons/lesson' + 
							(parseInt(this.props.lessonID)+1) + '_mp3/' + this.course.contents[idx].mp3;
			console.log(fromUrl);
			console.log(localPath);
			fs.downloadFile({
				fromUrl: fromUrl,
				toFile: localPath,
				begin: this.downLoadBegin.bind(this),
				progress: this.downloadProgress.bind(this),
			})
			.then((response)=>{
				if (response.statusCode == 200){//下载成功
					this.intIdx++;
					if (this.intIdx == this.allIdx){
						this.clearProgressTime = setTimeout(this.clearProgress.bind(this), 100);
					}
				}else{
					console.log(response);
				}
			})
			.catch((err)=>{
				console.log(err);
			});
		}
	}
	downLoadBegin(result){
		this.tmpLen[result.jobId] = 0;
	}
	downloadProgress(result){
		this.goIdx += (result.bytesWritten - this.tmpLen[result.jobId])/result.contentLength;
		this.tmpLen[result.jobId] = result.bytesWritten;
		console.log(this.goIdx);
		this.refs.download.setProgross(this.goIdx/this.allIdx, true);
	}
	clearProgress(){
		this.refs.download && this.refs.download.setProgross(0, false);
		this.gotoNextTime = setTimeout(this.gotoNext.bind(this), 200);
	}
	gotoNext(){
		this.props.onStart(parseInt(this.props.rowID), 0);
	}
}

const styles = StyleSheet.create({
	back: {
		width: width,
		height: height,
		borderRadius: minUnit*3,
		backgroundColor: '#FDFFFF',
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
		fontSize:12,
		// position:'absolute',
		// top:minUnit*2,
		width:width,
		textAlign:'center',
	},
	lessonTitleCN:{
		fontSize:24,
		// position:'absolute',
		// top:minUnit*7,
		marginTop: minUnit*2,
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
	}
});


export default LessonCard;