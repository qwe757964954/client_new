import { EventMouse, EventTouch, Vec3 } from "cc";
import { EventType } from "../../config/EventType";
import { MapStatus } from "../../config/MapConfig";
import { ViewsManager } from "../../manager/ViewsManager";
import { BuildingModel, BuildingOperationData, BuildingOperationType } from "../../models/BuildingModel";
import { GridModel } from "../../models/GridModel";
import { c2sBuildingCreate, c2sBuildingEdit, s2cBuildingCreate, s2cBuildingEdit, s2cBuildingEditBatch, s2cBuildingRecycle, s2cBuildingSell } from "../../models/NetModel";
import { User } from "../../models/User";
import { InterfacePath } from "../../net/InterfacePath";
import { ServiceMgr } from "../../net/ServiceManager";
import { EventMgr } from "../../util/EventManager";
import { MainScene } from "../main/MainScene";
import { MapBaseCtl } from "./MapBaseCtl";

//建筑编辑控制器
export class BuildEditCtl extends MapBaseCtl {
    private _lastTouchGrid: GridModel = null;//上一次触摸格子
    private _selectBuilding: BuildingModel = null;//选中建筑
    private _touchBuilding: BuildingModel = null;//触摸建筑
    private _dtScreenPos: Vec3 = new Vec3();//屏幕坐标差
    private _isBuildingMove: boolean = false;//建筑是否移动

    // private _buildingEditHandle: string;//建筑编辑事件
    // private _buildingCreateHandle: string;//建筑创建事件

    private _step: number = 0;//步骤
    private _operationCacheAry: BuildingOperationData[][] = [];//操作缓存
    private _operationCache: BuildingOperationData[] = [];//本次操作缓存
    private _tmpOperationData: BuildingOperationData = new BuildingOperationData();//临时操作数据

