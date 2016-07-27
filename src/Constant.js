/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

let Consts = {
    //界面跳转时，是替换还是加入，或者其他方式
    NAVI_REPLACE: 0,
    NAVI_PUSH: 1,
    NAVI_RESET: 2,

    //页面跳转方式
    PushFromRight: 0,
    FloatFromLeft: 1,
    FloatFromBottom: 2,
    FloatFromBottomAndroid: 3,
    FadeAndroid: 4,
    HorizontalSwipeJump: 5,
    HorizontalSwipeJumpFromRight: 6,
    VerticalUpSwipeJump: 7,
    VerticalDownSwipeJump: 8,

    //课程列表分类，刷新或者不刷新，刷新的是按类别从服务器取数据，不刷新的是另外三个（推荐，最新，猜你喜欢）
    REFRESH: 0,
    NOREFRESH: 1,
};

let Scenes = {//界面的index，主要是宏定义，方便跳转到对应的scenelist中的某个页面。
    LOGO: 0,
    PREPAGE: 1,
    REGISTER: 2,
    LOGIN: 3,
    MAIN: 4,
    MENU: 5,
    PRACTICE: 6,
    ALLLESSON: 7,
    EXAM: 8,
    LESSONLIST: 9,
    LESSONINFO: 10,
    KINDLIST: 11,
};

let getAudioFilePath = function(lessonID, courseID, dailogID){
    return "rec" + lessonID + "_" + courseID + "_" + dailogID + ".pcm";
};

let getExamFilePath = function(lessonID, courseID, dailogID){
    return "exam" + lessonID + "_" + courseID + "_" + dailogID + ".pcm";
};

let getMp3FilePath = function(lessonID, courseID) {
    return '/lesson' + lessonID + '/course' + courseID;
};

let serverUrl = 'http://192.169.1.19:8080';

module.exports = {
    Scenes,
    Consts,
    getAudioFilePath,
    getExamFilePath,
    serverUrl,
    getMp3FilePath,
}