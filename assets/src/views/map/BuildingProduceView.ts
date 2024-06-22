import { _decorator, EventTouch, Label, Layers, Node, Sprite, Vec3, Widget } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import GlobalConfig from '../../GlobalConfig';
import { BuildProduceInfo, DataMgr } from '../../manager/DataMgr';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { BuildingModel } from '../../models/BuildingModel';
import { s2cBuildingProduceAdd, s2cBuildingProduceDelete, s2cBuildingProduceGet, s2cBuildingUpgrade } from '../../models/NetModel';
import { InterfacePath } from '../../net/InterfacePath';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ToolUtil } from '../../util/ToolUtil';
import { BuildingProduceItem } from './BuildingProduceItem';
import { BuildingUpgradeView } from './BuildingUpgradeView';
import { ProduceQueueItem } from './ProduceQueueItem';
const { ccclass, property } = _decorator;

@ccclass('BuildingProduceView')
export class BuildingProduceView extends BaseComponent {
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
    @property(List)
    public leftListView: List = null;//列表
    @property(Label)
    public labelName: Label = null;//名字
    @property(Label)
    public labelLevel: Label = null;//等级
    @property(Node)
    public btnUpgrade: Node = null;//升级按钮
    @property(Node)
    public plLeft: Node = null;//左边层
    @property(Label)
    public labelQueue: Label = null;//队列

    private _building: BuildingModel = null;
    private _closeCallBack: Function = null;
    private _preCallBack: Function = null;
    private _nextCallBack: Function = null;

    // private _produceData: ProduceInfo[] = null;
    private _produceInfo: BuildProduceInfo = null;
    private _remainingNum: number = 0;

    onLoad() {
        this.adaptUI();
        this.init();
    }
    // 销毁
    onDestroy() {
        this.removeEvent();
    }
    /**适配UI */
    adaptUI() {
        let scale = ToolUtil.getValue(GlobalConfig.WIN_DESIGN_RATE, 0.1, 1.0);
        CCUtil.setNodeScale(this.listView, scale);
        CCUtil.setNodeScale(this.plLeft, scale);
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
        CCUtil.onTouch(this.btnUpgrade, this.onClickUpgrade, this);

        this.addEvent(InterfacePath.c2sBuildingUpgrade, this.onBuildingUpgrade.bind(this));
        this.addEvent(InterfacePath.c2sBuildingProduceAdd, this.onBuildingProduceAdd.bind(this));
        this.addEvent(InterfacePath.c2sBuildingProduceDelete, this.onBuildingProduceDelete.bind(this));
        this.addEvent(InterfacePath.c2sBuildingProduceGet, this.onBuildingProduceGet.bind(this));
    }
    // 移除事件
    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onClickClose, this);
        CCUtil.offTouch(this.btnLeft, this.onClickLeft, this);
        CCUtil.offTouch(this.btnRight, this.onClickRight, this);
        CCUtil.offTouch(this.btnUpgrade, this.onClickUpgrade, this);

        this.clearEvent();
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
        this.labelName.string = editInfo.name;
        let produceInfo = DataMgr.instance.buildProduceInfo[editInfo.id];
        this._produceInfo = produceInfo;
        this.onUpdateQueue();
        this.onUpdateLevelProduce();
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
        this.plBuilding.getComponent(Widget).updateAlignment();//立刻更新自动布局
        return this.plBuilding.position.add(this.building.position);
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
    /**升级 */
    onClickUpgrade() {
        let queue = this._building.buildingData.queue;
        if (queue && queue.length > 0) {
            ViewsMgr.showTip(TextConfig.Building_Upgrade_Error);
            return;
        }
        ViewsManager.instance.showView(PrefabType.BuildingUpgradeView, (node: Node) => {
            node.getComponent(BuildingUpgradeView).init(this._building);
        });
    }
    /**list加载 */
    onLoadProduceInfoList(item: Node, idx: number) {
        let data = this._produceInfo.data[idx + 1];
        let produceItem = item.getComponent(BuildingProduceItem);
        produceItem.initData(data, this._building.buildingData.level, this._building.buildingID);
        console.log("onLoadProduceInfoList", this._remainingNum);
        produceItem.setNum(this._remainingNum);
    }
    onLoadLeftList(item: Node, idx: number) {
        let queue = this._building.buildingData.queue;
        let data = queue[idx];
        console.log("onLoadLeftList", idx, data);
        if (!data) {
            item.getComponent(ProduceQueueItem)?.init(null);
            return;
        }
        let produceData = this._produceInfo.data[data.type];
        item.getComponent(ProduceQueueItem)?.init(data.time, produceData.res_png, this._building.buildingID, idx, produceData.res_time);
    }
    /**list点击 */
    onLeftListClick(event: EventTouch) {
        // console.log("onLeftListClick", event);
        // event.target.active = false;
        ViewsManager.showTip(TextConfig.Function_Tip);
    }
    /**建筑升级 */
    onBuildingUpgrade(data: s2cBuildingUpgrade) {
        if (200 != data.code) return;
        if (data.id != this._building.buildingID) return;
        ViewsMgr.showTip(TextConfig.Building_Upgrade_Success);
        this._building.buildingData.level = data.level;
        this.onUpdateLevelProduce();
    }
    /**建筑生产队列添加 */
    onBuildingProduceAdd(data: s2cBuildingProduceAdd) {
        console.log("onBuildingProduceAdd", this._building.buildingID);
        if (data.id != this._building.buildingID) return;
        this._building.setProducts(data.remaining_infos);
        this.onUpdateQueue();
    }
    /**建筑生产队列移除 */
    onBuildingProduceDelete(data: s2cBuildingProduceDelete) {
        if (data.id != this._building.buildingID) return;
        this._building.setProducts(data.remaining_infos);
        this.onUpdateQueue();
    }
    /**建筑生产获取 */
    onBuildingProduceGet(data: s2cBuildingProduceGet) {
        if (data.id != this._building.buildingID) return;
        this._building.setProducts(data.remaining_infos);
        this.onUpdateQueue();

        // let list = ToolUtil.itemMapToList(data.product_items);
        ViewsMgr.showRewards(data.product_items);
    }
    /**更新队列 */
    onUpdateQueue() {
        let buildingData = this._building.buildingData;
        this.labelQueue.string = ToolUtil.replace(TextConfig.Queue_Text, buildingData.queue.length, buildingData.queueMaxCount);
        this._remainingNum = buildingData.queueMaxCount - buildingData.queue.length;
        console.log("onUpdateQueue", this._remainingNum, buildingData.queueMaxCount, buildingData.queue.length);
        this.leftListView.numItems = buildingData.queueMaxCount;
        this.listView.content.children.forEach((item: Node) => {
            item.getComponent(BuildingProduceItem)?.setNum(this._remainingNum);
        });
    }
    /**更新等级生产 */
    onUpdateLevelProduce() {
        let level = this._building.buildingData.level;
        this.labelLevel.string = ToolUtil.replace(TextConfig.Level_Text, level);
        let count = this._produceInfo ? this._produceInfo.count : 0;
        this.listView.numItems = count;
        this.btnUpgrade.active = level < count;
    }
}


