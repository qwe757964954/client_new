import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ClothingInfo, ItemData } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsManager } from '../../manager/ViewsManager';
import { BagServer } from '../../service/BagService';
import CCUtil from '../../util/CCUtil';
import { BagConfig } from '../bag/BagConfig';
import { BagItemInfo, GoodsItemInfo } from '../bag/BagInfo';
import { TKConfig } from '../task/TaskConfig';
import { GoodsDetailView } from './GoodsDetailView';

const { ccclass, property } = _decorator;

@ccclass('ShopStoreItem')
export class ShopStoreItem extends Component {
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

    protected onLoad(): void {
        this.initEvent();
    }
    
    initData(data: ClothingInfo) {
        this._data = data;
        this.lblName.string = data.name;
        
        // Fetch necessary information directly
        const itemInfo: BagItemInfo = BagConfig.findShopItemInfo(data.id);
        const goodsInfo: GoodsItemInfo = BagConfig.findGoodsItemInfo(data.id);
        const itemDatas: ItemData[] = TKConfig.convertRewardData(goodsInfo.price);
        
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
        const itemDatas: ItemData[] = TKConfig.convertRewardData(goodsInfo.price);
        
        const useAmount = BagConfig.findItemInfo(itemDatas[0].id).name;
        const contentStr = `确认消耗 ${itemDatas[0].num} 个 ${useAmount} 购买 ${this._data.name} 吗？`;
        
        const ids = itemDatas.map(item => item.id);
        const nums = itemDatas.map(item => item.num);
        
        ViewsManager.showConfirm(contentStr, () => {
            BagServer.reqShopItemBuy(ids, nums);
        });
    }

    async onClickGoods() {
        const node = await ViewsManager.instance.showPopup(PrefabType.GoodsDetailView);
        const detailScript = node.getComponent(GoodsDetailView);
        // detailScript.initData(this._data);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }
}
