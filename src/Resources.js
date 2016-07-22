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
    loading: require('../res/UI/loading.png'),

    //--------all lessons图片资源-----------------//
    icon_store_search:require('../res/UI/icon_store_search.png'),
    ic_chevron_right:require('../res/UI/ic_chevron_right.png'),
    //--------all lessons图片资源------END--------//

    //--------Exam 图片资源----------------------//
    circle_btn_pause_26:require('../res/UI/circle_btn_pause_26.png'),
    //--------Exam 图片资源-------END-----------//

    icon_newcourse: require('../res/UI/icon_newcourse.png'),
    icon_store_diamond: require('../res/UI/icon_store_diamond.png'),

    block_loading00: require('../res/Waiting/block_loading00.png'),
    block_loading01: require('../res/Waiting/block_loading01.png'),
    block_loading02: require('../res/Waiting/block_loading02.png'),
    block_loading03: require('../res/Waiting/block_loading03.png'),
    block_loading04: require('../res/Waiting/block_loading04.png'),
    block_loading05: require('../res/Waiting/block_loading05.png'),
    block_loading06: require('../res/Waiting/block_loading06.png'),
    block_loading07: require('../res/Waiting/block_loading07.png'),
    block_loading08: require('../res/Waiting/block_loading08.png'),
    block_loading09: require('../res/Waiting/block_loading09.png'),
    block_loading10: require('../res/Waiting/block_loading10.png'),
    block_loading11: require('../res/Waiting/block_loading11.png'),
};


let ImageIcon = {
    user0:require('../icon/user0.png'),
    user1:require('../icon/user1.jpg'),
    user2:require('../icon/user2.jpg'),
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

let kindList = [
  {color:'rgb(253,155,80)',name:'影视视频'},
  {color:'rgb(108,176,241)',name:'商务职场'},
  {color:'rgb(253,103,104)',name:'日常会话'},
  {color:'rgb(67,184,124)',name:'旅游出行'},
  {color:'rgb(38,196,189)',name:'五花八门'},
  {color:'rgb(121,112,204)',name:'校园生活'},
  {color:'rgb(85,154,143)',name:'经典教材'},
  {color:'rgb(90,194,164)',name:'文化百科'},
  {color:'rgb(189,189,189)',name:'更多'},
];

let lessonList = [
    {
        title: '懂你中文',
        secondTitle: '查看课程',
        index: 0,
        kind: 1,
        lessons:[
            {
                title:'懂你中文',
                oldPrice: 199,
                newPrice: 99,
                detail:'这里是懂你的中文，让你看中文电视剧甩掉字幕~~',
            },
        ],
    },
    {
        title: '最新课程',
        secondTitle: '查看更多',
        index: 1,
        kind: 2,
        lessons:[
            {title:'长发公主',},
            {title:'泰山归来',},
            {title:'胖妹也穿比基尼',},
            {title:'实习生',},
            {title:'创意广告大赏',},
            {title:'38被动语态2-新概念英语',},
            {title:'联合利华',},
            {title:'克扣奖金就辞职！',},
            {title:'黑客军团',},
            {title:'雷神',},
            {title:'委婉说“大姨妈”',},
            {title:'英国新首相上任',},
            {title:'龙猫',}
        ],
    },
    {
        title: '推荐课程',
        secondTitle: '查看更多',
        index: 2,
        kind: 3,
        lessons:[
            {title:'灰姑娘',},
            {title:'哆啦A梦',},
            {title:'夏天必备防晒霜',},
            {title:'超体',},
            {title:'阿凡达',},
            {title:'心怀好奇，创意无限',},
            {title:'龙猫',},
            {title:'和莎莫的500天',},
            {title:'驯龙高手',},
            {title:'钢铁侠',},
            {title:'蜘蛛侠',},
            {title:'创意广告大赏',},
            {title:'钢铁侠 小罗伯特·唐尼',}
        ],
    },
    {
        title: '猜你喜欢',
        secondTitle: '查看更多',
        index: 3,
        kind: 3,
        lessons:[
            {title:'好莱坞变色龙约翰尼·德普',},
            {title:'蚁人',},
            {title:'抖森在，阳光就在',},
            {title:'自然在说话',},
            {title:'如何应对种族歧视',},
            {title:'NBA全明星',},
            {title:'赫敏长大啦',},
            {title:'美队 克里斯·埃文斯',},
            {title:'钱包丢了怎么办？',},
            {title:'闪电侠',},
            {title:'警惕旅游陷阱',},
            {title:'火星救援',},
            {title:'愤怒的小鸟',}
        ],
    }
];

module.exports = {
    mainBottomBarIcon,
    ImageRes,
    ColorRes,
    ImageIcon,
    kindList,
    lessonList,
};