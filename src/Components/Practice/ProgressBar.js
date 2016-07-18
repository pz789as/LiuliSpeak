'use strict';

import React, { Component } from 'react';

import {
  	StyleSheet,
  	View,
  	Text,
} from 'react-native';

import {
	UtilStyles,
	ScreenWidth,
	ScreenHeight,
	minUnit,
	MinWidth,
} from '../../Styles';

import * as Progress from 'react-native-progress';

class ProgressBar extends Component {
	constructor(props) {
	  	super(props);
	
	  	this.state = {
	  		goldNum: 0,
	  	};
	}
	// 判断是否重新render（自身state改变时才会重新render）
	shouldComponentUpdate(nextProps, nextState) {
		if (nextState != this.state) return true;
		else return false;
	}
  	render() {
    	return (
      		<View style={[styles.container, UtilStyles.center]}>
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
    	);
  	}
  	// 得到金币，state改变，重新render
  	getGold(num) {
  		this.setState({
  			goldNum: goldNum + num, 
  		});
  	}
}

const styles = StyleSheet.create({
	container: {
        height: minUnit*4,
        borderBottomWidth: 1*MinWidth,
        borderColor: '#6B7071'
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
		fontSize: minUnit*2.8,
		color: '#FFFFFF',
		letterSpacing: minUnit/2,
	},
});


export default ProgressBar;