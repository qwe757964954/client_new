import { EventMouse, EventTouch } from "cc";
import { BuildingModel } from "../../models/BuildingModel";
import { MapBaseCtl } from "./MapBaseCtl";

//回收模式控制器
export class RecycleCtl extends MapBaseCtl {

    private _recycleBuildingAry: BuildingModel[] = [];//回收建筑数组

    // 点击开始
    onTouchStart(e: EventTouch) {
        return true;
    }
    // 点击移动
    onTouchMove(e: EventTouch) {
        let pos = e.getLocation();
        // let gridModel = this._mainScene.getTouchGrid(pos.x, pos.y);
        // this.onBuildingRecycle(gridModel?.building);
        this.onBuildingRecycle(this._mainScene.getTouchBuilding(pos.x, pos.y));
        return true;
    }
    // 点击结束
    onTouchEnd(e: EventTouch) {
        return true;
    }
    // 点击取消
    onTouchCancel(e: EventTouch) {
        return true;
    }
    // 滚轮事件
    onMapMouseWheel(e: EventMouse) {
        if (e.getScrollY() > 0) {
            this._mainScene.mapZoomIn();
        } else {
            this._mainScene.mapZoomOut();
        }
    }
    // 清理数据
    clearData(): void {
        this._recycleBuildingAry = [];
        super.clearData();
    }

    // 建筑回收
    onBuildingRecycle(building: BuildingModel) {
        if (!building) return;
        if (building.isCanEdit) return;
        building.recycle();
        this._recycleBuildingAry.push(building);
    }
    // 回收建筑还原
    onBuildingRecycleRestore() {
        for (let i = 0; i < this._recycleBuildingAry.length; i++) {
            let building = this._recycleBuildingAry[i];
            building.recover();
        }
    }
    // 回收保存
    onBuildingRecycleSave() {
        for (let i = 0; i < this._recycleBuildingAry.length; i++) {
            let building = this._recycleBuildingAry[i];
            building.dispose();
        }
        this._recycleBuildingAry = [];
    }
    // 确定事件
    confirmEvent(): void {
        this.onBuildingRecycleSave();
    }
    // 取消事件
    cancelEvent(): void {
        this.onBuildingRecycleRestore();
    }
}