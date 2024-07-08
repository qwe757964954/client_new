// 定义 CollectTabIds 枚举

import { AchevementRewardIds, AchevementRewardInfo, TaskTabIds, TaskTabInfo } from "../task/TaskInfo";
// 定义 ShopStoreSubTabInfos 数组
export const ShopStoreSubTabInfos: AchevementRewardInfo[] = [
    { id: AchevementRewardIds.ShopHat, title: "帽子",imageUrl:"" },
    { id: AchevementRewardIds.ShopHairstyle, title: "发型",imageUrl:"" },
    { id: AchevementRewardIds.ShopTop, title: "上衣",imageUrl:"" },
    { id: AchevementRewardIds.ShopPants, title: "裤子",imageUrl:"" },
    { id: AchevementRewardIds.ShopShoes, title: "鞋子",imageUrl:"" },
    { id: AchevementRewardIds.ShopFaceShape, title: "脸型",imageUrl:"" }
];
// 定义 ShopBuildingTabInfos 数组
export const ShopBuildingTabInfos: AchevementRewardInfo[] = [
    { id: AchevementRewardIds.FunctionalBuilding, title: "功能性建筑",imageUrl:"" },
    { id: AchevementRewardIds.LandmarkBuilding, title: "地标建筑",imageUrl:"" },
    { id: AchevementRewardIds.Decoration, title: "装饰",imageUrl:"" },
    { id: AchevementRewardIds.ShopFlooring, title: "地板",imageUrl:"" }
];


// 定义 ShopTabInfos 数组
export const ShopTabInfos: TaskTabInfo[] = [
    {
        id: TaskTabIds.ImageStore,
        title: "形象商店",
        subTabItems: ShopStoreSubTabInfos
    },
    {
        id: TaskTabIds.DebrisArea,
        title: "碎片区",
        subTabItems: []
    },
    {
        id: TaskTabIds.BuildingShop,
        title: "建筑商店",
        subTabItems: ShopBuildingTabInfos
    },
    {
        id: TaskTabIds.Decoration,
        title: "装饰类",
        subTabItems: []
    }
];