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
let MinWidth = 1/PixelRatio.get();
let minUint = ScreenWidth/100;

var width = minUint*80;
var height = minUint*35; 
class C_StudyCourse extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  render() {
    return (
    	<View style={[styles.arrange, this.props.style? this.props.style:styles.back]}>
        {/*左侧图标*/}
        <Image
          style={this.props.imgStyle?this.props.imgStyle:styles.image}
          source={this.props.image} />
        {/*右侧详细信息*/}
        <View style={[styles.message, styles.border]}>
          {/*课程名称，课程介绍，课程创建时间*/}
          <Text style={styles.name}>
            {this.props.name}
          </Text>
          <Text style={styles.tips}>
            {this.props.msg}
          </Text>
          <Text style={styles.time}>
            {this.props.time}
          </Text>
        </View>
    	</View>
    );
  }
}

const styles = StyleSheet.create({
	back: {
		backgroundColor: '#FFFFFF',
    borderRadius:minUint*3,
    width: width,
    height: height,
    marginHorizontal: ScreenWidth*0.1,
	},
  arrange: {
    flexDirection: 'row',
  },
  image: {
    width: width*0.3,
    height: height,
  },
  message: {
    margin: 10*MinWidth,
    padding: 20*MinWidth,
    flex: 1,
  },
  name: {
    fontSize: minUint*6,
    color: '#11171D',
  },
  tips: {
    fontSize: minUint*4,
    color: '#53686A',
  },
  time: {
    fontSize: minUint*3,
    color: '#000000',
  },
  border: {
    // borderColor:'#273231',
    // borderWidth: 1,
  }
});


export default C_StudyCourse;