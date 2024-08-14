import { isValid, JsonAsset } from "cc";
import { ItemData } from "../../manager/DataMgr";
import { ResLoader } from "../../manager/ResLoader";
import { ObjectUtil } from "../../util/ObjectUtil";

export interface Monster {
    monster_id: number;
    monster_name: string;
    monsterAni: any[];
}

export interface ClassificationReward {
    star_one_reward: number[];
    star_two_reward: number[];
    star_three_reward: number[];
    pass_reward: number[];
    random_reward: number[];
    random_percent: number[];
}

export interface ClassificationItemData {
    star_one_reward: ItemData[];
    star_two_reward: ItemData[];
    star_three_reward: ItemData[];
    pass_reward: ItemData[];
    random_reward: ItemData[];
    random_percent: number[];
}
export interface KeyMonsterData {
    key_monster: Monster[];
    classification_reward: ClassificationItemData;
}




export default class _ChallengeConfig {
    private static _instance: _ChallengeConfig;

    private _KeyMonsterInfo:KeyMonsterData = null;

    public static getInstance(): _ChallengeConfig {
        if(!this._instance || this._instance === null) {
            this._instance = new _ChallengeConfig();
        }
        return this._instance;
    }

    get KeyMonsterInfo(){
        return this._KeyMonsterInfo;
    } 

    public async getChallengeConfig() {
        // 获取��战相关配置
        try {
            if(!isValid(this._KeyMonsterInfo)){
                const jsonData = await ResLoader.instance.loadAsyncPromise<JsonAsset>('config/classification_word', JsonAsset);
                this._KeyMonsterInfo = this.transformToKeyMonsterData(jsonData.json);
            }

        } catch (err) {
            console.error("Failed to load KeyMonsterData:", err);
            throw err;
        }
    }

    private transformToKeyMonsterData(data:any):KeyMonsterData{
        const classificationReward: ClassificationReward = data.classification_reward[0];
        return {
            key_monster: data.key_monster,
            classification_reward: {
                star_one_reward: ObjectUtil.convertRewardData(classificationReward.star_one_reward),
                star_two_reward: ObjectUtil.convertRewardData(classificationReward.star_two_reward),
                star_three_reward: ObjectUtil.convertRewardData(classificationReward.star_three_reward),
                pass_reward: ObjectUtil.convertRewardData(classificationReward.pass_reward),
                random_reward: ObjectUtil.convertRewardData(classificationReward.random_reward),
                random_percent: classificationReward.random_percent
            }
        };
    }
    
}

export const CGConfig = _ChallengeConfig.getInstance();