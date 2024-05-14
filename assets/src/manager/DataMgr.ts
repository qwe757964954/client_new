import { PetInfo, PetInteractionInfo, PetMoodInfo } from "../config/PetConfig";
import { PropInfo } from "../config/PropConfig";
import { TextConfig } from "../config/TextConfig";
import { MapLevelData } from "../models/AdventureModel";
import { ToolUtil } from "../util/ToolUtil";
import { LoadManager } from "./LoadManager";

const ConfigPath = {
    RoleSlot: "role_slots",
    RoleSlotConfig: "dress_up",
    EditInfo: "building",
    ProduceInfo: "produce",
    WordSplit: "word_split",
    AdventureLevel: "adventure_level",
    PropConfig: "propConfig",
    PetInteraction: "petInteraction",
    PetMoodConfig: "petMoodConfig",
    PetConfig: "petConfig",
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
    Null = 0,
    Buiding = 1,//功能性建筑
    LandmarkBuiding = 2,//地标建筑
    Decoration = 3,//装饰
    Land = 4,//地块
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
    animation: string;//动画
}
/**奖励信息 */
export class RewardInfo {
    id: number;//id
    num: number;//数量
}
/**生产信息 */
export class ProduceInfo {
    level: number;//等级
    unlock: number;//解锁等级
    res_name: string;//资源名字
    res_png: string;//资源图片
    res_time: number;//资源产出时间（单位秒）
    produce: RewardInfo[];//产出
    expend: RewardInfo[];//消耗
    upgrade_need: RewardInfo[];//升级消耗
    upgrade_time: number;//升级时间
}
/**建筑生产信息 */
export class BuildProduceInfo {
    id: number;//id
    data: ProduceInfo[] = [];//生产信息
    count: number = 0;//数量
}

//大冒险关卡配置
export class AdvLevelConfig {
    islandId: number;
    levelId: number;
    type: number;
    monsterName: string;
    monsterAni: string;
    miniMonsterAni: string;
    mapLevelData: MapLevelData;
}
//教材单词关卡配置
export class BookLevelConfig {
    grade: string;
    unit: string;
    type_name: string;
    game_mode: number;
    book_name: string;
}


//数据管理器
export class DataMgr {

    public roleSlot: RoleSlot[] = [];//角色插槽
    public roleSlotConfig: RoleSlotConfig[] = [];//角色插槽配置
    public editInfo: EditInfo[] = [];//编辑信息
    public buildProduceInfo: BuildProduceInfo[] = [];//建筑生产信息
    public wordSplitConfig: any = null;
    public adventureLevelConfig: AdvLevelConfig[] = null;
    public propConfig: { [key: number]: PropInfo } = {};//道具信息
    public petInteraction: PetInteractionInfo[] = [];//交互信息
    public petMoodConfig: PetMoodInfo[] = [];//心情信息
    public petConfig: PetInfo[] = [];//宠物信息

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
        console.time("DataMgr initData");
        await this.initRoleSlot();
        await this.initRoleSlotConfig();
        await this.initPropConfig();
        await this.initEditInfo();
        await this.initBuildProduceInfo();
        await this.initPetInteractionConfig();
        console.timeEnd("DataMgr initData");
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
            if (obj.type == EditType.Land) {
                obj.png = ToolUtil.replace(TextConfig.Building_Path1, obj.png);
                if (!this.defaultLand) this.defaultLand = obj;
            } else {
                obj.png = ToolUtil.replace(TextConfig.Building_Path2, obj.png);
            }
            if (obj.animation && obj.animation.length > 0) {
                obj.animation = ToolUtil.replace(TextConfig.Building_SpPath, obj.animation);
            }
            this.editInfo[obj.id] = obj;
        }
    }
    public converAryToReward(ary: number[]): RewardInfo[] {
        let list: RewardInfo[] = [];
        let i = 0;
        let max = ary.length - 1;
        while (i < max) {
            let obj = new RewardInfo();
            obj.id = ary[i];
            obj.num = ary[i + 1];
            list.push(obj);

            i = i + 2;
        }
        return list;
    }
    /** 初始化建筑生产信息 */
    public async initBuildProduceInfo() {
        let json = await LoadManager.loadJson(ConfigPath.ProduceInfo);
        for (let k in json) {
            let value = json[k];
            let obj: BuildProduceInfo = this.buildProduceInfo[value.id];
            if (!obj) {
                obj = new BuildProduceInfo();
                obj.id = value.id;
                this.buildProduceInfo[obj.id] = obj;
            }
            let info: ProduceInfo = new ProduceInfo();
            info.level = value.level;
            info.unlock = value.unlock;
            info.res_name = value.res_name;
            info.res_png = ToolUtil.replace(TextConfig.Prop_Path, value.res_png);
            info.res_time = value.res_time;
            info.produce = this.converAryToReward(value.produce);
            info.expend = this.converAryToReward(value.expend);
            info.upgrade_need = this.converAryToReward(value.upgrade_need);
            info.upgrade_time = value.upgrade_time;
            obj.data[info.level] = info;
            obj.count++;
        }
    }
    /**初始化道具配置 */
    public async initPropConfig() {
        let json = await LoadManager.loadJson(ConfigPath.PropConfig);
        for (let k in json) {
            let obj: PropInfo = json[k];
            obj.png = ToolUtil.replace(TextConfig.Prop_Path, obj.png);
            obj.frame = ToolUtil.replace(TextConfig.Prop_Path, obj.frame);
            this.propConfig[obj.id] = obj;
        }
    }
    /**初始化宠物交互配置 */
    public async initPetInteractionConfig() {
        let json = await LoadManager.loadJson(ConfigPath.PetInteraction);
        for (let k in json) {
            this.petInteraction.push(json[k]);
        }
    }
    /**初始化心情信息 */
    public async initPetMoodConfig() {
        let json = await LoadManager.loadJson(ConfigPath.PetMoodConfig);
        for (let k in json) {
            this.petMoodConfig.push(json[k]);
        }
    }
    /**初始化宠物信息 */
    public async initPetConfig() {
        let json = await LoadManager.loadJson(ConfigPath.PetConfig);
        for (let k in json) {
            this.petConfig.push(json[k]);
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
        // if (editInfo.type == EditType.Land) {
        //     return ToolUtil.replace(TextConfig.Building_Path1, editInfo.png);
        // }
        // return ToolUtil.replace(TextConfig.Building_Path2, editInfo.png);
        return editInfo.png;
    }
    /**获取道具信息 */
    static getPropInfo(id: number): PropInfo {
        return DataMgr.instance.propConfig[id];
    }
}