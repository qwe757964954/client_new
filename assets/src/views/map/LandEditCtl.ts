import { EventTouch } from "cc";
import { MapStatus } from "../../config/MapConfig";
import { EditInfo } from "../../manager/DataMgr";
import { ViewsManager } from "../../manager/ViewsManager";
import { LandModel } from "../../models/LandModel";
import { s2cBuildingCreate, s2cBuildingEdit } from "../../models/NetModel";
import { InterfacePath } from "../../net/InterfacePath";
import { ServiceMgr } from "../../net/ServiceManager";
import { EventMgr } from "../../util/EventManager";
import { ToolUtil } from "../../util/ToolUtil";
import { MainScene } from "../main/MainScene";
import { MapBaseCtl } from "./MapBaseCtl";

//地块编辑控制器
export class LandEditCtl extends MapBaseCtl {

    private _selectLand: EditInfo = null;//选中地块
    private _landCache: Map<string, LandModel> = new Map();//地块缓存
    private _buildingEditHandle: string;//建筑编辑事件
    private _buildingCreateHandle: string;//建筑创建事件
    constructor(mainScene: MainScene, callBack?: Function) {
        super(mainScene, callBack);

        this.initEvent();
    }
    // 初始化事件
    initEvent() {
        this._buildingEditHandle = EventMgr.on(InterfacePath.c2sBuildingEdit, this.onBuildingEdit.bind(this));
        this._buildingCreateHandle = EventMgr.on(InterfacePath.c2sBuildingCreate, this.onBuildingCreate.bind(this));
    }
    // 销毁
    public dispose(): void {
        EventMgr.off(InterfacePath.c2sBuildingEdit, this._buildingEditHandle);
        EventMgr.off(InterfacePath.c2sBuildingCreate, this._buildingCreateHandle);
    }
    /** 建筑编辑返回 */
    onBuildingEdit(data: s2cBuildingEdit) {
        if (this._mainScene.getMapCtl() != this) return;
        if (200 != data.Code) {
            ViewsManager.showAlert(data.Msg);
            return;
        }
        let land = this._mainScene.findLand(data.id);
        this.saveOneLand(land);
    }
    /** 建筑创建返回 */
    onBuildingCreate(data: s2cBuildingCreate) {
        if (this._mainScene.getMapCtl() != this) return;
        if (200 != data.Code) {
            ViewsManager.showAlert(data.Msg);
            return;
        }
        let land = this._mainScene.findLandByIdx(data.idx);
        if (land) {
            land.buildingID = data.id;
            this.saveOneLand(land);
        }
    }
    /**保存单块地块 */
    public saveOneLand(land: LandModel) {
        if (!land) return;
        land.saveData();
        let key = ToolUtil.replace("{0}_{1}", land.x, land.y);
        this._landCache.delete(key);
        if (this._landCache.size <= 0) {
            this._selectLand = null;
            this._mainScene.changeMapStatus(MapStatus.EDIT);
        }
    }

    //设置选中地块
    public set selectLand(land: EditInfo) {
        if (!land) return;
        this._selectLand = land;
    }

    // 点击开始
    onTouchStart(e: EventTouch) {
        return super.onTouchStart(e);
    }
    // 点击移动
    onTouchMove(e: EventTouch) {
        if (!this._selectLand) return false;
        let delta = e.getUIDelta();
        let dtX = -delta.x;
        let dtY = -delta.y;
        if (!this.isTouchMoveEffective(dtX, dtY)) {
            return false;
        }
        this._isTouchMove = true;

        let pos = e.getLocation();
        let gridModel = this._mainScene.getTouchGrid(pos.x, pos.y);
        if (gridModel && gridModel.land) {
            gridModel.land.refreshLand(this._selectLand);
            this.cacheLand(gridModel.land);
        }
        return true;
    }
    // 点击结束
    onTouchEnd(e: EventTouch) {
        if (!this._selectLand) return false;
        if (!this._isTouchMove) {
            let pos = e.getLocation();
            let gridModel = this._mainScene.getTouchGrid(pos.x, pos.y);
            if (gridModel && gridModel.land) {
                gridModel.land.refreshOneLand(this._selectLand);
                this.cacheLand(gridModel.land);
            }
        }
        return super.onTouchEnd(e);
    }
    // 清理数据
    clearData(): void {
        this.recoverLand();
        super.clearData();
    }
    // 确定事件
    confirmEvent(): void {
        this.reqLandEdit();
        // this._selectLand = null;
        // this.saveLand();
        // this._mainScene.changeMapStatus(MapStatus.EDIT);
    }
    // 取消事件
    cancelEvent(): void {
        this._selectLand = null;
        this.recoverLand();
        this._mainScene.changeMapStatus(MapStatus.EDIT);
    }
    // 缓存修改地块
    cacheLand(land: LandModel): void {
        this._landCache.set(ToolUtil.replace("{0}_{1}", land.x, land.y), land);
    }
    // 缓存地块还原
    recoverLand(): void {
        this._landCache.forEach(element => {
            element.recover();
        });
        this._landCache.clear();
    }
    // 缓存地块保存
    saveLand(): void {
        this._landCache.forEach(element => {
            element.saveData();
        });
        this._landCache.clear();
    }
    // 请求地块修改
    reqLandEdit() {
        this._landCache.forEach(element => {
            if (element.buildingID) {
                ServiceMgr.buildingService.reqBuildingEdit(element.buildingID, element.x, element.y);
            } else {
                ServiceMgr.buildingService.reqBuildingCreate(element.bid, element.x, element.y, element.idx);
            }
        });
    }
}