import { AchevementRewardIds, AchevementRewardInfo, TaskTabIds, TaskTabInfo } from "../task/TaskInfo";

// 定义 CollectTabIds 枚举
// 定义 AchevementRewardInfos 数组
export const BuildingSubTabInfos: AchevementRewardInfo[] = [
    { id: AchevementRewardIds.All, title: "全部",imageUrl:"" },
    { id: AchevementRewardIds.Functional, title: "功能建筑",imageUrl:"" },
    { id: AchevementRewardIds.Landmark, title: "地标建筑",imageUrl:"" },
    { id: AchevementRewardIds.Decorative, title: "装饰建筑",imageUrl:"" },
    { id: AchevementRewardIds.Flooring, title: "地板",imageUrl:"" }
];
// 定义 Clothing Illustrated 数组
export const ClothingIllustratedTabInfos: AchevementRewardInfo[] = [
    { id: AchevementRewardIds.AllClothing, title: "全部",imageUrl:"" },
    { id: AchevementRewardIds.Hairstyle, title: "发型",imageUrl:"" },
    { id: AchevementRewardIds.Hat, title: "帽子",imageUrl:"" },
    { id: AchevementRewardIds.Jacket, title: "上衣",imageUrl:"" }
];

// 定义 CollectTabInfos 数组
export const CollectTabInfos: TaskTabInfo[] = [
    {
        id: TaskTabIds.AchievementMedals,
        title: "成就勋章",
        subTabItems: []
    },
    {
        id: TaskTabIds.WordMonsterCards,
        title: "单词怪兽卡",
        subTabItems: []
    },
    {
        id: TaskTabIds.BuildingAtlas,
        title: "建筑图鉴",
        subTabItems: BuildingSubTabInfos
    },
    {
        id: TaskTabIds.ClothingAtlas,
        title: "服装图鉴",
        subTabItems: ClothingIllustratedTabInfos
    }
];

// 定义 MonsterCardTabIds 枚举
export enum MonsterCardTabIds {
    AllLevels = 1, // 所有等级
    SLevel,        // S级
    ALevel,        // A级
    BLevel,        // B级
    CLevel         // C级
}

// 定义 MonsterCardTabIds 枚举
export enum BuildingAtlasTabIds {
    AllLevels = 1, // 全部等级
    ALevel,        // A级
    BLevel,        // B级
    CLevel,        // C级
}

// 定义 TaskTabInfo 接口
export interface MonsterCardTabInfo {
    id: MonsterCardTabIds;
    title: string;
}

// 定义 MonsterCardTabInfos 数组
export const MonsterCardTabInfos: MonsterCardTabInfo[] = [
    {
        id: MonsterCardTabIds.AllLevels,
        title: "所有等级",
    },
    {
        id: MonsterCardTabIds.SLevel,
        title: "S级",
    },
    {
        id: MonsterCardTabIds.ALevel,
        title: "A级",
    },
    {
        id: MonsterCardTabIds.BLevel,
        title: "B级",
    },
    {
        id: MonsterCardTabIds.CLevel,
        title: "C级",
    }
];

// 定义 MonsterCardTabInfos 数组
export const BuildingAtlasTabInfos: MonsterCardTabInfo[] = [
    {
        id: MonsterCardTabIds.AllLevels,
        title: "所有等级",
    },
    {
        id: MonsterCardTabIds.ALevel,
        title: "等级A",
    },
    {
        id: MonsterCardTabIds.BLevel,
        title: "等级B",
    },
    {
        id: MonsterCardTabIds.CLevel,
        title: "等级C",
    },
];
