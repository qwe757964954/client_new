import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ClothingInfo } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsManager } from '../../manager/ViewsManager';
import { ServiceMgr } from '../../net/ServiceManager';
import CCUtil from '../../util/CCUtil';
import { BagConfig } from '../bag/BagConfig';
import { BagItemInfo } from '../bag/BagInfo';
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
        let item_info:BagItemInfo = BagConfig.findShopItemInfo(data.id);
        // this.lblScore.string = "+" + goodData.medal;
        // this.lblPrice.string = data.buy.toString();
        this.lblPrice.string = "0";
        LoadManager.loadSprite(BagConfig.transformPath(item_info.png), this.sprIcon).then(() => {
            CCUtil.fixNodeScale(this.sprIcon.node, 260, 260, true);
        });
        // let not_buy = (User.buildingList.includes(data.id) && (data.type === EditType.Buiding || data.type === EditType.LandmarkBuiding))
        // this.btnBuy.getComponent(Sprite).grayscale = not_buy;
        // this.btnBuy.getComponent(Button).interactable = !not_buy;
        // this.lblPrice.string = not_buy ? "售罄" :data.buy.toString();
    }

    initEvent() {
        CCUtil.onBtnClick(this.btnBuy, this.onBuyClick.bind(this));
        // CCUtil.onTouch(this.ndGoods, this.onClickGoods, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.ndGoods, this.onClickGoods, this);
    }

    onBuyClick() {
        let use_amout = "金币";
        // let content_str = `确认消耗${this._data.buy}个${use_amout}购买${this._data.name}吗？`;
        let content_str = `确认消耗${0}个${use_amout}购买${this._data.name}吗？`;
        ViewsManager.showConfirm(content_str, () => {
            ServiceMgr.buildingService.reqBuyBuilding(this._data.id);
        })
        // ServiceMgr.shopService.buyGood(this._data.id);
        // EventMgr.emit(EventType.New_Building, this._data);
        // ViewsMgr.closeView(PrefabType.ShopUIView);
    }

    async onClickGoods() {
        let node = await ViewsManager.instance.showPopup(PrefabType.GoodsDetailView);
        let detail_script = node.getComponent(GoodsDetailView)
        // detail_script.initData(this._data);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }
}


