import { _decorator, Node } from 'cc';
import { PrefabType, PrefabTypeEntry } from '../../config/PrefabType';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { ShopPlayerView } from './ShopPlayerView';
const { ccclass, property } = _decorator;

@ccclass('ShopStoreView')
export class ShopStoreView extends BaseView {
    @property(List)
    public store_list: List = null;
    
    private _shopPlayerView:ShopPlayerView = null;

    protected async initUI(){
        try {
            await this.initViews();
        } catch (err) {
            console.error("Failed to ShopStoreView nitialize UI:", err);
        }
    }

    private async initViews() {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        await Promise.all([
            this.initViewComponent(PrefabType.ShopPlayerView, (node) => this._shopPlayerView = node.getComponent(ShopPlayerView), 
            {
                isAlignRight: true,
                isAlignBottom: true,
                bottom: 60.5,
                right: 72.5
            }),
        ]);
    }

    private async initViewComponent(prefabType: PrefabTypeEntry, onComponentInit: (node: Node) => void, alignOptions?: object) {
        let node = await this.loadAndInitPrefab(prefabType, this.node, alignOptions);
        onComponentInit(node);
    }
}

