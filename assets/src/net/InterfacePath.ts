
export const InterfacePath = {
    /***********************************socket消息类型start********************************************/

    c2sAccountLogin: "1001",//账号密码登录
    c2sPhoneCodeLogin: "1002",//手机验证码登录
    c2sTokenLogin: "1004",//token登录
    c2sGetPhoneCode: "1008",//获取手机验证码

    c2sStaminaUpdate: "1301",//体力值更新

    c2sBuildingList: "2005",//建筑列表
    c2sBuildingCreate: "2006",//新建建筑
    c2sBuildingEdit: "2007",//建筑修改
    c2sBuildingEditBatch: "2006",//建筑批量操作
    c2sLandUpdate: "2007",//地块更新
    c2sSpeedWordsGet: "2008",//加速单词获取
    c2sBuildingInfoGet: "2009",//建筑信息获取
    c2sBuildingSell: "2010",//建筑出售
    c2sBuildingRecycle: "2011-",//建筑回收
    c2sBuildingBuilt: "2011",//建筑建造
    c2sBuildingBuiltSpeed: "2012",//建筑建造加速
    c2sBuildingUpgrade: "2013",//建筑升级
    c2sBuildingUpgradeSpeed: "2014",//建筑升级加速
    c2sBuildingBuiltReward: "2015",//建筑建造奖励
    c2sBuildingUpgradeReward: "2016",//建筑升级奖励
    c2sBuildingProduceAdd: "2021",//建筑生产队列添加
    c2sBuildingProduceDelete: "2022",//建筑生产队列移除
    c2sBuildingProduceGet: "2023",//建筑生产领取
    c2sBuildingProduceSpeed: "2024",//建筑生产加速
    c2sCloudUnlock: "2031",//乌云解锁
    c2sCloudUnlockGet: "2032",//乌云解锁领取
    c2sCloudUnlockSpeed: "2033",//乌云解锁加速

    s2cAccountLogout: "10001",//登录被顶号返回
    s2cItemUpdate: "10002",//物品更新
    /***********************************************宠物相关start********************************************/
    c2sPetInfo: "2101", //宠物信息
    c2sPetInteraction: "2102", //宠物互动
    c2sPetUpgrade: "2103", //宠物升级
    c2sPetGetReward: "2104", //宠物奖励领取
    /***********************************************宠物相关 end*********************************************/

    /***********************************以上是新消息********************************************/
    Account_Step: "Account.Step",
    Account_Info: "Account.Info",
    Account_Init: "Account.Init",
    Prop_MyList: "Prop.MyList",    // 我的道具列表
    Account_EditRealName: "Account.EditRealName",  // 修改名字
    Account_StudyWord: "Account.StudyWord",  // 学生通关单词

    //大冒险学习模式相关
    Island_Status: "3100",  // 大冒险岛屿状态
    Island_Progress: "3101",  // 大冒险岛屿进度
    WordGame_Words: "3102",  // 获取大冒险单词
    WordGame_Sentence: "3103",  // 获取单词句子
    Adventure_Result: "3104",  // 大冒险结果提交
    Adventure_Word: "3105", //大冒险单个单词详情
    Words_Group: "3106", //获取组合模式单词选项
    Adventure_LevelProgress: "3107", //大冒险当前关卡进度
    Classification_AdventureCollectWord: "3108", //单词大冒险收藏
    Progress_RewardGet: "3109", //岛屿进度宝箱领取
    BossLevel_Topic: "3110", //大冒险Boss关卡题目
    BossLevel_Submit: "3111", //大冒险Boss关卡题目提交
    WordGame_LevelRestart: "3114", //单词大冒险关卡重玩
    WordGame_UnitList: "3115", //单元列表
    WordGame_UnitWords: "3116", //单词大冒险单元单词
    WordGame_Subject: "3117", //大冒险主题信息
    Subject_ArticleList: "3118", //主题ai文章列表
    Article_ExercisesList: "3119", //文章题目列表
    GradeSkip_ExercisesList: "3120", //大冒险跳级题目列表
    GradeSkip_ExercisesSubmit: "3121", //跳级题目提交
    WordBossGame_Restart: "3122", //大冒险Boss关卡重玩
    Search_Word: "3300",//查询单词
    More_Word_Detail: "3301",//单词更多详情消息
    Total_Collect_Word: "3302", //总词收藏与取消收藏单词

    /***********************************************选择词书 begin*********************************************/
    Classification_BookStatus: "3011", //我的词书-列表
    Classification_PlanModify: "3017", //我的词书-修改计划
    Classification_BookDel: "3014", //我的词书-删除词书
    Classification_List: "3001", //获取分类汇总列表
    Classification_SchoolBook: "3002", //获取教材课本
    Classification_SchoolGrade: "3003", //教材课本-年级
    Classification_AddPlanBook: "3013",//添加书与计划
    Classification_BookPlanDetail: "3015",//书对应计划详情
    Classification_SchoolUnit: "Classification.SchoolUnit", //教材课本-年级-单元
    Classification_SchoolWord: "Classification.SchoolWord", //教材课本-年级-单元-词汇
    Classification_UnitListStatus: "3004", //书年级单元列表
    Classification_VocabularyWord: "3005", //教材单词分类词汇列表接口
    Classification_UnitStatus: "3009", //书年级单元学习情况列表
    Classification_UnitWordList: "Classification.UnitWordList", // 单元单词列表
    Classification_GameResultUp: "Classification.GameResultUp", //结果上报
    Classification_Word: "3021", //单个单词详情
    Classification_ChangeTextbook: "3016", //切换教材
    Classification_CheckWord: "3008", //词表单词列表
    Classification_CollectWord: "3007", //教材单词收藏与移除
    Classification_BreakThroughStartAgain: "3012", //教材单词闯关重新开始
    Classification_WordGroup: "3023", //教材单词组合模式选项
    Classification_GameSubmit: "3024", //单词提交
    Classification_TypeNameStatus: "Classification.TypeNameStatus", //大分类信息
    Classification_BookAwardList: "3006", // 教材单词课本奖励列表
    Classification_CurrentBook: "3019", // 当前词书信息
    Classification_ReportResult: "Classification.ReportResult", // 上报消息
    Classification_RecBookAward: "Classification.RecBookAward", //教材单词领取课本单词奖励
    Classification_SoundCommit: "Classification.SoundCommit", //教材单词语音评测上报
    Classification_WordSentence: "Classification.WordSentence", //通过单词获取句子
    NewWord_List: "NewWord.List", //我的生词列表
    NewWord_Add: "NewWord.Add", //添加到我的生词本
    NewWord_Del: "NewWord.Del", //移除生词本
    SearchWord_DelSingle: "SearchWord.DelSingle", //删除一个查找单词历史
    SearchWord_DelAll: "SearchWord.DelAll", //删除所有查找单词历史
    /***********************************************选择词书 end*********************************************/

    /***********************************************复习规划start*********************************************/
    c2sReviewPlan: "3200", //复习规划
    c2sReviewPlanList: "3201", //复习规划列表
    c2sReviewPlanStatus: "3202", //复习规划状态与复习单词列表
    c2sReviewPlanUpdate: "3203", //复习规划更新
    c2sReviewPlanSubmit: "3204", //复习规划提交
    c2sReviewPlanDraw: "3205", //复习规划抽奖
    c2sReviewPlanOption: "3206", //复习规划选项
    c2sReviewPlanLongTimeWords: "3207", //复习规划长时间未复习单词
    c2sReviewPlanLongTimeWordSubmit: "3208", //复习规划长时间未复习单词提交
    /***********************************************复习规划 end*********************************************/

    /***********************************************主线任务进度信息start*********************************************/
    Classification_UserMainTask: "5001", //获取用户主线任务进度信息
    Classification_UserWeekTask: "5003", //获取用户每周任务进度信息
    Classification_GetMainTaskReward: "5004", //领取主线任务奖励
    Classification_GetWeekTaskReward: "5006", //领取周任务奖励
    Classification_GetBoxTaskReward: "5008", //领取宝箱周任务奖励
    Classification_UserWeekTaskChange: "251", //周任务进度发生变更
    Classification_UserMainTaskChange: "252", //主线任务进度发生变更
    Classification_CompleteWeekTask: "253", //完成每周任务
    Classification_CompleteMainTask: "254", //完成主线任务
    Classification_CompleteBoxWeekTask: "255", //达成每周任务宝箱
    /***********************************************主线任务进度信息 end*********************************************/

    /***********************************************设置相关start*********************************************/
    Classification_UserPlayerDetail: "1011", //用户信息详情消息
    Classification_UserPlayerModify: "1012", //用户信息修改
    Classification_UserPasswordModify: "1013", //用户密码修改
    /***********************************************设置相关 end*********************************************/


    /***********************************************好友相关start*********************************************/
    Classification_UserFriendList: "1101", //用户好友列表消息
    Classification_UserFriendAdd: "1102", //用户好友申请添加消息
    Classification_UserFriendSearch: "1103", //用户id搜索接口
    Classification_UserFriendApplyList: "1104", //用户好友申请列表消息
    Classification_UserFriendApplyModify: "1105", //用户好友申请修改拒绝或同意
    Classification_UserDelFriendMessage: "1106", //用户好友删除好友消息
    Classification_UserFriendMessageList: "1107", //获取用户好友消息列表
    Classification_UserSendMessageFriend: "1108", //用户给好友发送消息
    Classification_UserMessageStatusUpdate: "1109", //用户与朋友消息更新为已读
    Classification_UserRecommendFriendList: "1110", //好友推荐列表消息
    Classification_UserSystemMailList: "1201", //用户系统邮件列表
    Classification_UserSystemMailDetail: "1202", //用户系统邮件详情消息
    Classification_UserSystemAwardGet: "1203", //用户系统邮件奖励领取
    /***********************************************好友相关 end*********************************************/
    /***********************************************公告start*********************************************/
    Classification_Announcement: "1351", //用户公告列表获取
    /***********************************************公告 end*********************************************/
    /***********************************************背包相关start*********************************************/
    Classification_BreakdownBackpackItems: "1401", //背包物品分解
    Classification_BackpackItemSynthesis: "1402", //背包物品合成
    Classification_ShopItemBuy: "1403", //商城商品购买
    /***********************************************背包相关 end*********************************************/

    /***********************************************运营活动相关start*********************************************/
    Classification_GetActivityInfo: "1411", //获取运营活动信息
    Classification_SignRewardDraw: "1412", //签到奖励领取
    Classification_WeekendCarouselDraw: "1413", //周末大转盘抽奖
    /***********************************************运营活动相关 end*********************************************/

    /************************************socket消息类型end*********************************************/
}