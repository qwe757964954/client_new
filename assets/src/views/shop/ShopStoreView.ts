import { _decorator } from 'cc';
import { PrefabType } from '../../config/PrefabType';
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
}

