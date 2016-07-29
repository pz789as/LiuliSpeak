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

var resources = require('../Resources');

var width = minUnit*90;
var height = minUnit*35;

import * as Progress from 'react-native-progress';

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

const msg = [
'还没有开始闯关',
'闯关中...',
'不错，闯关成功!',
];

export default class C_CardItem extends Component {
  listNum = 0;
  constructor(props){
    super(props);
    console.log(this.props.renderData);
    if (this.props.renderData.practices) {
      this.listNum = this.props.renderData.practices.length;
    }
  }
  static propTypes = {
    renderData: React.PropTypes.any.isRequired,       //数据信息
    blnMain: React.PropTypes.bool,                    //是否在主菜单
    progress: React.PropTypes.number,                 //进度条（仅在主菜单）
    starNum: React.PropTypes.number,                  //星星数量（仅在主菜单）
    blnNew: React.PropTypes.bool,                     //是否为new
    blnAdd: React.PropTypes.bool,                     //是否已经添加
	};
  static defaultProps = {
    blnMain: true,
    progress: 0.5,
    starNum: 3,
    blnNew: false,
    blnAdd: false,
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state || nextProps != this.props) return true;
    return false;
  }
  render() {
    return (
    	<View style={[styles.container, this.props.style?this.props.style:{}]}>
        <Image
          style={[styles.image, this.props.imgStyle?this.props.imgStyle:{}]}
          source={this.props.image}>
          {this.renderAlreadyAdd()}
        </Image>
        {this.renderMsg()}
        {this.renderNew()}
    	</View>
    );
  }
  // 新课程
  renderNew() {
    if (!this.props.blnNew) return null;
    return (
      <Image
        style={styles.imageNew}
        source={resources.ImageRes.icon_newcourse} />
    );
  }
  // 已添加图标
  renderAlreadyAdd() {
    if (!this.props.blnAdd) return null;
    return (
      <View style={styles.alreadyAdd}>
        <Image
          style={styles.imageAdd}
          source={resources.ImageRes.icon_course_list_already_add} />
        <Text style={styles.fontAdd}>已添加</Text>
      </View>
    );
  }
  // 右侧信息显示
  renderMsg() {
    var {
      renderData,
      blnMain,
    } = this.props;
    return (
      <View style={[styles.message, ]}>
        {this.drawText(styles.name, renderData.titleCN, true)}
        {this.drawText(styles.small, renderData.titleEN, !blnMain)}
        {this.drawText(styles.small, '难度：'+renderData.degree, !blnMain)}
        {this.drawProgress()}
        {this.drawText(styles.small, msg[0], blnMain)}
        {this.drawStar()}
      </View>
    );
  }
  // 进度条（progress父组件传入）
  drawProgress() {
    if (!this.props.blnMain) return null;
    return (
      <Progress.Bar
        style={styles.progress}
        progress={this.props.progress}
        unfilledColor='#C0C0C0'
        borderWidth={1}
        borderColor='#C0C0C0'
        borderRadius={minUnit*1}
        color='#19E824'
        height={minUnit*2}
        width={minUnit*50}/>
    );
  }
  // 星星数量显示
  drawStar() {
    if (!this.props.blnMain) return null;
    return (
      <View style={[styles.starPosition, styles.border]}>
        <Image
          style={styles.starImg}
          source={resources.ImageRes.ic_star_yellow} />
        <Text style={[styles.small, styles.fontMove]}>
        {this.props.starNum}/{this.listNum*3}
        </Text>
      </View>
    );
  }
  // 文字信息显示
  drawText(style, text, bln) {
    if (!bln) return null;
    if (text == undefined) return null;
    return (
      <Text style={style} numberOfLines={1}>{text}</Text>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF',
    borderRadius:minUnit*2,
    width: width,
    height: height,
    marginHorizontal: minUnit*5,
    flexDirection: 'row',
    overflow: 'hidden',
	},
  border: {
    // borderColor:'#273231',
    // borderWidth: 1,
  },
  image: {
    width: width*0.3,
    height: height,
    backgroundColor: '#B8B8F5'
  },
  alreadyAdd: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(10,10,10,0.3)'
  },
  imageAdd: {
    width: width*0.3-minUnit*4,
    height: width*0.3-minUnit*4,
    margin: minUnit*2,
  },
  fontAdd: {
    fontSize: minUnit*3.5,
    color: '#FFFFFF',
  },
  imageNew: {
    position: 'absolute',
    right: 0,
    top: -MinWidth,
    width: minUnit*13,
    height: minUnit*13,
  },
  message: {
    margin: minUnit*4,
    flex: 1,
    overflow: 'hidden',
  },
  name: {
    fontSize: minUnit*5,
    marginBottom: minUnit,
  },
  progress: {
    marginVertical: minUnit,
  },
  small: {
    marginVertical: minUnit,
    fontSize: minUnit*4,
    color: '#6C6C6C',
  },
  fontMove: {
    // marginBottom: minUnit*0.5,
  },
  starPosition: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: minUnit*6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  starImg: {
    width: minUnit*4,
    height: minUnit*4,
    marginRight: minUnit,
  },
});