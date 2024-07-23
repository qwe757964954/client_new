import { ItemID } from "../export/ItemConfig";
import { ToolUtil } from "../util/ToolUtil";

//事件类型
export const EventType = {
    Socket_Connect: "SocketConnect",//socket连接成功
    Socket_Dis: "SocketDis",//socket断开
    Socket_Close: "SocketClose",//socket关闭
    Socket_ReconnectFail: "SocketReconnectFail",//socket重连失败
    Login_Success: "Login_Success",//登录成功

    Get_Record_Result: "GetRecordResult",//获取录音结果

    Map_Scale: "MapScale",//地图缩放
    BuildingBtnView_Close: "BuildingBtnViewClose",//建筑按钮界面关闭
    MapStatus_Change: "MapStatusChange",//地图状态改变
    BuidingModel_Remove: "BuildingModelRemove",//建筑模型移除
    Building_Need_Sort: "BuildingNeedSort",//建筑需要排序
    Role_Need_Move: "RoleNeedMove",//角色需要移动
    Role_Need_Sort: "RoleNeedSort",//角色需要排序
    GridRect_Need_Draw: "GridRectNeedDraw",//格子需要绘制
    EditUIView_Refresh: "EditUIViewRefresh",//编辑界面刷新
    New_Building: "NewBuilding",//新建建筑
    Building_Flipx: "BuildingFlipx",//建筑翻转
    Building_Save: "BuildingSave",//建筑保存
    Building_Sell: "BuildingSell",//建筑出售
    Building_Recycle: "BuildingRecycle",//建筑回收
    Building_RecycleEx: "Building_RecycleEx",//建筑回收
    Building_Step_Update: "BuildingStepUpdate",//建筑步数更新
    Building_Shop_Buy: "BuildingShopBuy",//建筑商店购买

    Stamina_Update: "StaminaUpdate",//体力更新
    Coin_Update: "CoinUpdate",//金币更新
    Diamond_Update: "DiamondUpdate",//钻石更新
    Amethyst_Update: "AmethystUpdate",//紫晶石更新
    Ticket_Update: "TicketUpdate",//奖券更新
    Mood_Score_Update: "MoodUpdate",//心情分更新
    Item_Update: "ItemUpdate_{0}",//物品更新（注意：参数为物品类型）

    NickName_Update: "NickNameUpdate",//昵称更新
    RoleID_Update: "RoleIDUpdate",//角色ID更新

    Stamina_Timer_Update: "StaminaTimerUpdate",//体力计时器更新
    Stamina_Timeout: "Stamina_Timeout",//体力计时器超时

    Study_Page_Switching: "Study_Page_Switching",//学习页面切换

    Expand_the_level_page: "Expand_the_level_page",//拓展关卡

    Enter_Island_Level: "Enter_Island_Level",  //进入大冒险关卡
    Enter_Level_Test: "Enter_Level_Test",  //进入关卡测试
    Exit_World_Island: "Exit_World_Island",  //退出岛屿界面
    Enter_Boss_Level: "Enter_Boss_Level",  //进入Boss关卡

    Exit_Island_Level: "Exit_Island_Level",  //退出大冒险关卡

    Challenge_ReportResult: "Challenge_ReportResult",  //挑战上报结果


    Goto_Textbook_Level: "Goto_Textbook_Level",  //进入单词大冒险
    Goto_Textbook_Next_Level: "Goto_Textbook_Next_Level",  //进入单词大冒险下一关
    Goto_Break_Through_Textbook_Next_Level: "Goto_Break_Through_Textbook_Next_Level",
    Goto_Exam_Mode: "Goto_Exam_Mode", //进入考试模式
    //大冒险学习模式相关
    WordGame_Words: "WordGame_Words",  // 获取单词数据
    Classification_AdventureCollectWord: "Classification_AdventureCollectWord",  // 获取单词数据
    Sys_Ani_Play: "Sys_Ani_Play",//播放动画
    Sys_Ani_Stop: "Sys_Ani_Stop",//停止动画
    Classification_Word: "Classification_Word",//单个单词详情
    MapPoint_Click: "MapPoint_Click", //点击了地图点
    Update_MapPoint: "Update_MapPoint",//更新地图点数据
    WordGame_Unit_Click: "WordGame_Unit_Click", //大冒险点击单元
    Subject_ItemChoice: "Subject_ItemChoice",//主题题目选择

    /**选择词书模块相关事件 */
    Select_Word_Plan: "Select_Word_Plan",//选择计划
    Update_Textbook_Challenge: "Update_Textbook_Challenge",//选择计划


    /**查找单词相关事件 */
    Search_Word: "SearchWord", //查找单词
    Search_Word_Item: "SearchWordItem", //查找某个单词项
    Search_Word_Del_OneWord: "DelOneSearchWord",//删除某个查找项
    Search_Word_Edt_Began: "editing-did-began", //输入框编辑开始

    /**学习计划相关事件 */
    StudyRecord_MonthPrice: "Account_MonthPrize", //每个月的得分情况
    StudyRecord_ClickDateRecord: "StudyRecord_ClickDateRecord", //点击列表里的某一天
    StudyRecord_DayPrizeWord: "StudyRecord_DayPrizeWord", //某一天学习的所有单词

    /**单词卡相关 */
    CardBookView_CardShow: "CardBookView_CardShow",
    CardBookView_TypeSelect: "CardBookView_TypeSelect",
    CardBookView_CardClick: "CardBookView_CardClick",
    CardBookView_CardWord: "CardBookView_CardWord",


    /**新人豪礼相关 */
    NewBieGift_GetDayGift: "NewBieGift_GetDayGift", //获取当天的礼物

    /**跑马灯和公告相关 */
    Notice_ShowNotice: "Notice_ShowNotice", //显示公告

    /**世界BOSS */
    Challenge_WorldBoss: "Challenge_WorldBoss", //挑战世界boss

    /**成就相关 */
    Achieve_GetAllInfo: "Achieve_GetAllInfo", //获取成就各项数据列表
    Achieve_SelectMedal: "Achieve_SelectMedal", //选择勋章
    Achieve_GetAward: "Achieve_GetAward", //领取奖励

    /**好友社交相关 */
    // Friend_RecommendList: "Friend_RecommendList", //获取推荐好友列表
    // Friend_ApplyList: "Friend_ApplyList", //获取好友申请列表
    // Friend_SearchFriend: "Friend_SearchFriend",   //查找好友
    // Friend_ClickFriendList: "Friend_ClickFriendList", // 点击好友列表
    // Friend_ClickEmailList: "Friend_ClickEmailList",   // 点击邮件列表
    // Friend_AddFriend: "Friend_AddFriend", //添加好友
    // Friend_ApplyStatus: "Friend_ApplyStatus", //同意/拒绝好友申请请求
    // Friend_SysMsg_List: "Friend_SysMsg_List", // 邮件列表
    // Friend_RecvAward: "Friend_RecvAward", // 获得邮件附件奖励
    // Friend_DelFriend: "Friend_DelFriend", // 删除好友
    //下面是好友聊天相关
    Friend_ClickChatFriendList: "Friend_ClickChatFriendList", //聊天框中好友点击某个朋友开始聊天
    Friend_MsgList: "MyFriend_MsgList", //获取和某个好友的聊天消息列表
    Friend_SelectEmotion: "Friend_SelectEmotion", //点击一个表情
    Friend_MsgSend: "Friend_MsgSend", //向好友发送一个消息
    Friend_RecMessage: "MyFriend_RecMessage", //收到一个好友消息
    //背包物品相关
    Bag_PropList: "Bag_PropList", //获取背包物品

    //商店相关
    Shop_GoodsList: "Shop_GoodsList", //获取商店商品列表

    Sub_Tab_Item_Click: "Sub_Tab_Item_Click",  //成就挑战子item点击
    Challenge_Week_Task_Reward: "Challenge_Week_Task_Reward",  //领取周任务奖励
    Challenge_Main_Task_Reward: "Challenge_Main_Task_Reward",  //领取主线任务奖励
    Box_Challenge_Reward: "Box_Challenge_Reward",  //领取宝箱奖励

    Friend_Talk_Event: "Friend_Talk_Event",
    Show_TextBook_Monster: "Show_TextBook_Monster",
}

export function itemEventKey(id: ItemID) {
    return ToolUtil.replace(EventType.Item_Update, id);
}