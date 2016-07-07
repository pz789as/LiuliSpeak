'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  PixelRatio,
  Image,
	Text,
} from 'react-native';

import Dimensions from 'Dimensions';
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
var minUnit = ScreenWidth/100;
var width = minUnit*80;
var height = ScreenHeight*0.7;

import IconButton from './IconButton';

class LessonCard extends Component {
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
						<Text style={styles.lessonTitleCN}>{this.props.titleCN}</Text>
					</View>
					<View style={styles.buttonView}>
						<IconButton	onPress={this.onPress1.bind(this)} 
								buttonStyle={styles.buttonStyle} 
								text={'修炼'} />
						<IconButton	onPress={this.onPress2.bind(this)} 
								buttonStyle={[styles.buttonStyle, {marginTop:minUnit*2}]} 
								text={'闯关'} />
					</View>
	      </View>
		  {/*下方其他信息*/}
	      <View style={[styles.bottom, styles.border]}>
	      </View>
      </View>
    );
  }
	onPress1(){
		this.props.onStart(parseInt(this.props.rowID), 0);
	}
	onPress2(){
		this.props.onStart(parseInt(this.props.rowID), 1);
	}
	onPress3(){
		this.props.onStart(parseInt(this.props.rowID), 2);
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