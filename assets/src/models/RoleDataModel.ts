import { Node, Rect, Sprite, Tween, TweenSystem, UITransform, Vec2, Vec3, sp, tween } from "cc";
import { EventType } from "../config/EventType";
import { MapConfig, RoleInfo } from "../config/MapConfig";
import { PrefabType } from "../config/PrefabType";
import { DataMgr } from "../manager/DataMgr";
import { LoadManager } from "../manager/LoadManager";
import { ServiceMgr } from "../net/ServiceManager";
import CCUtil from "../util/CCUtil";
import { EventMgr } from "../util/EventManager";
import { TimerMgr } from "../util/TimerMgr";
import { ToolUtil } from "../util/ToolUtil";
import { PetMoodView } from "../views/map/PetMoodView";
import { BaseModel } from "./BaseModel";
import { GridModel } from "./GridModel";
import { RoleState, RoleType } from "./RoleBaseModel";
import { User } from "./User";

const slotsAry = [
    [9500, 9700, 9701, 9702, 9703],
    [9550, 9800, 9801, 9802, 9803, 9805],
    [9600, 9900, 9901, 9902, 9903]
];

/**
 * 角色数据层
 * 为了优化瞬间加载大量的角色产生卡顿
 */
export class RoleDataModel extends BaseModel {
    /**精灵独有 */
    private _giftNode: Node = null;//礼物提示
    private _moodNode: Node = null;//心情提示
    private _giftShow: boolean = false;//礼物提示是否显示
    private _moodShow: boolean = false;//心情提示是否显示
    private _giftTipViewLoad: boolean = false;//礼物提示是否加载
    private _moodViewLoad: boolean = false;//心情提示是否加载
    private _moodView: PetMoodView = null;//心情提示view
    /**公共 */
    private _role: sp.Skeleton = null;//角色
    private _spNode: Node = null;//sp节点

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
    // private _isLoad: boolean = false;//是否加载
    private _isSpLoad: boolean = false;//是否加载动画
    private _isShowFlag1: boolean = true;//是否显示标记1(建筑层是否显示)
    // private _isShowFlag2: boolean = false;//是否显示标记2(摄像机是否显示)

    private _roleID: number;//角色id
    private _level: number;//等级
    private _roleType: RoleType = RoleType.none;//角色类型
    private _roleInfo: RoleInfo;//角色信息
    private _slots: number[] = [];//插槽
    private _needMovePos: Vec3 = null;//需要移动的位置

    /**角色独有 */
    // 更新spine插槽
    public updateSpineSlot() {
        let roleSlot = DataMgr.roleSlot[this._roleID];
        let roleSlotConfig = DataMgr.roleSlotConfig;
        let showSlot = [];
        this._slots.forEach(propID => {
            showSlot = showSlot.concat(roleSlotConfig[propID].Ass);
        });
        roleSlot.slots.forEach(slotName => {
            if (-1 == showSlot.indexOf(slotName)) {
                let slot = this._role.findSlot(slotName);
                slot?.setAttachment(null);//有些插槽是不存在的
            }
        });
    }
    /**精灵独有 */
    /**显示礼物提示 */
    public showGift() {
        this._giftShow = true;
        if (!this._giftNode) return;
        this._giftNode.active = true;
        if (this._giftTipViewLoad) return;
        this._giftTipViewLoad = true;
        LoadManager.loadPrefab(PrefabType.PetGiftTipView.path, this._giftNode).then((node: Node) => {
            CCUtil.onTouch(node, () => {
                ServiceMgr.buildingService.reqPetGetReward();
            });
        });
    }
    /**隐藏礼物提示 */
    public hideGift() {
        this._giftShow = false;
        if (!this._giftNode) return;
        this._giftNode.active = false;
    }
    /**显示心情提示 */
    public showMood() {
        this._moodShow = true;
        if (!this._moodNode) return;
        this._moodNode.active = true;
        if (this._moodView) {
            this._moodView.init(User.moodScore);
            return;
        }
        if (this._moodViewLoad) return;
        this._moodViewLoad = true;
        LoadManager.loadPrefab(PrefabType.PetMoodView.path, this._moodNode).then((node: Node) => {
            this._moodView = node.getComponent(PetMoodView);
            this._moodView.init(User.moodScore);
        });
    }
    /**隐藏心情提示 */
    public hideMood() {
        this._moodShow = false;
        if (!this._moodNode) return;
        this._moodNode.active = false;
    }

