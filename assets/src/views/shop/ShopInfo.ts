// 定义 CollectTabIds 枚举

import { ClothingType, EditType } from "../../manager/DataMgr";
import { User } from "../../models/User";
import { TabItemDataInfo, TabTypeIds, TaskTabIds, TaskTabInfo } from "../task/TaskInfo";


// 定义 ShopStoreSubTabInfos 数组
export const ShopStoreSubTabInfos: TabItemDataInfo[] = [
    { id: TabTypeIds.ShopHairstyle, title: "发型",imageUrl:"" },
    { id: TabTypeIds.ShopAccessories, title: "饰品",imageUrl:"" },
    { id: TabTypeIds.ShopTop, title: "上衣",imageUrl:"" },
    { id: TabTypeIds.ShopPants, title: "裤子",imageUrl:"" },
    { id: TabTypeIds.ShopShoes, title: "鞋子",imageUrl:"" },
    { id: TabTypeIds.ShopWing, title: "翅膀",imageUrl:"" },
    { id: TabTypeIds.ShopHat, title: "帽子",imageUrl:"" },
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


// 映射表，将 TabTypeIds 映射到 ClothingType
export const clothingTypeMapping: { [key in TabTypeIds]?: ClothingType } = {
    [TabTypeIds.ShopHairstyle]: ClothingType.toufa,
    [TabTypeIds.ShopAccessories]: ClothingType.shipin,
    [TabTypeIds.ShopTop]: ClothingType.shangyi,
    [TabTypeIds.ShopPants]: ClothingType.kuzi,
    [TabTypeIds.ShopShoes]: ClothingType.xiezi,
    [TabTypeIds.ShopWing]: ClothingType.chibang,
    [TabTypeIds.ShopHat]: ClothingType.maozi,
    [TabTypeIds.ShopFaceShape]: ClothingType.lian,
};


// 映射表，将 TabTypeIds 映射到 ClothingType
export const buildTypeMapping: { [key in TabTypeIds]?: EditType } = {
    [TabTypeIds.FunctionalBuilding]: EditType.Buiding,
    [TabTypeIds.LandmarkBuilding]: EditType.LandmarkBuiding,
    [TabTypeIds.Decoration]: EditType.Decoration,
    [TabTypeIds.ShopFlooring]: EditType.Land,
};


export interface ShopClothingInfo {
    type: ClothingType,
    userClothes: number
}

//  ShopClothingTypeMapping 映射表
export const ShopClothingTypeMapping: { [key in TabTypeIds]?: ShopClothingInfo } = {
    [TabTypeIds.ShopHairstyle]: { type: ClothingType.toufa, userClothes: User.userClothes.hair },
    [TabTypeIds.ShopAccessories]: { type: ClothingType.shipin, userClothes: User.userClothes.jewelry }, // 这里假设 Head 对应的是 jewelry
    [TabTypeIds.ShopTop]: { type: ClothingType.shangyi, userClothes: User.userClothes.coat },
    [TabTypeIds.ShopPants]: { type: ClothingType.kuzi, userClothes: User.userClothes.pants },
    [TabTypeIds.ShopShoes]: { type: ClothingType.xiezi, userClothes: User.userClothes.shoes },
    [TabTypeIds.ShopWing]: { type: ClothingType.chibang, userClothes: User.userClothes.wings },
    [TabTypeIds.ShopHat]: { type: ClothingType.maozi, userClothes: User.userClothes.hat },
    [TabTypeIds.ShopFaceShape]: { type: ClothingType.lian, userClothes: User.userClothes.face },
};


//背包物品分解
export interface BuyStoreInfo{
    ids:number[];
    nums:number[];
}