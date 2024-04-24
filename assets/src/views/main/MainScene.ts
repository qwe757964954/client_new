import { _decorator, Camera, Canvas, Component, EventMouse, EventTouch, Layers, Node, Prefab, UITransform, Vec3 } from 'cc';
import { EventType } from '../../config/EventType';
import { MapStatus } from '../../config/MapConfig';
import { BuildingModel } from '../../models/BuildingModel';
import EventManager from '../../util/EventManager';
import { BuildEditCtl } from '../map/BuildEditCtl';
import { LandEditCtl } from '../map/LandEditCtl';
import { MapEditCtl } from '../map/MapEditCtl';
import { MapNormalCtl } from '../map/MapNormalCtl';
import { RecycleCtl } from '../map/RecycleCtl';
// import { MainUICtl } from './MainUICtl';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { EditInfo, EditType } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { BuildingProduceView } from '../map/BuildingProduceView';
import { MapUICtl } from '../map/MapUICtl';
import { EditUIView } from './EditUIView';
import { LandEditUIIvew } from './LandEditUIIvew';
import { MainUIView } from './MainUIView';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {
    @property(Prefab)
    public bgModel: Prefab = null;//格子地图
    @property(Prefab)
    public landModel: Prefab = null;//地块
    @property(Prefab)
    public buildingModel: Prefab = null;//建筑
    @property(Prefab)
    public roleModel: Prefab = null;//角色
    @property(Prefab)
    public petModel: Prefab = null;//精灵
    @property(Node)
    public bgLayer: Node = null;//背景层
    @property(Node)
    public landLayer: Node = null;//地块层
    @property(Node)
    public lineLayer: Node = null;//编辑层
    @property(Node)
    public buildingLayer: Node = null;//建筑层
    @property(Camera)
    public mapCamera: Camera = null;//地图摄像机
    @property(Canvas)
    public touchCanvas: Canvas = null;//监听点击画布
    @property(Camera)
    public uiCamera: Camera = null;//ui摄像机

    /**=========================ui元素============================ */
    @property(MainUIView)
    public mainUIView: MainUIView = null;//主界面ui
    @property(EditUIView)
    public editUIView: EditUIView = null;//编辑界面ui
    @property(LandEditUIIvew)
    public landEditUIView: LandEditUIIvew = null;//编辑界面ui
    @property(Node)
    public sceneLayer: Node = null;//场景层
    @property(Node)
    public popupLayer: Node = null;//弹窗层
    @property(Node)
    public tipLayer: Node = null;//提示层
    @property(Node)
    public loadingLayer: Node = null;//加载层

    /**=========================变量============================ */
    private _mapStatus: MapStatus = MapStatus.DEFAULT;//地图状态
    private _mapNormalCtl: MapNormalCtl = null;//普通地图控制器
    private _mapEditCtl: MapEditCtl = null;//编辑地图控制器
    private _buildingEditCtl: BuildEditCtl = null;//建筑编辑控制器
    private _landEditCtl: LandEditCtl = null;//地块编辑控制器
    private _recycleCtl: RecycleCtl = null;//地图回收控制器
    // private _mainUICtl:MainUICtl = null;//主界面控制器
    private _mapUICtl: MapUICtl = null;//地图界面控制器


    /**=========================事件handle============================ */
    private _buildingBtnViewCloseHandle: string;//建筑按钮视图关闭事件

    start() {
        this.initData();
        this.initEvent();
    }

    protected update(dt: number): void {
        this._mapUICtl?.update(dt);
    }

    // 初始化数据
    initData() {
        this._mapNormalCtl = new MapNormalCtl(this);
        this._mapEditCtl = new MapEditCtl(this);
        this._buildingEditCtl = new BuildEditCtl(this);
        this._landEditCtl = new LandEditCtl(this);
        this._recycleCtl = new RecycleCtl(this);
        this._mapUICtl = new MapUICtl(this);

        this.mainUIView.mainScene = this;
        this.editUIView.mainScene = this;
        this.editUIView.node.active = false;
        this.landEditUIView.mainScene = this;
        this.landEditUIView.node.active = false;

        ViewsManager.instance.initLayer(this.sceneLayer, this.popupLayer, this.tipLayer, this.loadingLayer);
        // for test
        // this.changeMapStatus(MapStatus.EDIT);
        // this.editUIView.node.active = false;
    }
    // 初始化事件
    initEvent() {
        this.touchCanvas.node.on(Node.EventType.MOUSE_WHEEL, this.onMapMouseWheel, this);
        this.touchCanvas.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchCanvas.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchCanvas.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchCanvas.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this._buildingBtnViewCloseHandle = EventManager.on(EventType.BuildingBtnView_Close, this.onBuildingBtnViewClose.bind(this));
    }
    // 移除事件
    removeEvent() {
        this.touchCanvas.node?.off(Node.EventType.MOUSE_WHEEL);
        this.touchCanvas.node?.off(Node.EventType.TOUCH_START);
        this.touchCanvas.node?.off(Node.EventType.TOUCH_MOVE);
        this.touchCanvas.node?.off(Node.EventType.TOUCH_END);
        this.touchCanvas.node?.off(Node.EventType.TOUCH_CANCEL);

        EventManager.off(EventType.BuildingBtnView_Close, this._buildingBtnViewCloseHandle);
    }
    // 移除加载资源
    removeLoadAsset() {
    }
    // 移除控制器
    removeCtl() {
        this._mapNormalCtl.dispose();
        this._mapEditCtl.dispose();
        this._buildingEditCtl.dispose();
        this._landEditCtl.dispose();
        this._recycleCtl.dispose();
        this._mapUICtl.dispose();
    }
    // 滚轮事件
    onMapMouseWheel(e: EventMouse) {
        this.getMapCtl().onMapMouseWheel(e);
    }
    // 点击开始
    onTouchStart(e: EventTouch) {
        this.getMapCtl().onTouchStart(e);
    }
    // 点击移动
    onTouchMove(e: EventTouch) {
        this.getMapCtl().onTouchMove(e);
    }
    // 点击结束
    onTouchEnd(e: EventTouch) {
        this.getMapCtl().onTouchEnd(e);
    }
    // 点击取消
    onTouchCancel(e: EventTouch) {
        this.getMapCtl().onTouchCancel(e);
    }
    // 销毁
    protected onDestroy(): void {
        this.removeEvent();
        this.removeCtl();
        this.removeLoadAsset();
    }
    // 建筑点击
    onBuildingClick(building: BuildingModel) {
        if (!building) return;
        console.log("onBuildingClick", building);
        if (MapStatus.EDIT == this._mapStatus) {
            this._buildingEditCtl.selectBuilding = building;
            this.changeMapStatus(MapStatus.BUILD_EDIT);
            return;
        }
        else if (MapStatus.DEFAULT == this._mapStatus) {// 普通点击 展示建筑建造界面
            ViewsManager.instance.showView(PrefabType.BuildingProduceView, (node: Node) => {
                this.mainUIView.node.active = false;
                let buildingProduceView = node.getComponent(BuildingProduceView);
                this._mapUICtl.moveCameraToBuilding(building, buildingProduceView.getBuildingPos());
                let pos = building.pos;
                building.removeFromParent();
                buildingProduceView.initData(building, () => {
                    building.addToParent(this.buildingLayer);
                    building.pos = pos;
                    building.setCameraType(Layers.Enum.DEFAULT);
                    this.mainUIView.node.active = true;
                    this._mapUICtl.buildingSort();
                });
            });
        }
    }
    // 建筑长按
    onBuildingLongClick(building: BuildingModel) {
        if (!building) return;
        console.log("onBuildingLongClick", building);
        if (MapStatus.DEFAULT == this._mapStatus) {
            this._buildingEditCtl.selectBuilding = building;
            this.changeMapStatus(MapStatus.BUILD_EDIT);
        }
    }
    /** 角色点击 */
    onRoleClick(role: RoleBaseModel) {
        if (!role) return;
        console.log("onRoleClick", role);
        role.onClickShow();
    }
    /** 角色拖动开始 */
    onRoleDragStart(role: RoleBaseModel) {
        if (!role) return;
        console.log("onRoleDragStart", role);
        role.onDragStart();
    }
    /** 角色拖动 */
    onRoleDrag(role: RoleBaseModel, dtX: number, dtY: number) {
        if (!role) return;
        // console.log("onRoleDrag", role, x, y);
        role.onDrag(dtX * this.cameraRate, dtY * this.cameraRate);
    }
    /** 角色拖动结束 */
    onRoleDragEnd(role: RoleBaseModel) {
        if (!role) return;
        console.log("onRoleDragEnd", role);
        let pos = role.pos;
        let grid = this._mapUICtl.getGridByPos(pos.x, pos.y);
        if (grid) {
            role.onDragEnd(pos.x, pos.y);
        } else {
            ViewsManager.showTip(TextConfig.Role_Text2);
            role.onDragEndEx();
        }
    }
    // 新建建筑与地块
    onBuidLandClick(data: EditInfo) {
        console.log("onBuidLandClick", data);
        if (EditType.Land == data.type) {
            this._landEditCtl.selectLand = data;
            this.landEditUIView.initData(data);
            this.changeMapStatus(MapStatus.LAND_EDIT);
            return;
        }
        let building = this._mapUICtl.newBuildingInCamera(data);
        this._buildingEditCtl.selectBuilding = building;
        this.changeMapStatus(MapStatus.BUILD_EDIT);
    }
    // 建筑按钮界面关闭
    onBuildingBtnViewClose() {
        this.changeMapStatus(MapStatus.EDIT);
    }
    // 场景状态切换
    changeMapStatus(status: MapStatus) {
        let oldStatus = this._mapStatus;
        if (status == oldStatus) return;
        console.log("changeMapStatus", oldStatus, status);
        this.lineLayer.active = MapStatus.DEFAULT != status;
        this.mainUIView.node.active = MapStatus.DEFAULT == status;
        this.editUIView.node.active = (MapStatus.EDIT == status || MapStatus.BUILD_EDIT == status);
        this.landEditUIView.node.active = MapStatus.LAND_EDIT == status;
        this._mapUICtl.roleIsShow = MapStatus.DEFAULT == status;
        let ctl = this.getMapCtl();
        ctl.clearData();
        this._mapStatus = status;
        EventManager.emit(EventType.MapStatus_Change, { oldStatus: oldStatus, status: status });
    }
    // UI确定事件
    confirmEvent() {
        this.getMapCtl().confirmEvent();
    }
    // UI取消事件
    cancelEvent() {
        this.getMapCtl().cancelEvent();
    }
    // UI上一步
    prevStepEvent() {
        this.getMapCtl().prevStepEvent();
    }
    // UI下一步
    nextStepEvent() {
        this.getMapCtl().nextStepEvent();
    }

    /** 获取当前场景控制器 */
    getMapCtl(status?: MapStatus) {
        if (!status) status = this._mapStatus;
        if (MapStatus.DEFAULT == status) {
            return this._mapNormalCtl;
        }
        if (MapStatus.EDIT == status) {
            return this._mapEditCtl;
        }
        if (MapStatus.BUILD_EDIT == status) {
            return this._buildingEditCtl;
        }
        if (MapStatus.LAND_EDIT == status) {
            return this._landEditCtl;
        }
        if (MapStatus.RECYCLE == status) {
            return this._recycleCtl;
        }
        return this._mapNormalCtl;
    }
    /** 摄像头缩放大小 */
    get cameraRate(): number {
        return this._mapUICtl.cameraRate;
    }
    // 点击到格子
    getTouchGrid(x: number, y: number) {
        return this._mapUICtl.getTouchGrid(x, y);
    }
    /**点击到建筑 */
    getTouchBuilding(x: number, y: number) {
        return this._mapUICtl.getTouchBuilding(x, y);
    }
    // 点击到角色
    getTouchRole(x: number, y: number) {
        return this._mapUICtl.getTouchRole(x, y);
    }
    // 设置建筑物格子
    setBuildingGrid(building: BuildingModel, gridX: number, gridY: number) {
        this._mapUICtl.setBuildingGrid(building, gridX, gridY);
    }
    // 移动地图
    mapMove(dtX: number, dtY: number) {
        this._mapUICtl.mapMove(dtX, dtY);
    }
    // 缩放地图
    mapZoom(scale: number) {
        this._mapUICtl.mapZoom(scale);
    }
    mapZoomTo(scale: number) {
        this._mapUICtl.mapZoomTo(scale);
    }
    // 放大地图
    mapZoomIn() {
        this._mapUICtl.mapZoomIn();
    }
    // 缩小地图
    mapZoomOut() {
        this._mapUICtl.mapZoomOut();
    }
    /** 屏幕坐标转换成地图层坐标 */
    screenPosToMapPos(x: number, y: number) {
        let worldPos = this.mapCamera.screenToWorld(new Vec3(x, y, 0));
        let pos = this.landLayer.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        return pos;
    }
    /** 地图层坐标转换成屏幕坐标 */
    mapPosToScreenPos(x: number, y: number) {
        let worldPos = this.landLayer.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(x, y, 0));
        let pos = this.mapCamera.worldToScreen(worldPos);
        return pos;
    }
}

