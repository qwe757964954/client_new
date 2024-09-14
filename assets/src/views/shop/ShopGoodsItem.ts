import { _decorator, Button, Component, Label, Layout, Node, Sprite, SpriteFrame } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { EditInfo, EditType } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { PopMgr } from '../../manager/PopupManager';
import { ViewsMgr } from '../../manager/ViewsManager';
import { User } from '../../models/User';
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

    @property(Node)
    public goldLayout: Node = null;

    private _data: EditInfo = null;

    protected onLoad(): void {
        this.initEvent();
    }

    initData(data: EditInfo) {
        this._data = data;

        this.lblName.string = data.name;
        // this.lblScore.string = "+" + goodData.medal;
        this.lblPrice.string = data.buy.toString();
        this.lblLand.string =  ToolUtil.replace(TextConfig.Pet_Mood_Prop, `${data.width}x${data.height}`);
        this.sprFunction.spriteFrame = this.sprFuncAry[data.type - 1];
        LoadManager.loadSprite(data.png, this.sprIcon).then(() => {
            CCUtil.fixNodeScale(this.sprIcon.node, 260, 260, true);
        });
        let not_buy = (User.buildingList.includes(data.id) && (data.type === EditType.Buiding || data.type === EditType.LandmarkBuiding))
        this.btnBuy.getComponent(Sprite).grayscale = not_buy;
        this.btnBuy.getComponent(Button).interactable = !not_buy;
        this.lblPrice.string = not_buy ? "达拥有上限" :data.buy.toString();

        this.goldLayout.getChildByName("icon").active = !not_buy;
        this.goldLayout.getComponent(Layout).updateLayout();
    }

    initEvent() {
        CCUtil.onBtnClick(this.btnBuy, this.onBuyClick.bind(this));
        CCUtil.onTouch(this.ndGoods, this.onClickGoods, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.ndGoods, this.onClickGoods, this);
    }

    onBuyClick() {
        let use_amout = "金币";
        const contentStr = `<color=#000000>确认消耗<color=#ff0000>${this._data.buy}个${use_amout}</color><color=#000000>购买</color><color=#ff0000>${this._data.name}</color><color=#000000>吗？</color>`;
        ViewsMgr.showConfirm("", () => {
            ServiceMgr.buildingService.reqBuyBuilding(this._data.id);
        }).then((confirmView) => {
            confirmView.showRichText(contentStr);
        });
    }

    async onClickGoods() {
        let node = await PopMgr.showPopup(PrefabType.GoodsDetailView);
        let detail_script = node.getComponent(GoodsDetailView)
        detail_script.initData(this._data);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }
}


