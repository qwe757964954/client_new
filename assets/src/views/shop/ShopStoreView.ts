import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ClothingInfo, DataMgr } from '../../manager/DataMgr';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { TabTypeIds } from '../task/TaskInfo';
import { clothingTypeMapping } from './ShopInfo';
import { ShopPlayerView } from './ShopPlayerView';
import { ShopStoreItem } from './ShopStoreItem';
const { ccclass, property } = _decorator;

@ccclass('ShopStoreView')
export class ShopStoreView extends BaseView {
    @property(List)
    public store_list: List = null;
    
    private _shopPlayerView:ShopPlayerView = null;
    private _itemsData: ClothingInfo[] = [];//编辑数据
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
    updateData(id:TabTypeIds){
        this.getBuildItems(id);
        this.store_list.numItems = this._itemsData.length;
        this.store_list.scrollTo(0, 0);
    }
    getBuildItems(id: TabTypeIds) {
        this._itemsData = [];
        const editConfig = DataMgr.clothingConfig;
        
        // 获取对应的 ClothingType
        const clothingType = clothingTypeMapping[id];
    
        if (clothingType !== undefined) {
            // 过滤数据
            this._itemsData = editConfig.filter(item => item.type === clothingType);
        }
    }

    onLoadShopStoreGrid(item:Node, idx:number){
        let item_sript:ShopStoreItem = item.getComponent(ShopStoreItem);
        let data = this._itemsData[idx];
        item_sript.initData(data);
    }

}

