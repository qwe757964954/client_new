import { _decorator, Label, Node, Sprite, SpriteFrame } from 'cc';
import { EventType } from '../../config/EventType';
import { TextConfig } from '../../config/TextConfig';
import { EditInfo } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsManager } from '../../manager/ViewsManager';
import { ServiceMgr } from '../../net/ServiceManager';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
import { ToolUtil } from '../../util/ToolUtil';
const { ccclass, property } = _decorator;
/** 建筑信息 */
@ccclass('GoodsDetailView')
export class GoodsDetailView extends BasePopup {
    @property(Node)
    public imgNode: Node = null;//图片父节点
    @property(Sprite)
    public img: Sprite = null;//建筑图片
    @property(Node)
    public btnClose: Node = null;//关闭按钮
    @property(Node)
    public btnBuy: Node = null;//关闭按钮
    @property(Sprite)
    public imgIcon: Sprite = null;//建筑类型图标
    @property(Label)
    public labelName: Label = null;//建筑名称
    @property(Label)
    public labelDesc: Label = null;//建筑描述
    @property(Label)
    public labelPrice: Label = null;//建筑价格

    @property({ type: Label, tooltip: "分数" })
    public lblScore: Label = null;

    @property({ type: Label, tooltip: "土地数" }) //contentNd
    public lblLand: Label = null;

    @property({ type: Node, tooltip: "土地结点" })
    public ndLand: Node = null;

    @property({ type: Node, tooltip: "土地结点" })
    public contentNd: Node = null;

    @property({ type: [SpriteFrame], tooltip: "建筑类型图标 0功能 1地标 2装饰 3地板" })
    public spriteFrames: SpriteFrame[] = [];

    private _data: EditInfo = null;

    private _canClose: boolean = true;

    protected initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("img_bg")]).then(() => {

        });
    }

    protected onInitModuleEvent(): void {
        this.addModelListener(EventType.EditUIView_Refresh, this.onRepShopBuyBuilding.bind(this));
    }
    onRepShopBuyBuilding(){
        this.onClickClose();
    }
    /** 初始化事件 */
    public initEvent() {
        CCUtil.onTouch(this.btnClose, this.onClickClose, this);
        CCUtil.onTouch(this.btnBuy, this.onClickBuy, this);
    }
    /** 销毁事件 */
    public removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onClickClose, this);
        CCUtil.offTouch(this.btnBuy, this.onClickBuy, this);
    }
    /** 初始化数据 */
    public initData(data: EditInfo) {
        this._data = data;

        this.labelName.string = data.name;
        this.labelDesc.string = data.description;
        this.labelPrice.string = data.buy.toString();

        // this.lblScore.string = "+" + data.medal;
        this.lblLand.string = ToolUtil.replace(TextConfig.Pet_Mood_Prop, data.width);
        this.imgIcon.spriteFrame = this.spriteFrames[data.type - 1];
        LoadManager.loadSprite(data.png, this.img).then(() => {
            CCUtil.fixNodeScale(this.img.node, 260, 400);
        });
    }

    onClickBuy() {
        let use_amout = "金币";
        let content_str = `确认消耗${this._data.buy}个${use_amout}购买${this._data.name}吗？`;
        ViewsManager.showConfirm(content_str, () => {
            ServiceMgr.buildingService.reqBuyBuilding(this._data.id);
        })
        
        // ServiceMgr.shopService.buyGood(this._data.id);
        // EventMgr.emit(EventType.New_Building, this._data);
        // ViewsMgr.closeView(PrefabType.ShopUIView);
        // ViewsMgr.closeView(PrefabType.GoodsDetailView);
    }
    onClickClose() {
        this.closePop();
    }
}


