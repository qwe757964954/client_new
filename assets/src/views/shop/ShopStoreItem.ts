import { _decorator, Button, Label, Node, Sprite } from 'cc';
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
import { TabTypeIds } from '../task/TaskInfo';
import { GoodsDetailView } from './GoodsDetailView';
import { BuyStoreInfo, ShopClothingInfo } from './ShopInfo';

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

    @property({ type: Node, tooltip: "icon" })
    public rightIcon: Node = null;

    public data: ClothingInfo = null;
    private _shopClothing: { [key in TabTypeIds]?: ShopClothingInfo } = {};
    onLoad(): void {
        this.initEvent();
    }
    


    initData(data: ClothingInfo,shopInfo:{ [key in TabTypeIds]?: ShopClothingInfo }) {
        this.data = data;
        this.lblName.string = data.name;
        this._shopClothing = shopInfo;
        // this.rightIcon.active = this.findById(data.id);
        // Fetch necessary information directly
        const itemInfo: BagItemInfo = BagConfig.findShopItemInfo(data.id);
        const goodsInfo: GoodsItemInfo = BagConfig.findGoodsItemInfo(data.id);
        const itemDatas: ItemData[] = ObjectUtil.convertRewardData(goodsInfo.price);
        const isExist = BagConfig.isExistInPackage(data.id.toString());
        this.lblPrice.string = isExist ? "已存在":`${itemDatas[0].num}`;
        this.btnBuy.getComponent(Sprite).grayscale = isExist;
        this.btnBuy.getComponent(Button).interactable = !isExist;
        // Load sprite asynchronously and fix node scale
        LoadManager.loadSprite(BagConfig.transformPath(itemInfo.png), this.sprIcon).then(() => {
            CCUtil.fixNodeScale(this.sprIcon.node, 260, 260, true);
        });
    }

    updateRightActive(show:boolean){
        this.rightIcon.active = show;
    }

    initEvent() {
        CCUtil.onBtnClick(this.btnBuy, this.onBuyClick.bind(this));
    }

    removeEvent() {
    }

    onBuyClick() {
        const goodsInfo: GoodsItemInfo = BagConfig.findGoodsItemInfo(this.data.id);
        const itemDatas: ItemData[] = ObjectUtil.convertRewardData(goodsInfo.price);
        
        const useAmount = BagConfig.findItemInfo(itemDatas[0].id).name;
        const contentStr = `确认消耗 ${itemDatas[0].num} 个 ${useAmount} 购买 ${this.data.name} 吗？`;
        let buyInfo:BuyStoreInfo = {
            ids:[this.data.id],
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
