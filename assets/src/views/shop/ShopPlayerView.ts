import { _decorator, Button, Component, isValid, Label, Node, Sprite, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ClothingType } from '../../manager/DataMgr';
import { PopMgr } from '../../manager/PopupManager';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { User } from '../../models/User';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import { ObjectUtil } from '../../util/ObjectUtil';
import { BagConfig } from '../bag/BagConfig';
import { BuyStoreInfo, ShopClothingMap } from './ShopInfo';
import { ShopPlayerClothing } from './ShopPlayerClothing';

const { ccclass, property } = _decorator;

@ccclass('ShopPlayerView')
export class ShopPlayerView extends Component {
    @property({ type: Node, tooltip: "角色容器" })
    public roleContainer: Node = null;

    @property(Label)
    public clothingNumberLabel: Label = null;

    @property(Label)
    public clothingAmountLabel: Label = null;

    @property(Node)
    public purchaseButtonNode: Node = null;

    private roleNode: Node = null;
    public shopClothing: ShopClothingMap = {};

    private btnBuyComponent: Button = null;
    private btnBuySprite: Sprite = null;
    private _canBuy: boolean = true;
    start() {
        this.initializeComponents();
        this.initializeEvents();
        this.showRoleDress();
    }

    private initializeComponents() {
        this.btnBuyComponent = this.purchaseButtonNode.getComponent(Button);
        this.btnBuySprite = this.purchaseButtonNode.getComponent(Sprite);
    }

    private initializeEvents() {
        CCUtil.onBtnClick(this.purchaseButtonNode, this.onRoleClick.bind(this));
        CCUtil.onBtnClick(this.roleContainer, this.onRoleClick.bind(this));
    }

    private async showRoleDress() {
        this.roleContainer.removeAllChildren();
        this.roleNode = await ViewsManager.addRoleToNode(this.roleContainer);
        this.roleNode.setScale(v3(-2, 2, 1));
        this.roleNode.setPosition(0, -270.925, 0);
    }

    public updatePlayerProps(shopClothing: ShopClothingMap, clothingId: number) {
        this.shopClothing = shopClothing;
        this.updateClothing(clothingId);
        this.updateClothingStatus();
    }

    public unInstallPlayerProps(shopClothing: ShopClothingMap, type: ClothingType) {
        this.shopClothing = shopClothing;
        this.resetClothing(type);
        this.updateClothingStatus();
    }

    public updateClothingStatus() {
        const needBuyClothings = this.getNeedBuyClothingIds();
        this.clothingNumberLabel.string = `${needBuyClothings.length}件`;

        const totalCount = this.calculateTotalClothingCost();
        this.clothingAmountLabel.string = `${totalCount}`;

        this._canBuy = totalCount > 0 && User.coin >= totalCount;
        // this.btnBuyComponent.interactable = canBuy;
        this.btnBuySprite.grayscale = !this._canBuy;
    }

    private calculateTotalClothingCost(): number {
        return this.getNeedBuyClothingIds().reduce((total, clothingId) => {
            const goodsInfo = BagConfig.findGoodsItemInfo(clothingId);
            const itemDatas = ObjectUtil.convertRewardData(goodsInfo.price);
            return total + itemDatas[0].num;
        }, 0);
    }

    private getNeedBuyClothingIds(): number[] {
        return Object.values(this.shopClothing)
            .map(item => item.userClothes)
            .filter((id): id is number => isValid(id))
            .filter(id => !BagConfig.isExistInPackage(id.toString()));
    }

    public updateClothing(clothingId: number) {
        const roleModel = this.roleNode.getComponent(RoleBaseModel);
        roleModel.changeClothing(clothingId);
    }

    public resetClothing(type: ClothingType) {
        const clothing = User.userClothes.getClothings();
        const id = clothing[type - 1];
        const roleModel = this.roleNode.getComponent(RoleBaseModel);
        roleModel.changeClothing(id);
    }

    private purchaseShopClothing() {
        if(!this._canBuy){
            ViewsMgr.showTip("购物车是空或金币不足");
            return;
        }
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
        });
    }

    public async onRoleClick() {
        if(!this._canBuy){
            ViewsMgr.showTip("购物车是空或金币不足");
            return;
        }
        let node = await PopMgr.showPopup(PrefabType.ShopPlayerClothing);
        node.getComponent(ShopPlayerClothing).updateData(this.shopClothing);
    }
}
