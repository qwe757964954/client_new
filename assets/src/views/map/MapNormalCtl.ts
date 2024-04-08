import { EventMouse, EventTouch, Vec2 } from "cc";
import { MainScene } from "../main/MainScene";

//普通地图处理
export class MapNormalCtl {

    private _touchMoveOffset:number = 1;//触摸误差

    protected _mainScene:MainScene = null;//主场景
    protected _lastTouchPos:Vec2;//上一次触摸位置
    protected _isTouchMove:boolean = false;//是否触摸移动

    constructor(mainScene:MainScene) {
        this._mainScene = mainScene;

        this.init();
    }

    // 初始化
    public init():void {
        
    }
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
        // let pos = e.getLocation();//需要用屏幕坐标去转换点击事件
        // this._lastTouchGrid = this.getTouchGrid(pos.x, pos.y);
        // if(this._lastTouchGrid){
        //     this._touchBuilding = this._lastTouchGrid.building;
        // }
        // this._touchBuilding = this.isTouchBuilding(pos.x, pos.y);
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
    }
    // 点击取消
    onTouchCancel(e:EventTouch){
        this._lastTouchPos = null;
        this._isTouchMove = false;
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
    }
    // 确定事件
    confirmEvent(): void {
        
    }
    // 取消事件
    cancelEvent(): void {
    }
}