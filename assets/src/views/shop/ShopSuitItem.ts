import { _decorator, Button, Label, Node, Sprite } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ItemData } from '../../manager/DataMgr';
import { PopMgr } from '../../manager/PopupManager';
import { ViewsManager } from '../../manager/ViewsManager';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import ListItem from '../../util/list/ListItem';
import { ObjectUtil } from '../../util/ObjectUtil';
import { BagConfig } from '../bag/BagConfig';
import { CothingSuitInfo } from '../bag/BagInfo';
import { TabTypeIds } from '../task/TaskInfo';
import { GoodsDetailView } from './GoodsDetailView';
import { BuyStoreInfo, ShopClothingInfo } from './ShopInfo';

const { ccclass, property } = _decorator;

@ccclass('ShopSuitItem')
export class ShopSuitItem extends ListItem {
    @property({ type: Label, tooltip: "标题" })
    public lblName: Label = null;

    @property({ type: Label, tooltip: "价格" })
    public lblPrice: Label = null;

    @property({ type: Node, tooltip: "可以点击的商品结点" })
    public ndGoods: Node = null;

    @property({ type: Node, tooltip: "购买按钮" })
    public btnBuy: Node = null;

    @property({ type: Node, tooltip: "商品图标" })
    public sprIcon: Node = null;

    @property({ type: Node, tooltip: "icon" })
    public rightIcon: Node = null;

    private data: CothingSuitInfo = null;
    private _shopClothing: { [key in TabTypeIds]?: ShopClothingInfo } = {};

    onLoad(): void {
        this.initEvent();
    }

    async initData(data: CothingSuitInfo, shopInfo: { [key in TabTypeIds]?: ShopClothingInfo }) {
        this.data = data;
        this._shopClothing = shopInfo;
        this.lblName.string = data.suit_title;

        const roleNode = await ViewsManager.addRoleToNode(this.sprIcon);
        const roleModel = roleNode.getComponent(RoleBaseModel);

        let totalAmount = 0;
        let suitExist = BagConfig.isExistGoodsInPackage(data.items);

        for (const item of data.items) {
            roleModel.changeClothing(item.id);
            const itemDatas: ItemData[] = ObjectUtil.convertRewardData(item.price);
            const isExist = BagConfig.isExistInPackage(item.id.toString());
            if (!isExist) {
                totalAmount += itemDatas[0].num;
            }
        }

        this.lblPrice.string = suitExist ? "已存在" : `${totalAmount}`;
        const btnSprite = this.btnBuy.getComponent(Sprite);
        btnSprite.grayscale = suitExist;
        this.btnBuy.getComponent(Button).interactable = !suitExist;
    }

    updateRightActive(show: boolean) {
        this.rightIcon.active = show;
    }

    private initEvent() {
        CCUtil.onBtnClick(this.btnBuy, this.onBuyClick.bind(this));
    }

    private removeEvent() {
        // Placeholder for any cleanup if needed
    }

    private onBuyClick() {
        let totalAmount = 0;
        let useAmount = "";
        const ids: number[] = [];
        const nums: number[] = [];

        for (const item of this.data.items) {
            const itemDatas: ItemData[] = ObjectUtil.convertRewardData(item.price);
            const isExist = BagConfig.isExistInPackage(item.id.toString());
            useAmount = BagConfig.findItemInfo(itemDatas[0].id).name;

            if (!isExist) {
                totalAmount += itemDatas[0].num;
                ids.push(item.id);
                nums.push(1);
            }
        }

        const contentStr = `确认消耗 ${totalAmount} 个 ${useAmount} 购买 ${this.data.suit_title} 吗？`;
        const buyInfo: BuyStoreInfo = {
            ids: ids,
            nums: nums
        };

        ViewsManager.showConfirm(contentStr, () => {
            EventMgr.dispatch(EventType.Shop_Buy_Store, buyInfo);
        });
    }

    async onClickGoods() {
        const node = await PopMgr.showPopup(PrefabType.GoodsDetailView);
        const detailScript = node.getComponent(GoodsDetailView);
        // Uncomment and implement if needed
        // detailScript.initData(this.data);
    }

    onDestroy(): void {
        this.removeEvent();
    }
}
