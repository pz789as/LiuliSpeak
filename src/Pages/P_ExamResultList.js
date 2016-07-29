/**
 * Created by tangweishu on 16/7/29.
 */
import React, {Component, PropTypes} from 'react'
import {View, Text, Image, ListView, StyleSheet, TouchableOpacity} from 'react-native'

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
import Sentence from '../ListItem/C_NewSentence';
import ScoreCircle from '../Common/ScoreCircle'

fontSize = minUnit * 4;

export default class ExamResultList extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态         
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(this.props.dialogData),
        };
        this.time = new Date();
    }

    static propTypes = {
        dialogData: PropTypes.object,
        arrSyllableScore: PropTypes.array,
        arrSentenceScore: PropTypes.array,
        Score:PropTypes.number,
    }
    static defaultProps = {}
    renderTopBar = ()=> {
        return (
            <View style={styles.topBar}>
                <TouchableOpacity onPress={()=>{app.PopPage(Consts.POP_ROUTE, Scenes.MENU)}}>
                    <Image style={styles.backImg} source={ImageRes.ic_back}/>
                </TouchableOpacity>
                <Text style={styles.textTitle}>闯关结果</Text>
                <ScoreCircle score={this.props.Score}/>
            </View>
        );
    }
    renderBottomBar = ()=> {
        return (
            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={()=>{logf("播放")}}>
                    <Image style={styles.playImg} source={ImageRes.btn_playing}/>
                </TouchableOpacity>
                <Text style={styles.textTitle}>播放成绩单</Text>
            </View>
        );
    }

    renderItem = (rowData, sectionID, rowID)=> {
        //logf("rowID",rowID);
        //logf("arrSyllableScore:",this.props.arrSyllableScore);
        //logf("sentenceScore",this.props.arrSentenceScore);
        return(<ResultItem itemIndex={rowID} itemWords={rowData.cn.words}
                           itemPinyins={rowData.cn.pinyins} itemEN={rowData.en}
                            arrSyllableScore = {this.props.arrSyllableScore[rowID]}
                            sentenceScore = {this.props.arrSentenceScore[rowID]}/>);

    }

    componentDidMount() {
        logf("--P_ExamResultList Did Mount:--",this.time - new Date());
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderTopBar()}
                <ListView
                    //initialListSize={6}
                    //pageSize={1}
                    scrollRenderAheadDistance={minUnit}
                    removeClippedSubviews={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderItem.bind(this)}
                />
                {this.renderBottomBar()}
            </View>
        );
    }
}


class ResultItem extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            progress: 0,
        };
    }

    static propTypes = {
        itemIndex: PropTypes.number,
        itemWords: PropTypes.string,
        itemPinyins: PropTypes.string,
        itemEN:PropTypes.string,
        arrSyllableScore:PropTypes.array,
        sentenceScore:PropTypes.number,
    };
    static defaultProps = {};

    render() {
        return (
            <TouchableOpacity style={styles.itemView} activeOpacity={0.5}>
                <View style={styles.itemContent}>
                    <Sentence words={this.props.itemWords} pinyins={this.props.itemPinyins} arrScore = {this.props.arrSyllableScore}/>
                    <Text style={{fontSize:fontSize,color:'#757575',marginTop:fontSize*0.4,marginLeft:fontSize/2}}>{this.props.itemEN}</Text>
                </View>
                <ScoreCircle score={this.props.sentenceScore}/>
            </TouchableOpacity>
        );
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
        position: 'absolute',
        flexDirection: 'row',
        width: ScreenWidth,
        height: fontSize * 4,
        left: 0,
        top: ScreenHeight - fontSize * 4,
        backgroundColor: '#ffffff',
        //justifyContent: 'space-between',
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
    itemView: {
        borderBottomWidth: MinWidth,
        borderBottomColor: '#CBCBCB',
        paddingHorizontal: fontSize,
        paddingVertical:fontSize*0.5,
        width: ScreenWidth,
        flexDirection:'row',
        overflow : 'hidden',
    },
    itemContent:{
        width:ScreenWidth - minUnit*16,
        //backgroundColor:'#00ff0011',
    }
})