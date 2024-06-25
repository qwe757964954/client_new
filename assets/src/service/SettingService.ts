import { c2sUserPlayerDetail } from "../models/SettingModel";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import { NetNotify } from "../net/NetNotify";
import { BaseControll } from "../script/BaseControll";


export default class _SettingService extends BaseControll {
    private static _instance: _SettingService = null;
    public static get instance(): _SettingService {
        if (this._instance == null) {
            this._instance = new _SettingService("_SettingService");
        }
        return this._instance;
    }
    constructor(name: string) {
        super(name);
    }
    /** 初始化模块事件 */
    onInitModuleEvent() {
        this.addModelListeners([
            [InterfacePath.Classification_UserPlayerDetail, this.onUserPlayerDetail],
        ]);
    }

    reqUserPlayerDetail(){
        let param:c2sUserPlayerDetail = new c2sUserPlayerDetail();
        NetMgr.sendMsg(param);
    }
    onUserPlayerDetail(data: any) {
        this.handleResponse(data, NetNotify.Classification_UserPlayerDetail);
    }
}

export const STServer = _SettingService.instance;