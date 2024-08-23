import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { MyRank } from './MyRank';
const { ccclass, property } = _decorator;

@ccclass('KingdomRankingView')
export class KingdomRankingView extends BaseView {
    @property(List)
    public rank_list:List = null;
    private _myRank:MyRank = null;
    protected initUI(): void {
        this.offViewAdaptSize();
        this.rank_list.numItems = 20;
        this.initViews();
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
    onLoadKingdomRanking(item:Node, idx:number){
        
    }

}

