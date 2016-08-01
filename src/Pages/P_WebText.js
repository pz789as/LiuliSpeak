/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  WebView,
} from 'react-native';

import {
  Consts,
  Scenes,
} from '../Constant';

var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';

var TEXT_INPUT_REF = 'urlInput';
var WEBVIEW_REF = 'webview';
var DEFAULT_URL = 'https://www.baidu.com';

const HTML = `
<!DOCTYPE html>\n
<html>
  <head>
    <title>Hello Static World</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=320, user-scalable=no">
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        font: 62.5% arial, sans-serif;
        background: #ccc;
      }
      h1 {
        padding: 1px;
        margin: 0;
        text-align: center;
        color: #33f;
      }
    </style>
  </head>
  <body>
    <h1>Hello Static World<h1>Hello Static World<h1>Hello Static World</h1></h1></h1>
    <h1>Hello Static World</h1>
    <h1>Hello Static World</h1>
    <h1>Hello Static World</h1>
    <h1>Hello Static World</h1>
    <h1>Hello Static World</h1>
    <h1>Hello Static World</h1>
    <h1>Hello Static World</h1>
  </body>
</html>
`;

export default class P_WebText extends Component {
  constructor(props){
    super(props);
    this.state={
      url: DEFAULT_URL,
      status: 'No Page Loaded',
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      loading: true,
      scalesPageToFit: true,
      html: '../../data/test.html',
    };
    this.inputText = '';
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state) return true;
    return false;
  }
  componentWillMount(){
  }
  componentDidMount(){
  }
  componentWillUnmount(){
  }
  GotoLogin(){
    app.PopPage();
  }
  render() {
    this.inputText = this.state.url;
    return (
      <View style={{backgroundColor:'white', flex: 1 }}>
        <View style={{height: 400, marginTop: 40}}>
          <WebView
            style={styles.webView}
            source={{html: HTML}}
            scalesPageToFit={this.state.scalesPageToFit}
          >
          </WebView>
        </View>
      </View>
    );
    // source={require('../../data/test.html')}
  }
}

var styles = StyleSheet.create({
  webView: {
    backgroundColor: BGWASH,
    height: 50,
    overflow: 'hidden',
  },
});

