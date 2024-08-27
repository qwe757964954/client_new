import { _decorator, Button, Component, isValid, Label, Node, Sprite, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { ClothingType, ItemData } from '../../manager/DataMgr';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { User } from '../../models/User';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import { ObjectUtil } from '../../util/ObjectUtil';
import { BagConfig } from '../bag/BagConfig';
import { GoodsItemInfo } from '../bag/BagInfo';
import { TabTypeIds } from '../task/TaskInfo';
import { BuyStoreInfo, ShopClothingInfo } from './ShopInfo';

const { ccclass, property } = _decorator;

@ccclass('ShopPlayerView')
export class ShopPlayerView extends Component {
    @property({ type: Node, tooltip: "角色容器" })
    public roleContainer: Node = null;

    @property(Label)
    public clothing_number: Label = null;

    @property(Label)
    public clothing_amount: Label = null;

    @property(Node)
    public purchase_btn: Node = null;

    private _role: Node = null;
    private _shopClothing: { [key in TabTypeIds]?: ShopClothingInfo } = {};

    private btnBuyComponent: Button = null;
    private btnBuySprite: Sprite = null;

    start() {
        this.initializeComponents();
        this.initializeEvents();
        this.showRoleDress();
    }

    private initializeComponents() {
        this.btnBuyComponent = this.purchase_btn.getComponent(Button);
        this.btnBuySprite = this.purchase_btn.getComponent(Sprite);
    }

    private initializeEvents() {
        CCUtil.onBtnClick(this.purchase_btn, this.purchaseShopClothing.bind(this));
    }

    private async showRoleDress() {
        this.roleContainer.removeAllChildren();
        this._role = await ViewsManager.addRoleToNode(this.roleContainer);
        this._role.setScale(v3(-2, 2, 1));
    }

    public updatePlayerProps(shopClothing: { [key in TabTypeIds]?: ShopClothingInfo }, clothingId: number) {
        this._shopClothing = shopClothing;
        this.changeClothings(clothingId);
        this.updateClothingStatus();
    }

    public unInstallPlayerProps(shopClothing: { [key in TabTypeIds]?: ShopClothingInfo }, type: ClothingType) {
        this._shopClothing = shopClothing;
        this.resetClothings(type);
        this.updateClothingStatus();
    }

    private updateClothingStatus() {
        const needBuyClothings = this.findNeedBuyClothing();
        this.clothing_number.string = `${needBuyClothings.length}件`;
        
        const totalCount = this.getTotalClothing();
        this.clothing_amount.string = `${totalCount}`;

        const canBuy = totalCount > 0 && User.coin >= totalCount;
        this.btnBuyComponent.interactable = canBuy;
        this.btnBuySprite.grayscale = !canBuy;
    }

    private getTotalClothing(): number {
        return this.findNeedBuyClothing().reduce((total, clothingId) => {
            const goodsInfo: GoodsItemInfo = BagConfig.findGoodsItemInfo(clothingId);
            const itemDatas: ItemData[] = ObjectUtil.convertRewardData(goodsInfo.price);
            return total + itemDatas[0].num;
        }, 0);
    }

    private findNeedBuyClothing(): number[] {
        const shopClothingIds = Object.values(this._shopClothing)
            .map(item => item.userClothes)
            .filter((id): id is number => isValid(id));
        return shopClothingIds;
        // Filter out items that are already in user clothes
        // const userClothesIds = Object.values(User.userClothes).filter((id): id is number => id !== null);
        // return shopClothingIds.filter(id => !userClothesIds.includes(id));
    }

    public changeClothings(clothingId: number) {
        const roleModel = this._role.getComponent(RoleBaseModel);
        roleModel.changeClothing(clothingId);
    }

    public resetClothings(type: ClothingType) {
        const clothing = User.userClothes.getClothings();
        const id = clothing[type - 1];
        const roleModel = this._role.getComponent(RoleBaseModel);
        roleModel.changeClothing(id);
    }

    private purchaseShopClothing() {
        const needBuyClothings = this.findNeedBuyClothing();
        const totalCount = this.getTotalClothing();
        const useAmount = "金币";
        // const contentStr = `确认消耗 ${totalCount} 个 ${useAmount} 一键购买 吗？`;

        const contentStr = `<color=#000000>确认消耗<color=#ff0000>${totalCount}个${useAmount}</color><color=#000000>一键购买 吗?`;
        const buyInfo: BuyStoreInfo = {
            ids: needBuyClothings,
            nums: needBuyClothings.map(() => 1)
        };
        ViewsMgr.showConfirm("", () => {
            EventMgr.dispatch(EventType.Shop_Buy_Store, buyInfo);
        }).then((confirmView) => {
            confirmView.showRichText(contentStr);
        });
    }
}
