import { Node, Rect, TweenSystem, Vec3, _decorator, sp, tween } from 'cc';
import { MapSpInfo } from '../config/MapConfig';
import { PrefabType } from '../config/PrefabType';
import { LoadManager } from '../manager/LoadManager';
import CCUtil from '../util/CCUtil';
import { TimerMgr } from '../util/TimerMgr';
import { ToolUtil } from '../util/ToolUtil';
import { BaseModel } from './BaseModel';
const { ccclass, property } = _decorator;

enum MapSpState {
    rightMove = 0,//右移动
    leftMove = 1,//左移动
    standby = 2,//原地待机
}

export class MapSpModel extends BaseModel {

    private _sp: sp.Skeleton = null;//动画
    // private _spNode: Node = null;//sp节点

    private _data: MapSpInfo;//数据
    private _isSpLoad: boolean = false;//是否加载动画
    private _timer: number = 0;//计时器
    private _clickCount: number = 0;//点击次数
    private _spState: MapSpState = null;//状态

    public dispose(): void {
        if (this._node && this._node.isValid) {
            this._node.destroy();
            this._node = null;
        }
    }

    /**初始化 */
    public init(data: MapSpInfo, parent: Node) {
        this._data = data;
        this._parent = parent;
        this._pos = data.pos;
    }
    /**显示动画 */
    public showAnimation(callBack?: Function) {
        LoadManager.loadSpine(this._data.path, this._sp).then((skeletonData: sp.SkeletonData) => {
            this._isSpLoad = true;
            this.showNormalAnimation();
            if (callBack) callBack();
        });
    }
    /**显示与否 */
    public show(isShow: boolean, callBack?: Function) {
        if (this._node) {
            this._node.active = isShow;
        }
        this._isShow = isShow;
        if (isShow && !this._isLoad) {
            this._isLoad = true;
            if (this._node) {
                this.showAnimation(callBack);
            } else {
                this.loadNode(callBack);
            }
        } else {
            if (callBack) callBack();
        }
    }
    /**加载node */
    public loadNode(callBack?: Function) {
        if (!this._isLoadNode) {
            this._isLoadNode = true;

            LoadManager.loadPrefab(PrefabType.SpModel.path, this._parent, true).then((node: Node) => {
                this._node = node;
                this._node.active = this._isShow;
                this._node.position = this._pos;
                this._sp = node.getComponentInChildren(sp.Skeleton);
                // this._spNode = node.getChildByName("spNode");
                if (this._data.scale) {
                    this._sp.node.scale = this._data.scale;
                }

                CCUtil.offTouch(this._node, this.onClick, this);
                CCUtil.onTouch(this._node, this.onClick, this);

                if (this._isLoad) {
                    this.showAnimation(callBack);
                } else {
                    if (callBack) callBack();
                }
            });
        } else {
            if (callBack) callBack();
        }
    }
    /**获取显示范围 */
    public getRect() {
        let rect = new Rect(this._data.rect);
        rect.x += this._pos.x;
        rect.y += this._pos.y;
        return rect;
    }
    /**显示常态动画 */
    public showNormalAnimation() {
        if (!this._isSpLoad) return;
        if (7 == this._data.id) {//白虎
            this.moveAction();
            return;
        }
        this._sp.setAnimation(0, this._data.names[0], true);
    }
    /**白虎移动 */
    public moveAction() {
        if (!this._isSpLoad) return;
        this._sp.timeScale = 0.75;
        this._sp.setCompleteListener(this.onAnimationComplete.bind(this));
        this._sp.setMix(this._data.names[0], this._data.names[2], 0.5);
        this._sp.setMix(this._data.names[2], this._data.names[0], 0.5);
        this._sp.setMix(this._data.names[1], this._data.names[2], 0.5);
        this._sp.setMix(this._data.names[2], this._data.names[1], 0.5);
        this._sp.setMix(this._data.names[0], this._data.names[1], 0.5);
        this._sp.setMix(this._data.names[1], this._data.names[0], 0.5);
        this.moveToRightAction();
    }
    public moveToRightAction() {
        if (!this._isSpLoad) return;
        this._sp.setAnimation(0, this._data.names[0], true);
        let dtPos = new Vec3(260, -60, 0);
        let toPos = new Vec3(this._data.pos.x + dtPos.x, this._data.pos.y + dtPos.y, this._data.pos.z);
        tween(this._node).to(5.0, { position: toPos }).call(() => {
            this._sp.timeScale = 0.0;
            // this._spState = MapSpState.leftMove; TODO 待机动画
        }).delay(ToolUtil.getRandom(1, 4)).call(() => {
            this._sp.timeScale = 0.75;
            this.moveToLeftAction();
        }).start();
        this._spState = MapSpState.rightMove;
    }
    public moveToLeftAction() {
        if (!this._isSpLoad) return;
        this._sp.setAnimation(0, this._data.names[1], true);
        let toPos = new Vec3(this._data.pos);
        tween(this._node).to(5.0, { position: toPos }).delay(ToolUtil.getRandom(1, 2)).call(() => {
            this.moveToRightAction();
        }).start();
        this._spState = MapSpState.leftMove;
    }
    /**白虎生气 */
    public angryAction() {
        if (!this._isSpLoad) return;
        this._sp.timeScale = 0.75;
        this._sp.setAnimation(0, this._data.names[2], false);
    }
    /**点击事件 */
    public onClick() {
        if (!this._isSpLoad) return;
        this._clickCount++;
        this.clearTimer();
        if (this._clickCount >= 2) {
            this._clickCount = 0;
            TweenSystem.instance.ActionManager.pauseTarget(this._node);
            this.angryAction();
            return;
        }
        this._timer = TimerMgr.once(() => {
            this._clickCount = 0;
        }, 1000);
    }
    /**清理定时器 */
    public clearTimer() {
        if (this._timer) {
            TimerMgr.stop(this._timer);
            this._timer = null;
        }
    }
    /**动画完成回调 */
    onAnimationComplete(trackEntry: sp.spine.TrackEntry) {
        if (trackEntry.animation.name == this._data.names[2]) {
            this._sp.scheduleOnce(() => {
                TweenSystem.instance.ActionManager.resumeTarget(this._node);
                if (MapSpState.rightMove == this._spState) {
                    this._sp.setAnimation(0, this._data.names[0], true);
                } else {
                    this._sp.setAnimation(0, this._data.names[1], true);
                }
            });
        }
    }
}


