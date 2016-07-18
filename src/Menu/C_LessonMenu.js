'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  PixelRatio,
  Text,
  ListView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

import {
  ImageRes
} from '../Resources';

import IconButton from '../Common/IconButton';
import LessonCard from './LessonCard';
import CoverFlow from './CoverFlow';

import {
  styles,
  ScreenWidth,
  ScreenHeight,
  minUnit,
  UtilStyles,
} from '../Styles';

let MinWidth = 1/PixelRatio.get();

import ShowNum from './ShowNum';

var MoreMsgH = minUnit*49;
class C_LessonMenu extends Component {
  constructor(props){
    super(props);
    this.state = {
      moreH: new Animated.Value(0),
      moveY: new Animated.Value(0),
      showIdx: 0,
    };
  }
  render() {
    return (
      <View style={ming.menuBack}>
        {/*上方 按钮 信息显示*/}
        <View style={[ming.menuTop, styles.horizontalList]}>
          <IconButton icon={ImageRes.ic_close} onPress={this.props.onClose}/>
          <Text style={{fontSize:16,color:'white'}}>课程名称</Text>
          <IconButton icon={ImageRes.more} onPress={this.AnimatedInt.bind(this)}/>
        </View>
        <View style={{alignItems:'center'}}>
          {/*<Text style={{fontSize:16,color:'white'}}>
            {parseInt(this.state.showIdx + 1)}/{parseInt(this.props.CardNum)}
          </Text>*/}
          <ShowNum select={0} all={this.props.CardNum} ref={'ShowNum'} />
        </View>
        {/*中间课程显示，选择不同的打开方式*/}
        <CoverFlow style={[styles.fill, {alignItems:'center'}, ming.cardHoriziontal]}
                frameSpace={minUnit * 80} 
                SelectId={this.state.showIdx}
                getSelectIndex={this.moveIndex.bind(this)}>
          {this.drawList()}
        </CoverFlow>
        {this.drawMoreMenu()}
      </View>
    );
  }
  moveIndex(select){
    this.refs.ShowNum.setSelect(select);
  }
  drawList(){
    var array = [];
    var rowIDs = this.props.listDataSource.rowIdentities[0];
    for(var i=0;i<rowIDs.length;i++){
      var course = this.props.listDataSource.getRowData(0,i);
      array.push(<LessonCard onStart={this.gotoLesson.bind(this)} 
          rowID={i}
          course={course}
          lessonID={this.props.lessonID}
          key={i} />);
    }
    return array;
  }
  drawMoreMenu(){
      return (
        <Animated.View style={[ming.shade, {height:this.state.moreH}]} >
          <TouchableOpacity style={styles.fill} onPress={this.AnimatedOut.bind(this)} >
          </TouchableOpacity>
          <Animated.View style={[ming.moreMenu, {transform:[{translateY: this.state.moveY}]}]}>
            <View style={ming.upMenu}>
              <TouchableOpacity style={[ming.buttonMenu, styles.center, ming.menuLine]} onPress={this.props.gotoMorePage} activeOpacity={0.5} >
                <Text style={ming.menuFont}>详情</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[ming.buttonMenu, styles.center]} onPress={()=>{}} activeOpacity={0.5} >
                <Text style={ming.menuFont}>下载全部关卡</Text>
              </TouchableOpacity>
            </View>
            <View style={ming.downMenu}>
              <TouchableOpacity style={[ming.buttonMenu, styles.center]} onPress={this.AnimatedOut.bind(this)} activeOpacity={0.5} >
                <Text style={ming.menuFont}>取消</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      );
  }
  gotoLesson(rowID, kind){
    this.props.selectListItem(rowID, kind);
  }
  AnimatedInt() {
    this.state.moreH.setValue(ScreenHeight);
    Animated.timing(this.state.moveY, {
			toValue: -MoreMsgH,
		}).start();
  }
  AnimatedOut(){
    Animated.timing(this.state.moveY, {
			toValue: 0,
		}).start(()=>{
      this.state.moreH.setValue(0);
    });
  }
}

const ming = StyleSheet.create({
	menuBack: {
    flex: 1,
    backgroundColor: '#DBDDDD',
	},
  menuTop: {
    height: minUnit*10,
    margin: minUnit*3,
  },
  list: {
    flex: 1,
  },
  listTop:{
    marginTop:ScreenHeight*0.075,
  },
  cardHoriziontal:{
    marginHorizontal: minUnit*10,
  },
  shade: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: ScreenWidth,
    backgroundColor: 'rgba(10,10,10,0.5)'
  },
  moreMenu:{
    position:'absolute',
    left:minUnit*2, 
    top:ScreenHeight,
    width:ScreenWidth - minUnit*4,
    height:MoreMsgH,
  },
  upMenu:{
    height: minUnit * 30,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor:'#808080',
    borderRadius: 10,
    marginBottom: minUnit*2,
  },
  downMenu:{
    height: minUnit * 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor:'#808080',
    borderRadius: 10,
    marginBottom: minUnit*2,
  },
  buttonMenu: {
    height: minUnit*15,
  },
  menuLine:{
    borderBottomWidth: 1,
    borderColor: '#767575'
  },
  menuFont:{
    fontSize: minUnit * 7,
    backgroundColor:'rgba(10,10,10,0)',
  },
});

export default C_LessonMenu;