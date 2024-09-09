import { _decorator, Node } from 'cc';
import { ItemData } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { ObjectUtil } from '../../util/ObjectUtil';
import { BagConfig } from '../bag/BagConfig';
import { CothingSuitInfo } from '../bag/BagInfo';
import { BuyStoreInfo, ShopClothingMap } from './ShopInfo';
import { ShopItemBase } from './ShopItemBase';

const { ccclass } = _decorator;

@ccclass('ShopSuitItem')
export class ShopSuitItem extends ShopItemBase {
    private data: CothingSuitInfo = null;
    private _roleNode:Node = null;
    async initData(data: CothingSuitInfo, shopInfo: ShopClothingMap) {
        this.data = data;
        this._shopClothing = shopInfo;
        this.lblName.string = data.suit_title;

        this._roleNode = await ViewsManager.addRoleToNode(this.icon);
        const roleModel = this._roleNode.getComponent(RoleBaseModel);

        const [totalAmount, suitExist] = this.calculateSuitStatus(data.items, roleModel);

        this.lblPrice.string = suitExist ? "已存在" : `${totalAmount}`;
        this.btnBuySprite.grayscale = suitExist;
        this.btnBuyComponent.interactable = !suitExist;
    }

    private calculateSuitStatus(items: any[], roleModel: RoleBaseModel): [number, boolean] {
        let totalAmount = 0;
        let suitExist = false;

        for (const item of items) {
            roleModel.changeClothing(item.id);
            const itemDatas: ItemData[] = ObjectUtil.convertRewardData(item.price);
            const isExist = BagConfig.isExistInPackage(item.id.toString());

            if (isExist) {
                suitExist = true;
            } else {
                totalAmount += itemDatas[0].num;
            }
        }

        return [totalAmount, suitExist];
    }

    protected getPrice(): number {
        return this.calculateSuitStatus(this.data.items, this._roleNode.getComponent(RoleBaseModel))[0];
    }

    protected getItemName(): string {
        return "金币"; // Replace with dynamic logic if needed
    }

    protected prepareBuyInfo(): BuyStoreInfo {
        const ids: number[] = [];
        const nums: number[] = [];

        for (const item of this.data.items) {
            const isExist = BagConfig.isExistInPackage(item.id.toString());

            if (!isExist) {
                ids.push(item.id);
                nums.push(1);
            }
        }

        return { ids, nums };
    }
}
