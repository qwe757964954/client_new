import { InterfacePath } from "../net/InterfacePath";

//背包物品分解
export class c2sBreakdownBackpackItems{
    command_id: string = InterfacePath.Classification_BreakdownBackpackItems;
    id:number;
    num:number;
}

//背包物品分解
export class c2sShopItemBuy{
    command_id: string = InterfacePath.Classification_ShopItemBuy;
    ids:number[];
    nums:number[];
}

//背包物品合成
export class c2sBackpackItemSynthesis{
    command_id: string = InterfacePath.Classification_BackpackItemSynthesis;
    id:number;
}

//获取人物装饰信息
export class c2sGetPlayerClothing{
    command_id: string = InterfacePath.Classification_GetPlayerClothing;
}
export interface DressInfoItem{
    jewelry?:number;
    coat?:number;
    pants?:number;
    shoes?:number;
    wings?:number;
    hat?:number;
    face?:number;
    hair?:number;
}

//更新人物装饰信息
export class c2sUpdatePlayerClothing{
    command_id: string = InterfacePath.Classification_UpdatePlayerClothing;
    dress_info:DressInfoItem;
    constructor(data: DressInfoItem) {
        // this.command_id = InterfacePath.Classification_UpdatePlayerClothing;
        this.dress_info = data;
    }
}

