import { EventTouch } from "cc";
import { MapStatus } from "../../config/MapConfig";
import { TextConfig } from "../../config/TextConfig";
import { EditInfo } from "../../manager/DataMgr";
import { ViewsManager } from "../../manager/ViewsManager";
import { LandModel } from "../../models/LandModel";
import { s2cLandUpdate } from "../../models/NetModel";
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
    private _landUpdateHandle: string;//地块更新
    constructor(mainScene: MainScene, callBack?: Function) {
        super(mainScene, callBack);

        this.initEvent();
    }
    // 初始化事件
    initEvent() {
        this._landUpdateHandle = EventMgr.on(InterfacePath.c2sLandUpdate, this.onLandUpdate.bind(this));
    }
    // 销毁
    public dispose(): void {
        EventMgr.off(InterfacePath.c2sLandUpdate, this._landUpdateHandle);
    }
    /**地块更新返回 */
    onLandUpdate(data: s2cLandUpdate) {
        if (200 != data.code) {
            ViewsManager.showAlert(data.msg);
            return;
        }
        this._selectLand = null;
        this.saveLand();
        this._mainScene.changeMapStatus(MapStatus.EDIT);
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
        if (gridModel && gridModel.land && !gridModel.cloud) {
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
            if (gridModel && gridModel.land && !gridModel.cloud) {
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
        this._landCache.set(ToolUtil.replace(TextConfig.Land_Key, land.x, land.y), land);
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
        let map: { [key: string]: number } = {};
        this._landCache.forEach((value, key) => {
            map[key] = value.bid;
        });
        ServiceMgr.buildingService.reqLandUpdate(map);
    }
}