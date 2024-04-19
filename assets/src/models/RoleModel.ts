import { _decorator, Asset, Component, Intersection2D, Node, Rect, sp, Tween, tween, TweenAction, TweenSystem, UITransform, Vec2, Vec3 } from 'cc';
import { LoadManager } from '../manager/LoadManager';
import { MapConfig, RoleInfo } from '../config/MapConfig';
import { DataMgr } from '../manager/DataMgr';
import { ToolUtil } from '../util/ToolUtil';
import EventManager from '../util/EventManager';
import { EventType } from '../config/EventType';
import { GridModel } from './GridModel';
import { TimerMgr } from '../util/TimerMgr';
import { BaseComponent } from '../script/BaseComponent';
import { ViewsManager } from '../manager/ViewsManager';
import { TextConfig } from '../config/TextConfig';
const { ccclass, property } = _decorator;

enum RoleState {//角色状态
    none = 0,
    idle = 1,
    walk = 2,
    drag = 3,
}

@ccclass('RoleModel')
export class RoleModel extends BaseComponent {
    @property(sp.Skeleton)
    public role: sp.Skeleton = null;

    private _x: number;//x格子坐标
    private _y: number;//y格子坐标
    private _loadAssetAry: Asset[] = [];//加载资源数组
    private _lastPos: Vec3;//上一次停留位置
    private _toPos: Vec3;//目标位置
    private _roleState: RoleState = RoleState.none;//角色状态
    private _roleSpeed: number = 50;//角色速度
    private _scale: number = 0.8;//角色缩放
    private _isMoving: boolean = false;//是否正在移动
    private _timer: number = 0;//计时器
    // private _isActive: boolean = false;//是否激活
    private _dataPos: Vec3;//数据坐标


    private _roleID: number;//角色id
    private _propID: number[];//道具id

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
        LoadManager.releaseAssets(this._loadAssetAry);
        this._loadAssetAry = [];
        if (this._timer) {
            TimerMgr.stopLoop(this._timer);
            this._timer = null;
        }
    }
    // 初始化
    public async init(roleID: number, propID: number[]) {
        this._roleID = roleID;
        this._propID = propID;

        await this.initRole();
    }
    // 初始化角色
    public async initRole() {
        let roleInfo: RoleInfo = MapConfig.roleInfo[this._roleID];
        this.role.node.scale = new Vec3(this._scale, this._scale, 1);
        await LoadManager.load(roleInfo.spPath, sp.SkeletonData).then((skeletonData: sp.SkeletonData) => {
            this.role.skeletonData = skeletonData;
            this._loadAssetAry.push(skeletonData);

            this.updateSpineSlot();
            this.idle();
        });
    }
    // 初始化事件
    public initEvent() {
    }
    // 移除事件
    public removeEvent() {

    }
    // 更新spine插槽
    public updateSpineSlot() {
        let roleSlot = DataMgr.instance.roleSlot[this._roleID];
        let roleSlotConfig = DataMgr.instance.roleSlotConfig;
        let showSlot = [];
        this._propID.forEach(propID => {
            showSlot = showSlot.concat(roleSlotConfig[propID].Ass);
        });
        roleSlot.slots.forEach(slotName => {
            if (-1 == showSlot.indexOf(slotName)) {
                let slot = this.role.findSlot(slotName);
                slot?.setAttachment(null);//有些插槽是不存在的
            }
        });
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
        let roleInfo: RoleInfo = MapConfig.roleInfo[this._roleID];
        this.role.setAnimation(0, roleInfo.spNames[0], true);
    }
    // 走动动作
    public walk() {
        if (this._roleState == RoleState.walk) return;
        this._roleState = RoleState.walk;
        let roleInfo: RoleInfo = MapConfig.roleInfo[this._roleID];
        this.role.setAnimation(0, roleInfo.spNames[1], true);
    }
    // 拖拽动作
    public drag() {
        if (this._roleState == RoleState.drag) return;
        this._roleState = RoleState.drag;
        let roleInfo: RoleInfo = MapConfig.roleInfo[this._roleID];
        this.role.setAnimation(0, roleInfo.spNames[0], true);
    }
    // 设置格子
    public set grid(grid: GridModel) {
        if (!grid) return;
        this._x = grid.x;
        this._y = grid.y;
        // this._zIndex = this._x * this._y;
        this._zIndex = grid.height * 0.5 - grid.pos.y;
        if (this._lastPos) return;
        let gridPos = grid.pos;
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
        let transform = this.role.getComponent(UITransform);
        let rect: Rect = MapConfig.roleInfo[this._roleID].rect;
        rect = rect.clone();
        let pos = this.node.position;
        rect.x += pos.x;
        rect.y += pos.y;
        return rect.contains(new Vec2(x, y));
    }
    /** 是否显示在屏幕上 */
    public set isActive(isActive: boolean) {
        this.node.active = isActive;
        if (isActive) {
            TweenSystem.instance.ActionManager.resumeTarget(this.node);
        } else {
            TweenSystem.instance.ActionManager.pauseTarget(this.node);
        }
    }
    /** 点击显示 */
    public onClickShow() {
        this.standby();
        ViewsManager.instance.showAlert(TextConfig.Role_Text1);//TODO 效果
    }
    /** 拖拽开始 */
    public onDragStart() {
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
    }
    public onDragEndEx() {//还原回去
        this.node.position = this._dataPos;
        this.standby();
    }
}

