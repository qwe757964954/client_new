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
    Head = 1,
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
    price: [number, number];
}

export interface GameBagData {
    item_info: BagItemInfo[];
    backpack_item_info: BackpackItemInfo[];
    goods_item_info: GoodsItemInfo[];
}
