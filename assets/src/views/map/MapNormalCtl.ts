import { EventMouse, EventTouch, Vec2 } from "cc";
import { MapBaseCtl } from "../map/MapBaseCtl";
import { BuildingModel } from "../../models/BuildingModel";
import { TimerMgr } from "../../util/TimerMgr";

//普通地图处理
export class MapNormalCtl extends MapBaseCtl {

    private _touchBuilding:BuildingModel = null;//触摸建筑
    private _timer:number = null;//计时器
    private _isLongClick:boolean = false;//是否长按点击

    // 点击开始
    onTouchStart(e:EventTouch){
        if(!super.onTouchStart(e)!) return false;
        let pos = e.getLocation();//需要用屏幕坐标去转换点击事件
        let grid = this._mainScene.getTouchGrid(pos.x, pos.y);
        this._touchBuilding = grid?.building;
        if(this._touchBuilding){
            // 显示长按提示UI TODO
            // 定时器触发
            this._timer = TimerMgr.once(()=>{
                if(this._touchBuilding){
                    this._isLongClick = true;
                    this._mainScene.onBuildingLongClick(this._touchBuilding);
                    this._timer = null;
                    this.onTouchCancel(e);
                }
            }, 1000);
        }
        return true;
    }
    //点击移动
    public onTouchMove(e: EventTouch) {
        if(!super.onTouchMove(e)) return false;
        if(this._isTouchMove && this._touchBuilding){
            TimerMgr.stop(this._timer);
            this._timer = null;
            this._touchBuilding = null;
        }
        return true;
    }
    //点击结束
    public onTouchEnd(e: EventTouch) {
        if(this._timer){
            TimerMgr.stop(this._timer);
            this._timer = null;
        }
        if(this._touchBuilding && !this._isLongClick){
            this._mainScene.onBuildingClick(this._touchBuilding);
        }
        this._touchBuilding = null;
        return super.onTouchEnd(e);
    }
    //点击取消
    public onTouchCancel(e: EventTouch) {
        if(this._timer){
            TimerMgr.stop(this._timer);
            this._timer = null;
        }
        this._touchBuilding = null;
        return super.onTouchCancel(e);
    }
    //滚轮事件
    public onMapMouseWheel(e: EventMouse): void {
        super.onMapMouseWheel(e);
    }
    // 清理数据
    clearData(): void {
        if(this._timer){
            TimerMgr.stop(this._timer);
            this._timer = null;
        }
        this._touchBuilding = null;
        this._isLongClick = false;
        super.clearData();
    }
    // 确定事件
    confirmEvent(): void {
        
    }
    // 取消事件
    cancelEvent(): void {
    }
}