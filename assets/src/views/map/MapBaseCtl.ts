import { EventMouse, EventTouch, Vec2 } from "cc";
import { MainBaseCtl } from "../main/MainBaseCtl";

//普通地图处理
export class MapBaseCtl extends MainBaseCtl {

    private _touchMoveOffset:number = 1;//触摸误差
    protected _lastTouchPos:Vec2;//上一次触摸位置
    protected _isTouchMove:boolean = false;//是否触摸移动
    protected _isTouchInSelf:boolean = false;//是否触摸自身

    // 触摸移动有效
    isTouchMoveEffective(dtX:number, dtY:number):boolean{
        if(Math.abs(dtX) < this._touchMoveOffset &&
            Math.abs(dtY) < this._touchMoveOffset){
            return false;
        }
        return true;
    }
    // 点击开始
    onTouchStart(e:EventTouch){
        this._lastTouchPos = e.getUILocation();
        this._isTouchInSelf = true;
    }
    // 点击移动
    onTouchMove(e:EventTouch){
        let touchPos = e.getUILocation();
        let dtX = this._lastTouchPos.x - touchPos.x;
        let dtY = this._lastTouchPos.y - touchPos.y;
        if(!this.isTouchMoveEffective(dtX, dtY)){
            return;
        }
        this._isTouchMove = true;
        this._mainScene.mapMove(dtX, dtY);
        this._lastTouchPos = touchPos;
    }
    // 点击结束
    onTouchEnd(e:EventTouch){
        this._lastTouchPos = null;
        this._isTouchMove = false;
        this._isTouchInSelf = false;
    }
    // 点击取消
    onTouchCancel(e:EventTouch){
        this._lastTouchPos = null;
        this._isTouchMove = false;
        this._isTouchInSelf = false;
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
        this._isTouchInSelf = false;
    }
    // 确定事件
    confirmEvent(): void {
        
    }
    // 取消事件
    cancelEvent(): void {
    }
}