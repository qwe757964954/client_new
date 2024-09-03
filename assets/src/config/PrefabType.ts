
// 场景类型
export const SceneType = {
    LoadingScene: "LoadScene",
    LoginScene: "LoginScene",
    MainScene: "MainScene",
    WorldMapScene: "WorldMapViewManager",
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
    public componentName?: string;
    public isCache?: boolean = false;
}

export type PrefabTypeEntry = {
    path: string;
    zindex: number;
    tips: string;
    componentName?: string;
};

// 预制体类型
export const PrefabType = {
    /*********************************************登录相关start*************************************************************/
    LoginView: { path: "login/LoginView", zindex: Hierarchy.SCENELAYER, tips: "登录主界面" },
    LoginAccountView: { path: "login/LoginAccountView", zindex: Hierarchy.SCENELAYER, tips: "账号密码登录" },
    LoginCodeView: { path: "login/LoginCodeView", zindex: Hierarchy.SCENELAYER, tips: "验证码登录" },
    LoginRegisterView: { path: "login/LoginRegisterView", zindex: Hierarchy.SCENELAYER, tips: "注册" },
    QRCodeView: { path: "login/QRCodeView", zindex: Hierarchy.SCENELAYER, tips: "二维码" },
    ActivationCodeView: { path: "login/ActivationCodeView", zindex: Hierarchy.SCENELAYER, tips: "激活码" },
    /*********************************************登录相关end*************************************************************/
    //**学习模式相关 */
    StudyView: { path: "study/StudyViewchange", zindex: Hierarchy.POPUPLAYER, tips: "学习模块选择" },
    StudyModeView: { path: "studyModes/StudyModeView", componentName: "StudyModeView", zindex: Hierarchy.POPUPLAYER, tips: "关卡学模式" },
    WorldMapView: { path: "adventure/WorldMapView", zindex: Hierarchy.POPUPLAYER, tips: "单词大冒险岛屿选择" },
    WorldIsland: { path: "adventure/levelMap/WorldIsland", zindex: Hierarchy.POPUPLAYER, tips: "单词大冒险关卡选择" },
    GradeSelectView: { path: "adventure/GradeSelectView", componentName: "GradeSelectView", zindex: Hierarchy.TIPLAYER, tips: "年级选择" },
    WordMeaningView: { path: "studyModes/WordMeaningView", componentName: "WordMeaningView", zindex: Hierarchy.POPUPLAYER, tips: "词意模式" },
    WordPracticeView: { path: "studyModes/WordPraticeView", componentName: "WordPracticeView", zindex: Hierarchy.POPUPLAYER, tips: "练习模式" },
    WordSpellView: { path: "studyModes/WordSpellView", componentName: "WordSpellView", zindex: Hierarchy.POPUPLAYER, tips: "拼写模式" },
    WordReadingView: { path: "studyModes/WordReadingView", componentName: "WordReadingView", zindex: Hierarchy.POPUPLAYER, tips: "读模式" },
    WordExamView: { path: "studyModes/WordExamView", componentName: "WordExamView", zindex: Hierarchy.POPUPLAYER, tips: "测试模式" },
    WordReportView: { path: "studyModes/WordReportView", componentName: "WordReportView", zindex: Hierarchy.POPUPLAYER, tips: "结算界面" },
    TransitionView: { path: "common/TransitionView", zindex: Hierarchy.POPUPLAYER, tips: "过渡界面" },
    MapPointItem: { path: "adventure/levelMap/MapPointItem", zindex: Hierarchy.POPUPLAYER, tips: "地图节点" },
    ExamReportView: { path: "studyModes/ExamReportView", zindex: Hierarchy.POPUPLAYER, tips: "测评模式结算界面" },
    WordBossView: { path: "studyModes/WordBossView", zindex: Hierarchy.POPUPLAYER, tips: "Boss关卡" },
    JellyTransition: { path: "studyModes/common/JellyTransition", zindex: Hierarchy.POPUPLAYER, tips: "过渡动画" },
    ComboView: { path: "studyModes/common/ComboView", zindex: Hierarchy.TIPLAYER, tips: "combo动画" },
    ComboBestView: { path: "studyModes/common/ComboBestView", componentName: "ComboBestView", zindex: Hierarchy.TIPLAYER, tips: "combo best动画" },
    ComboRightView: { path: "studyModes/common/ComboRightView", componentName: "ComboRightView", zindex: Hierarchy.TIPLAYER, tips: "combo 右侧动画" },
    LevelUpView: { path: "common/LevelUpView", zindex: Hierarchy.POPUPLAYER, tips: "升级界面" },
    MapProcessRewardView: { path: "adventure/common/MapProcessRewardView", componentName: "MapProcessRewardView", zindex: Hierarchy.TIPLAYER, tips: "岛屿进度奖励展示" },
    MonsterModel: { path: "adventure/common/MonsterModel", componentName: "MonsterModel", zindex: Hierarchy.POPUPLAYER, tips: "怪物模型" },
    //**学习模式相关 end*/
    /*********************************************公共相关start***********************************************************/
    TopAmoutView: { path: "common/ResPannel", zindex: Hierarchy.POPUPLAYER, tips: "数值公共模块" },
    NavTitleView: { path: "common/NavTitleView", zindex: Hierarchy.POPUPLAYER, tips: "导航公共模块" },
    PopView: { path: "common/PopView", zindex: Hierarchy.TIPLAYER, tips: "提示弹窗" },
    TipView: { path: "common/TipView", zindex: Hierarchy.TIPLAYER, tips: "提示界面" },
    TipSmallView: { path: "common/TipSmallView", zindex: Hierarchy.TIPLAYER, tips: "提示界面" },
    ConfirmView: { path: "common/ConfirmView", componentName: "ConfirmView", zindex: Hierarchy.TIPLAYER, tips: "确定弹窗" },
    RewardItem: { path: "common/RewardItem", zindex: Hierarchy.SCENELAYER, tips: "奖励道具" },
    RewardView: { path: "common/RewardView", zindex: Hierarchy.POPUPLAYER, tips: "奖励弹窗" },
    WaitingView: { path: "common/WaittingView", zindex: Hierarchy.LOADINGLAYER, tips: "等待弹窗" },
    WordDetailUI: { path: "common/WordDetailUI", zindex: Hierarchy.POPUPLAYER, tips: "单词详情" },
    /*********************************************公共相关end*************************************************************/
    // 设置相关
    SettingView: { path: "setting/SettingView", zindex: Hierarchy.POPUPLAYER, tips: "设置界面" },
    SettingTabView: { path: "setting/SettingTabView", zindex: Hierarchy.POPUPLAYER, tips: "设置tab界面" },
    VideoView: { path: "setting/VideoView", zindex: Hierarchy.POPUPLAYER, tips: "视频播放界面" },
    ChangeHeadView: { path: "setting/ChangeHeadView", zindex: Hierarchy.POPUPLAYER, tips: "头像调整" },
    ChangeNameView: { path: "setting/ChangeNameView", componentName: "ChangeNameView", zindex: Hierarchy.TIPLAYER, tips: "设置昵称" },
    MyTableView: { path: "setting/MyTableView", zindex: Hierarchy.POPUPLAYER, tips: "我的表格" },
    SubscribeView: { path: "setting/SubscribeView", zindex: Hierarchy.POPUPLAYER, tips: "订阅学习周报" },
    AccountActivationView: { path: "setting/AccountActivationView", zindex: Hierarchy.POPUPLAYER, tips: "账号激活中心" },
    MemberCentreView: { path: "setting/MemberCentreView", zindex: Hierarchy.POPUPLAYER, tips: "会员中心" },
    ChangeRoleView: { path: "setting/ChangeRoleView", zindex: Hierarchy.POPUPLAYER, tips: "角色更换" },
    FeedbackView: { path: "setting/FeedbackView", zindex: Hierarchy.POPUPLAYER, tips: "意见反馈" },
    ResetPasswordView: { path: "setting/ResetPasswordView", componentName: "ResetPasswordView", zindex: Hierarchy.TIPLAYER, tips: "重置密码" },
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
    RightPanelchange: { path: "adventure/common/RightPanelchange", componentName: "rightPanelchange", zindex: Hierarchy.TIPLAYER, tips: "单词大冒险右侧挑战模块" },
    SettingPlanView: { path: "textbook/SettingPlanView", componentName: "SettingPlanView", zindex: Hierarchy.TIPLAYER, tips: "计划设置dialog模块" },
    ScrollMapView: { path: "textbook/ScrollMapView", zindex: Hierarchy.POPUPLAYER, tips: "滑动地图模块" },
    BreakThroughView: { path: "textbook/BreakThroughView", zindex: Hierarchy.POPUPLAYER, tips: "单词大冒险挑战模块" },
    BreakThroughRemindView: { path: "textbook/BreakThroughRemindView", componentName: "BreakThroughRemindView", zindex: Hierarchy.TIPLAYER, tips: "二级确认弹窗" },
    ChallengeRemindView: { path: "textbook/ChallengeRemindView", componentName: "ChallengeRemindView", zindex: Hierarchy.TIPLAYER, tips: "首次故事背景引导" },
    WordCheckView: { path: "textbook/WordCheckView", zindex: Hierarchy.POPUPLAYER, tips: "单词列表" },
    /*********************************************教材单词相关end*************************************************************/
    /*********************************************商城相关start***********************************************************/
    ShopUIView: { path: "shop/ShopUIView", zindex: Hierarchy.POPUPLAYER, tips: "商城模块" },
    ShopBuildView: { path: "shop/ShopBuildView", zindex: Hierarchy.POPUPLAYER, tips: "商城建筑模块" },
    ShopPlayerView: { path: "shop/ShopPlayerView", zindex: Hierarchy.POPUPLAYER, tips: "商店玩家" },
    ShopStoreView: { path: "shop/ShopStoreView", zindex: Hierarchy.POPUPLAYER, tips: "形象商店模块" },
    ShopDecorationView: { path: "shop/ShopDecorationView", zindex: Hierarchy.POPUPLAYER, tips: "装饰模块" },
    DebrisAreaView: { path: "shop/DebrisAreaView", zindex: Hierarchy.POPUPLAYER, tips: "碎片区模块" },
    GoodsDetailView: { path: "shop/GoodsDetailView", componentName: "GoodsDetailView", zindex: Hierarchy.TIPLAYER, tips: "商品详情" },
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
    LandModel: { path: "map/model/LandModel", zindex: Hierarchy.SCENELAYER, tips: "地块模型" },
    CloudModel: { path: "map/model/CloudModel", zindex: Hierarchy.SCENELAYER, tips: "乌云模型" },
    BuildingModel: { path: "map/model/BuildingModel", zindex: Hierarchy.SCENELAYER, tips: "建筑模型" },
    SpModel: { path: "map/model/SpModel", zindex: Hierarchy.SCENELAYER, tips: "特效模型" },
    RoleModel: { path: "map/model/RoleModel", zindex: Hierarchy.SCENELAYER, tips: "角色模型" },
    PetModel: { path: "map/model/PetModel", zindex: Hierarchy.SCENELAYER, tips: "宠物模型" },
    RoleBaseModel: { path: "map/model/RoleBaseModel", zindex: Hierarchy.SCENELAYER, tips: "角色模型" },
    MainUIView: { path: "map/MainUIView", zindex: Hierarchy.SCENELAYER, tips: "地图UI界面", isCache: true },
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
    ProduceItemView: { path: "map/ProduceItemView", zindex: Hierarchy.POPUPLAYER, tips: "生产物品界面" },
    BuildBuiltView: { path: "map/BuildBuiltView", zindex: Hierarchy.POPUPLAYER, tips: "建筑建造界面" },
    SpeedWordsView: { path: "map/SpeedWordsView", zindex: Hierarchy.POPUPLAYER, tips: "加速单词界面" },
    CloudConditionView: { path: "map/CloudConditionView", zindex: Hierarchy.POPUPLAYER, tips: "乌云解锁条件界面" },
    BuildingSellView: { path: "map/BuildingSellView", zindex: Hierarchy.POPUPLAYER, tips: "建筑出售界面" },
    /*********************************************地图相关end*************************************************************/
    /*********************************************宠物相关start*************************************************************/
    PetInteractionView: { path: "map/PetInteractionView", zindex: Hierarchy.POPUPLAYER, tips: "宠物交互界面" },
    PetInfoView: { path: "map/PetInfoView", zindex: Hierarchy.POPUPLAYER, tips: "宠物信息界面" },
    PetGiftTipView: { path: "map/PetGiftTipView", zindex: Hierarchy.POPUPLAYER, tips: "宠物礼物提示界面" },
    PetMoodView: { path: "map/PetMoodView", zindex: Hierarchy.POPUPLAYER, tips: "宠物心情界面" },
    /*********************************************宠物相关end*************************************************************/
    /*********************************************CardBook start***********************************************************/
    CardBookView: { path: "cardWar/CardBookView", zindex: Hierarchy.POPUPLAYER, tips: "卡牌书籍" },
    /*********************************************CardBook End*************************************************************/
    /*********************************************新人七天豪礼 start***********************************************************/
    NewbieGiftDialogView: { path: "gift/NewbieGiftDialogView", zindex: Hierarchy.POPUPLAYER, tips: "新人七天大礼" },
    NewbieRewardDialogView: { path: "gift/RewardDialogView", zindex: Hierarchy.POPUPLAYER, tips: "领奖励结算窗口" },
    /*********************************************新人七天豪礼 End*************************************************************/
    /*********************************************跑马灯和公告 start***********************************************************/
    NoticeDialogView: { path: "notice/NoticeDialogView", componentName: "NoticeDialogView", zindex: Hierarchy.TIPLAYER, tips: "新人七天大礼" },
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
    ReviewEndView: { path: "reviewPlan/ReviewEndView", zindex: Hierarchy.POPUPLAYER, tips: "复习结束" },
    ReviewRewardView: { path: "reviewPlan/ReviewRewardView", zindex: Hierarchy.POPUPLAYER, tips: "复习抽奖奖励" },
    ReviewPlanRuleView: { path: "reviewPlan/ReviewPlanRuleView", zindex: Hierarchy.POPUPLAYER, tips: "复习规则" },
    /*********************************************复习规划end***********************************************************/
    /*********************************************单词本start***********************************************************/
    WordbookView: { path: "wordbook/WordbookView", zindex: Hierarchy.POPUPLAYER, tips: "单词本" },
    ReviewWordbookView: { path: "wordbook/ReviewWordbookView", zindex: Hierarchy.POPUPLAYER, tips: "复习本" },
    ErrorWordbookView: { path: "wordbook/ErrorWordbookView", zindex: Hierarchy.POPUPLAYER, tips: "错题本" },
    /*********************************************单词本end***********************************************************/
    /*********************************************社交 start***********************************************************/
    FriendsDialogView: { path: "social/FriendsDialogView", componentName: "FriendsDialogView", zindex: Hierarchy.POPUPLAYER, tips: "好友界面" },
    FriendTalkDialogView: { path: "social/FriendTalkDialogView", componentName: "FriendTalkDialogView", zindex: Hierarchy.TIPLAYER, tips: "好友聊天界面" },
    FriendApplyView: { path: "social/FriendApplyView", componentName: "FriendApplyView", zindex: Hierarchy.TIPLAYER, tips: "好友申请界面" },
    FriendLeftTabView: { path: "social/FriendLeftTabView", zindex: Hierarchy.POPUPLAYER, tips: "好友tab界面" },
    FriendList: { path: "social/ListViews/FriendList", zindex: Hierarchy.POPUPLAYER, tips: "好友list界面" },
    ApplyList: { path: "social/ListViews/ApplyList", zindex: Hierarchy.POPUPLAYER, tips: "好友apply界面" },
    Blacklist: { path: "social/ListViews/Blacklist", zindex: Hierarchy.POPUPLAYER, tips: "好友Blacklist界面" },
    FriendPlayerInfoView: { path: "social/FriendPlayerInfoView", componentName: "FriendPlayerInfoView", zindex: Hierarchy.TIPLAYER, tips: "好友玩家信息界面" },
    FriendListView: { path: "social/FriendListView", componentName: "FriendListView", zindex: Hierarchy.TIPLAYER, tips: "好友列表界面" },
    FriendAddView: { path: "social/FriendAddView", componentName: "FriendAddView", zindex: Hierarchy.TIPLAYER, tips: "好友添加界面" },
    FriendMessageView: { path: "social/FriendMessageView", zindex: Hierarchy.POPUPLAYER, tips: "好友消息界面" },
    FriendEmailView: { path: "social/FriendEmailView", zindex: Hierarchy.POPUPLAYER, tips: "好友邮件界面" },
    /*********************************************社交 End*************************************************************/
    /*********************************************背包 start***********************************************************/
    BagView: { path: "bag/BagView", zindex: Hierarchy.POPUPLAYER, tips: "背包界面" },
    BreakdownView: { path: "bag/BreakdownView", zindex: Hierarchy.TIPLAYER, componentName: "BreakdownView", tips: "分解栏" },
    CompositeBagView: { path: "bag/CompositeBagView", zindex: Hierarchy.TIPLAYER, componentName: "CompositeBagView", tips: "合成栏" },
    /*********************************************背包 end***********************************************************/

    /*********************************************角色 start***********************************************************/
    /*********************************************角色 end***********************************************************/

    /*********************************************每周任务 start***********************************************************/
    WeekTaskView: { path: "task/WeekTaskView", zindex: Hierarchy.POPUPLAYER, tips: "每周任务界面" },
    TaskAwardView: { path: "task/TaskAwardView", zindex: Hierarchy.POPUPLAYER, tips: "每周任务界面" },
    RightRewardView: { path: "task/RightRewardView", zindex: Hierarchy.POPUPLAYER, tips: "每周任务界面" },
    AchievementRewardView: { path: "task/AchievementRewardView", zindex: Hierarchy.POPUPLAYER, tips: "每周任务界面" },
    RightAchievementView: { path: "task/RightAchievementView", zindex: Hierarchy.POPUPLAYER, tips: "每周任务界面" },
    TaskView: { path: "task/TaskView", zindex: Hierarchy.POPUPLAYER, tips: "每周任务界面" },
    MainTaskView: { path: "task/MainTaskView", zindex: Hierarchy.POPUPLAYER, tips: "主线任务界面" },
    DailyTaskView: { path: "task/DailyTaskView", zindex: Hierarchy.POPUPLAYER, tips: "每日任务界面" },
    TaskAchievementView: { path: "task/TaskAchievementView", zindex: Hierarchy.POPUPLAYER, tips: "每周任务界面" },
    TaskTabView: { path: "task/TaskTabView", zindex: Hierarchy.POPUPLAYER, tips: "每周任务界面" },
    /*********************************************每周任务 End*************************************************************/

    MainNotifyView: { path: "map/MainNotifyView", componentName: "MainNotifyView", zindex: Hierarchy.POPUPLAYER, tips: "任务奖励界面" },
    MainRightActivity: { path: "map/MainRightActivity", componentName: "MainRightActivity", zindex: Hierarchy.TIPLAYER, tips: "主界面右侧活动" },
    /*********************************************收集 start***********************************************************/
    CollectView: { path: "collect/CollectView", zindex: Hierarchy.POPUPLAYER, tips: "成就徽章" },
    AchievementMedalsView: { path: "collect/AchievementMedalsView", zindex: Hierarchy.POPUPLAYER, tips: "成就徽章" },
    AchieveSelectView: { path: "collect/AchieveSelectView", zindex: Hierarchy.POPUPLAYER, tips: "徽章选择" },
    AchieveTabView: { path: "collect/AchieveTabView", zindex: Hierarchy.POPUPLAYER, tips: "tab选择" },
    AchieveThemeView: { path: "collect/ThemeView", zindex: Hierarchy.POPUPLAYER, tips: "主题选择" },
    MonsterCardView: { path: "collect/MonsterCardView", zindex: Hierarchy.POPUPLAYER, tips: "单词怪兽卡" },
    BuildingAtlasView: { path: "collect/BuildingAtlasView", zindex: Hierarchy.POPUPLAYER, tips: "建筑图鉴" },
    ClothingIllustratedView: { path: "collect/ClothingIllustratedView", zindex: Hierarchy.POPUPLAYER, tips: "服装图鉴" },
    /*********************************************收集 end***********************************************************/

    /*********************************************排行 start***********************************************************/
    RankView: { path: "rank/RankView", zindex: Hierarchy.POPUPLAYER, tips: "排行" },
    VocabularyRankingView: { path: "rank/VocabularyRankingView", zindex: Hierarchy.POPUPLAYER, tips: "词汇量排名" },
    KingdomRankingView: { path: "rank/KingdomRankingView", zindex: Hierarchy.POPUPLAYER, tips: "王国分排名" },
    CombatPowerRankingView: { path: "rank/CombatPowerRankingView", zindex: Hierarchy.POPUPLAYER, tips: "战力排名" },
    MyRank: { path: "rank/MyRank", zindex: Hierarchy.POPUPLAYER, tips: "我的排名" },
    /*********************************************排行 end***********************************************************/

    /*********************************************活动 start***********************************************************/
    ActivityView: { path: "activities/ActivityView", zindex: Hierarchy.POPUPLAYER, tips: "活动" },
    ActivityNewPeople: { path: "activities/ActivityNewPeople", zindex: Hierarchy.POPUPLAYER, tips: "新人豪礼" },
    WeekendCarouselView: { path: "activities/WeekendCarouselView", zindex: Hierarchy.POPUPLAYER, tips: "周末转盘" },
    Carouseltem: { path: "activities/Carouseltem", zindex: Hierarchy.POPUPLAYER, tips: "转盘元素" },
    /*********************************************活动 end***********************************************************/

    /*********************************************myword start***********************************************************/
    WordSearchView: { path: "myword/WordSearchView", zindex: Hierarchy.POPUPLAYER, tips: "查找单词详情弹窗" },
    SearchWorldView: { path: "myword/SearchWordView", zindex: Hierarchy.POPUPLAYER, tips: "查找单词弹窗" },
    WordPanel: { path: "myword/WordPanel", zindex: Hierarchy.POPUPLAYER, tips: "单词弹窗" },
    /*********************************************myword End*************************************************************/

    /*********************************************漫画阅读 start***********************************************************/
    ComicReadingView: { path: "comicReading/ComicReadingView", zindex: Hierarchy.POPUPLAYER, tips: "漫画阅读" },
    ComicLandView: { path: "comicReading/ComicLandView", zindex: Hierarchy.POPUPLAYER, tips: "漫画阅读" },
    /*********************************************漫画阅读 end***********************************************************/

    /*********************************************主题 start***********************************************************/
    SubjectView: { path: "theme/SubjectView", componentName: "SubjectView", zindex: Hierarchy.TIPLAYER, tips: "主题界面" },
    PracticeView: { path: "theme/PracticeView", componentName: "PracticeView", zindex: Hierarchy.POPUPLAYER, tips: "主题文章列表界面" },
    ArticleView: { path: "theme/ArticleView", componentName: "ArticleView", zindex: Hierarchy.POPUPLAYER, tips: "AI阅读文章列表界面" },
    ComicController: { path: "theme/ComicController", componentName: "ComicController", zindex: Hierarchy.POPUPLAYER, tips: "漫画" },
    ReadArticleView: { path: "theme/ReadArticleView", componentName: "ReadArticleView", zindex: Hierarchy.POPUPLAYER, tips: "读文章" },
    UnitExerciseView: { path: "theme/UnitExerciseView", componentName: "UnitExerciseView", zindex: Hierarchy.POPUPLAYER, tips: "跳级测试界面" },
    PracticRightView: { path: "theme/PracticRightView", componentName: "PracticRightView", zindex: Hierarchy.TIPLAYER, tips: "右侧练习" },
    /*********************************************主题 end***********************************************************/

}