import { _decorator, isValid, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { ClothingInfo, DataMgr } from '../../manager/DataMgr';
import { ViewsMgr } from '../../manager/ViewsManager';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import { ObjectUtil } from '../../util/ObjectUtil';
import { BagConfig } from '../bag/BagConfig';
import { GoodsItemInfo } from '../bag/BagInfo';
import { BuyStoreInfo, ShopClothingMap } from './ShopInfo';
import { ShopStoreItem } from './ShopStoreItem';

const { ccclass, property } = _decorator;

@ccclass('ShopPlayerClothing')
export class ShopPlayerClothing extends BasePopup {
    @property(List)
    private storeList: List = null;

    @property(Node)
    private btnClose: Node = null;

    @property(Node)
    private purchaseButton: Node = null;

    public shopClothing: ShopClothingMap = {};
    private itemsData: ClothingInfo[] = [];

    protected initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("content")]);
    }

    public updateData(map: ShopClothingMap) {
        this.shopClothing = map;
        this.loadClothingItems();
    }

    private async loadClothingItems() {
        const editConfig = DataMgr.clothingConfig;
        const ids = this.getNeedBuyClothingIds();
        this.itemsData = this.filterItems(editConfig, BagConfig.BagConfigInfo.goods_item_info)
            .filter(item => ids.includes(item.id));
        
        console.log("Clothing Items Loaded:", this.itemsData);
        this.storeList.numItems = this.itemsData.length;
    }

    private filterItems(clothingConfigs: ClothingInfo[], goodsItems: GoodsItemInfo[]): ClothingInfo[] {
        const idsInGoodsItems = new Set(goodsItems.map(item => item.id));
        return clothingConfigs.filter(item => idsInGoodsItems.has(item.id));
    }

    private getNeedBuyClothingIds(): number[] {
        return Object.values(this.shopClothing)
            .map(item => item.userClothes)
            .filter((id): id is number => isValid(id))
            .filter(id => !BagConfig.isExistInPackage(id.toString()));
    }

    private calculateTotalClothingCost(): number {
        return this.getNeedBuyClothingIds().reduce((total, clothingId) => {
            const goodsInfo = BagConfig.findGoodsItemInfo(clothingId);
            const itemDatas = ObjectUtil.convertRewardData(goodsInfo.price);
            return total + itemDatas[0].num;
        }, 0);
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.btnClose, this.onClickClose.bind(this));
        CCUtil.onBtnClick(this.purchaseButton, this.onPurchase.bind(this));
    }

    private onClickClose() {
        this.closePop();
    }

    private onPurchase() {
        const needBuyClothings = this.getNeedBuyClothingIds();
        const totalCount = this.calculateTotalClothingCost();
        const useAmount = "金币";

        const contentStr = `<color=#000000>确认消耗<color=#ff0000>${totalCount}个${useAmount}</color><color=#000000>一键购买 吗?</color>`;
        const buyInfo: BuyStoreInfo = {
            ids: needBuyClothings,
            nums: needBuyClothings.map(() => 1),
        };

        ViewsMgr.showConfirm("", () => {
            EventMgr.dispatch(EventType.Shop_Buy_Store, buyInfo);
        }).then((confirmView) => {
            confirmView.showRichText(contentStr);
            this.closePop();
        });
    }

    public onLoadShopStoreGrid(item: Node, idx: number) {
        const itemScript = item.getComponent(ShopStoreItem);
        const data = this.itemsData[idx];
        itemScript.initData(data, this.shopClothing);
    }
}
