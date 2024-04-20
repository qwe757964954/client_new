import { _decorator, Component, Layers, Node, Sprite, Vec3 } from 'cc';
import CCUtil from '../../util/CCUtil';
import { BuildingModel } from '../../models/BuildingModel';
const { ccclass, property } = _decorator;

@ccclass('BuildingProduceView')
export class BuildingProduceView extends Component {
    @property(Sprite)
    public btnClose: Sprite = null;//关闭按钮
    @property(Node)
    public plBuilding: Node = null;//建筑层
    @property(Node)
    public building: Node = null;//建筑

    private _building: BuildingModel = null;
    private _closeCallBack: Function = null;

    start() {
        this.init();
    }
    // 销毁
    onDestroy() {
        this.removeEvent();
    }
    // 初始化
    init() {
        this.initEvent();
    }
    // 初始化事件
    initEvent() {
        CCUtil.onTouch(this.btnClose, this.onClickClose, this);
    }
    // 移除事件
    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onClickClose, this);
    }
    // 处理销毁
    dispose() {
        this.node.destroy();
    }
    // 关闭按钮
    onClickClose() {
        this.removeBuilding();
        if (this._closeCallBack) this._closeCallBack();
        this.dispose();
    }
    // 初始化数据
    initData(building: BuildingModel, callBack: Function) {
        this._building = building;
        this._closeCallBack = callBack;

        this._building.pos = Vec3.ZERO;
        this._building.addToParent(this.building);
        this._building.setCameraType(Layers.Enum.UI_2D);
    }
    // 获取建筑所在位置
    getBuildingPos() {
        return this.plBuilding.position;
    }
    // 移除建筑
    removeBuilding() {
        if (this._building) {
            this._building.removeFromParent();
            this._building = null;
        }
    }
}


