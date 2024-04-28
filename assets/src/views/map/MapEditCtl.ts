import { EventMouse, EventTouch } from "cc";
import { EventType } from "../../config/EventType";
import { BuildingModel } from "../../models/BuildingModel";
import EventManager from "../../util/EventManager";
import { MapBaseCtl } from "../map/MapBaseCtl";

//地图编辑控制器
export class MapEditCtl extends MapBaseCtl {

    private _touchBuilding: BuildingModel = null;//触摸建筑

    private _step: number = 0;//步骤
    private _cacheDataAry: BuildingModel[] = [];//缓存数据

    private _buildingRemoveHandle: string;//建筑移除事件
    // 初始化事件
    public initEvent(): void {
        this._buildingRemoveHandle = EventManager.on(EventType.BuidingModel_Remove, this.onBuildingRemove.bind(this));
    }
    // 销毁
    public dispose(): void {
        EventManager.off(EventType.BuidingModel_Remove, this._buildingRemoveHandle);
        this._cacheDataAry = [];
    }
    //点击开始
    public onTouchStart(e: EventTouch) {
        if (!super.onTouchStart(e)) return false;
        let pos = e.getLocation();//需要用屏幕坐标去转换点击事件
        // let grid = this._mainScene.getTouchGrid(pos.x, pos.y);
        // this._touchBuilding = grid?.building;
        this._touchBuilding = this._mainScene.getTouchBuilding(pos.x, pos.y);
        return true;
    }
    //点击移动
    public onTouchMove(e: EventTouch) {
        return super.onTouchMove(e);
    }
    //点击结束
    public onTouchEnd(e: EventTouch) {
        if (!this._isTouchMove) {
            this._mainScene.onBuildingClick(this._touchBuilding);
        }
        this._touchBuilding = null;
        return super.onTouchEnd(e);
    }
    //点击取消
    public onTouchCancel(e: EventTouch) {
        this._touchBuilding = null;
        return super.onTouchCancel(e);
    }
    //滚轮事件
    public onMapMouseWheel(e: EventMouse): void {
        super.onMapMouseWheel(e);
    }
    // 清理数据
    clearData(): void {
        this._touchBuilding = null;
        this._cacheDataAry = [];
        super.clearData();
    }

    // 取消事件
    cancelEvent(): void {

    }
    // UI上一步
    prevStepEvent(): void {
        if (this._step <= 0) return;
        this._step--;
        // TODO
    }
    // UI下一步
    nextStepEvent(): void {
        if (this._step >= this._cacheDataAry.length) return;
        this._step++;
        // TODO
    }
    // 建筑移除事件
    onBuildingRemove(building: BuildingModel): void {
        // TODO 上一步下一步保存
        if (building.isNew) {
            building.node.destroy();
            return;
        }
        this._cacheDataAry.push(building);
    }
}