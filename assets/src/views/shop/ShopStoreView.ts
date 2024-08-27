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
import { CothingSuitInfo, GoodsItemInfo } from '../bag/BagInfo';
import { TabTypeIds } from '../task/TaskInfo';
import { BuyStoreInfo, clothingTypeMapping, ShopClothingInfo } from './ShopInfo';
import { ShopPlayerView } from './ShopPlayerView';
import { ShopStoreItem } from './ShopStoreItem';
import { ShopSuitItem } from './ShopSuitItem';

const { ccclass, property } = _decorator;

@ccclass('ShopStoreView')
export class ShopStoreView extends BaseView {
    @property(List)
    public store_list: List = null;

    @property(List)
    public suit_list: List = null;

    private _shopPlayerView: ShopPlayerView = null;
    private _itemsData: ClothingInfo[] = [];
    private _suitItemsData: CothingSuitInfo[] = [];
    private clothingInfo: BuyStoreInfo = null;
    private _curTabType: TabTypeIds = null;
    private _shopClothing: { [key in TabTypeIds]?: ShopClothingInfo } = {};

    protected async initUI() {
        this.offViewAdaptSize();
        this.updateShopClothingMapping();
        console.log("user clothing", User.userClothes);
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
        } else if (id === TabTypeIds.ShopDressTotal) {
            this._itemsData = this.filterItems(editConfig, BagConfig.BagConfigInfo.goods_item_info);
        } else if (id === TabTypeIds.ShoSuitTotal) {
            this._suitItemsData = BagConfig.filterSuitData();
        }
    }

    private filterItems(clothingConfigs: ClothingInfo[], goodsItems: GoodsItemInfo[]): ClothingInfo[] {
        const idsInGoodsItems = new Set(goodsItems.map(item => item.id));
        return clothingConfigs.filter(item => idsInGoodsItems.has(item.id));
    }

    public async updateData(id: TabTypeIds) {
        this._curTabType = id;
        await this.getBuildItems(id);
        const isSuit = this._curTabType === TabTypeIds.ShoSuitTotal;
        this.suit_list.node.active = isSuit;
        this.store_list.node.active = !isSuit;
        if (isSuit) {
            this.suit_list.numItems = this._suitItemsData.length;
        } else {
            this.store_list.numItems = this._itemsData.length;
        }
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
        itemScript.initData(data, this._shopClothing);
    }

    public onShopStoreGridSelected(item: Node, selectedId: number, lastSelectedId: number, val: number) {
        this.handleGridSelection(item, selectedId, this._itemsData, (info) => {
            let clothing = this.findByType(info.type);
            let script = item.getComponent(ShopStoreItem);
            let rightStatus = script.getRightStatus();
            if (rightStatus) {
                script.changeRightActive();
                clothing.userClothes = null;
                this._shopPlayerView.unInstallPlayerProps(this._shopClothing, info.type);
            } else {
                clothing.userClothes = info.id;
                this.updateSelectProps(info);
                this._shopPlayerView.updatePlayerProps(this._shopClothing, info.id);
            }
        });
    }

    public onLoadSuitStoreGrid(item: Node, idx: number) {
        const itemScript = item.getComponent(ShopSuitItem);
        const data = this._suitItemsData[idx];
        itemScript.initData(data, this._shopClothing);
    }

    public onShopSuitGridSelected(item: Node, selectedId: number, lastSelectedId: number, val: number) {
        this.handleGridSelection(item, selectedId, this._suitItemsData, (data) => {
            const suitExist = BagConfig.isExistGoodsInPackage(data.items);
            if (suitExist) {
                return;
            }
            let script = item.getComponent(ShopSuitItem);
            let rightStatus = script.getRightStatus();
            if (rightStatus) {
                this.handleSuitDeselection(data);
            } else {
                this.handleSuitSelection(data);
            }
        });
    }

    private handleGridSelection(item: Node, selectedId: number, dataArray: any[], onSelect: (data: any) => void) {
        if (isValid(selectedId) && selectedId >= 0 && isValid(item)) {
            let data = dataArray[selectedId];
            if (isValid(data.id) && BagConfig.isExistInPackage(data.id.toString())) {
                return;
            }
            onSelect(data);
        }
    }

    private handleSuitDeselection(data: CothingSuitInfo) {
        for (const item of data.items) {
            const clothInfo = this._itemsData.find(dinfo => dinfo.id === item.id);
            let clothing = this.findByType(clothInfo.type);
            clothing.userClothes = null;
            this._shopPlayerView.unInstallPlayerProps(this._shopClothing, clothInfo.id);
        }
    }

    private handleSuitSelection(data: CothingSuitInfo) {
        for (const item of data.items) {
            const isExist = BagConfig.isExistInPackage(item.id.toString());
            if (!isExist) {
                const clothInfo = this._itemsData.find(dinfo => dinfo.id === item.id);
                let clothing = this.findByType(clothInfo.type);
                clothing.userClothes = clothInfo.id;
                this._shopPlayerView.updatePlayerProps(this._shopClothing, clothInfo.id);
            }
        }
        this.updateSuitSelectProps(data);
    }

    private updateSuitSelectProps(selectData: CothingSuitInfo) {
        this.updateListSelection(this.suit_list, (script) => {
            return !BagConfig.isExistGoodsInPackage(script.data.items) && script.data.suit_id === selectData.suit_id;
        });
    }

    private updateSelectProps(selectInfo: ClothingInfo) {
        this.updateListSelection(this.store_list, (script) => {
            return script.data.type === selectInfo.type && script.data.id === selectInfo.id;
        });
    }

    private updateListSelection(list: List, predicate: (script: any) => boolean) {
        const total = list.numItems;
        for (let i = 0; i < total; i++) {
            const node = list.getItemByListId(i);
            const script = node.getComponent(ShopStoreItem) || node.getComponent(ShopSuitItem);
            if (predicate(script)) {
                script.updateRightActive(true);
            } else {
                script.updateRightActive(false);
            }
        }
    }

    private findByType(type: number): ShopClothingInfo | undefined {
        return Object.values(this._shopClothing).find(clothing => clothing.type === type);
    }
}