    public get roleType(): RoleType {
        return this._roleType;
    }
    // 初始化
    public init(roleID: number, level: number, roleType: RoleType) {
        if (RoleType.none != this._roleType) return;
        this._roleType = roleType;
        this._roleID = roleID;
        this._level = level;
        if (RoleType.role == roleType) {
            this._roleInfo = MapConfig.roleInfo[this._roleID][level - 1];
            let id = this._roleID;
            if (id > 100) id -= 100;
            this._slots = slotsAry[id - 1];
        } else {
            this._roleInfo = MapConfig.spriteInfo[this._roleID][level - 1];
        }
    }
    public initSelfRole() {
        let roleID = User.roleID;
        if (roleID < 100) roleID += 100;
        this.init(roleID, 1, RoleType.role);
    }
    public initSelfPet() {
        let petID = User.petID;
        if (petID < 100) petID += 100;
        this.init(petID, User.petLevel, RoleType.sprite);
    }

    get pos() {
        if (!this._node) return this._pos;
        return this._node.position;
    }
    get roleID() {
        return this._roleID;
    }
    get level() {
        return this._level;
    }
    // 销毁
    public dispose() {
        if (this._node && this._node.isValid) {
            this._node.destroy();
            this._node = null;
        }
        if (this._timer) {
            TimerMgr.stopLoop(this._timer);
            this._timer = null;
        }
    }
    /**画出碰撞区域 */
    public drawRect() {
        let sprite = this._node.getComponentInChildren(Sprite);
        if (!sprite) return;
        let node = sprite.node;
        node.active = true;
        let rect: Rect = this._roleInfo.rect;
        node.position = new Vec3(rect.x, rect.y, 0);
        let transform: UITransform = node.getComponent(UITransform);
        transform.width = rect.width;
        transform.height = rect.height;
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
    // 更新朝向
    public updateFace() {
        if (!this._lastPos || !this._toPos) return;
        if (this._toPos.x > this._lastPos.x) {
            CCUtil.setNodeScale(this._spNode, this._scale);
            return;
        }
        CCUtil.setNodeScaleEx(this._spNode, -this._scale, this._scale);
    }
    // 待机动作
    public idle() {
        if (this._roleState == RoleState.idle) return;
        this._roleState = RoleState.idle;
        if (!this._isSpLoad) return;
        this._role.setAnimation(0, this._roleInfo.spNames[0], true);
    }
    // 走动动作
    public walk() {
        if (this._roleState == RoleState.walk) return;
        this._roleState = RoleState.walk;
        if (!this._isSpLoad) return;
        this._role.setAnimation(0, this._roleInfo.spNames[1], true);
    }
    // 拖拽动作
    public drag() {
        if (this._roleState == RoleState.drag) return;
        this._roleState = RoleState.drag;
        if (!this._isSpLoad) return;
        this._role.setAnimation(0, this._roleInfo.spNames[0], true);
    }
    // 设置格子
    public set grid(grid: GridModel) {
        if (!grid) return;
        this._x = grid.x;
        this._y = grid.y;
        let gridPos = grid.pos;
        this._zIndex = this.pos ? -this.pos.y : (gridPos.y - grid.height * 0.5);
        if (this._lastPos) return;
        let pos = new Vec3(gridPos.x, gridPos.y - grid.height * 0.5, 0);
        if (this._node)
            this._node.position = pos;
        this._pos = pos;
        this._lastPos = pos;
    }
    // 移动到指定格子
    public moveToGrid(grid: GridModel) {
        if (!grid) return;
        let gridPos = grid.pos;
        let pos = new Vec3(gridPos.x, gridPos.y - grid.height * 0.5, 0);
        if (this._node) {
            this.moveTo(pos);
        }
        else {
            this._needMovePos = pos;
        }
    }
    public moveTo(pos: Vec3) {
        if (this._isMoving) return;
        // console.log("移动到指定位置", pos.x,pos.y);
        this.walk();
        Tween.stopAllByTarget(this._node);
        this._isMoving = true;
        this._toPos = pos;
        if (this._timer) TimerMgr.stopLoop(this._timer);
        this._timer = TimerMgr.loop(this.notifyZOrderUpdate.bind(this), 1000);
        let distance = ToolUtil.vec3Sub(this._lastPos, pos).length();
        let t = distance / this._roleSpeed;
        tween(this._node).to(t, { position: pos }).call(() => {
            this._lastPos = pos;
            this._isMoving = false;
            if (this._timer) {
                TimerMgr.stopLoop(this._timer);
                this._timer = null;
            }
            EventMgr.emit(EventType.Role_Need_Move, this);
        }).start();
        this.updateFace();
    }
    // 原地待机
    public standby() {
        if (!this._node) return;
        this.idle();
        Tween.stopAllByTarget(this._node);
        this._isMoving = false;
        this._lastPos = this.pos;
        tween(this._node).delay(0.5).call(() => {
            EventMgr.emit(EventType.Role_Need_Move, this);
        }).start();
    }
    /** 原地拖拽 */
    public dragStandby() {
        this.drag();
        Tween.stopAllByTarget(this._node);
        this._isMoving = false;
        this._lastPos = this.pos;
    }
    // 通知层级更新
    public notifyZOrderUpdate() {
        if (!this._isMoving) return;//没有移动暂时不用通知
        EventMgr.emit(EventType.Role_Need_Sort, this);
    }
    // 是否点击到自己
    public isTouchSelf(x: number, y: number): boolean {
        if (!this._node) return false;
        let rect = this.getRect();
        return rect.contains(new Vec2(x, y));
    }
    /** 是否显示在屏幕上 */
    public set isActive(isActive: boolean) {
        this._isShowFlag1 = isActive;
        if (this._isShowFlag1) {
            this.node.active = this._isShow;
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
        //TODO 效果
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
        if (this._node) {
            this._node.active = isShow;
        }

        this._isShow = isShow;
        if (isShow) {
            if (this._node) {
                this._node.active = this._isShowFlag1;
            }
            if (this._isShowFlag1 && !this._isLoad) {
                this._isLoad = true;
                LoadManager.loadPrefab(PrefabType.RoleBaseModel.path, this._parent).then((node: Node) => {
                    this._node = node;
                    this._node.active = this._isShow && this._isShowFlag1;
                    this._node.position = this._pos;
                    this._giftNode = node.getChildByName("gift");
                    this._moodNode = node.getChildByName("mood");
                    this._role = node.getComponentInChildren(sp.Skeleton);
                    this._spNode = node.getChildByName("spNode");
                    CCUtil.setNodeScale(this._spNode, this._scale);
                    if (this._giftNode && this._giftShow) {
                        this.showGift();
                    }
                    if (this._moodNode && this._moodShow) {
                        this.showMood();
                    }
                    LoadManager.loadSpine(this._roleInfo.spPath, this._role).then((skeletonData: sp.SkeletonData) => {
                        this._isSpLoad = true;
                        this.initAction();
                        if (this._needMovePos) {
                            this.moveTo(this._needMovePos);
                            this._needMovePos = null;
                        }
                        this.updateSpineSlot();
                        if (callBack) callBack();
                    });
                });
            } else {
                if (callBack) callBack();
            }
        } else {
            if (this._node) {
                this._node.active = false;
            }
            if (callBack) callBack();
        }
    }
    /**获取显示范围 */
    public getRect() {
        let rect: Rect = this._roleInfo.rect;
        rect = rect.clone();
        let pos = this.node ? this.node.position : this._pos;
        rect.x += pos.x;
        rect.y += pos.y;
        return rect;
    }
    /**等级更新 */
    public updateLevel(level: number) {
        if (this._level == level) return;
        this._level = level;
        if (RoleType.role == this._roleType) {
            this._roleInfo = MapConfig.roleInfo[this._roleID][level - 1];
        } else {
            this._roleInfo = MapConfig.spriteInfo[this._roleID][level - 1];
        }
        LoadManager.loadSpine(this._roleInfo.spPath, this._role).then((skeletonData: sp.SkeletonData) => {
            this.initAction();
        });
    }
}