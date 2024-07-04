import { _decorator, Camera, Canvas, EventMouse, EventTouch, Layers, Node, Prefab, sp, UITransform, Vec3 } from 'cc';
import { EventType } from '../../config/EventType';
import { MapStatus } from '../../config/MapConfig';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { DataMgr, EditInfo, EditType } from '../../manager/DataMgr';
import { SoundMgr } from '../../manager/SoundMgr';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { BuildingIDType, BuildingModel } from '../../models/BuildingModel';
import { CloudModel } from '../../models/CloudModel';
import { RoleType } from '../../models/RoleBaseModel';
import { RoleDataModel } from '../../models/RoleDataModel';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { TimerMgr } from '../../util/TimerMgr';
import { BuildEditCtl } from '../map/BuildEditCtl';
import { BuildingProduceView } from '../map/BuildingProduceView';
import { CastleInfoView } from '../map/CastleInfoView';
import { LandEditCtl } from '../map/LandEditCtl';
import { MapNormalCtl } from '../map/MapNormalCtl';
import { MapUICtl } from '../map/MapUICtl';
import { PetInteractionView } from '../map/PetInteractionView';
import { RecycleCtl } from '../map/RecycleCtl';
import { EditUIView } from './EditUIView';
import { LandEditUIView } from './LandEditUIView';
import { MainUIView } from './MainUIView';
const { ccclass, property } = _decorator;

const loadingSpNames = ["start", "click", "end"];

@ccclass('MainScene')
export class MainScene extends BaseComponent {
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
    @property(Prefab)
    public cloudModel: Prefab = null;//乌云
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
    @property(Camera)
    public mapUICamera: Camera = null;//地图UI摄像机
    @property(Canvas)
    public touchCanvas: Canvas = null;//监听点击画布
    @property(Camera)
    public uiCamera: Camera = null;//ui摄像机
    @property(Node)
    public loadingNode: Node = null;//加载节点
    @property(sp.Skeleton)
    public loadingSp: sp.Skeleton = null;//加载动画
    /**=========================ui元素============================ */
    @property(Node)
    public sceneLayer: Node = null;//场景层
    @property(Node)
    public popupLayer: Node = null;//弹窗层
    @property(Node)
    public tipLayer: Node = null;//提示层
    @property(Node)
    public loadingLayer: Node = null;//加载层

    private _mainUIView: MainUIView = null;//主界面ui
    private _editUIView: EditUIView = null;//编辑界面ui
    private _landEditUIView: LandEditUIView = null;//编辑界面ui
    /**=========================变量============================ */
    private _mapStatus: MapStatus = MapStatus.DEFAULT;//地图状态
    private _mapNormalCtl: MapNormalCtl = null;//普通地图控制器
    private _buildingEditCtl: BuildEditCtl = null;//建筑编辑控制器
    private _landEditCtl: LandEditCtl = null;//地块编辑控制器
    private _recycleCtl: RecycleCtl = null;//地图回收控制器
    private _mapUICtl: MapUICtl = null;//地图界面控制器

    private _loadCount: number = 0;//加载计数
    /**=========================事件handle============================ */

    start() {
        SoundMgr.mainBgm();
        this.initData();
        this.initEvent();
    }

    protected onLoad(): void {
        // let a;
        // a.b.m = 1;
    }

