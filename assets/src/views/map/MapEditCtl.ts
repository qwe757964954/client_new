import { EventMouse, EventTouch } from "cc";
import { MapBaseCtl } from "../map/MapBaseCtl";
import { BuildingModel } from "../../models/BuildingModel";

//地图编辑控制器
export class MapEditCtl extends MapBaseCtl {

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
        this._touchBuilding = null;
        super.onTouchEnd(e);
    }
    //点击取消
    public onTouchCancel(e: EventTouch): void {
        this._touchBuilding = null;
        super.onTouchCancel(e);
    }
    //滚轮事件
    public onMapMouseWheel(e: EventMouse): void {
        super.onMapMouseWheel(e);
    }
    // 清理数据
    clearData(): void {
        this._touchBuilding = null;
        super.clearData();
    }

    // 取消事件
    cancelEvent(): void {
        
    }
}