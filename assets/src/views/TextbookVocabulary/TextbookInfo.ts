import { isValid, JsonAsset } from "cc";
import { ResLoader } from "../../manager/ResLoader";


export enum EducationLevel {
    ElementaryGrade1 = 3001,
    ElementaryGrade2,
    ElementaryGrade3,
    ElementaryGrade4,
    ElementaryGrade5,
    ElementaryGrade6,
    MiddleSchoolGrade1,
    MiddleSchoolGrade2,
    MiddleSchoolGrade3,
    HighSchoolGrade1,
    HighSchoolGrade2,
    HighSchoolGrade3,
    Other = 3015
}

export interface EducationDataInfo {
    id: EducationLevel,
    monsterName?:string,
    monsterAni?: string,
    monster_effect: string,
    lock_opener: string,
    box: string,
}

//用户信息服务
export default class _TextbookInfo {
    private static _instance: _TextbookInfo;
    private _ConfigInfo:EducationDataInfo[] = null;
    public static getInstance(): _TextbookInfo {
        if (!this._instance || this._instance == null) {
            this._instance = new _TextbookInfo();
        }
        return this._instance;
    }
    
    // constructor(){
    //     this.loadTextBookInfo();
    // }

    get ConfigInfo() {
        return this._ConfigInfo;
    }
    public async loadTextBookInfo(): Promise<void> {
        try {
            if(!isValid(this._ConfigInfo)){
                const jsonData = await ResLoader.instance.loadAsyncPromise<JsonAsset>('config/education_info', JsonAsset);
                this._ConfigInfo = jsonData.json.education_info as EducationDataInfo[];
            }

        } catch (err) {
            console.error("Failed to load task configuration:", err);
            throw err;
        }
    }

    getMasterAniName(monsterId: EducationLevel){
        const info = this._ConfigInfo.find(item => item.id === monsterId);
        const monsterUrl = `spine/TextbookVocabulary/${info.monsterAni}/${info.monsterAni}.json`;
        return monsterUrl;
    }
    getMasterEffectName(monsterId: EducationLevel){
        const info = this._ConfigInfo.find(item => item.id === monsterId);
        const monsterUrl = `spine/TextbookVocabulary/${info.monster_effect}/${info.monster_effect}.json`;
        return monsterUrl;
    }
    getLockOpener(monsterId: EducationLevel){
        const info = this._ConfigInfo.find(item => item.id === monsterId);
        const lock_opener = `Challenge/reward/${info.lock_opener}/spriteFrame`;
        return lock_opener;
    }

    getBoxUrl(monsterId: EducationLevel){
        const info = this._ConfigInfo.find(item => item.id === monsterId);
        const lock_opener = `Challenge/reward/${info.box}/spriteFrame`;
        return lock_opener;
    }
}

export const TbConfig = _TextbookInfo.getInstance();