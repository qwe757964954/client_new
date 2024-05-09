
export const InterfacePath = {
    /***********************************socket消息类型start********************************************/

    c2sAccountLogin: "1001",//账号密码登录
    c2sBuildingList: "2005",//建筑列表
    c2sBuildingCreate: "2006",//新建建筑
    c2sBuildingEdit: "2007",//建筑修改
    c2sLandUpdate: "2008",//地块更新

    s2cAccountLogout: "10001",//登录被顶号返回

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
    Adventure_Result: "3104",  // 大冒险结果提交
    /***********************************************选择词书 begin*********************************************/
    Classification_BookStatus: "3011", //我的词书-列表
    Classification_BookAdd: "3013", //我的词书-添加词书
    Classification_PlanAdd: "3016", //我的词书-添加计划
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
    Classification_UnitStatus: "3009", //书年级单元学习情况列表
    Classification_UnitWordList: "Classification.UnitWordList", // 单元单词列表
    Classification_GameResultUp: "Classification.GameResultUp", //结果上报
    Classification_Word: "Classification.Word", //单个单词详情
    Classification_GameSubmit: "Classification.GameSubmit", //单个单词学习提交
    Classification_TypeNameStatus: "Classification.TypeNameStatus", //大分类信息
    Classification_BookAwardList: "3006", // 教材单词课本奖励列表
    Classification_CurrentBook: "3019", // 当前词书信息
    Classification_ReportResult: "3023", // 上报消息
    Classification_RecBookAward: "Classification.RecBookAward", //教材单词领取课本单词奖励
    Classification_SoundCommit: "Classification.SoundCommit", //教材单词语音评测上报
    Classification_WordSentence: "Classification.WordSentence", //通过单词获取句子
    NewWord_List: "NewWord.List", //我的生词列表
    NewWord_Add: "NewWord.Add", //添加到我的生词本
    NewWord_Del: "NewWord.Del", //移除生词本
    SearchWord_DelSingle: "SearchWord.DelSingle", //删除一个查找单词历史
    SearchWord_DelAll: "SearchWord.DelAll", //删除所有查找单词历史
    /***********************************************选择词书 end*********************************************/
    /************************************socket消息类型end*********************************************/
}