    protected update(dt: number): void {
        this._mapUICtl?.update(dt);
    }
    /**加载回调 */
    loadOverCall() {
        this._loadCount--;
        // 等动画完成后再移除加载层
        if (this._loadCount <= 0) {
            this._loadCount = 0;
            console.timeEnd("MainScene");
            // this.loadingSp.clearAnimations();
            // this.loadingNode.active = false;
            console.log("加载完成，播放消失动画");
            console.time("loadingSp");
            this.loadingSp.timeScale = 4.0;
            this.loadingSp.setAnimation(0, loadingSpNames[2], false);
        }
    }
    /**获取加载回调 */
    getLoadOverCall() {
        this._loadCount++;
        return this.loadOverCall.bind(this);
    }
    // 显示加载动画
    showLoading() {
        this.loadingNode.active = true;
        // this.loadingSp.setAnimation(0, loadingSpNames[0], false);
        this.loadingSp.setAnimation(0, loadingSpNames[1], true);
        this.loadingSp.setCompleteListener(this.onLoadingAnimationComplete.bind(this));
    }
    /**loading动画完成 */
    onLoadingAnimationComplete(trackEntry: sp.spine.TrackEntry) {
        if (this._loadCount <= 0 && trackEntry.animation.name == loadingSpNames[2]) {
            console.timeEnd("loadingSp");
            this.loadingSp.clearAnimations();
            this.loadingNode.active = false;
        }
    }
    // 初始化数据
    initData() {
        console.time("MainScene");
        ViewsMgr.initLayer(this.sceneLayer, this.popupLayer, this.tipLayer, this.loadingLayer);

        let call = this.getLoadOverCall();
        ViewsMgr.showView(PrefabType.MainUIView, (node: Node) => {
            let view = node.getComponent(MainUIView);
            this._mainUIView = view;
            this._mainUIView.mainScene = this;
            if (call) call();
        });
        this.showLoading();

        this._mapNormalCtl = new MapNormalCtl(this, this.getLoadOverCall());
        this._buildingEditCtl = new BuildEditCtl(this, this.getLoadOverCall());
        this._landEditCtl = new LandEditCtl(this, this.getLoadOverCall());
        this._recycleCtl = new RecycleCtl(this, this.getLoadOverCall());
        this._mapUICtl = new MapUICtl(this, this.getLoadOverCall());
    }
    // 初始化事件
    initEvent() {
        this.touchCanvas.node.on(Node.EventType.MOUSE_WHEEL, this.onMapMouseWheel, this);
        this.touchCanvas.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchCanvas.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchCanvas.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchCanvas.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.addEvent(EventType.BuildingBtnView_Close, this.onBuildingBtnViewClose.bind(this));
        this.addEvent(EventType.New_Building, this.onBuildLandClick.bind(this));

        // TimerMgr.loop(() => {
        //     console.log("加载音效开始");
        //     LoadManager.loadRemote("wav/1.wav?t=" + ToolUtil.now()).then(() => {
        //         console.log("加载音效成功");
        //     });
        // }, 2000);
    }
    // 移除事件
    removeEvent() {
        this.touchCanvas.node?.off(Node.EventType.MOUSE_WHEEL);
        this.touchCanvas.node?.off(Node.EventType.TOUCH_START);
        this.touchCanvas.node?.off(Node.EventType.TOUCH_MOVE);
        this.touchCanvas.node?.off(Node.EventType.TOUCH_END);
        this.touchCanvas.node?.off(Node.EventType.TOUCH_CANCEL);

        this.clearEvent();
    }
    // 移除加载资源
    removeLoadAsset() {
    }
    // 移除控制器
    removeCtl() {
        this._mapNormalCtl.dispose();
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
        SoundMgr.stopBgm();
        this.removeEvent();
        this.removeCtl();
        this.removeLoadAsset();
    }
    // 建筑点击
    onBuildingClick(building: BuildingModel) {
        if (!building) return;
        SoundMgr.click();
        console.log("onBuildingClick", building);
        if (MapStatus.DEFAULT == this._mapStatus) {// 普通点击 展示建筑建造界面
            let editInfo = building.editInfo;
            if (EditType.Null == editInfo.type) {
                this.showCastleView(building);
            } else if (DataMgr.instance.buildProduceInfo[editInfo.id]) {
                if (!building.getProduce()) {
                    this.showBuildingProduceView(building);
                }
            }
        }
    }
    /**建筑长按开始 */
    onBuildingLongStart(building: BuildingModel) {
        if (!building) return;
        building.showLongView(this.cameraRate);
    }
    /**建筑长按取消 */
    onBuildingLongCancel(building: BuildingModel) {
        if (!building) return;
        building.closeLongView();
    }
    // 建筑长按
    onBuildingLongClick(building: BuildingModel) {
        if (!building) return;
        console.log("onBuildingLongClick", building);
        building.closeLongView();
        if (MapStatus.DEFAULT == this._mapStatus) {
            this._buildingEditCtl.selectBuilding = building;
            this.changeMapStatus(MapStatus.BUILD_EDIT);
        }
    }
    /** 角色点击 */
    onRoleClick(role: RoleDataModel) {
        if (!role) return;
        console.log("onRoleClick", role);
        if (RoleType.role == role.roleType) {
            role.onClickShow();
            return;
        }
        role.isActive = false;
        //延迟一针调用，防止点击事件触发异常（后续点击会穿透）
        TimerMgr.once(() => {
            this.hideMainUIView();
        }, 1);
        ViewsMgr.showView(PrefabType.PetInteractionView, (node: Node) => {
            let view = node.getComponent(PetInteractionView);
            view.init(role.roleID, role.level);
            view.setRemoveCallback(() => {
                role.isActive = true;
                this.showMainUIView();
            });
        });
    }
    /** 角色拖动开始 */
    onRoleDragStart(role: RoleDataModel) {
        if (!role) return;
        console.log("onRoleDragStart", role);
        role.onDragStart();
        this._mapUICtl.buildingRoleSort();
    }
    /** 角色拖动 */
    onRoleDrag(role: RoleDataModel, dtX: number, dtY: number) {
        if (!role) return;
        // console.log("onRoleDrag", role, x, y);
        role.onDrag(dtX * this.cameraRate, dtY * this.cameraRate);
    }
    /** 角色拖动结束 */
    onRoleDragEnd(role: RoleDataModel) {
        if (!role) return;
        console.log("onRoleDragEnd", role);
        let pos = role.pos;
        let grid = this._mapUICtl.getGridByPos(pos.x, pos.y);
        if (grid && !grid.cloud) {
            role.onDragEnd(pos.x, pos.y);
        } else {
            ViewsManager.showTip(TextConfig.Role_Text2);
            role.onDragEndEx();
        }
        this._mapUICtl.buildingRoleSort();
    }
    /**乌云点击 */
    onCloudClick(cloud: CloudModel) {
        if (!cloud) return;
        let width = cloud.width;
        let xAry = [0, width, 0, -width];
        let yAry = [-width, 0, width, 0];
        for (let i = 0; i < xAry.length; i++) {
            let grid = this._mapUICtl.getGridInfo(cloud.x + xAry[i], cloud.y + yAry[i]);
            // console.log("onCloudClick", xAry[i], yAry[i], grid);
            if (grid && grid.isEditArea && !grid.cloud) {
                cloud.onCloudClick();
                return;
            }
        }
        ViewsMgr.showTip(TextConfig.Cloud_Unlock_Error1);
    }
    // 新建建筑与地块
    onBuildLandClick(data: EditInfo) {
        console.log("onBuidLandClick", data);
        if (EditType.Land == data.type) {
            this._landEditCtl.selectLand = data;
            if (this._landEditUIView) {
                this._landEditUIView.initData(data);
            } else {
                ViewsMgr.showView(PrefabType.LandEditUIView, (node: Node) => {
                    this._landEditUIView = node.getComponent(LandEditUIView);
                    this._landEditUIView.mainScene = this;
                    this._landEditUIView.initData(data);
                });
            }
            this.changeMapStatus(MapStatus.LAND_EDIT);
            return;
        }
        let building = this._mapUICtl.newBuildingInCamera(data);
        if (!building) {
            ViewsManager.showTip(TextConfig.Building_New_Error);
            return;
        }
        this._buildingEditCtl.selectBuilding = building;
        this.changeMapStatus(MapStatus.BUILD_EDIT);
    }
    // 建筑按钮界面关闭
    onBuildingBtnViewClose() {
        this.changeMapStatus(MapStatus.BUILD_EDIT);
    }
    // 场景状态切换
    changeMapStatus(status: MapStatus) {
        let oldStatus = this._mapStatus;
        if (status == oldStatus) return;
        console.log("changeMapStatus", oldStatus, status);
        this.lineLayer.active = MapStatus.DEFAULT != status;
        this._mainUIView.node.active = MapStatus.DEFAULT == status;
        if (this._editUIView) {
            this._editUIView.node.active = (MapStatus.BUILD_EDIT == status);
        } else if (MapStatus.BUILD_EDIT == status) {
            ViewsMgr.showView(PrefabType.EditUIView, (node: Node) => {
                let view = node.getComponent(EditUIView);
                this._editUIView = view;
                this._editUIView.mainScene = this;
            });
        }
        if (this._landEditUIView) {
            this._landEditUIView.node.active = MapStatus.LAND_EDIT == status;
        } else if (MapStatus.LAND_EDIT == status) {
            ViewsMgr.showView(PrefabType.LandEditUIView, (node: Node) => {
                let view = node.getComponent(LandEditUIView);
                this._landEditUIView = view;
                this._landEditUIView.mainScene = this;
            });
        }
        this._mapUICtl.roleIsShow = MapStatus.DEFAULT == status;
        this._mapUICtl.countdownFrameIsShow = MapStatus.DEFAULT == status;
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
    /**点击到乌云 */
    getTouchCloud(x: number, y: number) {
        return this._mapUICtl.getTouchCloud(x, y);
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
    /**查找建筑 */
    findBuilding(id: number) {
        return this._mapUICtl.findBuilding(id);
    }
    findBuildingByIdx(idx: number) {
        return this._mapUICtl.findBuildingByIdx(idx);
    }
    findAllBuilding(typeID: number) {
        return this._mapUICtl.findAllBuilding(typeID);
    }
    /**展示建筑建造界面 */
    showBuildingProduceView(selectBuilding: BuildingModel) {
        ViewsManager.instance.showView(PrefabType.BuildingProduceView, (node: Node) => {
            let children = this._mapUICtl.getBuildingModelAry();
            let buildAry = [];
            let idx = 0;
            for (let i = 0; i < children.length; i++) {
                const building = children[i];
                let editInfo = building.editInfo;
                if (!DataMgr.instance.buildProduceInfo[editInfo.id]) continue;
                if (BuildingIDType.castle == editInfo.id) continue;
                buildAry.push(building);
                if (building == selectBuilding) {
                    idx = buildAry.length - 1;
                }
            }
            let count = buildAry.length;

            this._mainUIView.node.active = false;
            let buildingProduceView = node.getComponent(BuildingProduceView);
            let pos = null;
            let self = this;
            let scale = 1.5;
            let showBuilding = function (building: BuildingModel) {
                self._mapUICtl.moveCameraToBuilding(building, buildingProduceView.getBuildingPos(), scale);
                pos = building.pos;
                building.removeFromParent();
                CCUtil.setNodeScale(building, scale);
                buildingProduceView.initData(building);
            }
            let backBuilding = function (building: BuildingModel) {
                CCUtil.setNodeScale(building, 1.0);
                building.addToParent(self.buildingLayer);
                building.pos = pos;
                building.setCameraType(Layers.Enum.DEFAULT);
            }
            showBuilding(selectBuilding);
            buildingProduceView.setCallBack((building: BuildingModel) => {
                backBuilding(building);
                self._mainUIView.node.active = true;
                self._mapUICtl.buildingSort();
            });
            if (count > 1) {
                buildingProduceView.setPreNextCallBack(
                    (building: BuildingModel) => {
                        backBuilding(building);
                        idx = (idx - 1 + count) % count;
                        showBuilding(buildAry[idx]);
                    }, (building: BuildingModel) => {
                        backBuilding(building);
                        idx = (idx + 1) % count;
                        showBuilding(buildAry[idx]);
                    }
                );
            }
        });
    }
    /**显示城堡升级界面 */
    showCastleView(selectBuilding: BuildingModel) {
        ViewsManager.instance.showView(PrefabType.CastleInfoView, (node: Node) => {
            this._mainUIView.node.active = false;
            let view = node.getComponent(CastleInfoView);
            let pos = selectBuilding.pos;
            let self = this;
            view.setCallBack((building: BuildingModel) => {
                building.addToParent(self.buildingLayer);
                building.pos = pos;
                building.setCameraType(Layers.Enum.DEFAULT);
                self._mainUIView.node.active = true;
                self._mapUICtl.buildingSort();
            });
            this._mapUICtl.moveCameraToBuilding(selectBuilding, view.getBuildingPos());
            selectBuilding.removeFromParent();
            view.init(selectBuilding);
        });
    }

    hideMainUIView() {
        this._mainUIView.node.active = false;
    }
    showMainUIView() {
        this._mainUIView.node.active = true;
    }
    /**回收建筑是否包含指定建筑 */
    isRecycleBuildingContain(bid: number) {
        return this._mapUICtl.isRecycleBuildingContain(bid);
    }
    /**新建建筑 */
    newBuildingFromBuilding(buildingModel: BuildingModel) {
        let building = this._mapUICtl.newBuildingFromBuilding(buildingModel);
        if (!building) {
            return;
        }
        this._buildingEditCtl.selectBuilding = building;
        this.changeMapStatus(MapStatus.BUILD_EDIT);
    }
}

