/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
} from 'react-native';


export default class C_MenuBack extends Component {
  constructor(props){
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state || nextProps != this.props) return true;
    return false;
  }
  componentWillMount(){
  }
  componentDidMount(){
  }
  componentWillUnmount(){
  }
  render() {
    return (
      <Image source={{uri:this.props.image}}>
        
      </Image>
    );
  }
}

const styles = StyleSheet.create({
	container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  menu:{
    width: 200,
    height: 200,
  },
  blur:{
    width: 200,
    height: 200,
  },
});

