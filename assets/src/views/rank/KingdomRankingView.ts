import { _decorator } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
const { ccclass, property } = _decorator;

@ccclass('KingdomRankingView')
export class KingdomRankingView extends BaseView {
    @property(List)
    public rank_list:List = null;
    protected initUI(): void {
        this.rank_list.numItems = 20;
    }

    onLoadKingdomRanking(item:Node, idx:number){
        
    }

}

