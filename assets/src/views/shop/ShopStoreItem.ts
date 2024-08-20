import { _decorator, Label, Node, Sprite } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ClothingInfo, ItemData } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { PopMgr } from '../../manager/PopupManager';
import { ViewsManager } from '../../manager/ViewsManager';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import ListItem from '../../util/list/ListItem';
import { ObjectUtil } from '../../util/ObjectUtil';
import { BagConfig } from '../bag/BagConfig';
import { BagItemInfo, GoodsItemInfo } from '../bag/BagInfo';
import { GoodsDetailView } from './GoodsDetailView';
import { BuyStoreInfo } from './ShopInfo';

const { ccclass, property } = _decorator;

@ccclass('ShopStoreItem')
export class ShopStoreItem extends ListItem {
    @property({ type: Label, tooltip: "标题" })
    public lblName: Label = null;

    @property({ type: Label, tooltip: "价格" })
    public lblPrice: Label = null;

    @property({ type: Node, tooltip: "可以点击的商品结点" })
    public ndGoods: Node = null;

    @property({ type: Node, tooltip: "购买按钮" })
    public btnBuy: Node = null;

    @property({ type: Sprite, tooltip: "商品图标" })
    public sprIcon: Sprite = null;

    private _data: ClothingInfo = null;

    onLoad(): void {
        this.initEvent();
    }
    
    initData(data: ClothingInfo) {
        this._data = data;
        this.lblName.string = data.name;
        
        // Fetch necessary information directly
        const itemInfo: BagItemInfo = BagConfig.findShopItemInfo(data.id);
        const goodsInfo: GoodsItemInfo = BagConfig.findGoodsItemInfo(data.id);
        const itemDatas: ItemData[] = ObjectUtil.convertRewardData(goodsInfo.price);
        
        this.lblPrice.string = `${itemDatas[0].num}`;

        // Load sprite asynchronously and fix node scale
        LoadManager.loadSprite(BagConfig.transformPath(itemInfo.png), this.sprIcon).then(() => {
            CCUtil.fixNodeScale(this.sprIcon.node, 260, 260, true);
        });
    }

    initEvent() {
        CCUtil.onBtnClick(this.btnBuy, this.onBuyClick.bind(this));
    }

    removeEvent() {
    }

    onBuyClick() {
        const goodsInfo: GoodsItemInfo = BagConfig.findGoodsItemInfo(this._data.id);
        const itemDatas: ItemData[] = ObjectUtil.convertRewardData(goodsInfo.price);
        
        const useAmount = BagConfig.findItemInfo(itemDatas[0].id).name;
        const contentStr = `确认消耗 ${itemDatas[0].num} 个 ${useAmount} 购买 ${this._data.name} 吗？`;
        let buyInfo:BuyStoreInfo = {
            ids:[this._data.id],
            nums:[1]
        }
        ViewsManager.showConfirm(contentStr, () => {
            EventMgr.dispatch(EventType.Shop_Buy_Store,buyInfo);
        });
    }

    async onClickGoods() {
        const node = await PopMgr.showPopup(PrefabType.GoodsDetailView);
        const detailScript = node.getComponent(GoodsDetailView);
        // detailScript.initData(this._data);
    }

    onDestroy(): void {
        this.removeEvent();
    }
}
