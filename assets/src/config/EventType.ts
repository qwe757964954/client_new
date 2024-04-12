//事件类型
export const EventType = {
    Socket_Dis: "SocketDis",//socket断开
    /***********************************socket消息类型start********************************************/
    Account_Step: "Account.Step",
    Account_Info: "Account.Info",
    Account_Init: "Account.Init",
    Prop_MyList : "Prop.MyList",    // 我的道具列表
    /************************************socket消息类型end*********************************************/

    Map_Scale: "MapScale",//地图缩放
    BuildingBtnView_Close: "BuildingBtnViewClose",//建筑按钮界面关闭
    MapStatus_Change: "MapStatusChange",//地图状态改变
    BuidingModel_Remove: "BuildingModelRemove",//建筑模型移除

    Energy_Update: "EnergyUpdate",//体力更新
    Coin_Update: "CoinUpdate",//金币更新
    Diamond_Update: "DiamondUpdate",//钻石更新

    study_page_switching: "study_page_switching",//学习页面切换

    Expand_the_level_page: "Expand_the_level_page",//拓展关卡
}