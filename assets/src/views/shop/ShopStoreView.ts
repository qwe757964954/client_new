import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ClothingInfo, DataMgr } from '../../manager/DataMgr';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { BagConfig } from '../bag/BagConfig';
import { GoodsItemInfo } from '../bag/BagInfo';
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

    protected onInitModuleEvent() {
        this.addModelListeners([
            [NetNotify.Classification_ShopItemBuy, this.onShopItemBuy],
        ]);
    }
    onShopItemBuy(data:any){
        console.log("onShopItemBuy",data);
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
    filterItems(clothingConfigs: ClothingInfo[], goodsItems: GoodsItemInfo[]): ClothingInfo[] {
        const idsInClothingConfigs = new Set(goodsItems.map(item => item.id));
        const cleanedArray = clothingConfigs.filter(item=>idsInClothingConfigs.has(item.id));
        return cleanedArray;
    }
    

    getBuildItems(id: TabTypeIds) {
        this._itemsData = [];
        const editConfig = DataMgr.clothingConfig;
        const clothingType = clothingTypeMapping[id];
        // Assuming BagConfig.BagConfigInfo.goods_item_info is GoodsItemInfo[]
        const filteredItems = this.filterItems(editConfig, BagConfig.BagConfigInfo.goods_item_info);        
        if (clothingType !== undefined) {
            this._itemsData = filteredItems.filter(item => item.type === clothingType);
        }
    }

    onLoadShopStoreGrid(item:Node, idx:number){
        let item_sript:ShopStoreItem = item.getComponent(ShopStoreItem);
        let data = this._itemsData[idx];
        item_sript.initData(data);
    }

}

