/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Logo from './Pages/P_Logo';
import PrePage from './Pages/P_PrePage';
import Register from './Pages/P_Register';
import Login from './Pages/P_Login';
import Main from './Pages/P_Main';
import Menu from './Pages/P_Menu';
import Practice from './Pages/P_Practice';
import AllLessons from './Pages/P_AllLessons';
// import AllLessons from './Pages/P_TestText';
// import AllLessons from './Pages/P_WebText';
import Exam from './Pages/P_Exam';
import LessonList from './Pages/P_LessonList';
import LessonInfo from './Pages/P_LessonInfo';
import KindList from './Pages/P_KindList';

import {
    Scenes,
} from './Constant';

//页面或场景的基本配置，用于界面跳转。
//如果有新的页面，都可以加入到这个里面来进行统一管理。（指跳转的）
let SceneList = [
    {
        name: 'Logo',//名称
        Component: Logo,//跳转到哪个页面的名字
        index: Scenes.LOGO,//index标识
        configure: 0,//跳转时的动画，可以参考App中的configureScene，看看对应的跳转方式。
        showStatusBar: false,
    },
    {
        name: 'PrePage',
        Component: PrePage,
        index: Scenes.PREPAGE,
        configure: 4,
        showStatusBar: false,
    },
    {
        name: 'Register',
        Component: Register,
        index: Scenes.REGISTER,
        configure: 2,
        showStatusBar: true,
    },
    {
        name: 'Login',
        Component: Login,
        index: Scenes.LOGIN,
        configure: 2,
        showStatusBar: true,
    },
    {
        name: 'Main',
        Component: Main,
        index: Scenes.MAIN,
        configure: 0,
        showStatusBar: true,
    },
    {
        name: 'Menu',
        Component: Menu,
        index: Scenes.MENU,
        configure: 2,
        showStatusBar: false,
    },
    {
        name: 'Practice',
        Component: Practice,
        index: Scenes.PRACTICE,
        configure: 0,
        showStatusBar: true,
    },
    {
        name: 'AllLessons',
        Component: AllLessons,
        index: Scenes.ALLLESSON,
        configure: 0,
        showStatusBar: true,
    },
    {
        name: 'Exam',
        Component: Exam,
        index: Scenes.EXAM,
        configure: 0,
        showStatusBar: true,
    },
    {
        name: 'LessonList',
        Component: LessonList,
        index: Scenes.LESSONLIST,
        configure: 0,
        showStatusBar: true,
    },
    {
        name: 'LessonInfo',
        Component: LessonInfo,
        index: Scenes.LESSONINFO,
        configure: 0,
        showStatusBar: true,
    },
    {
        name: 'KindList',
        Component: KindList,
        index: Scenes.KINDLIST,
        configure: 0,
        showStatusBar: true,
    }
];

module.exports = SceneList;