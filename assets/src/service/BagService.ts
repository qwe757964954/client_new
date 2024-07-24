import { ItemData } from "../manager/DataMgr";
import { c2sBackpackItemSynthesis, c2sBreakdownBackpackItems } from "../models/BagModel";
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
    onBreakdownBackpackItems(data: any) {
        this.handleResponse(data, NetNotify.Classification_BreakdownBackpackItems);
    }
    onBackpackItemSynthesis(data: any) {
        this.handleResponse(data, NetNotify.Classification_BackpackItemSynthesis);
    }
}

export const BagServer = _BagService.getInstance();