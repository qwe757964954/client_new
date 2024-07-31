import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { EditInfo } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsManager } from '../../manager/ViewsManager';
import { ServiceMgr } from '../../net/ServiceManager';
import CCUtil from '../../util/CCUtil';
import { ToolUtil } from '../../util/ToolUtil';
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

    private _data: EditInfo = null;

    protected onLoad(): void {
        this.initEvent();
    }

    initData(data: EditInfo) {
        this._data = data;

        this.lblName.string = data.name;
        // this.lblScore.string = "+" + goodData.medal;
        this.lblPrice.string = data.buy.toString();
        this.lblLand.string = ToolUtil.replace(TextConfig.Pet_Mood_Prop, data.width*data.height);
        this.sprFunction.spriteFrame = this.sprFuncAry[data.type - 1];
        LoadManager.loadSprite(data.png, this.sprIcon).then(() => {
            CCUtil.fixNodeScale(this.sprIcon.node, 260, 260, true);
        });
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
        let use_amout = "金币";
        let content_str = `确认消耗${this._data.buy}个${use_amout}购买${this._data.name}吗？`;
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
        detail_script.initData(this._data);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }
}


