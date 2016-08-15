'use strict';
import React, {Component, PropTypes} from 'react'
import {View, Image, Text, TouchableOpacity, StyleSheet, ListView, InteractionManager, AlertIOS} from 'react-native'
import {
    MinWidth,
    minUnit,
    ScreenWidth,
    ScreenHeight,
} from '../Styles';

import {
    ImageRes,
} from '../Resources';

import {
    Consts,
    Scenes,
    getAudioFilePath,
} from '../Constant';

var fontSize = parseInt(minUnit * 4);
import Setting from '../Practice/C_Setting'
import ListItem from '../Practice/C_ListItem'
export default class NewPractice extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.listData = this.getListData();
        //logf("listData :", this.listData);
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                //console.log("rowHasChanged:", (r1 !== r2));
                return (r1 !== r2)
            }
        });

        this.state = {
            blnSetting: false,
            blnAutoplay: false,
            autoplayType: 0,
            dataSource: ds.cloneWithRows(this.listData),
        };
        this.showType = 2;
        this.playerRate = 1;
        this.selectIndex = -1;
        this.listItemRefs = [];//ListView所有组件的引用
        this.listLayout = {y: 0, x: 0, width: 0, height: 0};
        this.listViewHeight = 0;//ListView的内容的高度
        global.practiceInAutoplay = false;
        this.blnOnScroll = true;
        this.useTime = new Date();
        logf("打印时间:",this.useTime.getTime())
    }

    static propTypes = {
        dialogData: PropTypes.array
    };
    static defaultProps = {};

    getListData() {
        var practiceSave = app.getPracticeSave(app.temp.lesson.key, app.temp.courseID);
        //logf("practiceSave:", practiceSave.contents);
        const {dialogData} = this.props;
        var arrData = [];
        for (var i = 0; i < dialogData.length; i++) {
            arrData[i] = {
                blnSelect: false,
                dialogData: dialogData[i],
                showType: 2,
                p_Score: practiceSave.contents[i].p_score,
                p_SyllableScore: practiceSave.contents[i].p_SyllableScore,
                blnHaveRecord: practiceSave.contents[i].p_SyllableScore.length != 0,
            }
        }
        return arrData;
    }

    addListRefs = (rowID, ref)=> {
        //..console.log("addListRefs:",rowID,ref);
        if (this.listItemRefs.length == this.listData.length) {
            return;
        }
        this.listItemRefs[rowID] = ref;
    }

    _onPressBackPage = ()=> {
        //..停止List中的各项状态
        app.PopPage();
    }

    _onPressAutoPlay = ()=> {
        if (this.state.blnAutoplay) {
            this.listItemRefs[this.selectIndex]._onStopAutoplay();
        } else {
            this.listItemRefs[this.selectIndex]._onStopAllWork();
            this.listItemRefs[this.selectIndex]._onAutoplay();
            this.onScrollListView();
        }

        practiceInAutoplay = !practiceInAutoplay;
        this.setState({
            blnAutoplay: !(this.state.blnAutoplay),
            dataSource: this.state.dataSource.cloneWithRows(this.listData)
        })
    }

    _onPressStartExam = ()=> {
        if (this.selectIndex != -1) {
            var newData = this.listData.slice();
            newData[this.selectIndex] = {
                blnSelect: false,
                dialogData: this.listData[this.selectIndex].dialogData,
                showType: this.listData[this.selectIndex].showType,
                p_Score: this.listData[this.selectIndex].p_Score,
                p_SyllableScore: this.listData[this.selectIndex].p_SyllableScore,
                blnHaveRecord: this.listData[this.selectIndex].blnHaveRecord,
            }
            this.listData = newData;
            this.selectIndex = -1;
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(newData)
            })
        }

        app.GotoPage(Consts.NAVI_PUSH, Scenes.EXAM,
            {
                dialogData: this.props.dialogData,
            });
    }

    _onPressSetting = ()=> {
        //..this.listItemRefs[this.selectIndex]._onStopAllWork()
        this.setState({
            blnSetting: !(this.state.blnSetting),
            dataSource: this.state.dataSource.cloneWithRows(this.listData)
        })
    }

    _onPressAutoPlayType = (type)=> {
        this.setState({
            autoplayType: (type + 1) % 2,
            dataSource: this.state.dataSource.cloneWithRows(this.listData)
        })
    }

    componentDidMount() {
        var tempTime = new Date();
        console.log("Page Practice Did Mount:",tempTime.getTime()-this.useTime.getTime())

        InteractionManager.runAfterInteractions(
            ()=> {
                this.pressItem(0);
            }
        )
    }

    pressItem(rowId) {
        if (rowId != this.selectIndex) {
            var newData = this.listData.slice();
            //newData[rowId].blnSelect = true;
            newData[rowId] = {
                blnSelect: true,
                dialogData: this.listData[rowId].dialogData,
                showType: this.listData[rowId].showType,
                p_Score: this.listData[rowId].p_Score,
                p_SyllableScore: this.listData[rowId].p_SyllableScore,
                blnHaveRecord: this.listData[rowId].blnHaveRecord,
            }
            if (this.selectIndex != -1) {
                newData[this.selectIndex] = {
                    blnSelect: false,
                    dialogData: this.listData[this.selectIndex].dialogData,
                    showType: this.listData[this.selectIndex].showType,
                    p_Score: this.listData[this.selectIndex].p_Score,
                    p_SyllableScore: this.listData[this.selectIndex].p_SyllableScore,
                    blnHaveRecord: this.listData[this.selectIndex].blnHaveRecord
                }
            }
            this.listData = newData;
            this.selectIndex = rowId;
            this.onScrollListView();
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(newData)
            })
        }
    }


    setItemScore = (index, score, syllableScore)=> {
        logf("setItemScore:",syllableScore);
        var newData = this.listData.slice();
        newData[index] = {
            blnSelect: true,
            dialogData: this.listData[index].dialogData,
            showType: this.listData[index].showType,
            p_Score: score,
            p_SyllableScore: syllableScore,
            blnHaveRecord: true
        }
        this.listData = newData;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newData)
        })
    }

    itemCallback = (index, msg, ...other)=> {
        logf("是否运行到这个里面了0:", msg)
        if (msg == "select") {
            this.pressItem(index);
        } else if (msg == "playover") {
            if (this.state.blnAutoplay) {
                this.autoplayNext();
            }
        } else if (msg == "PingCe") {
            logf("是否运行到这个里面了1", other[0], other[1])
            this.setItemScore(index, other[0], other[1]);
        }
    }

    autoplayNext = ()=> {
        if (this.selectIndex == this.listData.length - 1) {//自动播放到最后一条
            if (this.state.autoplayType == 0) {//播放一次
                practiceInAutoplay = false;
                this.setState({
                    blnAutoplay: false,
                })
            } else {//循环滚动播放
                this.pressItem(0);
            }
        } else {
            this.pressItem(this.selectIndex + 1);
        }
    }

    renderTop = ()=> {
        return (
            <View style={styles.top}>
                <TouchableOpacity onPress={this._onPressBackPage.bind(this)}>
                    <Image style={styles.backImg} source={ImageRes.ic_back}/>
                </TouchableOpacity>
                <Text style={styles.title}>修炼</Text>
                <View style={styles.backImg}></View>{/*左边这个纯粹用来对齐,无其他功能*/}
            </View>
        );
    }

    renderBottom = ()=> {
        return (
            <View style={styles.bottom}>
                <TouchableOpacity style={styles.bottomLeft} onPress={this._onPressAutoPlay.bind(this)}>
                    <Image style={styles.btnAutoPlay} source={this.state.blnAutoplay?ImageRes.pause:ImageRes.play}/>
                </TouchableOpacity>

                {!this.state.blnAutoplay &&
                <TouchableOpacity style={styles.bottomCenter} onPress={this._onPressStartExam.bind(this)}>
                    <Text style={styles.btnText}>开始闯关</Text>
                </TouchableOpacity>
                }
                {this.renderBottomRight()}
            </View>
        );
    }

    renderBottomRight = ()=> {
        if (this.state.blnAutoplay) {
            if (this.state.autoplayType == 0) {//播放一次
                return (
                    <TouchableOpacity style={[styles.bottomRight,{backgroundColor:"#fff"}]}
                                      onPress={this._onPressAutoPlayType.bind(this,0)}>
                        <Text style={[styles.btnAutoPlayType,{color:"#7B7B7B"}]}>播放一次</Text>
                    </TouchableOpacity>
                )
            } else if (this.state.autoplayType == 1) {//循环播放
                return (
                    <TouchableOpacity style={[styles.bottomRight,{backgroundColor:"#949494"}]}
                                      onPress={this._onPressAutoPlayType.bind(this,1)}>
                        <Text style={[styles.btnAutoPlayType,{color:"#FAFAFA"}]}>循环播放</Text>
                    </TouchableOpacity>
                )
            }
        } else {
            return (
                <TouchableOpacity onPress={this._onPressSetting.bind(this)}>
                    <Image style={styles.btnSetting} source={ImageRes.more}/>
                </TouchableOpacity>
            );
        }
    }

    renderListView = ()=> {
        var initialListSize = this.getInitListSize();//最后写个算法,计算出来先临时顶一下
        logf("此课程初始化列表数:",initialListSize);

        return (
            <ListView ref="listView" key={this.listData} style={styles.listView} scrollEnabled={!this.state.blnAutoplay}
                      dataSource={this.state.dataSource}
                      renderRow={this.renderRow.bind(this)}
                      initialListSize={initialListSize}
                      pageSize={1} //每次新增渲染多少条
                      scrollRenderAheadDistance={ScreenHeight/4} //离屏幕底部多少距离时渲染
                      onScroll= {this._onScroll.bind(this)}
                      scrollEventThrottle={100} //对onScroll回调频率的控制(仅限IOS)
                      onContentSizeChange={this._onContentSizeChange.bind(this)}
            />
        );
    }

    onScrollListView = ()=>{
        if(!this.blnOnScroll ){
            logf("成功啦我不是一个人")
            return;//如果并没有移动过列表,就不需要再调用这个了
        }
       
        var topH = fontSize*4;//顶部TabBar的高度
        var bottomH = fontSize*4;//底部TabBar的高度
        var changeHight = fontSize*7//选中时高度的变化值(由于无法及时补货到子对象的高度变化)
        var itemLayout = this.listItemRefs[this.selectIndex].getLayout();//获取被选中的item相对于ListView的位置值
        //console.log("itemLayout 高度:",this.selectIndex,itemLayout.height,itemLayout.y)

        var targetY = (ScreenHeight)/2 - (itemLayout.height + changeHight)/2 + topH - bottomH ;//设定目标item要对齐的屏幕位置         
        var listViewY = this.listLayout.y + topH; //此时listView 相对屏幕的Y位置        
        var itemY = listViewY + itemLayout.y ; //被选中的item在屏幕中的位置
        
        var itemOffY = targetY - itemY//计算出item与屏幕中心的差距
        if(targetY > itemY){
            itemOffY -= changeHight/2;
        }else{
            itemOffY += changeHight/2;
        }        
        var nextListY = this.listLayout.y + itemOffY; //通过当前位置与差距,计算出下一个位置
        nextListY = Math.min(0,nextListY);
        var maxListY = -(Math.max(this.listViewHeight,(ScreenHeight - topH - bottomH))  - (ScreenHeight - bottomH) + topH);
        
        nextListY = Math.max(maxListY,nextListY);//处理上下极端值
 
        this.refs.listView.scrollTo({
            x:this.listLayout.x,
            y:-nextListY, //注意,这里传递的是相对位置的取反
            animated:true,
        });
    }

    _onScroll=(event)=>{
        //console.log("_onScroll Offset:",event.nativeEvent.contentOffset);
        //console.log("_onScroll Offset:",event.nativeEvent.contentSize);
        this.listLayout.x = event.nativeEvent.contentOffset.x;
        this.listLayout.y = -event.nativeEvent.contentOffset.y;
        this.listLayout.width = event.nativeEvent.contentSize.width;
        this.listLayout.height = event.nativeEvent.contentSize.height;

        this.blnOnScroll = true;
    }

    _onContentSizeChange =(width,height)=>{
        console.log("_onContentSizeChange",width,height);
        this.listViewHeight = height;
    }

    getInitListSize = ()=>{
        var height = 0;
        var lineShowWord = 12;
        if(ScreenWidth/ScreenHeight > 0.6){
            lineShowWord = 16;
        }
        var size = 0;
        for(var i=0;i<this.listData.length;i++){
            var words = this.listData[i].dialogData.cn.words;
            words = words.replace(/_/g, "");
            var showLine = Math.ceil(words.length/lineShowWord)
            height += (showLine * fontSize*15);
            size++;
            if(height > ScreenHeight*1.5){
                break;
            }
        }
        return size;
    }

    renderRow = (rowData, sectionID, rowID, highlightRow)=> {
        var index = Number(rowID);
        const {dialogData, blnSelect, showType, p_Score, p_SyllableScore, blnHaveRecord} =rowData;
        return (
            <ListItem
                ref={this.addListRefs.bind(this,index)}
                itemIndex={index}
                itemShowType={showType}
                itemScore={p_Score}
                dialogInfo={dialogData}
                getRate={()=>this.playerRate}
                blnSelect={blnSelect}
                syllableScore={p_SyllableScore}
                itemCallback={this.itemCallback.bind(this)}
                blnHaveRecord={blnHaveRecord}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderTop()}
                {this.renderListView()}
                {this.renderBottom()}
                {this.state.blnSetting &&
                <Setting showType={this.showType} playerRate={this.playerRate} setCallback={this.changeSet.bind(this)}/>
                }
            </View>
        );
    }

    changeSet = (showType, rate)=> {
        if (showType != this.showType) {
            this.showType = showType;
            this.changeShowType(this.showType)
        }
        if (rate != this.playerRate) {
            this.playerRate = rate;
            this.listItemRefs[this.selectIndex]._onStopAllWork();
            this.listItemRefs[this.selectIndex]._onAutoplay();
        }
        if (this.state.blnSetting) {//理论上不会存在此时 blnSetting是false的情况,除非在0.5秒钟 用户点击了设置按钮
            this.setState({
                blnSetting: false,
            })
        }

    }
    changeShowType = (type)=> {
        var newData = this.listData.slice();
        for (var i = 0; i < newData.length; i++) {
            newData[i] = {
                blnSelect: this.listData[i].blnSelect,
                dialogData: this.listData[i].dialogData,
                showType: type,
                p_Score: this.listData[i].p_Score,
                p_SyllableScore: this.listData[i].p_SyllableScore,
                blnHaveRecord: this.listData[i].blnHaveRecord
            }
        }
        this.listData = newData;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newData)
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: ScreenWidth,
        height: fontSize * 3,
        borderBottomColor: '#C4C4C4',
        borderBottomWidth: MinWidth,
        marginTop: fontSize*1,
        paddingHorizontal: fontSize / 2,
        //backgroundColor:'#ffff0011'
    },
    title: {
        fontSize: fontSize,
        color: '#7D7D7D',
        textAlign: 'center',
    },
    backImg: {
        width: fontSize * 2.3,
        height: fontSize * 2.3,
    },
    listView:{
        flex:1,
    },
    bottom: {
        flexDirection: 'row',
        width: ScreenWidth,
        height: fontSize * 4,
        //position: 'absolute',
        //left: 0,
        //top: ScreenHeight - fontSize * 4,
        borderTopWidth: MinWidth,
        borderTopColor: '#C4C4C4',
        justifyContent: 'space-between',
        alignItems: 'center',
        //backgroundColor: '#ffffff',
        paddingHorizontal: fontSize / 2,
    },
    btnAutoPlay: {
        width: fontSize * 3.2,
        height: fontSize * 3.2,
    },
    bottomCenter: {
        width: fontSize * 9,
        height: fontSize * 3,
        borderRadius: fontSize * 2,
        backgroundColor: "#4ACE35",
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontSize: fontSize * 1.5,
        color: '#fff',
        textAlign: 'center',
    },
    btnSetting: {
        width: fontSize * 2,
        height: fontSize * 2,
    },
    btnAutoPlayType: {
        fontSize: fontSize,
        textAlign: 'center',
    },
    bottomRight: {
        width: fontSize * 7,
        height: fontSize * 2,
        borderRadius: fontSize * 2,
        borderWidth: MinWidth,
        borderColor: "#949494",
        justifyContent: 'center',
        alignItems: 'center',
    },

})