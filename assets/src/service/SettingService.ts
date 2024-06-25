import { isValid } from "cc";
import { UserPlayerModifyModel, c2sUserPlayerDetail, s2cUserPlayerModify } from "../models/SettingModel";
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
            [InterfacePath.Classification_UserPlayerModify, this.onUserPlayerModify],
        ]);
    }

    reqUserPlayerDetail(){
        let param:c2sUserPlayerDetail = new c2sUserPlayerDetail();
        NetMgr.sendMsg(param);
    }
    

    reqUserPlayerModify(data:UserPlayerModifyModel){
        let param:s2cUserPlayerModify = new s2cUserPlayerModify();
        if(isValid(data.role_id)){
            param.role_id = data.role_id;
        }
        if(isValid(data.nick_name)){
            param.nick_name = data.nick_name;
        }
        NetMgr.sendMsg(param);
    }

    onUserPlayerDetail(data: any) {
        this.handleResponse(data, NetNotify.Classification_UserPlayerDetail);
    }

    onUserPlayerModify(data: any) {
        this.handleResponse(data, NetNotify.Classification_UserPlayerModify);
    }
}

export const STServer = _SettingService.instance;