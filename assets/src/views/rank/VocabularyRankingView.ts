import { _decorator, Node } from 'cc';
import { PrefabType, PrefabTypeEntry } from '../../config/PrefabType';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { MyRank } from './MyRank';
const { ccclass, property } = _decorator;

@ccclass('VocabularyRankingView')
export class VocabularyRankingView extends BaseView {
    @property(List)
    public rank_list:List = null;
    private _myRank:MyRank = null;
    protected initUI(): void {
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
    private async initViewComponent(prefabType: PrefabTypeEntry, onComponentInit: (node: Node) => void, alignOptions?: object) {
        let node = await this.loadAndInitPrefab(prefabType, this.node, alignOptions);
        onComponentInit(node);
    }
    onLoadVocabularyRanking(item:Node, idx:number){

    }

}

