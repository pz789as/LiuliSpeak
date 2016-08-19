/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';

import {
  ScreenWidth,
  ScreenHeight,
  minUnit,
  MinWidth,
} from '../Styles';

import {
  BlurView,
  VibrancyView,
} from 'react-native-blur';

import FXBlurView from 'react-native-fxblurview';

export default class C_MenuBack extends Component {
  constructor(props){
    super(props);
    this.state = {
      imageName: '',
    };
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
  setImage(name){
    this.setState({
      imageName: name,
    });
  }
  render() {
    // return (
    //   <View style={styles.container}>
    //     <Image 
    //       source={{uri:app.getImageUrl(this.state.imageName)}} 
    //       style={styles.image}>
    //       <BlurView 
    //         blurType='light' 
    //         style={styles.blur}/>
    //     </Image>
    //   </View>
    // );

    return (
      <FXBlurView style={styles.container}
        blurRadius={50}
        blurEnabled={true}
        dynamic={true}>
        <Image 
          source={{uri:app.getImageUrl(this.state.imageName)}} 
          style={styles.image}/>
      </FXBlurView>
    );
  }
}

const styles = StyleSheet.create({
	container: {
    position: 'absolute',
    width: ScreenWidth,
    height: ScreenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DBDDDD',
  },
  image:{
    width: ScreenWidth,
    height: ScreenHeight,
  },
  blur:{
    width: ScreenWidth,
    height: ScreenHeight,
  },
});

