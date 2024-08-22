import { ItemData } from "../manager/DataMgr";

/**交互方式 */
export enum PetInteractionType {
    eat = 1,//喂食
    wash = 2,//洗澡
    game = 3,//玩耍
}
/**交互信息 */
export class PetInteractionInfo {
    id: number;//道具id
    type: PetInteractionType;//交互方式
    score: number;//得分
}
/**心情类型 */
export enum PetMoodType {
    sad = 1,//伤心
    normal = 2,//一般
    satisfy = 3,//满足
    happy = 4,//开心
}
/**心情信息 */
export class PetMoodInfo {
    id: PetMoodType;//心情id
    name: string;//名字
    minscore: number;//最低分数
    maxscore: number;//最高分数
    png: string[];//图片
    text: string[];//文案
}
/**亲密度信息 */
export class IntimacyInfo {
    level: number;//等级
    intimacy: number;//所需亲密度
}
/**宠物信息 */
export class PetInfo {
    id: number;//宠物id
    name: string;//名字
    level: number;//等级
    // amethyst: number;//紫晶石
    castleLevel: number;//城堡等级
    // diamond: number;//钻石
    // fruit: number;//亲密果实
    // soul: number;//精灵魂魄
    // coin: number;//金币
    upgradeNeed: ItemData[];//升级所需
    randomRewards: ItemData[];//奖励
}


