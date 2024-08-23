import { _decorator, isValid, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ClothingInfo, ClothingType, DataMgr } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { User } from '../../models/User';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { BagServer } from '../../service/BagService';
import List from '../../util/list/List';
import { BagConfig } from '../bag/BagConfig';
import { GoodsItemInfo } from '../bag/BagInfo';
import { TabTypeIds } from '../task/TaskInfo';
import { BuyStoreInfo, clothingTypeMapping, ShopClothingInfo } from './ShopInfo';
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
        this.offViewAdaptSize();
        this.updateShopClothingMapping();
        try {
            await this.initViews();
        } catch (err) {
            console.error("Failed to initialize ShopStoreView UI:", err);
        }
    }

    private updateShopClothingMapping() {
        this._shopClothing = {
            [TabTypeIds.ShopHairstyle]: { type: ClothingType.toufa, userClothes: User.userClothes.hair },
            [TabTypeIds.ShopAccessories]: { type: ClothingType.shipin, userClothes: User.userClothes.jewelry },
            [TabTypeIds.ShopTop]: { type: ClothingType.shangyi, userClothes: User.userClothes.coat },
            [TabTypeIds.ShopPants]: { type: ClothingType.kuzi, userClothes: User.userClothes.pants },
            [TabTypeIds.ShopShoes]: { type: ClothingType.xiezi, userClothes: User.userClothes.shoes },
            [TabTypeIds.ShopWing]: { type: ClothingType.chibang, userClothes: User.userClothes.wings },
            [TabTypeIds.ShopHat]: { type: ClothingType.maozi, userClothes: User.userClothes.hat },
            [TabTypeIds.ShopFaceShape]: { type: ClothingType.lian, userClothes: User.userClothes.face },
        };
    }

    protected onInitModuleEvent() {
        this.addModelListeners([
            [NetNotify.Classification_ShopItemBuy, this.onShopItemBuy.bind(this)],
            [EventType.Shop_Buy_Store, this.onShopBuyStore.bind(this)],
        ]);
    }

    private async initViews() {
        await this.initViewComponent(PrefabType.ShopPlayerView, (node) => {
            this._shopPlayerView = node.getComponent(ShopPlayerView);
        }, {
            isAlignRight: true,
            isAlignBottom: true,
            bottom: 60.5,
            right: 72.5
        });
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

    public async updateData(id: TabTypeIds) {
        this._curTabType = id;
        await this.getBuildItems(id);

        this.store_list.numItems = this._itemsData.length;
        const curClothing = this._shopClothing[id]?.userClothes;
        this.store_list.selectedId = this._itemsData.findIndex(item => item.id === curClothing);
        this.store_list.scrollTo(0, 0);
    }

    private onShopBuyStore(info: BuyStoreInfo) {
        this.clothingInfo = info;
        BagServer.reqShopItemBuy(info.ids, info.nums);
    }

    private onShopItemBuy(data: any) {
        if (!this.clothingInfo) return;

        const contentStr = this.clothingInfo.ids.map((id, i) => {
            const num = this.clothingInfo.nums[i];
            const goodsInfo: GoodsItemInfo = BagConfig.findGoodsItemInfo(id);
            return ` ${num}个 ${goodsInfo.name}`;
        }).join(', ');

        ViewsManager.showTip(`成功购买 ${contentStr}`);
        console.log("onShopItemBuy", data);
    }

    public onLoadShopStoreGrid(item: Node, idx: number) {
        const itemScript = item.getComponent(ShopStoreItem);
        const data = this._itemsData[idx];
        itemScript.initData(data);
    }

    public onShopStoreGridSelected(item: Node, selectedId: number, lastSelectedId: number, val: number) {
        if (isValid(selectedId) && selectedId >= 0 && isValid(item)) {
            this._shopClothing[this._curTabType].userClothes = this._itemsData[selectedId].id;
            this._shopPlayerView.updatePlayerProps(this._shopClothing, this._itemsData[selectedId].id);
        }
    }
}