    constructor(mainScene: MainScene, callBack?: Function) {
        super(mainScene, callBack);

        this.initEvent();
    }
    // 初始化事件
    initEvent() {
        this.addEvent(InterfacePath.c2sBuildingEdit, this.onBuildingEdit.bind(this));
        this.addEvent(InterfacePath.c2sBuildingCreate, this.onBuildingCreate.bind(this));
        this.addEvent(InterfacePath.c2sBuildingSell, this.onRepBuildingSell.bind(this));
        this.addEvent(InterfacePath.c2sBuildingRecycle, this.onRepBuildingRecycle.bind(this));
        this.addEvent(InterfacePath.c2sBuildingEditBatch, this.onRepBuildingEditBatch.bind(this));

        this.addEvent(EventType.Building_Save, this.onBuildingSave.bind(this));
        this.addEvent(EventType.Building_Recycle, this.onBuildingRecycle.bind(this));
        this.addEvent(EventType.Building_RecycleEx, this.onBuildingRecycleEx.bind(this));
        this.addEvent(EventType.Building_Sell, this.onBuildingSell.bind(this));
        this.addEvent(EventType.BuildingBtnView_Close, this.onBuildingBtnViewClose.bind(this));
    }
    // 销毁
    public dispose(): void {
        this.clearEvent();
    }
    /** 建筑编辑返回 */
    onBuildingEdit(data: s2cBuildingEdit) {
        if (this._mainScene.getMapCtl() != this) return;
        if (200 != data.code) {
            ViewsManager.showAlert(data.msg);
            return;
        }
        let building = this._mainScene.findBuilding(data.id);
        if (building) {
            building.saveData();
            this._mainScene.newBuildingFromBuilding(building);
        }
    }
    /**建筑卖出返回 */
    onRepBuildingSell(data: s2cBuildingSell) {
        if (this._mainScene.getMapCtl() != this) return;
        if (200 != data.code) {
            ViewsManager.showAlert(data.msg);
            return;
        }
        let building = this._mainScene.findBuilding(data.id);
        building?.sell(true);
    }
    /** 建筑创建返回 */
    onBuildingCreate(data: s2cBuildingCreate) {
        if (this._mainScene.getMapCtl() != this) return;
        if (200 != data.code) {
            ViewsManager.showAlert(data.msg);
            return;
        }
        let building = this._mainScene.findBuildingByIdx(data.idx);
        if (building) {
            building.buildingID = data.id;
            building.saveData();

            User.addBuilding(building.editInfo.id);
            this._mainScene.newBuildingFromBuilding(building);
        }
    }
    /**建筑回收返回 */
    onRepBuildingRecycle(data: s2cBuildingRecycle) {
        if (this._mainScene.getMapCtl() != this) return;
        if (200 != data.code) {
            ViewsManager.showAlert(data.msg);
            return;
        }
        let building = this._mainScene.findBuilding(data.id);
        building?.recycle();
    }
    /**建筑批量修改返回 */
    onRepBuildingEditBatch(data: s2cBuildingEditBatch) {
        if (1 == data.type) {
            return;
        }
        if (200 != data.code) {
            ViewsManager.showAlert(data.msg);
            return;
        }
        data.insert_result.forEach((item) => {
            let building = this._mainScene.findBuildingByIdx(item.idx);
            if (building) {
                building.buildingID = item.id;
                User.addBuilding(building.editInfo.id);
            } else {
                let recycleData = this._mainScene.findRecycleData(item.idx);
                if (recycleData) {
                    recycleData.data.id = item.id;
                    recycleData.data.state = item.status;
                    User.addBuilding(recycleData.bid);
                }
            }
        });
        this._step = 0;
        this._operationCacheAry = [];
        this._mainScene.changeMapStatus(MapStatus.DEFAULT);
    }
    // 设置选中建筑
    public set selectBuilding(building: BuildingModel) {
        if (!building) return;
        if (this._selectBuilding) {//恢复上一次选中的建筑
            this._selectBuilding.recoverData();
            this._selectBuilding = null;
        }
        this._selectBuilding = building;
        this._selectBuilding.showBtnView(this._mainScene.cameraRate);
    }
    // 摄像机缩放
    public onCameraScale(rate: number): void {
        if (this._selectBuilding) {
            this._selectBuilding.onCameraScale(this._mainScene.cameraRate);
        }
    }

    //点击开始
    public onTouchStart(e: EventTouch) {
        if (!super.onTouchStart(e)) return false;
        let pos = e.getLocation();//需要用屏幕坐标去转换点击事件
        let building = this._mainScene.getTouchBuilding(pos.x, pos.y);
        if (building && building.isCanEdit) {
            this._lastTouchGrid = building?.grids[0];
            let screenPos = this._mainScene.mapPosToScreenPos(this._lastTouchGrid.pos.x, this._lastTouchGrid.pos.y);

            this._dtScreenPos.x = screenPos.x - pos.x;
            this._dtScreenPos.y = screenPos.y - pos.y;
            this._touchBuilding = building;
        }
        return true;
    }
    //点击移动
    public onTouchMove(e: EventTouch) {
        let touches = e.getAllTouches();
        if (touches.length > this._maxTouchCount) return false;
        let delta = e.getUIDelta();
        let dtX = -delta.x;
        let dtY = -delta.y;
        if (!this.isTouchMoveEffective(dtX, dtY)) {
            return false;
        }
        if (1 == touches.length && this._touchBuilding && this._selectBuilding && this._selectBuilding == this._touchBuilding) {
            let pos = e.getLocation();
            let gridModel = this._mainScene.getTouchGrid(pos.x + this._dtScreenPos.x, pos.y + this._dtScreenPos.y);
            if (gridModel && gridModel != this._lastTouchGrid) {
                this._mainScene.setBuildingGrid(this._selectBuilding, gridModel.x, gridModel.y);
            }
            this._isBuildingMove = true;
            this._lastTouchGrid = gridModel;
            return true;
        }
        this._isTouchMove = true;
        if (1 == touches.length) {
            this._mainScene.mapMove(dtX, dtY);
            return true;
        }
        this.mapZoomByTouches(touches[0], touches[1]);
        return true;
    }
    //点击结束
    public onTouchEnd(e: EventTouch) {
        if (this._isTouchInSelf && !this._isTouchMove && !this._isBuildingMove) {
            if (this._selectBuilding && (!this._touchBuilding || this._touchBuilding == this._selectBuilding)) {
                let pos = e.getLocation();
                let gridModel = this._mainScene.getTouchGrid(pos.x, pos.y);
                if (gridModel) {
                    this._mainScene.setBuildingGrid(this._selectBuilding, gridModel.x, gridModel.y);
                }
            } else {
                this.selectBuilding = this._touchBuilding;
            }
        }
        this._lastTouchGrid = null;
        this._touchBuilding = null;
        this._isBuildingMove = false;
        return super.onTouchEnd(e);
    }

