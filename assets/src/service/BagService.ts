import { ItemData } from "../manager/DataMgr";
import { c2sBackpackItemSynthesis, c2sBreakdownBackpackItems, c2sGetPlayerClothing, c2sShopItemBuy, c2sUpdatePlayerClothing, DressInfoItem } from "../models/BagModel";
import { User } from "../models/User";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import { NetNotify } from "../net/NetNotify";
import { BaseControll } from "../script/BaseControll";
import { BackpackItemInfo } from "../views/bag/BagInfo";


export default class _BagService extends BaseControll {
    private static _instance: _BagService;
    public static getInstance(): _BagService {
        if (!this._instance || this._instance == null) {
            this._instance = new _BagService("_BagService");
        }
        return this._instance;
    }
    constructor(name: string) {
        super(name);
    }
    /** 初始化模块事件 */
    protected onInitModuleEvent() {
        this.addModelListeners([
            [InterfacePath.Classification_BreakdownBackpackItems, this.onBreakdownBackpackItems],
            [InterfacePath.Classification_BackpackItemSynthesis, this.onBackpackItemSynthesis],
            [InterfacePath.Classification_ShopItemBuy, this.onShopItemBuy],
            [InterfacePath.Classification_GetPlayerClothing, this.onGetPlayerClothing],
            [InterfacePath.Classification_UpdatePlayerClothing, this.onUpdatePlayerClothing],
        ]);
    }

    reqBreakdownBackpackItems(data:ItemData){
        let param: c2sBreakdownBackpackItems = new c2sBreakdownBackpackItems();
        param.id = data.id;
        param.num = data.num;
        NetMgr.sendMsg(param);
    }

    reqBackpackItemSynthesis(data:BackpackItemInfo){
        let param: c2sBackpackItemSynthesis = new c2sBackpackItemSynthesis();
        param.id = data.id;
        NetMgr.sendMsg(param);
    }
    reqShopItemBuy(ids:number[],nums:number[]){
        let param: c2sShopItemBuy = new c2sShopItemBuy();
        param.ids = ids;
        param.nums = nums;
        NetMgr.sendMsg(param);
    }

    reqGetPlayerClothing(){
        let param: c2sGetPlayerClothing = new c2sGetPlayerClothing();
        NetMgr.sendMsg(param);
    }
    reqUpdatePlayerClothing(data:DressInfoItem){
        const param = new c2sUpdatePlayerClothing(data);
        NetMgr.sendMsg(param);
    }
    onGetPlayerClothing(data:any){
        let dress_info = data.dress_info;
        // 使用 setData 更新 User.userClothes
        User.userClothes.setAssignData(dress_info);
        this.handleResponse(data, NetNotify.Classification_GetPlayerClothing);
    }
    onUpdatePlayerClothing(data:any){
        this.handleResponse(data, NetNotify.Classification_UpdatePlayerClothing);
    }
    onShopItemBuy(data: any) {
        this.handleResponse(data, NetNotify.Classification_ShopItemBuy);
    }

    onBreakdownBackpackItems(data: any) {
        this.handleResponse(data, NetNotify.Classification_BreakdownBackpackItems);
    }
    onBackpackItemSynthesis(data: any) {
        this.handleResponse(data, NetNotify.Classification_BackpackItemSynthesis);
    }
}

export const BagServer = _BagService.getInstance();