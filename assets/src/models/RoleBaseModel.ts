import { _decorator, Node, sp, SpriteFrame, Texture2D, Tween, tween } from 'cc';
import { MapConfig } from '../config/MapConfig';
import { DataMgr, RoleInfo, SlotPngInfo } from '../manager/DataMgr';
import { LoadManager } from '../manager/LoadManager';
import { BaseComponent } from '../script/BaseComponent';
import CCUtil from '../util/CCUtil';
import { UserClothes } from './User';
const { ccclass, property } = _decorator;
/** 角色状态 */
export enum RoleState {
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
    @property(Node)
    public spNode: Node = null;//sp节点

    private _isSelf: boolean = false;//是否是自己
    // private _x: number;//x格子坐标
    // private _y: number;//y格子坐标
    // private _lastPos: Vec3;//上一次停留位置
    // private _toPos: Vec3;//目标位置
    private _roleState: RoleState = RoleState.none;//角色状态
    // private _roleSpeed: number = 50;//角色速度
    private _scale: number = 1.0;//角色缩放
    // private _isMoving: boolean = false;//是否正在移动
    // private _timer: number = 0;//计时器
    // private _isActive: boolean = false;//是否激活
    // private _dataPos: Vec3;//数据坐标
    private _isLoad: boolean = false;//是否加载
    private _isSpLoad: boolean = false;//是否加载动画
    private _isShowFlag1: boolean = true;//是否显示标记1(建筑层是否显示)
    private _isShowFlag2: boolean = false;//是否显示标记2(摄像机是否显示)

    protected _roleID: number;//角色id
    protected _level: number;//等级
    protected _roleType: RoleType = RoleType.none;//角色类型
    protected _roleInfo: RoleInfo;//角色信息
    private _clothings: UserClothes = new UserClothes();//服装

    protected start(): void {
        this.initEvent();
    }
    protected update(dt: number): void {

    }
    get pos() {
        return this.node.position;
    }
    get roleID() {
        return this._roleID;
    }
    get level() {
        return this._level;
    }
    set roleScale(scale: number) {
        this._scale = scale;
        CCUtil.setNodeScale(this.spNode, this._scale);
    }
    // 销毁
    public dispose() {
        this.node.destroy();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    public get isSelf(): boolean {
        return this._isSelf;
    }
    public initSelf() {
        this._isSelf = true;
    }
    /**插槽加载 */
    private loadSlots(slots: SlotPngInfo[]) {
        if (!slots || !this.role || !this._isSpLoad) return;
        for (let i = 0; i < slots.length; i++) {
            let slotInfo = slots[i];
            LoadManager.loadSpriteFrame(slotInfo.png, this.role.node).then((asset: SpriteFrame) => {
                let slot = this.role.findSlot(slotInfo.slot);
                let attachment = this.role.getAttachment(slotInfo.slot, slotInfo.attachment);
                slot.setAttachment(attachment);
                this.role.setSlotTexture(slotInfo.slot, asset.texture as Texture2D, true);
            });
        }
    }
    public get clothings() {
        return this._clothings;
    }
    public set clothings(clothings: UserClothes) {
        this._clothings.setData(clothings);
        this.updateClothings();
    }
    /**更新服装 */
    private updateClothings() {
        if (!this._clothings || !this.role || !this._isSpLoad) return;
        let clothings = this._clothings.getClothings();
        for (let i = 0; i < clothings.length; i++) {
            let clothing = clothings[i];
            if (null == clothing) continue;
            let clothingInfo = DataMgr.clothingConfig[clothing];
            this.loadSlots(clothingInfo.slots);
        }
    }
    /**替换服装 */
    public changeClothing(clothing: number) {
        if (!clothing) return;
        let clothingInfo = DataMgr.clothingConfig[clothing];
        this._clothings.setClothing(clothing, clothingInfo.type);
        this.loadSlots(clothingInfo.slots);
    }
    // 初始化
    protected async init(roleID: number, level: number, roleType: RoleType = RoleType.none) {
        this._roleID = roleID;
        this._level = level;
        this._roleType = roleType;
        if (RoleType.role == roleType) {
            this._roleInfo = DataMgr.roleConfig[this._roleID];
            this._scale = MapConfig.roleGameScale;
        } else {
            this._roleInfo = MapConfig.spriteInfo[this._roleID][level - 1];
            this._scale = MapConfig.spriteScale;
        }
        this.initRole();
    }
    // 初始化角色
    public initRole() {
        CCUtil.setNodeScale(this.spNode, this._scale);
    }
    // 初始化动作
    public initAction() {
        let roleState = this._roleState;
        this._roleState = RoleState.none;
        switch (roleState) {
            case RoleState.walk:
                this.walk();
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
    // 待机动作
    public idle() {
        if (this._roleState == RoleState.idle) return;
        this._roleState = RoleState.idle;
        if (!this._isSpLoad) return;
        this.role.setAnimation(0, this._roleInfo.actNames[0], true);
    }
    // 走动动作
    public walk() {
        if (this._roleState == RoleState.walk) return;
        this._roleState = RoleState.walk;
        if (!this._isSpLoad) return;
        this.role.setAnimation(0, this._roleInfo.actNames[1], true);
    }
    // 原地待机
    public standby() {
        this.idle();
        Tween.stopAllByTarget(this.node);
        // this._isMoving = false;
        // this._lastPos = this.pos;
        tween(this.node).delay(0.5).call(() => {
            // EventManager.emit(EventType.Role_Need_Move, this);
        }).start();
    }
    /**显示与否 */
    public show(isShow: boolean, callBack?: Function) {
        this._isShowFlag2 = isShow;
        if (this._isShowFlag2) {
            this.node.active = this._isShowFlag1;
            if (this._isShowFlag1 && !this._isLoad) {
                this._isLoad = true;
                LoadManager.loadSpine(this._roleInfo.path, this.role).then((skeletonData: sp.SkeletonData) => {
                    this._isSpLoad = true;
                    this.initAction();
                    this.updateClothings();
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
    /**等级更新 */
    public updateLevel(level: number) {
        if (this._level == level) return;
        this._level = level;
        if (RoleType.sprite == this._roleType) {
            this._roleInfo = MapConfig.spriteInfo[this._roleID][level - 1];
        }
        LoadManager.loadSpine(this._roleInfo.path, this.role).then((skeletonData: sp.SkeletonData) => {
            this.initAction();
        });
    }
}