    //点击取消
    public onTouchCancel(e: EventTouch) {
        this._lastTouchGrid = null;
        this._touchBuilding = null;
        this._isBuildingMove = false;
        return super.onTouchCancel(e);
    }
    //滚轮事件
    public onMapMouseWheel(e: EventMouse): void {
        super.onMapMouseWheel(e);
    }
    // 清理数据
    clearData(): void {
        if (this._selectBuilding) {
            this._selectBuilding.recoverData();
            this._selectBuilding = null;
        }
        this._lastTouchGrid = null;
        this._touchBuilding = null;
        this._isBuildingMove = false;
        super.clearData();
    }
    // 确定事件
    confirmEvent(): void {
        if (this._selectBuilding) {
            this._selectBuilding.recoverData();
            this._selectBuilding = null;
        }

        let processedAry: number[] = [];//已处理建筑idx
        let createAry: c2sBuildingCreate[] = [];
        let updateAry: c2sBuildingEdit[] = [];
        let deleteAry: number[] = [];
        let step = this._step;
        while (step > 0) {
            step--;
            this._operationCacheAry[step].forEach((data) => {
                if (-1 != processedAry.findIndex(element => element == data.idx)) return;
                if (BuildingOperationType.edit == data.type) {
                    if (data.buildingID) {
                        let obj = new c2sBuildingEdit();
                        obj.id = data.buildingID;
                        obj.x = data.x;
                        obj.y = data.y;
                        obj.direction = data.isFlip ? 1 : 0;
                        updateAry.push(obj);
                    } else {
                        let obj = new c2sBuildingCreate();
                        obj.idx = data.idx;
                        obj.bid = data.editInfo.id;
                        obj.x = data.x;
                        obj.y = data.y;
                        obj.direction = data.isFlip ? 1 : 0;
                        createAry.push(obj);
                    }
                } else if (BuildingOperationType.recycle == data.type) {
                    if (data.buildingID) {
                        let obj = new c2sBuildingEdit();
                        obj.id = data.buildingID;
                        obj.x = data.x;
                        obj.y = data.y;
                        obj.direction = data.isFlip ? 1 : 0;
                        obj.hide = 1;
                        updateAry.push(obj);
                    } else {
                        let obj = new c2sBuildingCreate();
                        obj.idx = data.idx;
                        obj.bid = data.editInfo.id;
                        obj.x = data.x;
                        obj.y = data.y;
                        obj.direction = data.isFlip ? 1 : 0;
                        obj.hide = 1;
                        createAry.push(obj);
                    }
                } else if (BuildingOperationType.sell == data.type) {
                    if (data.buildingID) {
                        deleteAry.push(data.buildingID);
                    }
                }
                processedAry.push(data.idx);
            });
        }
        if (0 == createAry.length && 0 == updateAry.length && 0 == deleteAry.length) {
            this._step = 0;
            this._operationCacheAry = [];
            this._mainScene.changeMapStatus(MapStatus.DEFAULT);
            return;
        }
        ServiceMgr.buildingService.reqBuildingEditBatch(createAry, updateAry, deleteAry);
    }
    // 取消事件
    cancelEvent(): void {
        if (this._selectBuilding) {
            this._selectBuilding.recoverData();
            this._selectBuilding = null;
        }
        // TODO 还原步骤
        while (this._step > 0) {
            this._step--;
            this._operationCacheAry[this._step].forEach((data) => {
                this.recoverByOperationData(this.getRecoverOperationData(data, true));
            });
        }
        this._step = 0;
        this._operationCacheAry = [];
        this._mainScene.changeMapStatus(MapStatus.DEFAULT);
    }
    // UI上一步
    prevStepEvent(): void {
        if (this._step <= 0) return;
        this._step--;
        this._operationCacheAry[this._step].forEach((data) => {
            this.recoverByOperationData(this.getRecoverOperationData(data, true));
        });
    }
    // UI下一步
    nextStepEvent(): void {
        if (this._step >= this._operationCacheAry.length) return;
        this._operationCacheAry[this._step].forEach((data) => {
            this.recoverByOperationData(this.getRecoverOperationData(data, false));
        });
        this._step++;
    }
    /** 下一步 */
    nextStep(): void {
        if (this._operationCache.length <= 0) return;
        if (this._operationCacheAry.length > this._step) {
            this._operationCacheAry.splice(this._step);
        }
        this._step++;
        this._operationCacheAry.push(this._operationCache);
        this._operationCache = [];

        this._selectBuilding = null;
        this.clearData();
        EventMgr.emit(EventType.Building_Step_Update);
    }
    /**当前步数 */
    getStep(): number {
        return this._step;
    }
    /**总步数 */
    getTotalStep(): number {
        return this._operationCacheAry.length;
    }
    /**缓存建筑操作数据 */
    cacheBuildingOperationData(type: BuildingOperationType, building: BuildingModel): void {
        this._operationCache.push(building.getOperationData(type));
    }
    /**建筑保存事件 */
    onBuildingSave(building: BuildingModel): void {
        this.cacheBuildingOperationData(BuildingOperationType.edit, building);
        building.saveData();
        this.nextStep();
        this._mainScene.newBuildingFromBuilding(building);
    }
    /**建筑回收事件 */
    onBuildingRecycle(building: BuildingModel): void {
        building.recycle();
        if (!building.isNew) {
            this.nextStep();
        }
    }
    onBuildingRecycleEx(building: BuildingModel): void {
        if (!building.isNew) {
            this.cacheBuildingOperationData(BuildingOperationType.recycle, building);
        }
    }
    /**建筑卖出事件 */
    onBuildingSell(building: BuildingModel): void {
        if (building.isNew && !building.buildingID) {
            building.sell(true);
            return;
        }
        this.cacheBuildingOperationData(BuildingOperationType.sell, building);
        building.sell(true);
        this.nextStep();
    }
    /**获取数据 */
    getRecoverOperationData(data: BuildingOperationData, toLast: boolean) {
        this._tmpOperationData.reset();
        this._tmpOperationData.type = data.type;
        this._tmpOperationData.idx = data.idx;
        this._tmpOperationData.buildingID = data.buildingID;
        this._tmpOperationData.editInfo = data.editInfo;
        if (toLast) {
            this._tmpOperationData.x = data.dataX;
            this._tmpOperationData.y = data.dataY;
            this._tmpOperationData.grids = data.dataGrids;
            this._tmpOperationData.isFlip = data.dataIsFlip;
        } else {
            if (BuildingOperationType.edit == data.type) {
                this._tmpOperationData.x = data.x;
                this._tmpOperationData.y = data.y;
                this._tmpOperationData.grids = data.grids;
                this._tmpOperationData.isFlip = data.isFlip;
            }
        }
        return this._tmpOperationData;
    }
    /**从操作数据中还原 */
    recoverByOperationData(data: BuildingOperationData): void {
        this._mainScene.recoverByOperationData(data);
    }
    /**建筑按钮界面关闭 */
    onBuildingBtnViewClose() {
        this.clearData();
    }
}