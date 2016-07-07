/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

let ImageRes = {
    study_icon_normal: require('../res/UI/study_icon_normal.png'),
    study_icon_selected: require('../res/UI/study_icon_selected.png'),
    engzobar_icon_normal: require('../res/UI/engzobar_icon_normal.png'),
    engzobar_icon_selected: require('../res/UI/engzobar_icon_selected.png'),
    discovery_icon_normal: require('../res/UI/discovery_icon_normal.png'),
    discovery_icon_selected: require('../res/UI/discovery_icon_selected.png'),
    me_icon_normal: require('../res/UI/me_icon_normal.png'),
    me_icon_selected: require('../res/UI/me_icon_selected.png'),
    ic_close: require('../res/UI/ic_close.png'),
    more: require('../res/UI/more.png'),
    ic_back: require('../res/UI/ic_back.png'),
    play: require('../res/UI/play.png'),
    pause: require('../res/UI/pause.png'),

    //--------ListItem以及子组件用的图片资源------------//
    btn_playing:require('../res/UI/btn_playing.png'),
    btn_play:require('../res/UI/btn_play.png'),
    btn_pause:require('../res/UI/btn_pause.png'),
    bg_mic_highlight_l:require('../res/UI/bg_mic_highlight_l.png'),
    bg_mic_highlight_l_hit:require('../res/UI/bg_mic_highlight_l_hit.png'),
    default_avatar:require('../res/UI/default_avatar.png'),
    icon_bad:require('../res/UI/icon_bad.png'),

    line_avatar_128:require('../res/UI/line_avatar_128.png'),
    bg_mic:require('../res/UI/bg_mic.png'),
    icon_pause_light_m:require('../res/UI/icon_pause_light_m.png'),
    icon_play_light_m:require('../res/UI/icon_play_light_m.png'),
    icon_coin_s:require('../res/UI/icon_coin_s.png'),
    //--------ListItem以及子组件用的图片资源-----END-----//
    icon_coin_m:require('../res/UI/icon_coin_m.png'),
    icon_coin_l:require('../res/UI/icon_coin_l_hit.png'),
};

let ColorRes = {
    mainBottomTextNormal: '#CCC',
    mainBottomTextSelect: '#AE8',
};

let mainBottomBarIcon = [
    {
        normal: ImageRes.study_icon_normal,
        selected: ImageRes.study_icon_selected,
        normalColor: ColorRes.mainBottomTextNormal,
        selectedColor: ColorRes.mainBottomTextSelect,
        text: '学习',
    },
    {
        normal: ImageRes.engzobar_icon_normal,
        selected: ImageRes.engzobar_icon_selected,
        normalColor: ColorRes.mainBottomTextNormal,
        selectedColor: ColorRes.mainBottomTextSelect,
        text: '中文吧',
    },
    {
        normal: ImageRes.discovery_icon_normal,
        selected: ImageRes.discovery_icon_selected,
        normalColor: ColorRes.mainBottomTextNormal,
        selectedColor: ColorRes.mainBottomTextSelect,
        text: '发现',
    },
    {
        normal: ImageRes.me_icon_normal,
        selected: ImageRes.me_icon_selected,
        normalColor: ColorRes.mainBottomTextNormal,
        selectedColor: ColorRes.mainBottomTextSelect,
        text: '我',
    },
];

module.exports = {
    mainBottomBarIcon,
    ImageRes,
    ColorRes,
};