
export const InterfacePath = {
    /***********************************socket消息类型start********************************************/

    c2sAccountLogin: "1001",//账号密码登录
    c2sTokenLogin: "1004",//token登录
    c2sBuildingList: "2005",//建筑列表
    c2sBuildingCreate: "2006",//新建建筑
    c2sBuildingEdit: "2007",//建筑修改
    c2sLandUpdate: "2008",//地块更新
    c2sBuildingUpgrade: "2009",//建筑升级
    c2sBuildingSell: "2010",//建筑出售
    c2sBuildingRecycle: "2011",//建筑回收
    c2sBuildingProduceAdd: "2012",//建筑生产队列添加
    c2sBuildingProduceDelete: "2013",//建筑生产队列移除
    c2sBuildingProduceGet: "2014",//建筑生产领取
    c2sCloudUnlock: "2015",//乌云解锁
    c2sCloudUnlockGet: "2016",//乌云解锁领取

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
    BossLevel_Topic: "3110", //大冒险Boss关卡题目
    BossLevel_Submit: "3111", //大冒险Boss关卡题目提交
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
    /************************************socket消息类型end*********************************************/
}