'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';

import {
  ScreenWidth,
  ScreenHeight,
  minUnit,
  MinWidth,
} from '../Styles';

var width = minUnit*90;
var height = minUnit*40;

//renderRight: 渲染函数，返回传入的renderData，渲染右侧显示信息，根据自己的需求修改里面的内容。
//renderData: renderData，可以是自己设定的任何值，如果有多个值，可以传入一个json对象，如：
//
// render(){
//  return (
//    ...
//    <CardItem renderData:{{title: 'title', msg: 'msg', progress: 0.1, ...}}
//      renderRight：{this.renderRight.bind(this)} />
//    ...
//  );
// }
//
// renderRight(data){
//   return (
//     <View style={...}>
//       <Text>data.title</Text>
//       <Text>data.msg</Text>
//       <Progress value={data.progress} />
//     </View>
//   );
// }


export default class C_CardItem extends Component {
  constructor(props){
    super(props);
  }
  static propTypes = {
		renderRight: React.PropTypes.func.isRequired,
    renderData: React.PropTypes.any.isRequired,
	};
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state || nextProps != this.props) return true;
    return false;
  }
  render() {
    return (
    	<View style={[styles.arrange, this.props.style? this.props.style:styles.back]}>
        <Image
          style={this.props.imgStyle?this.props.imgStyle:styles.image}
          source={this.props.image} />
        {this.props.renderRight(this.props.renderData)}
    	</View>
    );
  }
}

const styles = StyleSheet.create({
	back: {
		backgroundColor: '#FFFFFF',
    borderRadius:minUnit*2,
    width: width,
    height: height,
    marginHorizontal: minUnit*5,
	},
  arrange: {
    flexDirection: 'row',
  },
  image: {
    width: width*0.3,
    height: height,
  },
  border: {
    // borderColor:'#273231',
    // borderWidth: 1,
  }
});