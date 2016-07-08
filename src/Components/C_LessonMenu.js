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

import IconButton from './IconButton';
import LessonCard from './LessonCard';
import CoverFlow from './CoverFlow';

import {
  styles,
  ScreenWidth,
  ScreenHeight,
  minUnit,
} from '../Styles';

let MinWidth = 1/PixelRatio.get();

import ShowNum from './ShowNum';

class C_LessonMenu extends Component {
  constructor(props){
    super(props);
    this.state = {
      moveY: new Animated.Value(minUnit * 32),
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
          <IconButton icon={ImageRes.more} onPress={this.props.onMore}/>
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
    // this.setState({
    //   showIdx: select,
    // });
  }
  drawList(){
    var array = [];
    var rowIDs = this.props.listDataSource.rowIdentities[0];
    for(var i=0;i<rowIDs.length;i++){
      var course = this.props.listDataSource.getRowData(0,i);
      array.push(<LessonCard onStart={this.gotoLesson.bind(this)} 
          rowID={i}
          titleCN={course.titleCN}
          titleEN={course.titleEN}
          key={i} />);
    }
    return array;
  }
  drawMoreMenu(){
    var moveInStyle={
      transform:[{
        translateY: this.state.moveY,
      }],
    };
    if (this.props.blnMoreMenu){
      return (<TouchableWithoutFeedback onPress={this.AnimatedOut.bind(this)}>
            <View style={ming.moreMenu}>
              <Animated.View style={moveInStyle}>
                <View style={ming.upMenu}>
                  <TouchableOpacity style={ming.touchFont} onPress={this.props.gotoMorePage}>
                    <Text style={ming.menuFont}>详情</Text>
                  </TouchableOpacity>
                  <View style={ming.upMenuLine} />
                  <TouchableOpacity style={ming.touchFont}>
                    <Text style={ming.menuFont}>下载全部关卡</Text>
                  </TouchableOpacity>
                </View>
                <View style={ming.downMenu}>
                  <TouchableOpacity style={ming.touchFont} onPress={this.AnimatedOut.bind(this)}>
                    <Text style={ming.menuFont}>取消</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
      );
    }
  }
  gotoLesson(rowID, kind){
    this.props.selectListItem(rowID, kind);
  }
  AnimatedInt() {
    this.state.moveY.setValue(minUnit * 32);
    Animated.timing(this.state.moveY, {
			toValue: 0,
		}).start();
  }
  AnimatedOut(){
    Animated.timing(this.state.moveY, {
			toValue: minUnit * 32,
		}).start(()=>{
      this.props.cancelMore();
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
  moreMenu:{
    position:'absolute',
    top:0,
    left:0, 
    width:ScreenWidth, 
    height:ScreenHeight, 
    backgroundColor:'rgba(10,10,10,0.5)',
  },
  upMenu:{
    position:'absolute',
    top: ScreenHeight - minUnit * 32,
    left: minUnit * 2,
    width: ScreenWidth - minUnit * 4,
    height: minUnit * 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor:'#808080',
    borderRadius: 10,
    alignItems:'center',
    justifyContent:'space-around',
    paddingVertical: minUnit * 1,
  },
  downMenu:{
    position: 'absolute',
    top: ScreenHeight - minUnit * 11,
    left: minUnit * 2,
    width: ScreenWidth - minUnit * 4,
    height: minUnit * 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor:'#808080',
    borderRadius: 10,
    alignItems:'center',
    justifyContent:'center',
  },
  upMenuLine:{
    width: ScreenWidth - minUnit * 4,
    height: 1,
    backgroundColor: '#A0A0A0',
  },
  touchFont:{
    alignItems:'center',
    width: ScreenWidth - minUnit * 4,
  },
  menuFont:{
    fontSize: minUnit * 5,
    backgroundColor:'rgba(10,10,10,0)',
  },
});

export default C_LessonMenu;