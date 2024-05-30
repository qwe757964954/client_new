import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { GoodsItemData } from '../../models/GoodsModel';
import { LoadManager } from '../../manager/LoadManager';
import CCUtil from '../../util/CCUtil';
import { ServiceMgr } from '../../net/ServiceManager';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';
import { GoodsDetailView } from './GoodsDetailView';
const { ccclass, property } = _decorator;

@ccclass('ShopGoodsItem')
export class ShopGoodsItem extends Component {
    @property({ type: Label, tooltip: "标题" })
    public lblName: Label = null;

    @property({ type: Label, tooltip: "分数" })
    public lblScore: Label = null;

    @property({ type: Label, tooltip: "价格" })
    public lblPrice: Label = null;

    @property({ type: Label, tooltip: "土地数" })
    public lblLand: Label = null;

    @property({ type: Node, tooltip: "土地结点" })
    public ndLand: Node = null;

    @property({ type: Node, tooltip: "可以点击的商品结点" })
    public ndGoods: Node = null;

    @property({ type: Node, tooltip: "购买按钮" })
    public btnBuy: Node = null;

    @property({ type: Sprite, tooltip: "功能图标" })
    public sprFunction: Sprite = null;

    @property({ type: Sprite, tooltip: "商品图标" })
    public sprIcon: Sprite = null;

    @property({ type: [SpriteFrame], tooltip: "功能性图标" })
    public sprFuncAry: SpriteFrame[] = [];

    _data: GoodsItemData = null;

    protected onLoad(): void {
        this.initEvent();
    }

    async initData(goodData: GoodsItemData) {
        this._data = goodData;

        this.lblName.string = goodData.name;
        this.lblScore.string = "+" + goodData.medal;
        this.lblPrice.string = "" + goodData.price;
        if (goodData.land > 0) {
            this.ndLand.active = true;
            this.lblLand.string = "+" + goodData.land;
        }
        else {
            this.ndLand.active = false;
            this.lblLand.string = "0";
        }

        this.sprFunction.node.active = true;
        if (goodData.funtype == 1) { //功能性图标
            this.sprFunction.spriteFrame = this.sprFuncAry[0];
        }
        else if (goodData.funtype == 2) {
            this.sprFunction.spriteFrame = this.sprFuncAry[1];
        }
        else {
            this.sprFunction.node.active = false;
        }
        let iconPath: string = "shop/" + goodData.icon + "/spriteFrame";
        await LoadManager.loadSprite(iconPath, this.sprIcon);

    }

    initEvent() {
        CCUtil.onTouch(this.btnBuy, this.onBuyClick, this);
        CCUtil.onTouch(this.ndGoods, this.onClickGoods, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.btnBuy, this.onBuyClick, this);
        CCUtil.offTouch(this.ndGoods, this.onClickGoods, this);
    }

    onBuyClick() {
        ServiceMgr.shopService.buyGood(this._data.id);
    }

    onClickGoods() {
        ViewsManager.instance.showView(PrefabType.GoodsDetailView, (node: Node) => {
            node.getComponent(GoodsDetailView).initData(this._data);
        });
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


