import { EventMouse, EventTouch } from "cc";
import { MapBaseCtl } from "./MapBaseCtl";
import { GridModel } from "../../models/GridModel";
import { BuildingModel } from "../../models/BuildingModel";
import { MapStatus } from "../../config/MapConfig";

//建筑编辑控制器
export class BuildEditCtl extends MapBaseCtl {
    private _lastTouchGrid:GridModel = null;//上一次触摸格子
    private _selectBuilding:BuildingModel = null;//选中建筑
    private _touchBuilding:BuildingModel = null;//触摸建筑
    
    // 设置选中建筑
    public set selectBuilding(building:BuildingModel){
        if(!building) return;
        if(this._selectBuilding){//恢复上一次选中的建筑
            this._selectBuilding.recoverData();
            this._selectBuilding = null;
        }
        this._selectBuilding = building;
        this._selectBuilding.showBtnView(this._mainScene.cameraRate);
    }
    // 摄像机缩放
    public onCameraScale(rate:number):void {
        if(this._selectBuilding){
            this._selectBuilding.onCameraScale(this._mainScene.cameraRate);
        }
    }

    //点击开始
    public onTouchStart(e: EventTouch) {
        if(!super.onTouchStart(e)) return false;
        let pos = e.getLocation();//需要用屏幕坐标去转换点击事件
        let grid = this._mainScene.getTouchGrid(pos.x, pos.y);
        this._lastTouchGrid = grid;
        this._touchBuilding = grid?.building;
        return true;
    }
    //点击移动
    public onTouchMove(e: EventTouch) {
        let delta = e.getUIDelta();
        let dtX = -delta.x;
        let dtY = -delta.y;
        if(!this.isTouchMoveEffective(dtX, dtY)){
            return false;
        }
        if(this._touchBuilding && this._selectBuilding && this._selectBuilding == this._touchBuilding){
            let pos = e.getLocation();
            let gridModel = this._mainScene.getTouchGrid(pos.x, pos.y);
            if(gridModel && gridModel != this._lastTouchGrid){
                this._mainScene.setBuildingGrid(this._selectBuilding, gridModel.x, gridModel.y);
            }

            this._lastTouchGrid = gridModel;
            return true;
        }
        this._isTouchMove = true;
        this._mainScene.mapMove(dtX, dtY);
        return true;
    }
    //点击结束
    public onTouchEnd(e: EventTouch) {
        if(this._isTouchInSelf && !this._isTouchMove){
            let pos = e.getLocation();
            let gridModel = this._mainScene.getTouchGrid(pos.x, pos.y);
            if(gridModel){
                this._mainScene.setBuildingGrid(this._selectBuilding, gridModel.x, gridModel.y);
            }
        }
        this._lastTouchGrid = null;
        this._touchBuilding = null;
        return super.onTouchEnd(e);
    }

    //点击取消
    public onTouchCancel(e: EventTouch) {
        this._lastTouchGrid = null;
        this._touchBuilding = null;
        return super.onTouchCancel(e);
    }
    //滚轮事件
    public onMapMouseWheel(e: EventMouse): void {
        super.onMapMouseWheel(e);
    }
    // 清理数据
    clearData(): void {
        if(this._selectBuilding){
            this._selectBuilding.recoverData();
            this._selectBuilding = null;
        }
        super.clearData();
    }
    // 取消事件
    cancelEvent(): void {
        if(this._selectBuilding){
            this._selectBuilding.recoverData();
            this._selectBuilding = null;
        }
    }
    // UI上一步
    prevStepEvent(): void {
        this._mainScene.changeMapStatus(MapStatus.EDIT);
    }
    // UI下一步
    nextStepEvent(): void {
        this._mainScene.changeMapStatus(MapStatus.EDIT);
    }
}