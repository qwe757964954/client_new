import { EventMouse, EventTouch } from "cc";
import { BuildingModel } from "../../models/BuildingModel";
import { CloudModel } from "../../models/CloudModel";
import { RoleDataModel } from "../../models/RoleDataModel";
import { TimerMgr } from "../../util/TimerMgr";
import { MapBaseCtl } from "../map/MapBaseCtl";

//普通地图处理
export class MapNormalCtl extends MapBaseCtl {

    private _touchBuilding: BuildingModel = null;//触摸建筑
    private _timer: number = null;//计时器
    private _isLongClick: boolean = false;//是否长按点击

    private _touchRole: RoleDataModel = null;//触摸角色
    private _touchCloud: CloudModel = null;//触摸乌云


    /** 点击开始 */
    onTouchStart(e: EventTouch) {
        if (!super.onTouchStart(e)!) return false;
        let pos = e.getLocation();//需要用屏幕坐标去转换点击事件
        this._touchRole = this._mainScene.getTouchRole(pos.x, pos.y);
        if (this._touchRole) {
            // 定时器触发
            this._timer = TimerMgr.once(() => {
                if (this._touchRole) {
                    this._isLongClick = true;
                    this._timer = null;
                    this._mainScene.onRoleDragStart(this._touchRole);
                }
            }, 100);
            return true;
        }
        this._touchCloud = this._mainScene.getTouchCloud(pos.x, pos.y);
        if (this._touchCloud) {
            return true;
        }
        this._touchBuilding = this._mainScene.getTouchBuilding(pos.x, pos.y);//for test
        // let grid = this._mainScene.getTouchGrid(pos.x, pos.y);
        // this._touchBuilding = grid?.building;
        if (this._touchBuilding && this._touchBuilding.isCanEdit) {
            // 显示长按提示UI
            this._mainScene.onBuildingLongStart(this._touchBuilding);
            // 定时器触发
            this._timer = TimerMgr.once(() => {
                if (this._touchBuilding) {
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
        let touches = e.getAllTouches();
        if (touches.length > this._maxTouchCount) return false;
        let delta = e.getUIDelta();
        let dtX = -delta.x;
        let dtY = -delta.y;
        if (!this.isTouchMoveEffective(dtX, dtY)) {
            return false;
        }
        this._isTouchMove = true;

        if (this._isTouchMove) {
            if (this._timer) {
                this._mainScene.onBuildingLongCancel(this._touchBuilding);
                TimerMgr.stop(this._timer);
                this._timer = null;
            }

            this._touchBuilding = null;
            if (!this._isLongClick) {
                this._touchRole = null;
            }
            this._touchCloud = null;
        }

        if (1 == touches.length) {
            if (this._isLongClick) {
                this._mainScene.onRoleDrag(this._touchRole, delta.x, delta.y);
                return true;
            }
            this._mainScene.mapMove(dtX, dtY);
            return true;
        }
        this.mapZoomByTouches(touches[0], touches[1]);
        return true;
    }
    //点击结束
    public onTouchEnd(e: EventTouch) {
        if (this._timer) {
            this._mainScene.onBuildingLongCancel(this._touchBuilding);
            TimerMgr.stop(this._timer);
            this._timer = null;
        }
        if (this._touchRole) {
            if (this._isLongClick) {
                this._mainScene.onRoleDragEnd(this._touchRole);
            } else {
                this._mainScene.onRoleClick(this._touchRole);
            }
        }
        if (this._touchCloud) {
            this._mainScene.onCloudClick(this._touchCloud);
        }
        if (this._touchBuilding && !this._isLongClick) {
            this._mainScene.onBuildingClick(this._touchBuilding);
        }

        this._touchBuilding = null;
        this._isLongClick = false;
        this._touchRole = null;
        this._touchCloud = null;
        return super.onTouchEnd(e);
    }
    //点击取消
    public onTouchCancel(e: EventTouch) {
        if (this._timer) {
            this._mainScene.onBuildingLongCancel(this._touchBuilding);
            TimerMgr.stop(this._timer);
            this._timer = null;
        }
        this._touchBuilding = null;
        this._isLongClick = false;
        this._touchRole = null;
        this._touchCloud = null;
        return super.onTouchCancel(e);
    }
    //滚轮事件
    public onMapMouseWheel(e: EventMouse): void {
        super.onMapMouseWheel(e);
    }
    // 清理数据
    clearData(): void {
        if (this._timer) {
            this._mainScene.onBuildingLongCancel(this._touchBuilding);
            TimerMgr.stop(this._timer);
            this._timer = null;
        }
        this._touchBuilding = null;
        this._isLongClick = false;
        this._touchRole = null;
        this._touchCloud = null;
        super.clearData();
    }
    // 确定事件
    confirmEvent(): void {

    }
    // 取消事件
    cancelEvent(): void {
    }
}