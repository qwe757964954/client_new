import { _decorator } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
const { ccclass, property } = _decorator;

@ccclass('VocabularyRankingView')
export class VocabularyRankingView extends BaseView {
    @property(List)
    public rank_list:List = null;
    start() {

    }

    updateData(){
        
    }
}
