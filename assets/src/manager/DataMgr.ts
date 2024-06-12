import { Vec3 } from "cc";
import { PetInfo, PetInteractionInfo, PetMoodInfo } from "../config/PetConfig";
import { PropInfo } from "../config/PropConfig";
import { TextConfig } from "../config/TextConfig";
import { LevelProgressData, MapLevelData } from "../models/AdventureModel";
import { ToolUtil } from "../util/ToolUtil";
import { LoadManager } from "./LoadManager";

const ConfigPath = {
    RoleSlot: "role_slots",
    RoleSlotConfig: "dress_up",
    // EditInfo: "building",
    // ProduceInfo: "produce",
    WordSplit: "word_split",
    AdventureLevel: "adventure_level",
    // PropConfig: "propConfig",
    // PetInteraction: "petInteraction",
    // PetMoodConfig: "petMoodConfig",
    // PetConfig: "petConfig",
    ArchConfig: "AchConfig",
    MedalConfig: "medal",
    HelpConfig: "gameHelp",

    BuildingConfig: "building",
    PetConfig: "pet",
    ProduceConfig: "produce",
    ItemInfoConfig: "item_info",
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
    Null = 0,//城堡
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
    animpos: Vec3;//位置
}
/**道具数据 */
export class PropData {
    id: number;//id
    num: number;//数量
}
/**生产信息 */
export class ProduceInfo {
    id: number;//id
    level: number;//等级
    unlock: number;//解锁等级
    res_name: string;//资源名字
    res_png: string;//资源图片
    res_time: number;//资源产出时间（单位秒）
    produce: PropData[];//产出
    expend: PropData[];//消耗
    upgrade_need: PropData[];//升级消耗
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
    progressData: LevelProgressData;
    error_num: number;
}
//教材单词关卡配置
export class BookLevelConfig {
    book_id: string;//
    unit_id: string;//
    unit: string;
    game_mode: number;
    small_id: number;
    word_num: number;
    cur_game_mode: number;
    error_word?: any;
    time_remaining: number;
    error_num?: number;
}
//成就信息配置
export class ArchConfig {
    AchId: number;  //成就id
    Info: string;   //成就描述
    Awards: string[]; //奖励 300,30
    Type: number;    //成就类型
    Title: string;   //成就名字
    T: number;
    SendFlag: number;
    Score: number;
    MedalId: number; //奖章ID
    Bid: number;
    Mid: number;
    Status: number;
    NextIds: number[];
}
/**勋章信息配置 */
export class MedalConfig {
    MedalId: number; //勋章ID
    Info: string;    //勋章信息
    Type: string;
    Ce: number;
}

//数据管理器
export class DataManager {

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
    public archConfig: { [key: number]: ArchConfig } = {}; //成就信息
    public medalConfig: MedalConfig[] = []; //勋章信息
    public helpConfig = {} //帮助配置

    private _isInit: boolean = false;
    public defaultLand: EditInfo = null;//默认地块

