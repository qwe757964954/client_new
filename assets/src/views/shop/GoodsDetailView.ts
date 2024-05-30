import { _decorator, Component, Label, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { DataMgr, EditInfo } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import CCUtil from '../../util/CCUtil';
import { ShopGoodsItem } from './ShopGoodsItem';
import { GoodsItemData } from '../../models/GoodsModel';
import { EffectUtil } from '../../util/EffectUtil';
import { ServiceMgr } from '../../net/ServiceManager';
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

    _data: GoodsItemData = null;

    _canClose: boolean = true;


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
    public initData(editInfo: GoodsItemData) {
        this._data = editInfo;

        this.labelName.string = editInfo.name;
        this.labelDesc.string = editInfo.desc;
        this.labelPrice.string = "" + editInfo.price;

        this.lblScore.string = "+" + editInfo.medal;
        if (editInfo.land > 0) {
            this.ndLand.active = true;
            this.lblLand.string = "+" + editInfo.land;
        }
        else {
            this.ndLand.active = false;
            this.lblLand.string = "0";
        }

        this.imgIcon.spriteFrame = this.spriteFrames[editInfo.type - 1];

        let iconPath: string = "shop/" + editInfo.icon + "/spriteFrame";
        LoadManager.loadSprite(iconPath, this.img).then((spriteFrame: SpriteFrame) => {
            this.resetImgSize();
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
    /** 重设图片大小 */
    public resetImgSize() {
        let size = this.imgNode.getComponent(UITransform).contentSize;
        let scale = size.width / this.img.spriteFrame.originalSize.width;
        console.log("resetImgSize", scale, size.width, this.img.spriteFrame.originalSize);
        if (scale >= 1.0) return;
        this.img.node.scale = new Vec3(scale, scale, 1.0);
    }
}


