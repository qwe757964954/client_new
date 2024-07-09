// 定义 CollectTabIds 枚举

import { TabItemDataInfo, TabTypeIds, TaskTabIds, TaskTabInfo } from "../task/TaskInfo";
// 定义 ShopStoreSubTabInfos 数组
export const ShopStoreSubTabInfos: TabItemDataInfo[] = [
    { id: TabTypeIds.ShopHat, title: "帽子",imageUrl:"" },
    { id: TabTypeIds.ShopHairstyle, title: "发型",imageUrl:"" },
    { id: TabTypeIds.ShopTop, title: "上衣",imageUrl:"" },
    { id: TabTypeIds.ShopPants, title: "裤子",imageUrl:"" },
    { id: TabTypeIds.ShopShoes, title: "鞋子",imageUrl:"" },
    { id: TabTypeIds.ShopFaceShape, title: "脸型",imageUrl:"" }
];
// 定义 ShopBuildingTabInfos 数组
export const ShopBuildingTabInfos: TabItemDataInfo[] = [
    { id: TabTypeIds.BuildAll, title: "全部",imageUrl:"" },
    { id: TabTypeIds.FunctionalBuilding, title: "功能性建筑",imageUrl:"" },
    { id: TabTypeIds.LandmarkBuilding, title: "地标建筑",imageUrl:"" },
    { id: TabTypeIds.Decoration, title: "装饰",imageUrl:"" },
    { id: TabTypeIds.ShopFlooring, title: "地板",imageUrl:"" }
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