'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
  Text,
  PanResponder,
  Animated,
  TouchableOpacity,
} from 'react-native';

import {
  ScreenWidth,
  ScreenHeight,
  minUnit,
  MinWidth,
} from '../Styles';

import {
  ImageRes,
} from '../Resources';

import {
  serverUrl,
} from '../Constant';

var width = minUnit*90;
var height = minUnit*35;

var MoveDis = minUnit*30;

import* as Progress from 'react-native-progress';
export default class C_CardItem extends Component {
  oldx = 0;
  touchKind = -1;
  constructor(props){
    super(props);

    this.state = {
      movex: new Animated.Value(0),
      blnRefresh: false,
    };
    this.imagePath = app.getImageUrl(this.props.image);
  }
  Refresh() {
    this.setState({
      blnRefresh: !this.state.blnRefresh,
    });
  }
  static propTypes = {
    renderData: React.PropTypes.any.isRequired,       //数据信息
    onTouch: React.PropTypes.func,                    //点击效果
	};
  static defaultProps = {
    onTouch: ()=>{logf('Touched!')},
    parents: null,
    blnCanMove: false,
    blnRenderAdd: false,
    blnRenderCom: false,          // 标记是否已完成
    renderRight: ()=>{return null},
    deleteBack: (key)=>{},

    // Animation Config
    overshootSpringConfig: {
      friction: 7,
      tension: 40
    },
    momentumDecayConfig: {
      deceleration: 0.993
    },
    // springOriginConfig: {
    //  friction: 7,
    //  tension: 40
    // },
    overshootReductionFactor: 3,
    directionLockDistance: 10,
    index: 0,
  };
  // 手势处理
  componentWillMount() {
    this._panResponder = null;
    this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: ()=>true,
          onMoveShouldSetPanResponder: ()=>true,
          onPanResponderGrant: this.panResponderStart.bind(this),
          onPanResponderMove: this.panResponderMove.bind(this),
          onPanResponderRelease: this.panResponderRelease.bind(this),
      });
  }
  // 开始
  panResponderStart() {
    this.touchKind = 0;
    this.oldx = this.state.movex._value;
    if (this.props.blnCanMove) {
      this.props.parents.setSelect(this.props.renderData.key);
    }
  }
  // 移动
  panResponderMove(evt, {dx, dy, vx, vy}) {
    if (this.touchKind == 0) {
      if (Math.abs(dx) > Math.abs(dy)) this.touchKind = 1;
      else this.touchKind = 2;
    }
    if (this.props.blnCanMove && this.touchKind == 1) {
      var newx = this.oldx+dx;
      if (newx > 0) newx = 0;
      else if (newx < -MoveDis*1.5) newx = -MoveDis*1.5;
      this.state.movex.setValue(newx);
      if (dx != 0 && this.props.parents!=null) {
        this.props.parents.closeScrollMove();
      }
    }
  }
  // 松开
  panResponderRelease(evt, {vx, vy}) {
    if (this.touchKind == 0) {
      if (this.state.movex._value == 0) {
        this.props.onTouch();
      }
    }
    if (this.props.parents!=null) {
      this.props.parents.openScrollMove();
    }
    if (this.props.blnCanMove && this.touchKind == 1) {
      var movex = this.state.movex;

      var dis = Math.abs(movex._value);
      var target = 0;
      if (dis > MoveDis/2) target = -MoveDis;
      if (vx > 0 && dis == 0) return;
      if (Math.abs(vx) < 0.2) {
        this.endMove();
      } else {
        if (Math.abs(vx) < 0.5) {
          if (vx > 0) vx += 0.5;
          else vx -= 0.5;
        }
        this._listener = movex.addListener(({
          value
        }) => {
          if (value > 0) {
            movex.setValue(0);
          } else if (value < -MoveDis) {
            Animated.spring(movex, {
              ...this.props.overshootSpringConfig,
              toValue: -MoveDis,
            }).start();
          }
        });
        Animated.decay(movex, {
          ...this.props.momentumDecayConfig,
          toValue: target,
          velocity: vx
        }).start(()=>{
          movex.removeListener(this._listener);
        });
      }
    }
  }
  endMove() {
    if (Math.abs(this.state.movex._value) > MoveDis/2) {
      // console.log('AnimatedShow');
      this.AnimatedShow();
    } else {
      // console.log('AnimatedBack');
      this.AnimatedBack();
    }
  }
  AnimatedShow() {
    Animated.timing(this.state.movex, {
      toValue: -MoveDis,
    }).start();
  }
  AnimatedBack() {
    if (this.state.movex._value == 0) return;
    Animated.timing(this.state.movex, {
      toValue: 0,
    }).start();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // logf('carditem update:', nextProps != this.props, nextProps.image);
    if (nextState != this.state || nextProps != this.props) return true;
    return false;
  }
  render() {
    this.imagePath = app.getImageUrl(this.props.image);
    return (
      <View style={[styles.container, ]}>
        {this.renderDelete()}
      	<Animated.View style={[styles.frame, this.props.style?this.props.style:{}, {transform:[{translateX: this.state.movex}]}, ]} {...this._panResponder.panHandlers}>
          <Image
            style={[styles.image, this.props.imgStyle?this.props.imgStyle:{}]}
            source={{uri:this.imagePath}}>
            {this.renderLeft(this.props.renderData)}
          </Image>
          {this.renderMsg()}
          {/*this.renderNew()*/}
      	</Animated.View>
      </View>
    );
  }
  renderDelete() {
    return (
      <TouchableOpacity style={styles.delete} onPress={this.deleteCard.bind(this)} activeOpacity={1}>
        <Image
          style={styles.deleteImage}
          source={ImageRes.empty_trash} />
      </TouchableOpacity>
    );
  }
  deleteCard() {
    this.props.deleteBack(this.props.renderData.key);
    // app.main.subOldLesson(this.props.renderData.key);
  }
  renderLeft(course) {
    var isAdd = app.lessonIsAdd(course.key);
    var isCom = app.lessonIsComplete(course.key);
    if (this.props.blnRenderAdd) {
      if (isAdd) {
        if (isCom) {
          return this.renderCom(course);
        } else {
          return this.renderAdd(course);
        }
      }
    } else if (this.props.blnRenderCom) {
      if (isCom) {
        return this.renderCom(course);
      }
    }
  }
  renderAdd(course) {
    // 已添加
    return (
      <View style={styles.left}>
        <Image
          style={styles.cardLeftImage}
          source={ImageRes.icon_course_list_already_add} />
        <Text style={styles.cardLeftWord}>已添加</Text>
      </View>
    );
  }
  renderCom(course) {
    // 已完成显示
    var info = app.getMainLessonInfo(course.key);
    var progress = info.star/info.starAll;
    return (
      <View style={styles.left}>
        <Progress.Circle style={styles.progress} thickness={minUnit*1.5} borderWidth={0}
                           progress={progress} size={minUnit*20} color="#F3B341" unfilledColor={'#FFFAFC'}>
          <Image
            style={styles.cardLeftStar}
              source={ImageRes.ic_star_yellow} />
        </Progress.Circle>
        <Text style={styles.cardLeftWord}>{info.star}/{info.starAll}</Text>
        <Text style={styles.cardLeftWord}>已完成</Text>
      </View>
    );
  }
  // 右侧信息显示
  renderMsg() {
    return (
      <View style={[styles.message, ]}>
        {this.props.renderRight(this.props.renderData)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
    width: ScreenWidth,
    height: height,
    marginVertical: minUnit*2,
    alignItems: 'center',
	},
  delete: {
    position: 'absolute',
    right: MoveDis/2,
    top: height/2 - minUnit*6,
    borderRadius: minUnit*6,
    overflow: 'hidden',
  },
  deleteImage: {
    width: minUnit*12,
    height: minUnit*12,
  },
  frame: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius:minUnit*2,
    width: width,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  border: {
    borderColor:'#273231',
    borderWidth: 1,
  },
  image: {
    width: width*0.3,
    height: height,
    backgroundColor: '#B8B8F5'
  },
  left: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: minUnit*3,
    backgroundColor: 'rgba(10,10,10,0.5)',
  },
  message: {
    flex: 1,
    overflow: 'hidden',
  },
  cardLeftImage: {
    width: minUnit*20,
    height: minUnit*20,
  },
  cardLeftStar: {
    position: 'absolute',
    left: minUnit*4,
    top: minUnit*4,
    width: minUnit*12,
    height: minUnit*12,
  },
  cardLeftWord: {
    fontSize: minUnit*3.5,
    color: '#FFFFFF',
  },
});