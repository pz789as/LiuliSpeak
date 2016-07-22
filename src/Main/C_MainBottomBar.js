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
} from '../Styles';

import {
  Consts,
  Scenes,
} from '../Constant';

import {
  mainBottomBarIcon,
} from '../Resources';

export default class C_MainBottomBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      selected: 0,
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state && nextProps != this.props) return true;
    return false;
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  onSelected(selected){
    this.setState({
      selected: selected
    });
  }
  render() {
    var list=[];
    for(var i = 0; i < 4; i++){
      list.push(
        <TouchableOpacity style={styles.mainBottomButton} key={i} onPress={this.onSelected.bind(this,i)}>
          <Image style={styles.mainBottomIcon}
              source={ i==this.state.selected ? mainBottomBarIcon[i].selected : mainBottomBarIcon[i].normal}
              resizeMode='contain' />
          <Text style={[styles.mainBottomText,
              {color: i==this.state.selected ? mainBottomBarIcon[i].selectedColor : mainBottomBarIcon[i].normalColor}]}>
            {mainBottomBarIcon[i].text}
          </Text>
        </TouchableOpacity>);
    }
    return (
      <View style={styles.mainBottomView}>
        {list}
      </View>
    );
  }
}

