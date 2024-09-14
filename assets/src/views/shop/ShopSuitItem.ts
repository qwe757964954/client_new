import { _decorator, Layout, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { ItemData } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { EventMgr } from '../../util/EventManager';
import { ObjectUtil } from '../../util/ObjectUtil';
import { BagConfig } from '../bag/BagConfig';
import { CothingSuitInfo } from '../bag/BagInfo';
import { BuyStoreInfo, ShopClothingMap } from './ShopInfo';
import { ShopItemBase } from './ShopItemBase';

const { ccclass } = _decorator;

@ccclass('ShopSuitItem')
export class ShopSuitItem extends ShopItemBase {
    private data: CothingSuitInfo = null;
    private _roleNode: Node = null;

    async initData(data: CothingSuitInfo, shopInfo: ShopClothingMap): Promise<void> {
        this.data = data;
        this._shopClothing = shopInfo;
        this.lblName.string = data.suit_title;

        this._roleNode = await ViewsManager.addRoleToNode(this.icon);
        const roleModel = this._roleNode.getComponent(RoleBaseModel);

        const [totalAmount, suitExist] = this.calculateSuitStatus(data.items, roleModel);

        this.lblPrice.string = suitExist ? "已拥有" : `${totalAmount}`;
        this.btnBuySprite.grayscale = suitExist;
        this.btnBuyComponent.interactable = !suitExist;

        this.goldLayout.getChildByName("icon").active = !suitExist;
        this.goldLayout.getComponent(Layout).updateLayout();
    }

    private calculateSuitStatus(items: any[], roleModel: RoleBaseModel): [number, boolean] {
        let totalAmount = 0;
        let suitCount = 0;

        items.forEach(item => {
            roleModel.changeClothing(item.id);
            const itemDatas: ItemData[] = ObjectUtil.convertRewardData(item.price);
            if (BagConfig.isExistInPackage(item.id.toString())) {
                suitCount++;
            } else {
                totalAmount += itemDatas[0].num;
            }
        });

        return [totalAmount, suitCount === items.length];
    }

    protected getPrice(): number {
        return this.calculateSuitStatus(this.data.items, this._roleNode.getComponent(RoleBaseModel))[0];
    }

    protected getItemName(): string {
        return "金币"; // Static as the suit item does not have a specific item name
    }

    protected async gotoBuy(): Promise<void> {
        EventMgr.dispatch(EventType.Shop_Buy_Suit_Detail, this.data);
    }

    protected prepareBuyInfo(): BuyStoreInfo {
        const ids: number[] = [];
        const nums: number[] = [];

        this.data.items.forEach(item => {
            if (!BagConfig.isExistInPackage(item.id.toString())) {
                ids.push(item.id);
                nums.push(1);
            }
        });

        return { ids, nums };
    }
}
