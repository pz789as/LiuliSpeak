/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ListView,
  TouchableHighlight,
} from 'react-native';

import {
  styles,
  ScreenWidth,
  ScreenHeight,
  minUnit,
  MinWidth,
} from '../Styles';

import {
  Consts,
  Scenes,
} from '../Constant';

import {
  kindList,
  ImageRes,
} from '../Resources';

import PageTop from '../Common/PageTop';

export default class P_KindList extends Component {
  constructor(props){
    super(props);
    this.state = {
      listDataSource: new ListView.DataSource({
        rowHasChanged:(oldRow, newRow)=>{oldRow !== newRow}
      }),
    };
    this.listData = [];
    for(var i=0;i<kindList.length;){
      if (i==0){
        this.listData.push({color:'rgb(127,127,127)', name:'全部'});
      }else{
        this.listData.push(kindList[i-1]);
      }
      i++;
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state) return true;
    return false;
  }
  componentWillMount(){
  }
  componentDidMount(){
    this.setState({
      listDataSource:this.state.listDataSource.cloneWithRows(this.listData),
    });
  }
  componentWillUnmount(){
  }
  onPressBack(){
    this.props.PopPage();
  }
  onSelectKind(rowID){
    //0 选择全部
    // 选择其他类型
    this.props.GotoPage(Consts.NAVI_PUSH, Scenes.LESSONLIST, {
      freshType: Consts.REFRESH,
      listKind: this.listData[rowID],
      mainTitle: this.listData[rowID].name,
    });
  }
  render() {
    return (
      <View style={[styles.fill, {backgroundColor: 'white'}]}>
        <View style={styles.studyTopBar}>
          <PageTop mainTitle='选择分类'
            onPressBack={this.onPressBack.bind(this)}/>
        </View>
        <View style={[styles.fill, {backgroundColor: 'white'}]}>
          <ListView dataSource={this.state.listDataSource}
            renderRow={this.renderRow.bind(this)}
            style={styles.fill} />
        </View>
      </View>
    );
  }
  renderRow(data, sectionID, rowID){
    return (
      <TouchableHighlight onPress={this.onSelectKind.bind(this, rowID)} 
        underlayColor='#DDD'>
        <View style={styles.kindListItemStyle}>
          <View style={[styles.kindListItemIconBack, {backgroundColor: data.color}]}>
            <Image source={ImageRes.me_icon_normal} style={styles.kindListItemIconImage}/>
          </View>
          <Text style={{fontSize: minUnit * 6, marginLeft: minUnit * 5}}>
            {data.name}
          </Text>
          <View style={{flex:1}} />
          <Image source={ImageRes.ic_chevron_right} style={styles.kindListItemRightIamge}/>
        </View>
      </TouchableHighlight>
    );
  }
}

