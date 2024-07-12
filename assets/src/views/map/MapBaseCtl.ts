import { EventMouse, EventTouch, Touch } from "cc";
import { MainBaseCtl } from "../main/MainBaseCtl";

//普通地图处理
export class MapBaseCtl extends MainBaseCtl {

    private _touchMoveOffset: number = 1;//触摸误差
    protected _maxTouchCount: number = 2;//最大触摸数量
    // protected _lastTouchPos:Vec2;//上一次触摸位置
    protected _isTouchMove: boolean = false;//是否触摸移动
    protected _isTouchInSelf: boolean = false;//是否触摸自身

    // 触摸移动有效
    isTouchMoveEffective(dtX: number, dtY: number): boolean {
        if (Math.abs(dtX) < this._touchMoveOffset &&
            Math.abs(dtY) < this._touchMoveOffset) {
            return false;
        }
        return true;
    }
    /** 点击开始 */
    onTouchStart(e: EventTouch) {
        if (1 != e.getAllTouches().length) return false;
        this._isTouchInSelf = true;
        return true;
    }
    /** 点击移动 */
    onTouchMove(e: EventTouch) {
        let touches = e.getAllTouches();
        if (touches.length > this._maxTouchCount) return false;
        let delta = e.getUIDelta();
        let dtX = -delta.x;
        let dtY = -delta.y;
        if (!this.isTouchMoveEffective(dtX, dtY)) {
            return false;
        }
        this._isTouchMove = true;

        if (1 == touches.length) {
            this._mainScene.mapMove(dtX, dtY);
            return true;
        }
        this.mapZoomByTouches(touches[0], touches[1]);
        return true;
    }
    /** 点击结束 */
    onTouchEnd(e: EventTouch) {
        this._isTouchMove = false;
        this._isTouchInSelf = false;
        return true;
    }
    // 点击取消
    onTouchCancel(e: EventTouch) {
        this._isTouchMove = false;
        this._isTouchInSelf = false;
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
        this._isTouchInSelf = false;
    }
    // 确定事件
    confirmEvent(): void {

    }
    // 取消事件
    cancelEvent(): void {
    }
    // UI上一步
    prevStepEvent() {
    }
    // UI下一步
    nextStepEvent() {
    }
    /**当前步数 */
    getStep(): number {
        return 0;
    }
    /**总步数 */
    getTotalStep(): number {
        return 0;
    }
    // 两点缩放地图
    public mapZoomByTouches(touch1: Touch, touch2: Touch) {
        let touchPos1 = touch1.getUILocation();
        let touchPos2 = touch2.getUILocation();
        let delta1 = touch1.getUIDelta();
        let delta2 = touch2.getUIDelta();
        let dt1 = touchPos1.subtract(touchPos2);
        let dt2 = delta1.subtract(delta2);
        // let dis = 1.0;
        let scale = 1.0;
        if (Math.abs(dt1.x) > Math.abs(dt1.y)) {
            // dis = (dt1.x + dt2.x) / dt1.x;
            scale = dt1.x / (dt1.x + dt2.x);
        }
        else {
            // dis = (dt1.y + dt2.y) / dt1.y;
            scale = dt1.y / (dt1.y + dt2.y);
        }
        if (scale > 1.0) scale = Math.min(scale, 1.2);
        if (scale < 1.0) scale = Math.max(scale, 0.8);
        // this._mainScene.mapZoom(1 / dis);
        this._mainScene.mapZoom(scale);
    }
}