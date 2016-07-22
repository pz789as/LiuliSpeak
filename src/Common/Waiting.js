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
} from 'react-native';

import {
  styles,
} from '../Styles';

import {
  ImageRes
} from '../Resources';

let listWaitRes = [
  ImageRes.block_loading00,
  ImageRes.block_loading01,
  ImageRes.block_loading02,
  ImageRes.block_loading03,
  ImageRes.block_loading04,
  ImageRes.block_loading05,
  ImageRes.block_loading06,
  ImageRes.block_loading07,
  ImageRes.block_loading08,
  ImageRes.block_loading09,
  ImageRes.block_loading10,
  ImageRes.block_loading11,
];

export default class Waiting extends Component {
  constructor(props){
    super(props);
    this.state = {
      waitIdx:0,
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state || nextProps != this.props) return true;
    return false;
  }
  componentWillMount(){
    this.waitFrame = setInterval(this.WaitFrame.bind(this), 100);
  }
  componentWillUnmount(){
    this.waitFrame && clearInterval(this.waitFrame);
  }
  WaitFrame(){
    this.setState({
      waitIdx: (this.state.waitIdx + 1) % listWaitRes.length,
    });
  }
  render() {
    return (
      <View style={[styles.waitingAllBack, styles.center]}>
        <View style={styles.waitingBack}>
          <Image style={styles.waitingImageStyle}
            source={listWaitRes[this.state.waitIdx]} />
        </View>
      </View>
    );
  }
}

