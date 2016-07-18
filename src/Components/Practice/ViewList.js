'use strict';

import React, {
    Component
} from 'react';

import {
    StyleSheet,
    View,
    ScrollView,
    ListView,
    TouchableOpacity
} from 'react-native';

import {
    UtilStyles,
    ScreenWidth,
    ScreenHeight,
    minUnit,
    MinWidth
} from '../../Styles';

import ListItem from '../C_ListItem';

class ViewList extends Component {
    scrollLayout = null;
    listItemLayout = null;

    constructor(props) {
        super(props);

        this.state = {
            select: 0,
            listDataSource: new ListView.DataSource({
                rowHasChanged: (oldRow, newRow)=> {
                    oldRow !== newRow
                }
            }),
        };
        this.listItemLayout = [this.props.dialogData.length];
    }

    componentWillMount() {
        this.setState({
            listDataSource: this.state.listDataSource.cloneWithRows(this.props.dialogData),
        });
        console.log('cn: ' + this.props.dialogData[0].cn);
        console.log('listDataSource: ' + this.state.listDataSource);
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
            if (this.refs[i].blnTouchItem(touch, colLayout)) {
                break;
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    onLayout={(event)=>{this.scrollLayout = event.nativeEvent.layout;}}
                    ref={'ScrollView'}
                    showsVerticalScrollIndicator={false}>
                    {this.renderList(this.state.select)}
                </ScrollView>

            </View>
        );
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.select != this.state.select) {
            this.refs[this.state.select]._onHiddenItem();//通知ListItem被关闭了
            this.refs[nextState.select]._onSelectItem();//通知ListItem被选中,改变它的itemStatus值
        }
    }

    componentDidUpdate(prevProps, prevState) {
        this.moveScrollView();
    }

    // 显示列表（listView方式）
    renderListFrame(course, sectionID, rowID) {
        var i = rowID;
        var dialogInfo = {
            lesson: this.props.lessonID,
            course: this.props.courseID,
            dIndex: i,
            gategory: course.Category
        };
        var name = 'listItem' + rowID;
        return (
            <TouchableOpacity
                onLayout={this._onLayoutItem.bind(this,i)}
                disabled={this.props.blnAutoplay}
                onPress={this.touchView.bind(this,i)}
                activeOpacity={1}
                key={i}>
                <ListItem itemWordCN={course.cn}
                          itemWordEN={course.en}
                          audio={course.mp3}
                          itemShowType={this.props.showKind}
                          itemBlnSelect={i==this.state.select?true:false}
                          itemScore={0}
                          itemCoins={course.gold}
                          ref={name}
                          playNext={this.playNext.bind(this)}
                          blnInAutoplay={this.props.blnAutoplay}
                          user={i%2}
                          dialogInfo={dialogInfo}/>

            </TouchableOpacity>
        );
    }

    // 显示列表
    renderList(select) {
        var array = [];
        for (var i = 0; i < this.props.dialogData.length; i++) {
            var dialogInfo = {
                lesson: this.props.lessonID,
                course: this.props.courseID,
                dIndex: i,
                gategory: this.props.dialogData[i].Category
            }
            array.push(
                <TouchableOpacity
                    onLayout={this._onLayoutItem.bind(this,i)}
                    disabled={this.props.blnAutoplay}
                    onPress={this.touchView.bind(this,i)}
                    activeOpacity={1}
                    overflow={'hidden'}
                    key={i}>
                    <ListItem itemWordCN={this.props.dialogData[i].cn}
                              itemWordEN={this.props.dialogData[i].en}
                              audio={this.props.dialogData[i].mp3}
                              itemShowType={this.props.showKind}
                              itemBlnSelect={i==select?true:false}
                              itemScore={0}
                              itemCoins={this.props.dialogData[i].gold}
                              ref={i}
                              playNext={this.playNext.bind(this)}
                              blnInAutoplay={this.props.blnAutoplay}
                              user={i%2}
                              dialogInfo={dialogInfo}
                              itemIndex={i}
                    />

                </TouchableOpacity>
            );
        }
        return array;
    }

    // 列表中选中处理
    touchView(_id) {
        if (_id != this.state.select) {
            this.setState({
                select: _id
            });
        }
    }

    onPlay() {
        this.refs[this.state.select]._onAutoplay();
    }

    onPause() {
        this.refs[this.state.select]._onStopAutoplay();
    }

    // 自动播放下一条
    playNext() {
        if (this.props.blnAutoplay) {
            var index = (this.state.select + 1) % this.props.dialogData.length;
            // 单次播放的 跳出
            this.touchView(index);
        }
    }

    // 控制列表移动（主要是自动播放时，根据当前选中项，判断列表是否移动）
    moveScrollView() {
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
        backgroundColor: '#E9E9E9'
    }
});


export default ViewList;