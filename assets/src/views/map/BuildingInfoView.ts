import { _decorator, Component, Label, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { BuildingModel } from '../../models/BuildingModel';
import CCUtil from '../../util/CCUtil';
import { DataMgr, EditInfo } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
const { ccclass, property } = _decorator;
/** 建筑信息 */
@ccclass('BuildingInfoView')
export class BuildingInfoView extends Component {
    @property(Node)
    public imgNode: Node = null;//图片父节点
    @property(Sprite)
    public img: Sprite = null;//建筑图片
    @property(Node)
    public btnClose: Node = null;//关闭按钮
    @property(Sprite)
    public imgIcon: Sprite = null;//建筑类型图标
    @property(Label)
    public labelName: Label = null;//建筑名称
    @property(Label)
    public labelDesc: Label = null;//建筑描述
    @property(Label)
    public labelFunction: Label = null;//建筑功能

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
    }
    /** 销毁事件 */
    public removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onClickClose, this);
    }
    /** 销毁 */
    public dispose() {
        this.node.destroy();
    }

    /** 初始化数据 */
    public initData(editInfo: EditInfo) {
        this.labelName.string = editInfo.name;
        this.labelDesc.string = editInfo.description;
        this.labelFunction.string = editInfo.function;

        LoadManager.load(DataMgr.getEditPng(editInfo), SpriteFrame).then((spriteFrame: SpriteFrame) => {
            this.img.spriteFrame = spriteFrame;

            this.resetImgSize();
        });
    }
    /** 关闭按钮 */
    public onClickClose() {
        this.dispose();
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


