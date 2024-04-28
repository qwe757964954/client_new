import { _decorator, Rect, sp, Tween, tween, TweenSystem, Vec2, Vec3 } from 'cc';
import { EventType } from '../config/EventType';
import { MapConfig, RoleInfo } from '../config/MapConfig';
import { TextConfig } from '../config/TextConfig';
import { LoadManager } from '../manager/LoadManager';
import { ViewsManager } from '../manager/ViewsManager';
import { BaseComponent } from '../script/BaseComponent';
import EventManager from '../util/EventManager';
import { TimerMgr } from '../util/TimerMgr';
import { ToolUtil } from '../util/ToolUtil';
import { GridModel } from './GridModel';
const { ccclass, property } = _decorator;
/** 角色状态 */
enum RoleState {
    none = 0,//无
    idle = 1,//待机
    walk = 2,//行走
    drag = 3,//拖拽
}
/** 角色类型 */
export enum RoleType {
    none = 0,//无
    role = 1,//角色
    sprite = 2,//精灵
}
/** 角色精灵基类 */
@ccclass('RoleBaseModel')
export class RoleBaseModel extends BaseComponent {
    @property(sp.Skeleton)
    public role: sp.Skeleton = null;

    private _x: number;//x格子坐标
    private _y: number;//y格子坐标
    private _lastPos: Vec3;//上一次停留位置
    private _toPos: Vec3;//目标位置
    private _roleState: RoleState = RoleState.none;//角色状态
    private _roleSpeed: number = 50;//角色速度
    private _scale: number = 0.8;//角色缩放
    private _isMoving: boolean = false;//是否正在移动
    private _timer: number = 0;//计时器
    // private _isActive: boolean = false;//是否激活
    private _dataPos: Vec3;//数据坐标
    private _isLoad: boolean = false;//是否加载
    private _isSpLoad: boolean = false;//是否加载动画
    private _isShowFlag1: boolean = true;//是否显示标记1(建筑层是否显示)
    private _isShowFlag2: boolean = false;//是否显示标记2(摄像机是否显示)

    protected _roleID: number;//角色id
    protected _level: number;//等级
    protected _roleType: RoleType = RoleType.none;//角色类型
    protected _roleInfo: RoleInfo;//角色信息
    protected _slots: number[] = [];//插槽
    protected _loadCallBack: Function = null;//加载回调

