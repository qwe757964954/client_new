import { LoadManager } from "./LoadManager";

const ConfigPath = {
    RoleSlot : "role_slots",
    RoleSlotConfig : "dress_up",
}

//角色插槽
export class RoleSlot {
    id : number;//id
    slots : string[];//插槽名字
}
//角色插槽配置
export class RoleSlotConfig {
    PropId : number;//id
    Suit : string;//套装
    RoleId : number;//角色id
    DressUpType : string;//类型
    Ass : string[];//资源
    Remark : string;//备注
}


//数据管理器
export class DataMgr {

    public roleSlot : RoleSlot[] = [];//角色插槽
    public roleSlotConfig : RoleSlotConfig[] = [];//角色插槽配置

    private _isInit:boolean = false;

    public static _instance:DataMgr = null;
    public static get instance():DataMgr {
        if(this._instance == null) {
            this._instance = new DataMgr();
        }
        return this._instance;
    }
    private constructor() {
    }

    //初始化数据
    public async initData() {
        if(this._isInit) return;
        this._isInit = true;

        await this.initRoleSlot();
        await this.initRoleSlotConfig();
    }
    //初始化角色插槽
    public async initRoleSlot() {
        let json = await LoadManager.loadJson(ConfigPath.RoleSlot);
        for (let k in json) {
            let obj = new RoleSlot();
            obj.id = Number(k);
            obj.slots = json[k];
            this.roleSlot[obj.id] = obj;
        }
    }
    //初始化角色插槽配置
    public async initRoleSlotConfig() {
        let json = await LoadManager.loadJson(ConfigPath.RoleSlotConfig);
        for (let k in json) {
            let obj = new RoleSlotConfig();
            obj.PropId = Number(k);
            obj.Suit = json[k].Suit;
            obj.RoleId = Number(json[k].RoleId);
            obj.DressUpType = json[k].DressUpType;
            obj.Ass = json[k].Ass.split(",");
            obj.Remark = json[k].Remark;
            this.roleSlotConfig[obj.PropId] = obj;
        }
    }
}