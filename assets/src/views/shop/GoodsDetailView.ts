import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { EditInfo } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { ServiceMgr } from '../../net/ServiceManager';
import CCUtil from '../../util/CCUtil';
import { EffectUtil } from '../../util/EffectUtil';
import { ToolUtil } from '../../util/ToolUtil';
const { ccclass, property } = _decorator;
/** 建筑信息 */
@ccclass('GoodsDetailView')
export class GoodsDetailView extends Component {
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


    start() {
        this.initEvent();
    }
    /** 销毁 */
    public onDestroy() {
        this.removeEvent();
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
    /** 销毁 */
    public dispose() {
        this.node.destroy();
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

        this.show();
    }

    /**弹出式窗口 */
    private show() {
        EffectUtil.centerPopup(this.contentNd);
        setTimeout(() => {
            this._canClose = true;
        })
    }
    /** 关闭按钮 */
    public onClickClose() {
        if (!this._canClose) return;
        this._canClose = false;
        EffectUtil.centerClose(this.contentNd, () => {
            //if (this._callBack) this._callBack();
            this.dispose();
        });
        //this.dispose();
    }

    onClickBuy() {
        ServiceMgr.shopService.buyGood(this._data.id);
    }
}


