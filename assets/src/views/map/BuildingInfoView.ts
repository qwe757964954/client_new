import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { BuildingModel } from '../../models/BuildingModel';
import CCUtil from '../../util/CCUtil';
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
    public initData() {

    }
    /** 关闭按钮 */
    public onClickClose() {
        this.dispose();
    }
}


