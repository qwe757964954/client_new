import { EventMouse, EventTouch } from "cc";
import { MapNormalCtl } from "./MapNormalCtl";
import { BuildingModel } from "../../models/BuildingModel";

//回收模式控制器
export class RecycleCtl extends MapNormalCtl {

    private _recycleBuildingAry:BuildingModel[] = [];//回收建筑数组

    // 点击开始
    onTouchStart(e:EventTouch){
    }
    // 点击移动
    onTouchMove(e:EventTouch){
        let pos = e.getLocation();
        let gridModel = this._mainScene.getTouchGrid(pos.x, pos.y);
        this.onBuildingRecycle(gridModel?.building);
    }
    // 点击结束
    onTouchEnd(e:EventTouch){
    }
    // 点击取消
    onTouchCancel(e:EventTouch){
    }
    // 滚轮事件
    onMapMouseWheel(e:EventMouse){
        if(e.getScrollY()>0){
            this._mainScene.mapZoomIn();
        }else{
            this._mainScene.mapZoomOut();
        }
    }
    // 清理数据
    clearData(): void {
        this._recycleBuildingAry = [];
    }

    // 建筑回收
    onBuildingRecycle(building:BuildingModel){
        if(!building) return;
        building.recycle();
        this._recycleBuildingAry.push(building);
    }
    // 回收建筑还原
    onBuildingRecycleRestore(){
        for (let i = 0; i < this._recycleBuildingAry.length; i++) {
            let building = this._recycleBuildingAry[i];
            building.recover();
        }
    }
    // 回收保存
    onBuildingRecycleSave(){
        for (let i = 0; i < this._recycleBuildingAry.length; i++) {
            let building = this._recycleBuildingAry[i];
            building.destroy();
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