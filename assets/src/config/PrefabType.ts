
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
    public scpt_name?: string;
}

// 预制体类型
export const PrefabType = {
    //**学习模式相关 */
    StudyView: { path: "study/StudyViewchange", zindex: Hierarchy.POPUPLAYER, tips: "学习模块选择" },
    StudyModeView: { path: "studyModes/StudyModeView", zindex: Hierarchy.POPUPLAYER, tips: "关卡学模式" },
    WorldMapView: { path: "adventure/WorldMapView", zindex: Hierarchy.POPUPLAYER, tips: "单词大冒险岛屿选择" },
    WordMeaningView: { path: "studyModes/WordMeaningView", zindex: Hierarchy.POPUPLAYER, tips: "词意模式" },
    WordPracticeView: { path: "studyModes/WordPraticeView", zindex: Hierarchy.POPUPLAYER, tips: "练习模式" },
    WordSpellView: { path: "studyModes/WordSpellView", zindex: Hierarchy.POPUPLAYER, tips: "拼写模式" },
    WordReadingView: { path: "studyModes/WordReadingView", zindex: Hierarchy.POPUPLAYER, tips: "读模式" },
    WordReportView: { path: "studyModes/WordReportView", zindex: Hierarchy.POPUPLAYER, tips: "结算界面" },
    TransitionView: { path: "common/TransitionView", zindex: Hierarchy.POPUPLAYER, tips: "过渡界面" },

    //**学习模式相关 end*/
    /*********************************************公共相关start***********************************************************/
    TopAmoutView: { path: "common/TopAmoutView", zindex: Hierarchy.POPUPLAYER, tips: "数值公共模块" },
    NavTitleView: { path: "common/NavTitleView", zindex: Hierarchy.POPUPLAYER, tips: "导航公共模块" },
    PopView: { path: "common/PopView", zindex: Hierarchy.TIPLAYER, tips: "提示弹窗" },
    BaseRemindView: { path: "common/BaseRemindView", zindex: Hierarchy.TIPLAYER, tips: "二次提示界面" },
    TipView: { path: "common/TipView", zindex: Hierarchy.TIPLAYER, tips: "提示界面" },
    ConfirmView: { path: "common/ConfirmView", zindex: Hierarchy.TIPLAYER, tips: "确定弹窗" },
    RewardItem: { path: "common/RewardItem", zindex: Hierarchy.SCENELAYER, tips: "奖励道具" },
    RewardView: { path: "common/RewardView", zindex: Hierarchy.POPUPLAYER, tips: "奖励弹窗" },
    WaitingView: { path: "common/WaittingView", zindex: Hierarchy.LOADINGLAYER, tips: "等待弹窗" },
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
    FeedbackView: { path: "setting/FeedbackView", zindex: Hierarchy.POPUPLAYER, tips: "意见反馈" },
    ResetPasswordView: { path: "setting/ResetPasswordView", zindex: Hierarchy.POPUPLAYER, tips: "重置密码" },
    ApplyLogoutView: { path: "setting/ApplyLogoutView", zindex: Hierarchy.POPUPLAYER, tips: "申请注销" },
    LogoutView: { path: "setting/LogoutView", zindex: Hierarchy.POPUPLAYER, tips: "注销账号" },
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
    SettingPlanView: { path: "textbook/SettingPlanView", scpt_name: "SettingPlanView", zindex: Hierarchy.POPUPLAYER, tips: "计划设置dialog模块" },
    ScrollMapView: { path: "textbook/ScrollMapView", zindex: Hierarchy.POPUPLAYER, tips: "滑动地图模块" },
    BreakThroughView: { path: "textbook/BreakThroughView", zindex: Hierarchy.POPUPLAYER, tips: "单词大冒险挑战模块" },
    TextbookRemindView: { path: "textbook/TextbookRemindView", scpt_name: "TextbookRemindView", zindex: Hierarchy.POPUPLAYER, tips: "二级确认弹窗" },
    ChallengeRemindView: { path: "textbook/ChallengeRemindView", scpt_name: "ChallengeRemindView", zindex: Hierarchy.POPUPLAYER, tips: "首次故事背景引导" },
    SearchWorldView: { path: "textbook/SearchWordView", zindex: Hierarchy.POPUPLAYER, tips: "查找单词弹窗" },
    WordSearchView: { path: "textbook/WordSearchView", zindex: Hierarchy.POPUPLAYER, tips: "查找单词详情弹窗" },
    WordCheckView: { path: "textbook/WordCheckView", zindex: Hierarchy.POPUPLAYER, tips: "单词列表" },
    /*********************************************教材单词相关end*************************************************************/
    /*********************************************商城相关start***********************************************************/
    ShopUIView: { path: "shop/ShopUIView", zindex: Hierarchy.POPUPLAYER, tips: "商城模块" },
    GoodsDetailView: { path: "shop/GoodsDetailView", zindex: Hierarchy.POPUPLAYER, tips: "商品详情" },
    /*********************************************商城相关end*************************************************************/
    /*********************************************语法训练start***********************************************************/
    GrammarTrainingView: { path: "grammar/GrammarTrainingView", zindex: Hierarchy.POPUPLAYER, tips: "语法训练" },
    GrammarVocabularyView: { path: "grammar/GrammarVocabularyView", zindex: Hierarchy.POPUPLAYER, tips: "语法训练" },
    /*********************************************语法训练end*************************************************************/
    /*********************************************挑战BOSS相关start***********************************************************/
    WorldBossView: { path: "worldBoss/WorldBossView", zindex: Hierarchy.POPUPLAYER, tips: "世界boss挑战模块" },
    WorldLeftNavView: { path: "worldBoss/WorldLeftNavView", zindex: Hierarchy.POPUPLAYER, tips: "世界boss左侧" },
    CenterBossView: { path: "worldBoss/CenterBossView", zindex: Hierarchy.POPUPLAYER, tips: "世界boss中间" },
    RightRankView: { path: "worldBoss/RightRankView", zindex: Hierarchy.POPUPLAYER, tips: "世界boss右侧" },
    BossChallengeView: { path: "worldBoss/BossChallengeView", zindex: Hierarchy.POPUPLAYER, tips: "世界boss挑战界面" },
    ChallengeFrameView: { path: "worldBoss/ChallengeFrameView", zindex: Hierarchy.POPUPLAYER, tips: "世界boss挑战操作页面" },
    /*********************************************挑战BOSS相关end*************************************************************/
    /*********************************************地图相关start***********************************************************/
    MainUIView: { path: "map/MainUIView", zindex: Hierarchy.SCENELAYER, tips: "地图UI界面" },
    EditUIView: { path: "map/EditUIView", zindex: Hierarchy.SCENELAYER, tips: "地图编辑UI界面" },
    LandEditUIView: { path: "map/LandEditUIView", zindex: Hierarchy.SCENELAYER, tips: "地块编辑UI界面" },
    BuildingBtnView: { path: "map/BuildingBtnView", zindex: Hierarchy.POPUPLAYER, tips: "建筑按钮界面" },
    BuildingProduceView: { path: "map/BuildingProduceView", zindex: Hierarchy.POPUPLAYER, tips: "建筑生产界面" },
    BuildingInfoView: { path: "map/BuildingInfoView", zindex: Hierarchy.POPUPLAYER, tips: "建筑信息界面" },
    BuildingProduceItem: { path: "map/BuildingProduceItem", zindex: Hierarchy.POPUPLAYER, tips: "建筑生产item" },
    BuildingUpgradeView: { path: "map/BuildingUpgradeView", zindex: Hierarchy.POPUPLAYER, tips: "建筑升级信息界面" },
    CastleInfoView: { path: "map/CastleInfoView", zindex: Hierarchy.POPUPLAYER, tips: "城堡信息界面" },
    EditAnimView: { path: "map/EditAnimView", zindex: Hierarchy.SCENELAYER, tips: "建筑编辑动画" },
    CountdownFrame: { path: "map/CountdownFrame", zindex: Hierarchy.SCENELAYER, tips: "倒计时框加速" },
    BuildingSuccessView: { path: "map/BuildingSuccessView", zindex: Hierarchy.POPUPLAYER, tips: "建筑成功界面" },
    /*********************************************地图相关end*************************************************************/
    /*********************************************宠物相关start*************************************************************/
    PetInteractionView: { path: "map/PetInteractionView", zindex: Hierarchy.POPUPLAYER, tips: "宠物交互界面" },
    PetInfoView: { path: "map/PetInfoView", zindex: Hierarchy.POPUPLAYER, tips: "宠物信息界面" },
    /*********************************************宠物相关end*************************************************************/
    /*********************************************复习计划start***********************************************************/
    ReviewMainView: { path: "review/ReviewMainView", zindex: Hierarchy.POPUPLAYER, tips: "复习规划主界面" },
    StudyRecordView: { path: "review/StudyRecordView", zindex: Hierarchy.POPUPLAYER, tips: "复习计划日程表" },
    DayWordDialogView: { path: "review/DayWordDialogView", zindex: Hierarchy.POPUPLAYER, tips: "每日学习单词表" },
    /*********************************************复习计划end*************************************************************/
    /*********************************************CardBook start***********************************************************/
    CardBookView: { path: "cardWar/CardBookView", zindex: Hierarchy.POPUPLAYER, tips: "卡牌书籍" },
    /*********************************************CardBook End*************************************************************/
    /*********************************************新人七天豪礼 start***********************************************************/
    NewbieGiftDialogView: { path: "gift/NewbieGiftDialogView", zindex: Hierarchy.POPUPLAYER, tips: "新人七天大礼" },
    NewbieRewardDialogView: { path: "gift/RewardDialogView", zindex: Hierarchy.POPUPLAYER, tips: "领奖励结算窗口" },
    /*********************************************新人七天豪礼 End*************************************************************/
    /*********************************************跑马灯和公告 start***********************************************************/
    NoticeDialogView: { path: "notice/NoticeDialogView", zindex: Hierarchy.POPUPLAYER, tips: "新人七天大礼" },
    /*********************************************跑马灯和公告 End*************************************************************/
    /*********************************************成就 start***********************************************************/
    AchieveDialogView: { path: "achieve/AchieveDialogView", zindex: Hierarchy.POPUPLAYER, tips: "成就面板" },
    /*********************************************成就 End*************************************************************/
    /*********************************************帮助 start***********************************************************/
    HelpDialogView: { path: "help/HelpDialogView", zindex: Hierarchy.POPUPLAYER, tips: "帮助界面" },
    /*********************************************帮助 End*************************************************************/
    /*********************************************复习规划start***********************************************************/
    ReviewPlanView: { path: "reviewPlan/ReviewPlanView", zindex: Hierarchy.POPUPLAYER, tips: "复习规划" },
    ReviewAdjustPlanView: { path: "reviewPlan/ReviewAdjustPlanView", zindex: Hierarchy.POPUPLAYER, tips: "复习规划调整框" },
    ReviewWordListView: { path: "reviewPlan/ReviewWordListView", zindex: Hierarchy.POPUPLAYER, tips: "复习单词列表" },
    /*********************************************复习规划end***********************************************************/
    /*********************************************社交 start***********************************************************/
    FriendsDialogView: { path: "social/FriendsDialogView", zindex: Hierarchy.POPUPLAYER, tips: "好友界面" },
    FriendTalkDialogView: { path: "social/FriendTalkDialogView", zindex: Hierarchy.POPUPLAYER, tips: "好友聊天界面" },
    /*********************************************社交 End*************************************************************/
    /*********************************************背包 start***********************************************************/
    BagView: { path: "bag/BagView", zindex: Hierarchy.POPUPLAYER, tips: "背包界面" }
    /*********************************************背包 end***********************************************************/
}