    public static _instance: DataManager = null;
    public static get instance(): DataManager {
        if (this._instance == null) {
            this._instance = new DataManager();
        }
        return this._instance;
    }
    public get instance() {
        return this;
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
        await this.initItemInfoConfig();
        await this.initBuildingConfig();
        await this.initBuildProduceInfo();
        await this.initPetConfig();
        await this.initAchieveConfig();
        await this.initMedalConfig();
        await this.initHelpConfig();
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
    /** 初始化建筑配置 */
    public async initBuildingConfig() {
        let json = await LoadManager.loadJson(ConfigPath.BuildingConfig);
        let building_info = json.building_info;
        for (let k in building_info) {
            let obj = building_info[k];
            if (0 == obj.enable) continue;
            if (obj.type == EditType.Land) {
                obj.png = ToolUtil.replace(TextConfig.Building_Path1, obj.png);
                if (!this.defaultLand) this.defaultLand = obj;
            } else {
                obj.png = ToolUtil.replace(TextConfig.Building_Path2, obj.png);
            }
            if (obj.animation && obj.animation.length > 0) {
                obj.animation = ToolUtil.replace(TextConfig.Building_SpPath, obj.animation);
            } else {
                obj.animation = null;
            }
            if (obj.animpos && obj.animpos.length > 0) {
                obj.animpos = new Vec3(obj.animpos[0], obj.animpos[1], 0);
            } else {
                obj.animpos = null;
            }
            this.editInfo[obj.id] = obj;
        }
    }
    public converAryToReward(ary: number[]): PropData[] {
        let list: PropData[] = [];
        let i = 0;
        let max = ary.length - 1;
        while (i < max) {
            let obj = new PropData();
            obj.id = ary[i];
            obj.num = ary[i + 1];
            list.push(obj);

            i = i + 2;
        }
        return list;
    }
    /** 初始化建筑生产信息 */
    public async initBuildProduceInfo() {
        let json = await LoadManager.loadJson(ConfigPath.ProduceConfig);
        let produce = json.produce;
        for (let k in produce) {
            let value = produce[k];
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
    /**初始化物品配置 */
    public async initItemInfoConfig() {
        let json = await LoadManager.loadJson(ConfigPath.ItemInfoConfig);
        let item_info = json.item_info;
        for (let k in item_info) {
            let obj: PropInfo = item_info[k];
            obj.png = ToolUtil.replace(TextConfig.Prop_Path, obj.png);
            obj.frame = ToolUtil.replace(TextConfig.Prop_Path, obj.frame);
            this.propConfig[obj.id] = obj;
        }
    }
    /**初始化宠物配置 */
    public async initPetConfig() {
        let json = await LoadManager.loadJson(ConfigPath.PetConfig);
        let pet_upgrade = json.pet_upgrade;
        for (let k in pet_upgrade) {
            this.petConfig.push(pet_upgrade[k]);
        }
        let pet_interaction = json.pet_interaction;
        for (let k in pet_interaction) {
            this.petInteraction.push(pet_interaction[k]);
        }
        let pet_mood = json.pet_mood;
        for (let k in pet_mood) {
            this.petMoodConfig.push(pet_mood[k]);
        }
    }

    /**初始化成就信息 */
    public async initAchieveConfig() {
        let json = await LoadManager.loadJson(ConfigPath.ArchConfig);
        for (let k in json) {
            let obj: ArchConfig = new ArchConfig();
            obj.AchId = Number(json[k].AchId);
            obj.Info = json[k].Info;
            obj.Awards = json[k].Awards.split(",");
            obj.Type = Number(json[k].Type);
            obj.Title = json[k].Title;
            obj.T = json[k].T;
            obj.SendFlag = Number(json[k].SendFlag);
            obj.Score = Number(json[k].Score);
            obj.MedalId = Number(json[k].MedalId);
            obj.Bid = Number(json[k].Bid);
            obj.Mid = Number(json[k].Mid);
            obj.Status = -1;
            obj.NextIds = [];
            this.archConfig[obj.AchId] = obj;
            //this.archConfig.push(obj);
        }
    }
    /**初始化勋章信息 */
    public async initMedalConfig() {
        let json = await LoadManager.loadJson(ConfigPath.MedalConfig);
        for (let k in json) {
            let obj: MedalConfig = new MedalConfig();
            obj.MedalId = Number(json[k].MedalId);
            obj.Info = json[k].Info;
            obj.Type = json[k].Type;
            obj.Ce = Number(json[k].Ce);
            this.medalConfig.push(obj);
        }
    }

    /**初始化帮助信息 */
    public async initHelpConfig() {
        let json = await LoadManager.loadJson(ConfigPath.HelpConfig);
        for (let k in json) {
            this.helpConfig[k] = json[k];
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
    public getEditPng(editInfo: EditInfo): string {
        // if (editInfo.type == EditType.Land) {
        //     return ToolUtil.replace(TextConfig.Building_Path1, editInfo.png);
        // }
        // return ToolUtil.replace(TextConfig.Building_Path2, editInfo.png);
        return editInfo.png;
    }
    /**获取道具信息 */
    public getPropInfo(id: number): PropInfo {
        return this.propConfig[id];
    }
}

export const DataMgr = DataManager.instance;