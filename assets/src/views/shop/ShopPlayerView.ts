import { _decorator, Component, instantiate, Label, Layers, Node, Prefab, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ItemData } from '../../manager/DataMgr';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { User } from '../../models/User';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import { NodeUtil } from '../../util/NodeUtil';
import { BagConfig } from '../bag/BagConfig';
import { GoodsItemInfo } from '../bag/BagInfo';
import { TKConfig } from '../task/TaskConfig';
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

    start() {
        this.showRoleDress();
        this.initEvents();
    }

    initEvents() {
        CCUtil.onBtnClick(this.purchase_btn, this.purchaseShopClothing.bind(this));
    }

    private async showRoleDress() {
        this.roleContainer.removeAllChildren();
        this._role = null;

        const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.RoleModel.path}`, Prefab);
        this._role = instantiate(prefab);
        this._role.setScale(v3(2, 2, 1));
        this.roleContainer.addChild(this._role);

        NodeUtil.setLayerRecursively(this._role, Layers.Enum.UI_2D);
        const roleModel = this._role.getComponent(RoleBaseModel);
        roleModel.initSelf();
        roleModel.show(true);
    }

    public updatePlayerProps(shopClothing: { [key in TabTypeIds]?: ShopClothingInfo }, clothingId: number) {
        this._shopClothing = shopClothing;
        this.changeClothings(clothingId);

        const needBuyClothings = this.findNeedBuyClothing();
        this.clothing_number.string = `${needBuyClothings.length}件`;

        const totalCount = this.getTotalClothing();
        this.clothing_amount.string = `${totalCount}`;
    }

    private getTotalClothing(): number {
        const needBuyClothings = this.findNeedBuyClothing();
        return needBuyClothings.reduce((total, clothingId) => {
            const goodsInfo: GoodsItemInfo = BagConfig.findGoodsItemInfo(clothingId);
            const itemDatas: ItemData[] = TKConfig.convertRewardData(goodsInfo.price);
            return total + itemDatas[0].num;
        }, 0);
    }

    private findNeedBuyClothing(): number[] {
        const shopClothingIds = Object.values(this._shopClothing)
            .map(item => item.userClothes)
            .filter((id): id is number => id !== null);

        const userClothesIds = Object.values(User.userClothes)
            .filter((id): id is number => id !== null);

        return shopClothingIds.filter(id => !userClothesIds.includes(id));
    }

    public changeClothings(clothingId: number) {
        const roleModel = this._role.getComponent(RoleBaseModel);
        roleModel.changeClothing(clothingId);
    }

    private purchaseShopClothing() {
        const needBuyClothings = this.findNeedBuyClothing();
        const totalCount = this.getTotalClothing();
        const useAmount = "金币";
        const contentStr = `确认消耗 ${totalCount} 个 ${useAmount} 一键购买 吗？`;

        const buyInfo: BuyStoreInfo = {
            ids: needBuyClothings,
            nums: needBuyClothings.map(() => 1)
        };

        ViewsManager.showConfirm(contentStr, () => {
            EventMgr.dispatch(EventType.Shop_Buy_Store, buyInfo);
        });
    }
}
