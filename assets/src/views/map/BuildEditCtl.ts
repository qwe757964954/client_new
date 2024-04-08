import { EventMouse, EventTouch } from "cc";
import { MapNormalCtl } from "./MapNormalCtl";
import { GridModel } from "../../models/GridModel";
import { BuildingModel } from "../../models/BuildingModel";

//建筑编辑控制器
export class BuildEditCtl extends MapNormalCtl {
    private _lastTouchGrid:GridModel = null;//上一次触摸格子
    private _selectBuilding:BuildingModel = null;//选中建筑
    private _touchBuilding:BuildingModel = null;//触摸建筑
    
    // 设置选中建筑
    public set selectBuilding(building:BuildingModel){
        this._selectBuilding = building;
        this._selectBuilding.showBtnView();
    }

    //点击开始
    public onTouchStart(e: EventTouch): void {
        super.onTouchStart(e);
        let pos = e.getLocation();//需要用屏幕坐标去转换点击事件
        let grid = this._mainScene.getTouchGrid(pos.x, pos.y);
        this._lastTouchGrid = grid;
        this._touchBuilding = grid?.building;
    }
    //点击移动
    public onTouchMove(e: EventTouch): void {
        let touchPos = e.getUILocation();
        let dtX = this._lastTouchPos.x - touchPos.x;
        let dtY = this._lastTouchPos.y - touchPos.y;
        if(!this.isTouchMoveEffective(dtX, dtY)){
            return;
        }
        if(this._touchBuilding && this._selectBuilding && this._selectBuilding == this._touchBuilding){
            let pos = e.getLocation();
            let gridModel = this._mainScene.getTouchGrid(pos.x, pos.y);
            if(gridModel && gridModel != this._lastTouchGrid){
                this._mainScene.setBuildingGrid(this._selectBuilding, gridModel.x, gridModel.y);
            }

            this._lastTouchGrid = gridModel;
            return;
        }
        this._isTouchMove = true;
        this._mainScene.mapMove(dtX, dtY);
        this._lastTouchPos = touchPos;
    }
    //点击结束
    public onTouchEnd(e: EventTouch): void {
        if(!this._isTouchMove){
            let pos = e.getLocation();
            let gridModel = this._mainScene.getTouchGrid(pos.x, pos.y);
            if(gridModel){
                this._mainScene.setBuildingGrid(this._selectBuilding, gridModel.x, gridModel.y);
            }
        }
        this._lastTouchGrid = null;
        this._touchBuilding = null;
        super.onTouchEnd(e);
    }

    //点击取消
    public onTouchCancel(e: EventTouch): void {
        this._lastTouchGrid = null;
        this._touchBuilding = null;
        super.onTouchCancel(e);
    }
    //滚轮事件
    public onMapMouseWheel(e: EventMouse): void {
        super.onMapMouseWheel(e);
    }
    // 清理数据
    clearData(): void {
        this._selectBuilding = null;
    }
    // 取消事件
    cancelEvent(): void {
        if(this._selectBuilding){
            this._selectBuilding.recover();
        }
    }
}