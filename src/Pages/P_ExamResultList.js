/**
 * Created by tangweishu on 16/7/29.
 */
import React, {Component, PropTypes} from 'react'
import {View, Text, Image, ListView, StyleSheet, TouchableOpacity, NativeModules, ProgressViewIOS} from 'react-native'

import {
    getExamFilePath,
    getMp3FilePath,
    Consts,
    Scenes,
} from '../Constant';
import {
    ImageRes,
} from '../Resources';
import {
    minUnit,
    ScreenWidth,
    ScreenHeight,
    MinWidth,
} from '../Styles';
import ResultItem from '../Exam/C_ResultItem'
import ScoreCircle from '../Common/ScoreCircle'

var fontSize = parseInt(minUnit * 4);

export default class ExamResultList extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态         
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {logf("rowHasChange:",(r1 !== r2));return( r1 !== r2)}
        });
        this.listData = this.getListData();
        
        this.state = {
            dataSource: ds.cloneWithRows(this.listData),
            blnAutoplay: false,
        };
        this.selectIndex = -1;
        this.arrListRefs = [];
        this.myLayout = {};
        this.time = new Date();
        this.listLayout = {y: 0, x: 0, width: 0, height: 0};
        this.listViewHeight = 0;//ListView的内容的高度
    }

    static propTypes = {
        dialogData: PropTypes.array,
        arrSyllableScore: PropTypes.array,
        arrSentenceScore: PropTypes.array,
        Score: PropTypes.number,
    }
    static defaultProps = {}

    getListData() {        
        const {dialogData,arrSentenceScore,arrSyllableScore} = this.props;
        var arrData = [];
        for (var i = 0; i < dialogData.length; i++) {
            arrData[i] = {
                blnPlay: false,
                dialogData: dialogData[i],
                sentenceScore:arrSentenceScore[i],
                syllableScore: arrSyllableScore[i],                
            }
        }
        return arrData;
    }    
    
    _onBackBtn = ()=>{
        // if(this.selectIndex >=0){
        //     this.arrListRefs[this.selectIndex].stopAudio();
        // }
        app.PopPage(Consts.POP_ROUTE, Scenes.MENU);
    }

    _onPressBtn = ()=> {
        var newData = this.listData.slice();
        var blnAutoplay = this.state.blnAutoplay;
        if (blnAutoplay) {            
            this.itemStopPlay(newData,this.selectIndex)
            blnAutoplay = false;
        } else {
            if (this.selectIndex != -1) {                
                this.itemStartPlay(newData,this.selectIndex);
            }else{
                this.itemStartPlay(newData,0);
                this.selectIndex = 0;
            }
            blnAutoplay = true;
        }
        this.listData = newData;
        this.setState({
            blnAutoplay:blnAutoplay,
            dataSource: this.state.dataSource.cloneWithRows(newData)
        })
    }

    nextGate = ()=>{
        // if(this.selectIndex >=0){
        //     this.arrListRefs[this.selectIndex].stopAudio();
        // }
        if (app.temp.courseID + 1 < app.temp.lesson.practices.length) {
            app.menu.setMoveTo(app.temp.courseID+1);
        }
        app.PopPage(Consts.POP_ROUTE, Scenes.MENU);
    }

    itemCallback = (msg, index)=> {
        logf("itemCallBack",index,msg,this.selectIndex);
        var blnAutoplay = this.state.blnAutoplay;
        if(blnAutoplay){
            if(msg == "play" || msg == "stop"){//处理自动播放时,点击item无响应
                return;
            }
        }
        var newData = this.listData.slice();

        if(msg == "play"){
            if(this.selectIndex != index && this.selectIndex != -1){
                this.itemStopPlay(newData,this.selectIndex);
            }
            this.selectIndex = index;
            this.onScrollListView();
            this.itemStartPlay(newData,index);
        }else if(msg == "stop"){
            if(index != this.selectIndex){
                logf("ERROR:播放录音异常,关闭了一个并没有播放的item",index);
            }
            this.itemStopPlay(newData,this.selectIndex);
        }else if(msg == "over"){
            if(index != this.selectIndex){
                logf("ERROR:播放录音异常,通知一个并没有播放的item已经播放完毕",index);
            }
            this.itemStopPlay(newData,this.selectIndex);
            if(blnAutoplay){
                if(this.selectIndex < this.listData.length-1){
                    this.itemStartPlay(newData,this.selectIndex + 1);
                    this.selectIndex += 1
                    this.onScrollListView();
                }else{
                    blnAutoPlay = false
                }
            }
        }

        this.listData = newData;
        this.setState({
            blnAutoplay:blnAutoplay,
            dataSource: this.state.dataSource.cloneWithRows(newData)
        })
    }

    itemStartPlay = (data,index)=>{
        data[index] = {
            blnPlay: true,
            dialogData: data[index].dialogData,
            sentenceScore:data[index].sentenceScore,
            syllableScore: data[index].syllableScore,
        }
    }

    itemStopPlay = (data,index)=>{
        data[index] = {
            blnPlay: false,
            dialogData: data[index].dialogData,
            sentenceScore:data[index].sentenceScore,
            syllableScore: data[index].syllableScore,
        }
    }

    restartGate = ()=>{
        // if(this.selectIndex >=0){
        //     this.arrListRefs[this.selectIndex].stopAudio();
        // }
        app.exam.ResetComponent();
        app.PopPage(Consts.POP_ROUTE, Scenes.EXAM);
    }

    renderTopBar = ()=> {
        var title = this.props.Score>=60?"闯关成功":"闯关失败";
        //logf("title:",title,this.props.Score);
        return (
            <View style={styles.topBar}>
                <TouchableOpacity onPress={this._onBackBtn}>
                    <Image style={styles.backImg} source={ImageRes.ic_back}/>
                </TouchableOpacity>
                <Text style={styles.textTitle}>{title}</Text>
                <ScoreCircle score={this.props.Score}/>
            </View>
        );
    }
    
    renderBottomBar = ()=> {
        return (
            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={this._onPressBtn.bind(this)}>
                     <Image style={styles.playImg} source={this.state.blnAutoplay?ImageRes.btn_pause:ImageRes.btn_playing}/>
                </TouchableOpacity>
                {this.props.Score>=60 &&<TouchableOpacity style={styles.btn} onPress={this.nextGate.bind(this)}>
                    <Text style={styles.btnText}>下一关</Text>
                </TouchableOpacity>}

                <TouchableOpacity style={styles.btn} onPress={this.restartGate.bind(this)}>
                    <Text style={styles.btnText}>重来</Text>
                </TouchableOpacity>
            </View>
        );
    }

    addListRefs = (rowID, ref)=> {       
        if (this.arrListRefs.length == this.listData.length) {
            return;
        }
        this.arrListRefs[rowID] = ref;
    }

    getInitListSize = ()=>{
        var height = 0;
        var lineShowWord = 11;
        if(ScreenWidth/ScreenHeight > 0.6){
            lineShowWord = 14;
        }
        var size = 0;
        for(var i=0;i<this.listData.length;i++){
            var words = this.listData[i].dialogData.cn.words;
            words = words.replace(/_/g, "");
            var showLine = Math.ceil(words.length/lineShowWord)
            height += (showLine * fontSize*5);
            size++;
            if(height > ScreenHeight*1.5){
                break;
            }
        }
        return size;
    }

    _onScroll=(event)=>{
        //logf("_onScroll Offset:",event.nativeEvent.contentOffset);
        //logf("_onScroll Offset:",event.nativeEvent.contentSize);
        this.listLayout.x = event.nativeEvent.contentOffset.x;
        this.listLayout.y = -event.nativeEvent.contentOffset.y;
        this.listLayout.width = event.nativeEvent.contentSize.width;
        this.listLayout.height = event.nativeEvent.contentSize.height;
    }

    _onContentSizeChange =(width,height)=>{
        logf("_onContentSizeChange",width,height);
        this.listViewHeight = height;
    }

    onScrollListView = ()=>{
        var topH = fontSize*5;//顶部TabBar的高度
        var bottomH = fontSize*4;//底部TabBar的高度
        var changeHight = 0//选中时高度的变化值(由于无法及时捕获到子对象的高度变化)
        var itemLayout = this.arrListRefs[this.selectIndex].getLayout();//获取被选中的item相对于ListView的位置值

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
        var maxListY = -(Math.max(this.listViewHeight,(ScreenHeight - topH - bottomH)) +changeHight/2 - (ScreenHeight - bottomH)+topH);
        nextListY = Math.max(maxListY,nextListY);//处理上下极端值
        this.refs.list.scrollTo({
            x:this.listLayout.x,
            y:-nextListY, //注意,这里传递的是相对位置的取反
            animated:true,
        });
    }

    /*onScrollListView = ()=>{
        logf("ScreenH:",ScreenHeight,"fontSize:",fontSize);
        var topH = fontSize*5;//顶部TabBar的高度
        var bottomH = fontSize*4;//底部TabBar的高度
        var changeHight = 0//选中时高度的变化值(由于无法及时捕获到子对象的高度变化)
        var itemLayout = this.arrListRefs[this.selectIndex].getLayout();//获取被选中的item相对于ListView的位置值
        logf("itemLayout 高度:",this.selectIndex,itemLayout.height,itemLayout.y)

        var targetY = (ScreenHeight)/2 - (itemLayout.height + changeHight)/2 + topH - bottomH ;//设定目标item要对齐的屏幕位置
        logf("目标位置的Y坐标:",targetY);
        logf("此时listView Y的偏移:",this.listLayout.y);
        var listViewY = this.listLayout.y + topH; //此时listView 相对屏幕的Y位置
        logf("listView相对屏幕的位置:",listViewY);
        var itemY = listViewY + itemLayout.y ; //被选中的item在屏幕中的位置
        logf("被选中的item在屏幕中位置:",itemY);
        var itemOffY = targetY - itemY//计算出item与屏幕中心的差距
        if(targetY > itemY){
            itemOffY -= changeHight/2;
        }else{
            itemOffY += changeHight/2;
        }

        logf("被选中Item 与目标位置差距:",itemOffY);
        var nextListY = this.listLayout.y + itemOffY; //通过当前位置与差距,计算出下一个位置
        logf("计算出的nextListY:",nextListY);

        nextListY = Math.min(0,nextListY);
        var maxListY = -(Math.max(this.listViewHeight,(ScreenHeight - topH - bottomH)) +changeHight/2 - (ScreenHeight - bottomH)+topH);
        logf("maxNextListY:",maxListY);
        nextListY = Math.max(maxListY,nextListY);//处理上下极端值
        logf("极值运算后的nextListY:",nextListY);
        this.refs.list.scrollTo({
            x:this.listLayout.x,
            y:-nextListY, //注意,这里传递的是相对位置的取反
            animated:true,
        });
    }*/ //带log的代码
    
    renderItem = (rowData, sectionID, rowID, highlightRow)=> {
        var index = Number(rowID);
        var refName = "item" + rowID;
        return (<ResultItem ref={this.addListRefs.bind(this,index)} itemIndex={index}
                            blnPlay={rowData.blnPlay}
                            itemWords={rowData.dialogData.cn.words} itemPinyins={rowData.dialogData.cn.pinyins}
                            itemEN={rowData.dialogData.en}
                            arrSyllableScore={rowData.syllableScore}
                            sentenceScore={rowData.sentenceScore}
                            itemCallback={this.itemCallback.bind(this)}                            
                            recordName={getExamFilePath(app.temp.lesson.key, app.temp.courseID, index)}
        />);
    }    

    render() {
        var initialListSize = this.getInitListSize();//最后写个算法,计算出来先临时顶一下
        logf("闯关结果初始化列表数:",initialListSize);
        return (
            <View style={styles.container}>
                {this.renderTopBar()}
                <ListView
                    ref="list" style={{flex:1}}
                    initialListSize={initialListSize}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderItem.bind(this)}
                    pageSize={1}
                    //removeClippedSubviews={true}

                    scrollRenderAheadDistance={ScreenHeight/2} //离屏幕底部多少距离时渲染
                    onScroll= {this._onScroll.bind(this)}
                    scrollEventThrottle={100} //对onScroll回调频率的控制(仅限IOS)
                    onContentSizeChange={this._onContentSizeChange.bind(this)}
                />
                {this.renderBottomBar()}
            </View>
        );
    }

    componentDidMount() {
        console.log("--P_ExamResultList Did Mount:--", this.time - new Date());
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    topBar: {
        flexDirection: 'row',
        width: ScreenWidth,
        height: fontSize * 4,
        //backgroundColor: '#ffff0022',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: fontSize,
        paddingHorizontal: fontSize,
        borderBottomWidth: MinWidth,
        borderBottomColor: '#CBCBCB',
    },
    backImg: {
        width: minUnit * 9,
        height: minUnit * 9,
        //backgroundColor:'#ff0000'
    },
    textTitle: {
        textAlign: 'center',
        color: '#787878',
        fontSize: fontSize * 1.25,
    },
    bottomBar: {
        //position: 'absolute',
        flexDirection: 'row',
        width: ScreenWidth,
        height: fontSize * 4,
        //left: 0,
        //top: ScreenHeight - fontSize * 4,
        backgroundColor: '#ffffff',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: MinWidth,
        borderTopColor: '#CBCBCB',
        paddingHorizontal: fontSize,
    },
    playImg: {
        width: minUnit * 9,
        height: minUnit * 9,
        marginRight: minUnit,
    },
    btn:{
        height:minUnit*9,
        paddingHorizontal:minUnit*2,
        paddingVertical:minUnit,
        borderWidth:2*MinWidth,
        borderColor:'#49CD36',
        borderRadius:minUnit*4,
        alignItems:'center',
        justifyContent:'center',

    },
    btnText:{
        fontSize:fontSize*1.25,
        color:'#49CD36',
        backgroundColor:'transparent'
    },
})