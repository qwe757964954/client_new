import { _decorator, Sprite } from 'cc';
import { ClothingInfo, ItemData } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import CCUtil from '../../util/CCUtil';
import { ObjectUtil } from '../../util/ObjectUtil';
import { BagConfig } from '../bag/BagConfig';
import { TabTypeIds } from '../task/TaskInfo';
import { BuyStoreInfo, ShopClothingInfo } from './ShopInfo';
import { ShopItemBase } from './ShopItemBase';

const { ccclass } = _decorator;

@ccclass('ShopStoreItem')
export class ShopStoreItem extends ShopItemBase {
    public data: ClothingInfo = null;

    initData(data: ClothingInfo, shopInfo: { [key in TabTypeIds]?: ShopClothingInfo }) {
        this.data = data;
        this.lblName.string = data.name;
        this._shopClothing = shopInfo;

        const itemInfo = BagConfig.findShopItemInfo(data.id);
        const goodsInfo = BagConfig.findGoodsItemInfo(data.id);
        const itemDatas: ItemData[] = ObjectUtil.convertRewardData(goodsInfo.price);
        const isExist = BagConfig.isExistInPackage(data.id.toString());

        this.lblPrice.string = isExist ? "已存在" : `${itemDatas[0].num}`;
        this.btnBuySprite.grayscale = isExist;
        this.btnBuyComponent.interactable = !isExist;

        const sprIcon = this.icon.getComponent(Sprite);

        LoadManager.loadSprite(BagConfig.transformPath(itemInfo.png), sprIcon).then(() => {
            CCUtil.fixNodeScale(this.icon, 260, 260, true);
        });
    }

    protected getPrice(): number {
        const goodsInfo = BagConfig.findGoodsItemInfo(this.data.id);
        const itemDatas: ItemData[] = ObjectUtil.convertRewardData(goodsInfo.price);
        return itemDatas[0].num;
    }

    protected getItemName(): string {
        const goodsInfo = BagConfig.findGoodsItemInfo(this.data.id);
        const itemDatas: ItemData[] = ObjectUtil.convertRewardData(goodsInfo.price);
        return BagConfig.findItemInfo(itemDatas[0].id).name;
    }

    protected prepareBuyInfo(): BuyStoreInfo {
        return {
            ids: [this.data.id],
            nums: [1]
        };
    }
}
