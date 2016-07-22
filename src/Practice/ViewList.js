'use strict';

import React, {
    Component
} from 'react';

import {
    StyleSheet,
    View,
    ScrollView,
    ListView,
    TouchableOpacity,
    InteractionManager,
    Image,
    Text,
    Animated,
} from 'react-native';

import {
    UtilStyles,
    ScreenWidth,
    ScreenHeight,
    minUnit,
    MinWidth
} from '../Styles';

import {
    ImageRes,
} from '../Resources';

import ListItem from './C_ListItem';

class ViewList extends Component {
    scrollLayout = null;
    listItemLayout = null;
    blnAutoplay = false;
    blnLoop = false;
    targetNum = 1;

    constructor(props) {
        super(props);

        this.state = {
            select: 0,
            listDataSource: new ListView.DataSource({
                rowHasChanged: (oldRow, newRow)=> {
                    oldRow !== newRow
                }
            }),
            showKind: this.props.showKind,
            speedKind: this.props.speedKind,
            blnDraw: false,
            rotate: new Animated.Value(0),
        };
        this.listItemLayout = [this.props.dialogData.length];

        this.arrayList = [];
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(()=>{
            this.setState({
                blnDraw: true,
            });
        });
    }
    // 修改设置
    changeShow(index, select) {
        // 显示，播放速度设置
        if (index == 0) {
            // 显示设置 0，中文  1，英文  2，中/英文
            this.setState({
                showKind: select
            });
            this.onPause();
        } else {
            // 播放速度 0，0.6x  1，1x  2，1.4x
            this.setState({
                speedKind: select
            });
            //this.onPlay();
        }
    }
    // 设置是否自动播放
    setAutoplay(bln) {
        this.blnAutoplay = bln;
        if (bln) {
            this.onPlay();
        } else {
            this.onPause();
        }
    }
    // 设置是否循环播放
    setLoop(bln) {
        this.blnLoop = bln;
    }

    componentWillMount() {
        this.setState({
            listDataSource: this.state.listDataSource.cloneWithRows(this.props.dialogData),
        });
    }

    _onLayoutItem = (index, event)=> {
        this.listItemLayout[index] = event.nativeEvent.layout;//..获取每个item在父组件中的位置
        //console.log("TouchOpiact layout:",event.nativeEvent.layout);
    }
    collisionItems = (touch)=> {//..
        for (var i = 0; i < this.props.dialogData.length; i++) {
            var colLayout = {
                x: this.listItemLayout[i].x + this.scrollLayout.x + parents.myLayout.x,
                y: this.listItemLayout[i].y + this.scrollLayout.y + parents.myLayout.y,
                w: this.listItemLayout[i].width,
                h: this.listItemLayout[i].height,
            };
            if (this.arrayList[i].blnTouchItem(touch, colLayout)) {
                break;
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState != this.state) return true;
        else return false;
    }
    render() {
        if (!this.state.blnDraw) {
            var rotateZ = this.state.rotate.interpolate({
                inputRange: [0,8,16],
                outputRange: ['0deg','180deg','360deg']
            });
            return (
                <View style={styles.container}>
                    {/*<Animated.Image
                        style={[styles.loadImg, {transform:[{rotateZ}]}]}
                        source={ImageRes.loading} />
                    <Text style={styles.font}>
                        加载中...
                    </Text>*/}
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <ListView
                  initialListSize={1}
                  pageSize={1}
                  onLayout={(event)=>{this.scrollLayout = event.nativeEvent.layout;}}
                  ref={'ScrollView'}
                  style={{flex: 1,}}
                  dataSource={this.state.listDataSource}
                  renderRow={this.renderListFrame.bind(this)} />
                
                {/*<ScrollView
                    onLayout={(event)=>{this.scrollLayout = event.nativeEvent.layout;}}
                    ref={'ScrollView'}
                    showsVerticalScrollIndicator={false}>
                    {this.renderList(this.state.select)}
                </ScrollView>*/}
            </View>
        );
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.select != this.state.select) {
            this.arrayList[this.state.select]._onHiddenItem();//通知ListItem被关闭了
            this.arrayList[nextState.select]._onSelectItem();//通知ListItem被选中,改变它的itemStatus值
        }
    }

    componentDidUpdate(prevProps, prevState) {
        this.moveScrollView();
        if(prevState.speedKind != this.state.speedKind){
            console.log("Run this onPlay");
            this.onPlay();
        }
    }

    // 显示列表（listView方式）
    renderListFrame(course, sectionID, rowID) {
        // console.log('renderListFrame!');
        var i = rowID;
        var dialogInfo = {
            lesson: this.props.lessonID,
            course: this.props.courseID,
            dIndex: i,
            gategory: course.Category
        };
        return (
            <TouchableOpacity
                onLayout={this._onLayoutItem.bind(this,i)}
                disabled={this.blnAutoplay}
                onPress={this.touchView.bind(this,i)}
                activeOpacity={1}
                key={i}>
                
                <ListItem itemWordCN={course.cn}
                          itemWordEN={course.en}
                          audio={course.mp3}
                          itemShowType={this.state.showKind}
                          itemScore={0}
                          itemCoins={course.gold}
                          ref={(ref)=>{this.arrayList.push(ref)}}
                          user={i%2}
                          dialogInfo={dialogInfo}
                          itemIndex={Number(i)}
                          partents={this}
                          />
            </TouchableOpacity>
        );
    }

    // 列表中选中处理
    touchView(_id,blnTouch=true) {
        if(blnTouch){
            if(this.blnAutoplay)return;
        }

        if (_id != this.state.select) {
            this.setState({
                select: _id
            });
        }
    }

    onPlay() {
        this.arrayList[this.state.select]._onAutoplay();
    }

    onPause() {
        this.arrayList[this.state.select]._onStopAutoplay();
    }

    // 自动播放下一条
    playNext() {
        if (this.blnAutoplay) {
            var index = (this.state.select + 1) % this.props.dialogData.length;

            // 是否循环播放处理
            if (index == 0) {
                if (this.blnLoop == 0) {
                    this.onPause();
                    this.props.parents.changePause();
                    return;
                }
            }
            // 单次播放的 跳出
            this.touchView(index,false);
        }
    }

    // 控制列表移动（主要是自动播放时，根据当前选中项，判断列表是否移动）
    moveScrollView() {
        if (this.scrollLayout == null) return;
        var layout = this.listItemLayout[this.state.select];
        if (layout.y == 0) {
            this.refs.ScrollView.scrollTo({
                y: 0
            });
        }
        if (layout.y + layout.height > this.scrollLayout.height) {
            var _move = layout.y + layout.height - this.scrollLayout.height;
            this.refs.ScrollView.scrollTo({
                y: _move
            });
        }
    }

    // 添加金币
    getGold(num) {
        this.props.getGold(num);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E9E9E9',
        alignItems: 'center',
    },
    loadImg: {
        width: minUnit*10,
        height: minUnit*10,
        marginVertical: minUnit*2,
    },
    font: {
        fontSize: minUnit*5,
    }
});


export default ViewList;