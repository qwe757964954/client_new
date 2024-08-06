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

