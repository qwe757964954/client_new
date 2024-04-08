import { EventMouse, EventTouch } from "cc";
import { MapNormalCtl } from "./MapNormalCtl";
import { GridModel } from "../../models/GridModel";
import { BuildingModel } from "../../models/BuildingModel";

//地图编辑控制器
export class MapEditCtl extends MapNormalCtl {

    // private _lastTouchGrid:GridModel = null;//上一次触摸格子
    private _touchBuilding:BuildingModel = null;//触摸建筑

    //初始化
    public init(): void {
        
    }
    //点击开始
    public onTouchStart(e: EventTouch): void {
        super.onTouchStart(e);
        let pos = e.getLocation();//需要用屏幕坐标去转换点击事件
        let grid = this._mainScene.getTouchGrid(pos.x, pos.y);
        this._touchBuilding = grid?.building;
    }
    //点击移动
    public onTouchMove(e: EventTouch): void {
        super.onTouchMove(e);
    }
    //点击结束
    public onTouchEnd(e: EventTouch): void {
        if(!this._isTouchMove){
            this._mainScene.onBuildingClick(this._touchBuilding);
        }
        this._isTouchMove = false;
        this._touchBuilding = null;
    }
    //点击取消
    public onTouchCancel(e: EventTouch): void {
        this._isTouchMove = false;
        this._touchBuilding = null;
    }
    //滚轮事件
    public onMapMouseWheel(e: EventMouse): void {
        super.onMapMouseWheel(e);
    }
}