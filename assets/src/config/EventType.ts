//事件类型
export const EventType = {
    Socket_Connect: "SocketConnect",//socket连接成功
    Socket_Dis: "SocketDis",//socket断开
    Socket_Close: "SocketClose",//socket关闭
    Socket_ReconnectFail: "SocketReconnectFail",//socket重连失败

    Get_Record_Result: "GetRecordResult",//获取录音结果

    Map_Scale: "MapScale",//地图缩放
    BuildingBtnView_Close: "BuildingBtnViewClose",//建筑按钮界面关闭
    MapStatus_Change: "MapStatusChange",//地图状态改变
    BuidingModel_Remove: "BuildingModelRemove",//建筑模型移除
    Building_Need_Sort: "BuildingNeedSort",//建筑需要排序
    Role_Need_Move: "RoleNeedMove",//角色需要移动
    Role_Need_Sort: "RoleNeedSort",//角色需要排序
    GridRect_Need_Draw: "GridRectNeedDraw",//格子需要绘制

    Stamina_Update: "StaminaUpdate",//体力更新
    Coin_Update: "CoinUpdate",//金币更新
    Diamond_Update: "DiamondUpdate",//钻石更新
    Amethyst_Update: "AmethystUpdate",//紫晶石更新

    Study_Page_Switching: "Study_Page_Switching",//学习页面切换

    Expand_the_level_page: "Expand_the_level_page",//拓展关卡

    Enter_Island_Level: "Enter_Island_Level",  //进入大冒险关卡
    Exit_World_Island: "Exit_World_Island",  //退出岛屿界面

    //大冒险学习模式相关
    WordGame_Words: "WordGame_Words",  // 获取单词数据
    Sys_Ani_Play: "Sys_Ani_Play",//播放动画
    Sys_Ani_Stop: "Sys_Ani_Stop",//停止动画
    Classification_Word: "Classification_Word",//单个单词详情
    MapPoint_Click: "MapPoint_Click", //点击了地图点

    /**选择词书模块相关事件 */
    Select_Word_Plan: "Select_Word_Plan",//选择计划
}