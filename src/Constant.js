/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

let Consts = {//界面跳转时，是替换还是加入，或者其他方式
    NAVI_REPLACE: 0,
    NAVI_PUSH: 1,
    NAVI_RESET: 2,
};

let Scenes = {//界面的index，主要是宏定义，方便跳转到对应的scenelist中的某个页面。
    LOGO: 0,
    PREPAGE: 1,
    REGISTER: 2,
    LOGIN: 3,
    MAIN: 4,
    MENU: 5,
    PRACTICE: 6,
};

module.exports = {
    Scenes,
    Consts,
}