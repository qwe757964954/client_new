import { _decorator, Component, Layers, Node, Sprite, Vec3 } from 'cc';
import { BuildProduceInfo, DataMgr, ProduceInfo } from '../../manager/DataMgr';
import { BuildingModel } from '../../models/BuildingModel';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { BuildingProduceItem } from './BuildingProduceItem';
const { ccclass, property } = _decorator;

@ccclass('BuildingProduceView')
export class BuildingProduceView extends Component {
    @property(Sprite)
    public btnClose: Sprite = null;//关闭按钮
    @property(Node)
    public plBuilding: Node = null;//建筑层
    @property(Node)
    public building: Node = null;//建筑
    @property(Sprite)
    public btnLeft: Sprite = null;//左箭头
    @property(Sprite)
    public btnRight: Sprite = null;//右箭头
    @property(List)
    public listView: List = null;//列表

    private _building: BuildingModel = null;
    private _closeCallBack: Function = null;
    private _preCallBack: Function = null;
    private _nextCallBack: Function = null;

    private _produceData: ProduceInfo[] = null;

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
        CCUtil.onTouch(this.btnLeft, this.onClickLeft, this);
        CCUtil.onTouch(this.btnRight, this.onClickRight, this);
    }
    // 移除事件
    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onClickClose, this);
        CCUtil.offTouch(this.btnLeft, this.onClickLeft, this);
        CCUtil.offTouch(this.btnRight, this.onClickRight, this);
    }
    // 处理销毁
    dispose() {
        this.node.destroy();
    }
    // 关闭按钮
    onClickClose() {
        let building = this._building;
        this.removeBuilding();
        if (this._closeCallBack) this._closeCallBack(building);
        this.dispose();
    }
    // 初始化数据
    initData(building: BuildingModel) {
        this._building = building;
        this._building.pos = Vec3.ZERO;
        this._building.addToParent(this.building);
        this._building.setCameraType(Layers.Enum.UI_2D);

        let editInfo = building.editInfo;
        let produceInfo: BuildProduceInfo = DataMgr.instance.buildProduceInfo[editInfo.id]
        this._produceData = produceInfo?.data;
        this.listView.numItems = produceInfo ? produceInfo.count : 0;
    }
    /**设置回调 */
    setCallBack(closeCallBack: Function) {
        this._closeCallBack = closeCallBack;

    }
    setPreNextCallBack(preCallBack?: Function, nextCallBack?: Function) {
        this._preCallBack = preCallBack;
        this._nextCallBack = nextCallBack;
        this.btnLeft.node.active = this._preCallBack ? true : false;
        this.btnRight.node.active = this._nextCallBack ? true : false;
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
    /**上一建筑 */
    onClickLeft() {
        let building = this._building;
        this.removeBuilding();
        if (this._preCallBack) this._preCallBack(building);
    }
    /**下一建筑 */
    onClickRight() {
        let building = this._building;
        this.removeBuilding();
        if (this._nextCallBack) this._nextCallBack(building);
    }
    /**list加载 */
    onLoadProduceInfoList(item: Node, idx: number) {
        let data = this._produceData[idx + 1];
        item.getComponent(BuildingProduceItem)?.initData(data.res_png, data.res_name, data.res_time, 5);
    }
}


