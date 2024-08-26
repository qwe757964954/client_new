import { ClothingType } from "../../manager/DataMgr";
import { DressInfoItem } from "../../models/BagModel";

// 定义枚举
export enum BagTabIds {
    All = 1,
    DressUp,
    Consumables,
    Others
}

// 使用枚举值来定义 BagTabNames 数组
export const BagTabNames = [
    { id: BagTabIds.All, title: "全部" },
    { id: BagTabIds.DressUp, title: "装扮" },
    { id: BagTabIds.Consumables, title: "消耗品" },
    { id: BagTabIds.Others, title: "其他" }
];

export enum BagOperationIds {
    Outfit = 1,
    UnOutfit,
    Disassemble,
    Combine
}

export enum BagOperationType {
    Orange,
    Gray
} 


export interface BagOperationData {
    id: BagOperationIds;
    title: string;
    btnType: BagOperationType;
}

// 使用枚举值来定义 BagTabNames 数组
export const BagOperationNames:BagOperationData[] = [
    { id: BagOperationIds.Outfit, title: "穿戴",btnType: BagOperationType.Orange },
    { id: BagOperationIds.UnOutfit, title: "卸下",btnType: BagOperationType.Gray },
    { id: BagOperationIds.Disassemble, title: "分解",btnType: BagOperationType.Orange },
    { id: BagOperationIds.Combine, title: "合成",btnType: BagOperationType.Gray }
];

// 定义枚举
export enum BagGressItemIds {
    Face =1,
    Hair,
    Head,
    UpperBody,
    Hat,
    Pants,
    Wings,
    Shoes
}

// 定义接口
export interface BagGressItem {
    id: BagGressItemIds;
    title: string;
    spriteFrame: string;
}
// 使用接口来定义 BagGressItems 数组
export const BagGressItems: BagGressItem[] = [
    { id: BagGressItemIds.Face, title: "脸部", spriteFrame: "Bag/icon_face/spriteFrame" },
    { id: BagGressItemIds.Hair, title: "头发", spriteFrame: "Bag/icon_hair_boy/spriteFrame" },
    { id: BagGressItemIds.Head, title: "头部", spriteFrame: "Bag/icon_hat/spriteFrame" },
    { id: BagGressItemIds.UpperBody, title: "上身", spriteFrame: "Bag/icon_clothes/spriteFrame" },
    { id: BagGressItemIds.Hat, title: "帽子", spriteFrame: "Bag/icon_ring/spriteFrame" },
    { id: BagGressItemIds.Pants, title: "裤子", spriteFrame: "Bag/icon_trousers/spriteFrame" },
    { id: BagGressItemIds.Wings, title: "翅膀", spriteFrame: "Bag/icon_wing/spriteFrame" },
    { id: BagGressItemIds.Shoes, title: "鞋子", spriteFrame: "Bag/icon_arms/spriteFrame" }
];

export enum BagItemType {
    Costume = 1,
    Consumable = 2,
    Other = 3
}


export interface BagItemInfo {
    id: number;
    name: string;
    png: string;
    frame: string;
}

export interface BackpackItemInfo {
    id: number;
    name: string;
    type: number;
    merge_item: number[];
    decompose_item: number[];
}

export interface GoodsItemInfo {
    id: number;
    name: string;
    suit_id?: number;
    suit_name?: string;
    price: [number, number];
}

export interface CothingSuitInfo {
    suit_id: number;
    suit_title: string;
    items: GoodsItemInfo[];
}

export interface GameBagData {
    item_info: BagItemInfo[];
    backpack_item_info: BackpackItemInfo[];
    goods_item_info: GoodsItemInfo[];
}


// BagGressType 类型定义
type BagGressType = {
    id: ClothingType;
    key: keyof DressInfoItem;
};

// 修正 BagGressTypeMap 中的 key 值
export const BagGressTypeMap: BagGressType[] = [
    { id: ClothingType.shipin, key: "jewelry" },
    { id: ClothingType.shangyi, key: "coat" },
    { id: ClothingType.kuzi, key: "pants" },
    { id: ClothingType.xiezi, key: "shoes" },
    { id: ClothingType.chibang, key: "wings" },
    { id: ClothingType.maozi, key: "hat" },
    { id: ClothingType.toufa, key: "hair" },
    { id: ClothingType.lian, key: "face" }
];


export enum ActionType {
    Idle = 1,      // 待机
    Wave = 2,      // 招手
    Walk = 3,      // 走路
    Run = 4,       // 跑步
    Jump = 5,      // 跳跃
    Die = 6        // 死亡
}
// 定义动作的数据结构
export interface ActionModel {
    type: ActionType;
    title: string;
}

// 使用定义的动作类型和标题创建一个数组
export const PlayerActions: ActionModel[] = [
    { type: ActionType.Idle, title: "待机" },
    { type: ActionType.Wave, title: "招手" },
    { type: ActionType.Walk, title: "走路" },
    { type: ActionType.Run, title: "跑步" },
    { type: ActionType.Jump, title: "跳跃" },
    { type: ActionType.Die, title: "死亡" }
];

