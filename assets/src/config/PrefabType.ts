
// 场景类型
export const SceneType = {
    LoadingScene: "LoadingScene",
    LoginScene: "LoginScene",
    MainScene: "MainScene",
    WorldMapScene: "WorldMapViewManager",
    TextbookScene: "TextbookScene",
}
/**窗口层级 */
export enum Hierarchy {

    SCENELAYER,

    POPUPLAYER,

    TIPLAYER,

    LOADINGLAYER,
}

export class PrefabConfig {
    public path: string;
    public zindex: number = Hierarchy.SCENELAYER;
    public tips: string;
}

// 预制体类型
export const PrefabType = {
    //**学习模式相关 */
    StudyView: { path: "study/StudyViewchange", zindex: Hierarchy.POPUPLAYER, tips: "学习模块选择" },
    StudyModeView: { path: "studyModes/StudyModeView", zindex: Hierarchy.POPUPLAYER, tips: "关卡学模式" },
    WorldMapView: { path: "adventure/WorldMapView", zindex: Hierarchy.POPUPLAYER, tips: "单词大冒险岛屿选择" },
    WordMeaningView: { path: "studyModes/WordMeaningView", zindex: Hierarchy.POPUPLAYER, tips: "词意模式" },
    WordPracticeView: { path: "studyModes/WordPraticeView", zindex: Hierarchy.POPUPLAYER, tips: "练习模式" },
    TransitionView: { path: "common/TransitionView", zindex: Hierarchy.POPUPLAYER, tips: "过渡界面" },

    //**学习模式相关 end*/
    /*********************************************公共相关start***********************************************************/
    TopAmoutView: { path: "common/TopAmoutView", zindex: Hierarchy.POPUPLAYER, tips: "数值公共模块" },
    NavTitleView: { path: "common/NavTitleView", zindex: Hierarchy.POPUPLAYER, tips: "导航公共模块" },
    PopView: { path: "common/PopView", zindex: Hierarchy.TIPLAYER, tips: "弹窗" },
    BaseRemindView: { path: "common/BaseRemindView", zindex: Hierarchy.TIPLAYER, tips: "二次提示界面" },
    TipView: { path: "common/TipView", zindex: Hierarchy.TIPLAYER, tips: "提示界面" },
    /*********************************************公共相关end*************************************************************/
    // 设置相关
    SettingView: { path: "setting/SettingView", zindex: Hierarchy.POPUPLAYER, tips: "设置界面" },
    VideoView: { path: "setting/VideoView", zindex: Hierarchy.POPUPLAYER, tips: "视频播放界面" },
    ChangeHeadView: { path: "setting/ChangeHeadView", zindex: Hierarchy.POPUPLAYER, tips: "头像调整" },
    ChangeNameView: { path: "setting/ChangeNameView", zindex: Hierarchy.POPUPLAYER, tips: "设置昵称" },
    MyTableView: { path: "setting/MyTableView", zindex: Hierarchy.POPUPLAYER, tips: "我的表格" },
    SubscribeView: { path: "setting/SubscribeView", zindex: Hierarchy.POPUPLAYER, tips: "订阅学习周报" },
    AccountActivationView: { path: "setting/AccountActivationView", zindex: Hierarchy.POPUPLAYER, tips: "账号激活中心" },
    MemberCentreView: { path: "setting/MemberCentreView", zindex: Hierarchy.POPUPLAYER, tips: "会员中心" },
    ChangeRoleView: { path: "setting/ChangeRoleView", zindex: Hierarchy.POPUPLAYER, tips: "角色更换" },
    // 设置相关END
    /**教材单词相关 */
    /*********************************************教材单词相关start***********************************************************/
    SelectWordView: { path: "textbook/SelectWordView", zindex: Hierarchy.POPUPLAYER, tips: "选择教材单词模块" },
    TextbookListView: { path: "textbook/TextbookListView", zindex: Hierarchy.POPUPLAYER, tips: "词书列表模块" },
    TabTopView: { path: "textbook/TabTopView", zindex: Hierarchy.POPUPLAYER, tips: "选择教材tab模块" },
    RightMonster: { path: "textbook/RightMonster", zindex: Hierarchy.POPUPLAYER, tips: "我的词库右侧怪物模块" },
    RightNavView: { path: "textbook/RightNavView", zindex: Hierarchy.POPUPLAYER, tips: "选择教材右侧导航模块" },
    SelectWordHelp: { path: "textbook/SelectWordHelp", zindex: Hierarchy.POPUPLAYER, tips: "选择教材帮助dialog" },
    TextbookChallengeView: { path: "textbook/TextbookChallengeView", zindex: Hierarchy.POPUPLAYER, tips: "选择教材挑战界面" },
    FloorsAutoView: { path: "textbook/FloorsAutoView", zindex: Hierarchy.POPUPLAYER, tips: "下方自动滚动角色模块" },
    ChallengeBottomView: { path: "textbook/ChallengeBottomView", zindex: Hierarchy.POPUPLAYER, tips: "下方单元进度模块" },
    ChallengeLeftView: { path: "textbook/ChallengeLeftView", zindex: Hierarchy.POPUPLAYER, tips: "左侧怪物模块" },
    RightUnitView: { path: "textbook/RightUnitView", zindex: Hierarchy.POPUPLAYER, tips: "右侧单元详情模块" },
    RightPanelchange: { path: "adventure/common/RightPanelchange", zindex: Hierarchy.POPUPLAYER, tips: "单词大冒险右侧挑战模块" },
    SettingPlanView: { path: "textbook/SettingPlanView", zindex: Hierarchy.POPUPLAYER, tips: "计划设置dialog模块" },
    ScrollMapView: { path: "textbook/ScrollMapView", zindex: Hierarchy.POPUPLAYER, tips: "滑动地图模块" },
    BreakThroughView: { path: "textbook/BreakThroughView", zindex: Hierarchy.POPUPLAYER, tips: "单词大冒险挑战模块" },
    TextbookRemindView: { path: "textbook/TextbookRemindView", zindex: Hierarchy.POPUPLAYER, tips: "二级确认弹窗" },
    SearchWorldView: { path: "textbook/SearchWordView", zindex: Hierarchy.POPUPLAYER, tips: "查找单词弹窗" },
    WordSearchView: { path: "textbook/WordSearchView", zindex: Hierarchy.POPUPLAYER, tips: "查找单词详情弹窗" },
    /*********************************************教材单词相关end*************************************************************/
    /*********************************************地图相关start***********************************************************/
    MainUIView: { path: "map/MainUIView", zindex: Hierarchy.SCENELAYER, tips: "地图UI界面" },
    EditUIView: { path: "map/EditUIView", zindex: Hierarchy.SCENELAYER, tips: "地图编辑UI界面" },
    LandEditUIView: { path: "map/LandEditUIView", zindex: Hierarchy.SCENELAYER, tips: "地块编辑UI界面" },
    BuildingBtnView: { path: "map/BuildingBtnView", zindex: Hierarchy.POPUPLAYER, tips: "建筑按钮界面" },
    BuildingProduceView: { path: "map/BuildingProduceView", zindex: Hierarchy.POPUPLAYER, tips: "建筑生产界面" },
    BuildingInfoView: { path: "map/BuildingInfoView", zindex: Hierarchy.POPUPLAYER, tips: "建筑信息界面" },
    /*********************************************地图相关end*************************************************************/
    /*********************************************复习计划start***********************************************************/
    ReviewMainView: { path: "review/ReviewMainView", zindex: Hierarchy.POPUPLAYER, tips: "复习规划主界面" },
    /*********************************************复习计划end*************************************************************/
}