    protected start(): void {
        this.initEvent();
    }
    protected update(dt: number): void {

    }
    get pos() {
        return this.node.position;
    }
    // 销毁
    public dispose() {
        this.node.destroy();
    }
    protected onDestroy(): void {
        this.removeEvent();
        if (this._timer) {
            TimerMgr.stopLoop(this._timer);
            this._timer = null;
        }
    }
    // 初始化
    public async init(roleID: number, level: number, slots: number[] = [], roleType: RoleType = RoleType.none, loadCallBack?: Function) {
        this._roleID = roleID;
        this._slots = slots;
        this._level = level;
        this._roleType = roleType;
        if (RoleType.role == roleType) {
            this._roleInfo = MapConfig.roleInfo[this._roleID][level - 1];
        } else {
            this._roleInfo = MapConfig.spriteInfo[this._roleID][level - 1];
        }
        this._loadCallBack = loadCallBack;
        this.initRole();
    }
    // 初始化角色
    public async initRole() {
        this.role.node.scale = new Vec3(this._scale, this._scale, 1);
    }
    // 初始化动作
    public initAction() {
        let roleState = this._roleState;
        this._roleState = RoleState.none;
        switch (roleState) {
            case RoleState.walk:
                this.walk();
                break;
            case RoleState.drag:
                this.drag();
                break;
            default:
                this.idle();
                break;
        }
    }
    // 初始化事件
    public initEvent() {
    }
    // 移除事件
    public removeEvent() {

    }
    // 更新朝向
    public updateFace() {
        if (!this._lastPos || !this._toPos) return;
        if (this._toPos.x > this._lastPos.x) {
            this.node.scale = new Vec3(this._scale, this._scale, 1);
            return;
        }
        this.node.scale = new Vec3(-this._scale, this._scale, 1);
    }
    // 待机动作
    public idle() {
        if (this._roleState == RoleState.idle) return;
        this._roleState = RoleState.idle;
        if (!this._isSpLoad) return;
        this.role.setAnimation(0, this._roleInfo.spNames[0], true);
    }
    // 走动动作
    public walk() {
        if (this._roleState == RoleState.walk) return;
        this._roleState = RoleState.walk;
        if (!this._isSpLoad) return;
        this.role.setAnimation(0, this._roleInfo.spNames[1], true);
    }
    // 拖拽动作
    public drag() {
        if (this._roleState == RoleState.drag) return;
        this._roleState = RoleState.drag;
        if (!this._isSpLoad) return;
        this.role.setAnimation(0, this._roleInfo.spNames[0], true);
    }
    // 设置格子
    public set grid(grid: GridModel) {
        if (!grid) return;
        this._x = grid.x;
        this._y = grid.y;
        let gridPos = grid.pos;
        // this._zIndex = this._x * this._y;
        // this._zIndex = -(gridPos.y - grid.height * 0.5);
        this._zIndex = -this.pos.y;
        if (this._lastPos) return;
        let pos = new Vec3(gridPos.x, gridPos.y - grid.height * 0.5, 0);
        this.node.position = pos;
        this._lastPos = pos;
    }
    // 移动到指定格子
    public moveToGrid(grid: GridModel) {
        if (!grid) return;
        let gridPos = grid.pos;
        let pos = new Vec3(gridPos.x, gridPos.y - grid.height * 0.5, 0);
        this.moveTo(pos);
    }
    public moveTo(pos: Vec3) {
        if (this._isMoving) return;
        // console.log("移动到指定位置", pos.x,pos.y);
        this.walk();
        Tween.stopAllByTarget(this.node);
        this._isMoving = true;
        this._toPos = pos;
        if (this._timer) TimerMgr.stopLoop(this._timer);
        this._timer = TimerMgr.loop(this.notifyZOrderUpdate.bind(this), 1000);
        let distance = ToolUtil.vec3Sub(this._lastPos, pos).length();
        let t = distance / this._roleSpeed;
        tween(this.node).to(t, { position: pos }).call(() => {
            this._lastPos = pos;
            this._isMoving = false;
            if (this._timer) {
                TimerMgr.stopLoop(this._timer);
                this._timer = null;
            }
            EventManager.emit(EventType.Role_Need_Move, this);
        }).start();
        this.updateFace();
    }
    // 原地待机
    public standby() {
        this.idle();
        Tween.stopAllByTarget(this.node);
        this._isMoving = false;
        this._lastPos = this.pos;
        tween(this.node).delay(0.5).call(() => {
            EventManager.emit(EventType.Role_Need_Move, this);
        }).start();
    }
    /** 原地拖拽 */
    public dragStandby() {
        this.drag();
        Tween.stopAllByTarget(this.node);
        this._isMoving = false;
        this._lastPos = this.pos;
    }
    // 通知层级更新
    public notifyZOrderUpdate() {
        if (!this._isMoving) return;//没有移动暂时不用通知
        EventManager.emit(EventType.Role_Need_Sort, this);
    }
    // 是否点击到自己
    public isTouchSelf(x: number, y: number): boolean {
        let rect = this.getRect();
        return rect.contains(new Vec2(x, y));
    }
    /** 是否显示在屏幕上 */
    public set isActive(isActive: boolean) {
        this._isShowFlag1 = isActive;
        if (this._isShowFlag1) {
            this.node.active = this._isShowFlag2;
        } else {
            this.node.active = false;
        }
        if (this._isShowFlag1) {
            TweenSystem.instance.ActionManager.resumeTarget(this.node);
        } else {
            TweenSystem.instance.ActionManager.pauseTarget(this.node);
        }
    }
    /** 点击显示 */
    public onClickShow() {
        this.standby();
        ViewsManager.showAlert(TextConfig.Role_Text1);//TODO 效果
    }
    /** 拖拽开始 */
    public onDragStart() {
        this.topZIndex = true;//置顶
        this.dragStandby();
        this._dataPos = this.node.position.clone();
    }
    /** 拖拽 */
    public onDrag(x: number, y: number) {
        let pos = this.node.position.clone();
        pos.x += x;
        pos.y += y;
        this.node.position = pos;
    }
    /** 拖拽结束 */
    public onDragEnd(x: number, y: number) {
        this.node.position = new Vec3(x, y, 0);
        this.standby();
        this.topZIndex = false;//取消置顶
    }
    public onDragEndEx() {//还原回去
        this.node.position = this._dataPos;
        this.standby();
        this.topZIndex = false;//取消置顶
    }
    /**显示与否 */
    public show(isShow: boolean, callBack?: Function) {
        this._isShowFlag2 = isShow;
        if (this._isShowFlag2) {
            this.node.active = this._isShowFlag1;
            if (this._isShowFlag1 && !this._isLoad) {
                this._isLoad = true;
                LoadManager.loadSpine(this._roleInfo.spPath, this.role).then((skeletonData: sp.SkeletonData) => {
                    this._isSpLoad = true;
                    this.initAction();
                    if (this._loadCallBack) this._loadCallBack();
                    if (callBack) callBack();
                });
            } else {
                if (callBack) callBack();
            }
        } else {
            this.node.active = false;
            if (callBack) callBack();
        }
    }
    /**获取显示范围 */
    public getRect() {
        let rect: Rect = this._roleInfo.rect;
        rect = rect.clone();
        let pos = this.node.position;
        rect.x += pos.x;
        rect.y += pos.y;
        return rect;
    }
}

