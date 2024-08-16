import { c2sUserVocabularyRank } from "../models/RankModel";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import { NetNotify } from "../net/NetNotify";
import { BaseControll } from "../script/BaseControll";


export default class _RankService extends BaseControll {
    private static _instance: _RankService;
    public static getInstance(): _RankService {
        if (!this._instance || this._instance == null) {
            this._instance = new _RankService("_RankService");
        }
        return this._instance;
    }
    constructor(name: string) {
        super(name);
    }
    /** 初始化模块事件 */
    protected onInitModuleEvent() {
        this.addModelListeners([
            [InterfacePath.Classification_UserVocabularyRank, this.onUserVocabularyRank],
        ]);
    }

    reqUserVocabularyRank(){
        let param: c2sUserVocabularyRank = new c2sUserVocabularyRank();
        NetMgr.sendMsg(param);
    }

    onUserVocabularyRank(data:any){
        this.handleResponse(data, NetNotify.Classification_UserVocabularyRank);
    }
}

export const RKServer = _RankService.getInstance();