import { c2sGetActivityInfo, c2sSignRewardDraw, c2sWeekendCarouselDraw } from "../models/ActivityModel";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import { NetNotify } from "../net/NetNotify";
import { BaseControll } from "../script/BaseControll";


export default class _ActivityService extends BaseControll {
    private static _instance: _ActivityService;
    public static getInstance(): _ActivityService {
        if (!this._instance || this._instance == null) {
            this._instance = new _ActivityService("_ActivityService");
        }
        return this._instance;
    }
    constructor(name: string) {
        super(name);
    }

    /** 初始化模块事件 */
    protected onInitModuleEvent() {
        this.addModelListeners([
            [InterfacePath.Classification_GetActivityInfo, this.onGetActivityInfo],
            [InterfacePath.Classification_SignRewardDraw, this.onSignRewardDraw],
            [InterfacePath.Classification_WeekendCarouselDraw, this.onWeekendCarouselDraw],
        ]);
    }

    reqGetActivityInfo(){
        let param: c2sGetActivityInfo = new c2sGetActivityInfo();
        NetMgr.sendMsg(param);
    }
    
    reqSignRewardDraw(){
        let param: c2sSignRewardDraw = new c2sSignRewardDraw();
        NetMgr.sendMsg(param);
    }

    reqWeekendCarouselDraw(){
        let param: c2sWeekendCarouselDraw = new c2sWeekendCarouselDraw();
        NetMgr.sendMsg(param);
    }

    onGetActivityInfo(data: any) {
        this.handleResponse(data, NetNotify.Classification_GetActivityInfo);
    }

    onSignRewardDraw(data:any){
        this.handleResponse(data, NetNotify.Classification_SignRewardDraw);
    }
    onWeekendCarouselDraw(data:any){
        this.handleResponse(data, NetNotify.Classification_WeekendCarouselDraw);
    }
}

export const ActServer = _ActivityService.getInstance();