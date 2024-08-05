import { Vec3 } from "cc";
import { PetInfo, PetInteractionInfo, PetMoodInfo } from "../config/PetConfig";
import { TextConfig } from "../config/TextConfig";
import { BossLevelData, LevelProgressData, MapLevelData } from "../models/AdventureModel";
import { ToolUtil } from "../util/ToolUtil";
import { LoadManager } from "./LoadManager";

const ConfigPath = {
    RoleSlot: "role_slots",
    RoleSlotConfig: "dress_up",
    WordSplit: "word_split",
    AdventureLevel: "adventure_level",
    ArchConfig: "AchConfig",
    MedalConfig: "medal",
    HelpConfig: "gameHelp",

    BuildingConfig: "building",
    PetConfig: "pet",
    ProduceConfig: "produce",
    ItemInfoConfig: "item_info",
    WordGameConfig: "word_game",
    RoleConfig: "role",
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
/**类型 */
export enum EditType {//编辑元素类型
    Null = 0,//城堡
    Buiding = 1,//功能性建筑
    LandmarkBuiding = 2,//地标建筑
    Decoration = 3,//装饰
    Land = 4,//地块
}
/**类型信息 */
export class EditTypeInfo {
    id: number;//id
    name: string;//名字
}
/**建筑、装饰、地板信息 */
export class EditInfo {
    id: number;//id
    name: string;//名字
    theme: number;//主题
    type: EditType;//类型
    buy: number;//购买金币数
    sell: number;//出售金币数
    enable: number;//是否可用
    width: number;//宽
    height: number;//高
    png: string;//图片
    description: string;//描述
    function: string;//功能描述
    animation: string;//动画
    animpos: Vec3;//位置
    baseColor: string;//底格颜色
}
/**道具数据 */
export class ItemData {
    id: number;//id
    num: number;//数量
    from?: string; //来源（如一星，二星奖励）
}
/**物品信息 */
export class ItemInfo {
    id: number;//id
    name: string;//名字
    png: string;//图片
    frame: string;//框图片
}
/**生产信息 */
export class ProduceInfo {
    id: number;//id
    level: number;//等级
    unlock: number;//解锁等级
    res_name: string;//资源名字
    res_png: string;//资源图片
    res_time: number;//资源产出时间（单位秒）
    produce: ItemData[];//产出
    expend: ItemData[];//消耗
    upgrade_need: ItemData[];//升级消耗
    upgrade_time: number;//升级时间
    upgrade_tips: string;//升级提示
}
/**建筑生产信息 */
export class BuildProduceInfo {
    id: number;//id
    data: ProduceInfo[] = [];//生产信息
    count: number = 0;//数量
}

//大冒险关卡配置
export class AdvLevelConfig {
    bigId: number;
    smallId: number;
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
    error_num?: number;
    time_remaining: number;
    monster_id:number;
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
/**城堡配置 */
export class CastleConfig {
    id: number;
    level: number;//等级
    upgrade_need: ItemData[];//升级消耗
    upgrade_time: number;//升级时间
    unlock1: number;//解锁条件(岛屿)
    unlock2: number;//解锁条件(关卡)
    unlock3: number;//解锁条件(精灵等级)
    unlock4: number;//解锁条件(人物等级)
}
/**建造配置 */
export class BuiltInfo {
    id: number;//id
    construct_need: ItemData[];//建造消耗
    construct_time: number;//建造时间
    construct_award: ItemData[];//建造奖励
}

//岛屿信息
export class IslandData {
    big_id: number;
    big_name: string;
    phase_id: number;
    phase_name: string;
    grade: string;
    bossName: string;
    bossAni: string;
}

//怪物信息
export class MonsterData {
    monster_id: number;
    monsterName: string;
    monsterAni: string;
    miniMonsterAni: string;
}

//岛屿学期信息
export class IslandGateData {
    big_id: number;
    unit: string;
    subject_id: number;
    small_id: number;
    monster_id: number;
}

/**角色信息 */
export class RoleInfo {
    id: number;//id
    name: string;//名字
    path: string;//sp动画
    actNames: string[];//动作名
}
/**插槽信息 */
export class SlotInfo {
    id: number;//id
    name: string;//名字
    slot: number;//插槽
}
/**插槽图片信息 */
export class SlotPngInfo {
    id: number;//id
    png: string;//图片
}
/**服装类型 */
export enum ClothingType {
    toufa = 1,//头发
    shipin = 2,//饰品
    shangyi = 3,//上衣
    kuzi = 4,//裤子
    xiezi = 5,//鞋子
    chibang = 6,//翅膀
    maozi = 7,//帽子
    lian = 8,//脸
}
/**服装信息 */
export class ClothingInfo {
    id: number;//id
    name: string;//名字
    type: ClothingType;//服装类型
    slots: SlotPngInfo[];//插槽
}
/**主题信息 */
export class ThemeInfo {
    id: number;//id
    name: string;//名字
}

//数据管理器
export class DataManager {

    public roleConfig: RoleInfo[] = [];//角色信息
    public slotConfig: SlotInfo[] = [];//插槽信息
    public clothingConfig: ClothingInfo[] = [];//服装信息
    public roleSlot: RoleSlot[] = [];//角色插槽（老的，会废弃）
    public roleSlotConfig: RoleSlotConfig[] = [];//角色插槽配置（老的，会废弃）
    public editInfo: EditInfo[] = [];//编辑信息
    public castleConfig: CastleConfig[] = [];//城堡配置
    public builtConfig: BuiltInfo[] = [];//建造配置
    public buildProduceInfo: BuildProduceInfo[] = [];//建筑生产信息
    public editTypeConfig: EditTypeInfo[] = [];//编辑类型配置
    public themeConfig: ThemeInfo[] = [];//主题信息
    public wordSplitConfig: any = null;
    public adventureLevelConfig: AdvLevelConfig[] = null;
    public itemConfig: { [key: number]: ItemInfo } = {};//道具信息
    public petInteraction: PetInteractionInfo[] = [];//交互信息
    public petMoodConfig: PetMoodInfo[] = [];//心情信息
    public petConfig: { [key: number]: PetInfo[] } = {};//宠物信息
    public archConfig: { [key: number]: ArchConfig } = {}; //成就信息
    public medalConfig: MedalConfig[] = []; //勋章信息
    public helpConfig = {} //帮助配置
    public adventureBossConfig: BossLevelData[] = []; //大冒险岛屿boss信息
    public islandConfig: IslandData[] = []; //岛屿配置
    public monsterConfig: MonsterData[] = []; //岛屿怪物配置
    public islandGateConfig: IslandGateData[] = []; //岛屿学期配置

    private _isInit: boolean = false;
    public defaultLand: EditInfo = null;//默认地块
    public petMaxLevel: number = 0;//宠物最大等级

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
        await this.initWordGameConfig();
        await this.initRoleConfig();
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
        /**建筑配置 */
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
        /**城堡配置 */
        let castle_info = json.castle_info;
        for (let k in castle_info) {
            let obj = castle_info[k];
            obj.upgrade_need = this.converAryToReward(obj.upgrade_need);
            this.castleConfig.push(obj);
        }
        /**建造配置 */
        let construct_info = json.construct_info;
        for (let k in construct_info) {
            let obj = construct_info[k];
            obj.construct_need = this.converAryToReward(obj.construct_need);
            obj.construct_award = this.converAryToReward(obj.construct_award);
            this.builtConfig[obj.id] = obj;
        }
        /**主题配置 */
        let theme_info = json.theme_info;
        for (let k in theme_info) {
            let obj = theme_info[k];
            this.themeConfig[obj.id] = obj;
        }
        /**编辑类型信息 */
        let type_info = json.type_info;
        for (let k in type_info) {
            let obj = type_info[k];
            this.editTypeConfig[obj.id] = obj;
        }
    }
    public converAryToReward(ary: number[]): ItemData[] {
        let list: ItemData[] = [];
        let i = 0;
        let max = ary.length - 1;
        while (i < max) {
            let obj = new ItemData();
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
            info.upgrade_tips = value.upgrade_tips;
            obj.data[info.level] = info;
            obj.count++;
        }
    }
    /**初始化物品配置 */
    public async initItemInfoConfig() {
        let json = await LoadManager.loadJson(ConfigPath.ItemInfoConfig);
        let item_info = json.item_info;
        for (let k in item_info) {
            let obj: ItemInfo = item_info[k];
            obj.png = ToolUtil.replace(TextConfig.Prop_Path, obj.png);
            obj.frame = ToolUtil.replace(TextConfig.Prop_Path, obj.frame);
            this.itemConfig[obj.id] = obj;
        }
    }
    /**初始化宠物配置 */
    public async initPetConfig() {
        let json = await LoadManager.loadJson(ConfigPath.PetConfig);
        let pet_upgrade = json.pet_upgrade;
        for (let k in pet_upgrade) {
            let obj = pet_upgrade[k];
            let ary = this.petConfig[obj.id];
            if (!ary) {
                ary = [];
                this.petConfig[obj.id] = ary;
            }
            ary.push(obj);
        }
        for (const key in this.petConfig) {
            this.petMaxLevel = Math.max(this.petConfig[key].length, this.petMaxLevel);
        }
        let pet_interaction = json.pet_interaction;
        for (let k in pet_interaction) {
            this.petInteraction.push(pet_interaction[k]);
        }
        let pet_mood = json.pet_mood;
        for (let k in pet_mood) {
            let obj = pet_mood[k];
            obj.png = ToolUtil.replace(TextConfig.Mood_Path, obj.png);
            this.petMoodConfig.push(obj);
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

    //初始化大冒险相关配置
    public async initWordGameConfig() {
        let json = await LoadManager.loadJson(ConfigPath.WordGameConfig);
        this.islandConfig = json.island_data;
        this.monsterConfig = json.monster_data;
        this.islandGateConfig = json.island_gate;
    }

    /**初始化角色数据 */
    public async initRoleConfig() {
        let json = await LoadManager.loadJson(ConfigPath.RoleConfig);
        let roleInfo = json.role_info;
        if (roleInfo) {
            for (let k in roleInfo) {
                let obj: RoleInfo = roleInfo[k];
                this.roleConfig[obj.id] = obj;
            }
        }
        let slotInfo = json.slot_info;
        if (slotInfo) {
            for (let k in slotInfo) {
                let obj: SlotInfo = slotInfo[k];
                this.slotConfig[obj.id] = obj;
            }
        }
        let clothingInfo = json.clothing_info;
        if (clothingInfo) {
            for (let k in clothingInfo) {
                let obj: ClothingInfo = clothingInfo[k];
                obj.slots = [];
                for (let i = 1; i < 4; i++) {
                    let key = "slotPng" + i;
                    if (obj[key]) {
                        let tempSlot = new SlotPngInfo();
                        tempSlot.png = obj[key];
                        let key2 = "slotID" + i;
                        if (obj[key2]) {
                            tempSlot.id = obj[key2];
                        }
                        obj.slots.push(tempSlot);
                    }
                }
                this.clothingConfig[obj.id] = obj;
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
        let config = await LoadManager.loadJson(ConfigPath.AdventureLevel);
        this.adventureLevelConfig = config.adventure_level;
        this.adventureBossConfig = config.island_boss;
        return this.adventureLevelConfig;
    }

    //获取指定关卡配置
    public getAdvLevelConfig(bigId: number, smallId: number): AdvLevelConfig {
        if (this.adventureLevelConfig == null) return null;
        let cfgData = this.adventureLevelConfig.find((cfg) => {
            return cfg.bigId == bigId && cfg.smallId == smallId;
        });
        return cfgData;
    }
    //获取指定岛屿Boss数据
    public getIslandBossConfig(bigId: number): BossLevelData {
        if (this.adventureBossConfig == null) return null;
        let cfgData = this.adventureBossConfig.find((cfg) => {
            return cfg.bigId == bigId;
        });
        return cfgData;
    }

    //获取岛屿配置
    public getIslandData(big_id: number): IslandData {
        return this.islandConfig.find((cfg) => {
            return cfg.big_id == big_id;
        });
    }

    //获取怪物配置
    public getMonsterData(monster_id: number): MonsterData {
        return this.monsterConfig.find((cfg) => {
            return cfg.monster_id == monster_id;
        });
    }
    //获取学期配置
    public getIslandGateData(big_id: number, small_id: number): IslandGateData {
        return this.islandGateConfig.find((cfg) => {
            return cfg.big_id == big_id && cfg.small_id == small_id;
        });
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
    public getItemInfo(id: number): ItemInfo {
        return this.itemConfig[id];
    }
    /**心情配置 */
    public getMoodConfig(moodScore: number): PetMoodInfo {
        let config = null;
        for (let i = 0; i < this.petMoodConfig.length; i++) {
            const element = this.petMoodConfig[i];
            config = element;
            if (element.score > moodScore) break;
        }
        return config;
    }
}

export const DataMgr = DataManager.instance;