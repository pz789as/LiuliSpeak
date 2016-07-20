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
  TouchableOpacity,
} from 'react-native';

import {
  styles,
  ScreenWidth,
  minUnit,
} from '../Styles';

import {
  Consts,
  Scenes,
} from '../Constant';

export default class C_KindBoard extends Component {
  constructor(props){
    super(props);
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  kindOnSelected(index){
    this.props.kindOnSelected(index);
  }
  render() {
    var iconArr = [];
    for(var i = 0; i < 8; i++) {
      var idx = i == 7 ? (this.props.kindList.length - 1) : i;
      iconArr.push(
        <TouchableOpacity style={styles.kindBoardItemView} 
          key={idx} onPress={this.kindOnSelected.bind(this, idx)}>
          <View style={[
            styles.kindBoardItemIcon, 
            {backgroundColor: this.props.kindList[idx].color}
            ]}/>
          <Text style={{fontSize: minUnit * 3, marginTop: minUnit * 2}}>
            {this.props.kindList[idx].name}
          </Text>
        </TouchableOpacity>
      )
    }
    return (
      <View style={styles.kindBoardView}>
        {iconArr}
      </View>
    );
  }
}

