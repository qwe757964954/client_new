import { TextConfig } from "../config/TextConfig";
import { ToolUtil } from "../util/ToolUtil";
import { LoadManager } from "./LoadManager";

const ConfigPath = {
    RoleSlot: "role_slots",
    RoleSlotConfig: "dress_up",
    EditInfo: "building",
    WordSplit: "word_split",
    AdventureLevel: "adventure_level",
}

//角色插槽
export class RoleSlot {
    id: number;//id
    slots: string[];//插槽名字
}
//角色插槽配置
export class RoleSlotConfig {
    PropId: number;//id
    Suit: string;//套装
    RoleId: number;//角色id
    DressUpType: string;//类型
    Ass: string[];//资源
    Remark: string;//备注
}
// 建筑、装饰、地板信息
export enum EditType {//编辑元素类型
    Buiding = 0,//建筑
    Decoration = 1,//装饰
    Land = 2,//地块
}
export class EditInfo {
    id: number;//id
    name: string;//名字
    theme: number;//主题
    type: EditType;//类型
    buy: number;//购买金币数
    sell: number;//出售金币数
    enable: number;//是否可用
    width: number;//宽
    png: string;//图片
    description: string;//描述
    function: string;//功能描述
}

//大冒险关卡配置
export class AdvLevelConfig {
    islandId: number;
    levelId: number;
    type: number;
    monsterName: string;
    monsterAni: string;
    miniMonsterAni: string;
}
//教材单词关卡配置
export class BookLevelConfig {
    grade:string;
    unit:string;
    type_name:string;
    game_mode:number
}


//数据管理器
export class DataMgr {

    public roleSlot: RoleSlot[] = [];//角色插槽
    public roleSlotConfig: RoleSlotConfig[] = [];//角色插槽配置
    public editInfo: EditInfo[] = [];//编辑信息
    public wordSplitConfig: any = null;
    public adventureLevelConfig: AdvLevelConfig[] = null;

    private _isInit: boolean = false;
    public defaultLand: EditInfo = null;//默认地块

    public static _instance: DataMgr = null;
    public static get instance(): DataMgr {
        if (this._instance == null) {
            this._instance = new DataMgr();
        }
        return this._instance;
    }
    private constructor() {
    }

    //初始化数据
    public async initData() {
        if (this._isInit) return;
        this._isInit = true;

        await this.initRoleSlot();
        await this.initRoleSlotConfig();
        await this.initEditInfo();
    }
    /** 初始化角色插槽 */
    public async initRoleSlot() {
        let json = await LoadManager.loadJson(ConfigPath.RoleSlot);
        for (let k in json) {
            let obj = new RoleSlot();
            obj.id = Number(k);
            obj.slots = json[k];
            this.roleSlot[obj.id] = obj;
        }
    }
    /** 初始化角色插槽配置 */
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
    /** 初始化编辑信息 */
    public async initEditInfo() {
        let json = await LoadManager.loadJson(ConfigPath.EditInfo);
        for (let k in json) {
            let obj: EditInfo = json[k];
            if (0 == obj.enable) continue;
            this.editInfo[obj.id] = obj;

            if (!this.defaultLand && obj.type == EditType.Land) {
                this.defaultLand = obj;
            }
        }
    }

    //获取导学模式单词拆分配置
    public async getWordSplitConfig() {
        if (this.wordSplitConfig != null) return this.wordSplitConfig;
        this.wordSplitConfig = await LoadManager.loadJson(ConfigPath.WordSplit);
        return this.wordSplitConfig;
    }

    //获取大冒险关卡数据
    public async getAdventureLevelConfig() {
        if (this.adventureLevelConfig != null) return this.adventureLevelConfig;
        this.adventureLevelConfig = await LoadManager.loadJson(ConfigPath.AdventureLevel);
        return this.adventureLevelConfig;
    }

    //获取指定关卡配置
    public getAdvLevelConfig(islandId: number, levelId: number): AdvLevelConfig {
        if (this.adventureLevelConfig == null) return null;
        let cfgData = this.adventureLevelConfig.find((cfg) => {
            return cfg.islandId == islandId && cfg.levelId == levelId;
        });
        return cfgData;
    }

    /**获取编辑图片 */
    static getEditPng(editInfo: EditInfo): string {
        if (editInfo.type == EditType.Land) {
            return ToolUtil.replace(TextConfig.Building_Path1, editInfo.png);
        }
        return ToolUtil.replace(TextConfig.Building_Path2, editInfo.png);
    }
}