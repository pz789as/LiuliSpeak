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
  TextInput,
} from 'react-native';

import {
  styles,
  UtilStyles,
} from '../Styles';

import {
  Consts,
  Scenes,
} from '../Constant';

import {
  ImageRes
} from '../Resources';

import IconButton from '../Common/IconButton'; 

export default class P_AllLessonsTop extends Component {
  constructor(props){
    super(props);
    this.state = {
      onSearch: false,
      searchText: '',
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state && nextProps != this.props) return true;
    return false;
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  SearchSwitch(){
    var blnSearch = this.state.onSearch;
    blnSearch = !blnSearch;
    this.setState({
      onSearch: blnSearch,
    });
  }
  doSearchLesson(){
    console.log('doing Search ' + this.state.searchText + ' Lessons begin');
    this.props.doSearchLessons();
  }
  
  render() {
    return (
      <View style={[styles.lessonsTopStyle, styles.line]}>
        <IconButton	icon={ImageRes.ic_back} 
            onPress={this.props.onPressBack}/>
        {this.state.onSearch ? null : <Text style={UtilStyles.font}>全部课程</Text>}
        {this.DrawSearch()}
      </View>
    );
  }

  DrawSearch(){
    if (this.state.onSearch) {
      return (
        <View style={{flexDirection:'row'}}>
          <View style={styles.lessonsTopSearchView}>
            <Image style={styles.lessonsTopSearchIconStyle}
              source={ImageRes.icon_store_search} />
            <TextInput style={styles.lessonsTopInputStyle}
              placeholder='搜索课程'
              placeholderTextColor='#CCC'
              onSubmitEditing={this.doSearchLesson.bind(this)}
              clearButtonMode='while-editing'
              returnKeyType='search'
              onChangeText={(text)=>{
                this.setState({
                  searchText: text,
                });
              }}>
            </TextInput>
          </View>
          <IconButton buttonStyle={styles.lessonsTopSearchCancel}
              fontStyle={UtilStyles.font}
              text={'取消'}
              onPress={this.SearchSwitch.bind(this)} />
        </View>
      );
    }else {
      return (
        <IconButton icon={ImageRes.icon_store_search}
            onPress={this.SearchSwitch.bind(this)}/>
      );
    }
  }
  
}

