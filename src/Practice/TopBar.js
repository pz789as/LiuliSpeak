'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text
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

class TopBar extends Component {
	// 添加判断是否重新render（本身状态改变时才会重新渲染）
	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}
  	render() {
	    return (
	      	<View style={[styles.container, styles.line]}>
      			<Text style={UtilStyles.font}>
      			  修炼
      			</Text>
	      		<IconButton	style={styles.backButton} icon={ImageRes.ic_back} onPress={this.props.onPressBack}/>
	      	</View>
	    );
  	}
}

const styles = StyleSheet.create({
	container: {
		height: minUnit*11,
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderColor: '#6B7071',
	},
	backButton: {
		position: 'absolute',
		left: minUnit,
		top: 0,
	}
});


export default TopBar;