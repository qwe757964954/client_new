import { _decorator, isValid, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ClothingInfo, DataMgr } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { User } from '../../models/User';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { BagServer } from '../../service/BagService';
import List from '../../util/list/List';
import { BagConfig } from '../bag/BagConfig';
import { GoodsItemInfo } from '../bag/BagInfo';
import { TabTypeIds } from '../task/TaskInfo';
import { BuyStoreInfo, clothingTypeMapping, ShopClothingInfo, ShopClothingTypeMapping } from './ShopInfo';
import { ShopPlayerView } from './ShopPlayerView';
import { ShopStoreItem } from './ShopStoreItem';

const { ccclass, property } = _decorator;

@ccclass('ShopStoreView')
export class ShopStoreView extends BaseView {
    @property(List)
    public store_list: List = null;

    private _shopPlayerView: ShopPlayerView = null;
    private _itemsData: ClothingInfo[] = [];
    private clothingInfo: BuyStoreInfo = null;
    private _curTabType: TabTypeIds = null;
    private _shopClothing: { [key in TabTypeIds]?: ShopClothingInfo } = {};

    protected async initUI() {
        this._shopClothing = ShopClothingTypeMapping;
        try {
            console.log(User.userClothes);
            await this.initViews();
        } catch (err) {
            console.error("Failed to initialize ShopStoreView UI:", err);
        }
    }

    protected onInitModuleEvent() {
        this.addModelListeners([
            [NetNotify.Classification_ShopItemBuy, this.onShopItemBuy.bind(this)],
            [EventType.Shop_Buy_Store, this.onShopBuyStore.bind(this)],
        ]);
    }

    private async initViews() {
        await Promise.all([
            this.initViewComponent(PrefabType.ShopPlayerView, (node) => {
                this._shopPlayerView = node.getComponent(ShopPlayerView);
            }, {
                isAlignRight: true,
                isAlignBottom: true,
                bottom: 60.5,
                right: 72.5
            }),
        ]);
    }

    private async getBuildItems(id: TabTypeIds) {
        const editConfig = DataMgr.clothingConfig;
        const clothingType = clothingTypeMapping[id];

        if (clothingType !== undefined) {
            const filteredItems = this.filterItems(editConfig, BagConfig.BagConfigInfo.goods_item_info);
            this._itemsData = filteredItems.filter(item => item.type === clothingType);
        }
    }

    private filterItems(clothingConfigs: ClothingInfo[], goodsItems: GoodsItemInfo[]): ClothingInfo[] {
        const idsInGoodsItems = new Set(goodsItems.map(item => item.id));
        return clothingConfigs.filter(item => idsInGoodsItems.has(item.id));
    }

    public updateData(id: TabTypeIds) {
        this._curTabType = id;
        this.getBuildItems(id)
            .then(() => {
                this.store_list.numItems = this._itemsData.length;
                const curClothing = this._shopClothing[id]?.userClothes;
                this.store_list.selectedId = this._itemsData.findIndex(item => item.id === curClothing);
                this.store_list.scrollTo(0, 0);
            });
    }

    private onShopBuyStore(info: BuyStoreInfo) {
        this.clothingInfo = info;
        BagServer.reqShopItemBuy(info.ids, info.nums);
    }

    private onShopItemBuy(data: any) {
        if (!this.clothingInfo) return;
        
        let contentStr = '成功购买 ';
        this.clothingInfo.ids.forEach((id, i) => {
            const num = this.clothingInfo.nums[i];
            const goodsInfo: GoodsItemInfo = BagConfig.findGoodsItemInfo(id);
            contentStr += ` ${num}个 ${goodsInfo.name}`;
        });
        
        ViewsManager.showTip(contentStr);
        console.log("onShopItemBuy", data);
    }

    public onLoadShopStoreGrid(item: Node, idx: number) {
        const itemScript = item.getComponent(ShopStoreItem);
        const data = this._itemsData[idx];
        itemScript.initData(data);
    }

    public onShopStoreGridSelected(item: Node, selectedId: number, lastSelectedId: number, val: number) {
        if (!isValid(selectedId) || selectedId < 0 || !isValid(item)) return;

        this._shopClothing[this._curTabType].userClothes = this._itemsData[selectedId].id;
        this._shopPlayerView.updatePlayerProps(this._shopClothing, this._itemsData[selectedId].id);
    }
}
