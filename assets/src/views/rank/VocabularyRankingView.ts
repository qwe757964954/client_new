import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { WordRankResponse } from '../../models/RankModel';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { MyRank } from './MyRank';
import { RankItem } from './RankItem';
const { ccclass, property } = _decorator;

@ccclass('VocabularyRankingView')
export class VocabularyRankingView extends BaseView {
    @property(List)
    public rank_list:List = null;
    private _myRank:MyRank = null;
    private _wordRankResponse:WordRankResponse = null;
    protected async initUI() {
        this.offViewAdaptSize();
        await this.initViews();
        this._myRank.updateMyRankData(this._wordRankResponse.user_rank);

    }

    updateData(data:WordRankResponse){
        this._wordRankResponse = data;
        this.rank_list.numItems = data.word_rank.length;
    }

    private async initViews() {
        await Promise.all([
            this.initViewComponent(PrefabType.MyRank, (node) => this._myRank = node.getComponent(MyRank), {
                isAlignBottom: true,
                isAlignLeft: true,
                bottom: 15.007,
                left: 465.268
            }),
        ]);
    }
    onLoadVocabularyRanking(item:Node, idx:number){
        let nodeScript = item.getComponent(RankItem);
        nodeScript.updateMyRankData(this._wordRankResponse.word_rank[idx]);
    }

}

