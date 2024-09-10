import { _decorator, Layout, Sprite } from 'cc';
import { EventType } from '../../config/EventType';
import { ClothingInfo, ItemData } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsMgr } from '../../manager/ViewsManager';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import { ObjectUtil } from '../../util/ObjectUtil';
import { BagConfig } from '../bag/BagConfig';
import { BuyStoreInfo, ShopClothingMap } from './ShopInfo';
import { ShopItemBase } from './ShopItemBase';

const { ccclass } = _decorator;

@ccclass('ShopStoreItem')
export class ShopStoreItem extends ShopItemBase {
    public data: ClothingInfo = null;

    initData(data: ClothingInfo, shopInfo: ShopClothingMap): void {
        this.data = data;
        this._shopClothing = shopInfo;
        this.lblName.string = data.name;

        const itemInfo = BagConfig.findShopItemInfo(data.id);
        const goodsInfo = BagConfig.findGoodsItemInfo(data.id);
        const itemDatas: ItemData[] = ObjectUtil.convertRewardData(goodsInfo.price);
        const isExist = BagConfig.isExistInPackage(data.id.toString());

        this.lblPrice.string = isExist ? "已拥有" : `${itemDatas[0].num}`;
        this.btnBuySprite.grayscale = isExist;
        this.btnBuyComponent.interactable = !isExist;

        this.updateIcon(itemInfo.png, isExist);
        this.goldLayout.getChildByName("icon").active = !isExist;
        this.goldLayout.getComponent(Layout).updateLayout();
    }

    private updateIcon(path: string, isExist: boolean): void {
        const sprIcon = this.icon.getComponent(Sprite);
        LoadManager.loadSprite(BagConfig.transformPath(path), sprIcon).then(() => {
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

    protected async gotoBuy(): Promise<void> {
        const totalAmount = this.getPrice();
        const itemName = this.getItemName();
        const buyInfo: BuyStoreInfo = this.prepareBuyInfo();

        const contentStr = `<color=#000000>确认消耗<color=#ff0000>${totalAmount}个${itemName}</color><color=#000000>购买</color><color=#ff0000>${this.lblName.string}</color><color=#000000>吗？</color>`;
        ViewsMgr.showConfirm("", () => {
            EventMgr.dispatch(EventType.Shop_Buy_Store, buyInfo);
        }).then((confirmView) => {
            confirmView.showRichText(contentStr);
        });
    }

    protected prepareBuyInfo(): BuyStoreInfo {
        return {
            ids: [this.data.id],
            nums: [1]
        };
    }
}
