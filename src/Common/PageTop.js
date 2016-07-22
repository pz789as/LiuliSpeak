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
  ScreenWidth,
  minUnit,
  UtilStyles,
} from '../Styles';

import {
  Consts,
  Scenes,
} from '../Constant';

import {
  ImageRes
} from '../Resources';

import IconButton from './IconButton'; 

export default class C_LessonListTop extends Component {
  constructor(props){
    super(props);
  }
  static propTypes = {
		onPressBack: React.PropTypes.func.isRequired,
    mainTitle: React.PropTypes.string.isRequired,
	};
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state && nextProps != this.props) return true;
    return false;
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  render() {
    return (
      <View style={[styles.lessonsTopStyle, styles.line]}>
        <IconButton	icon={ImageRes.ic_back} 
            onPress={this.props.onPressBack}/>
        <Text style={this.props.titleStyle ? this.props.titleStyle : UtilStyles.font}>
          {this.props.mainTitle}
        </Text>
        <View style={{width: minUnit * 10}}/>
      </View>
    );
  }
}

