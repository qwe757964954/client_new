import { _decorator, Label, Node, Rect, Sprite, Tween, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { ConfirmParam } from '../config/ClassConfig';
import { MapConfig } from '../config/MapConfig';
import { PrefabType } from '../config/PrefabType';
import { TextConfig } from '../config/TextConfig';
import { LoadManager } from '../manager/LoadManager';
import { ViewsMgr } from '../manager/ViewsManager';
import { ServiceMgr } from '../net/ServiceManager';
import CCUtil from '../util/CCUtil';
import { TimerMgr } from '../util/TimerMgr';
import { ToolUtil } from '../util/ToolUtil';
import { CloudConditionView } from '../views/map/CloudConditionView';
import { BaseModel } from './BaseModel';
import { GridModel } from './GridModel';
const { ccclass, property } = _decorator;
/**云 */
export class CloudModel extends BaseModel {
    private _img: Sprite = null;//图片
    private _label: Label = null;//文字
    private _unlockNode: Node = null;//解锁节点
    private _unlockTip: Node = null;//解锁提示
    private _imgClock: Node = null;//解锁时钟
    private _btnSpeed: Node = null;//加速按钮

    // y从上往下，x从右往左
    private _x: number;//x格子坐标
    private _y: number;//y格子坐标
    private _width: number;//宽
    private _grids: GridModel[];//格子
    private _unlockTime: number = null;//解锁时间
    private _isUnlock: boolean = false;//是否解锁

    private _showID: number = 0;//显示id
    private _isLoadOver: boolean = false;//图片是否加载完成
    private _timer: number = null;//定时器
    private _uiNodeShow: boolean = true;//是否显示
    private _canUnlock: boolean = false;//是否可以解锁
    private _tweenAct: Tween<UIOpacity> = null;//半透明动画
    public get unlockTime(): number {
        return this._unlockTime;
    }
    public get isUnlock(): boolean {
        return this._isUnlock;
    }
    public get canUnlock(): boolean {
        return this._canUnlock;
    }
    public set canUnlock(canUnlock: boolean) {
        this._canUnlock = canUnlock;
        this.refreshUIView();
    }

    public dispose(): void {
        this.clearTimer();
        if (this._node && this._node.isValid) {
            this._node.destroy();
            this._node = null;
        }
    }

    // 初始化数据
    public initData(x: number, y: number, width: number, leftTime?: number, parent?: Node) {
        this._x = x;
        this._y = y;
        this._width = width;
        this.unlockTime = leftTime;
        this._parent = parent;
    }
    public get x(): number {
        return this._x;
    }
    public get y(): number {
        return this._y;
    }
    public get width(): number {
        return this._width;
    }
    public set grids(grids: GridModel[]) {
        if (this._grids) return;
        if (grids.length != this._width * this._width) {
            console.log("grids error data");
            return;
        }
        // console.log("set grids",grids);
        this._grids = grids;
        for (let i = 0; i < this._grids.length; i++) {
            this._grids[i].cloud = this;
        }
        let gridInfo = this._grids[0];
        this._x = gridInfo.x;
        this._y = gridInfo.y;
        let gridPos = gridInfo.pos;
        let pos = new Vec3(gridPos.x, gridPos.y - this._width * gridInfo.height, 1);
        this._pos = pos;
        if (this._node)
            this._node.position = pos;
        // this._zIndex = -pos.y;
        this._zIndex = -(gridPos.y - this._width * gridInfo.height * 0.5);//描点
    }
    public set showID(showID: number) {
        this._showID = showID;
    }
    public set unlockTime(leftTime: number) {
        if (null != leftTime) {
            // console.log("set unlockTime", leftTime);
            this._unlockTime = ToolUtil.now() + leftTime;
            CCUtil.setNodeOpacity(this._img?.node, 128);
            if (this._label)
                this._label.node.active = true;
            if (this._imgClock)
                this._imgClock.active = true;
            if (this._btnSpeed)
                this._btnSpeed.active = true;
            if (leftTime > 0) {
                this.clearTimer();
                this._timer = TimerMgr.loop(this.updateBySec.bind(this), 1000);
            }
            if (this._unlockTip) this._unlockTip.active = false;
            this.refreshTimeEx();
        } else {
            CCUtil.setNodeOpacity(this._img?.node, 255);
            if (this._label)
                this._label.node.active = false;
            if (this._imgClock)
                this._imgClock.active = false;
            if (this._btnSpeed)
                this._btnSpeed.active = false;
        }
    }
    /**清理格子 */
    public clearGrids(): void {
        if (!this._grids) return;
        for (let i = 0; i < this._grids.length; i++) {
            this._grids[i].cloud = null;
        }
    }
    /**清理定时器 */
    public clearTimer(): void {
        if (this._timer) {
            TimerMgr.stopLoop(this._timer);
            this._timer = null;
        }
    }
    /**每秒刷新 */
    public updateBySec() {
        this.refreshTime();
    }
    /**获得剩余时间 */
    public getLeftTime(): number {
        let sec = this._unlockTime - ToolUtil.now();
        return sec > 0 ? sec : 0;
    }
    /**刷新时间显示 */
    public refreshTime() {
        if (!this._isLoadOver || null == this._unlockTime || this._isUnlock) return;
        this.refreshTimeEx();
    }
    public refreshTimeEx() {
        if (null == this._unlockTime) return;
        let leftTime = this._unlockTime - ToolUtil.now();
        if (leftTime > 0) {
            if (this._label)
                this._label.string = ToolUtil.secondsToTimeFormat(leftTime);
        } else {
            this._isUnlock = true;
            this.refreshUIView();
            // this.showOpacityAnim();
        }
    }
    /**半透明动画 */
    private showOpacityAnim() {
        if (this._tweenAct) return;
        let uiOpacity = this._img?.getComponent(UIOpacity);
        if (!uiOpacity) return;
        let time = 1.0;
        uiOpacity.opacity = 128;
        this._tweenAct = tween(uiOpacity)
            .to(time, { opacity: 255 })
            .delay(0.5)
            .to(time, { opacity: 128 })
            .union()
            .repeatForever()
            .start();
    }
    /**停止半透明动画 */
    private stopOpacityAnim() {
        if (!this._tweenAct) return;
        this._tweenAct.stop();
        this._tweenAct = null;
    }
    /**显示UI */
    public showUIView() {
        this._uiNodeShow = true;
        this.refreshUIView();
    }
    /**隐藏UI */
    public hideUIView() {
        this._uiNodeShow = false;
        this.refreshUIView();
    }
    /**刷新UI显示 */
    public refreshUIView() {
        if (this._uiNodeShow) {
            if (null != this._unlockTime) {
                if (this._unlockTime <= ToolUtil.now()) {
                    if (this._label) this._label.node.active = false;
                    if (this._imgClock) this._imgClock.active = false;
                    if (this._unlockNode) this._unlockNode.active = true;
                    if (this._btnSpeed) this._btnSpeed.active = false;
                    this.showOpacityAnim();
                } else {
                    CCUtil.setNodeOpacity(this._img?.node, 128);
                    if (this._label) this._label.node.active = true;
                    if (this._imgClock) this._imgClock.active = true;
                    if (this._unlockNode) this._unlockNode.active = false;
                    if (this._btnSpeed) this._btnSpeed.active = true;
                }
                if (this._unlockTip) this._unlockTip.active = false;
            } else {
                if (this._label) this._label.node.active = false;
                if (this._imgClock) this._imgClock.active = false;
                if (this._unlockNode) this._unlockNode.active = false;
                if (this._unlockTip) this._unlockTip.active = this._canUnlock;
                if (this._btnSpeed) this._btnSpeed.active = false;
            }
        } else {
            this.stopOpacityAnim();
            CCUtil.setNodeOpacity(this._img?.node, 255);
            if (this._label) this._label.node.active = false;
            if (this._imgClock) this._imgClock.active = false;
            if (this._unlockNode) this._unlockNode.active = false;
            if (this._unlockTip) this._unlockTip.active = false;
            if (this._btnSpeed) this._btnSpeed.active = false;
        }
    }
    //显示图片
    public showImg(callBack?: Function) {
        let cloudInfo = MapConfig.cloud;
        let path = ToolUtil.replace(cloudInfo.path, cloudInfo.pngs[this._showID]);
        LoadManager.loadSprite(path, this._img, true).then(() => {
            this._isLoadOver = true;

            let transform = this._img.getComponent(UITransform);
            let pos = new Vec3(0, transform.height, 0);
            this._unlockNode.position = pos;
            pos.x = -20;
            this._imgClock.position = pos;
            pos.x = 40;
            this._label.node.position = pos;

            this.refreshTime();
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
                this.showImg(callBack);
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
            LoadManager.loadPrefab(PrefabType.CloudModel.path, this._parent, true).then((node: Node) => {
                this._node = node;
                this._node.active = this._isShow;
                this._node.position = this._pos;
                this._img = this._node.getChildByName("Sprite").getComponent(Sprite);
                this._label = this._node.getChildByName("Label").getComponent(Label);
                this._unlockNode = this._node.getChildByName("img_right");
                this._unlockTip = this._node.getChildByName("img_unlock");
                this._imgClock = this._node.getChildByName("img_clock");
                this._btnSpeed = this._node.getChildByName("btnSpeed");
                CCUtil.onTouch(this._btnSpeed, this.onCloudClick, this);
                CCUtil.onTouch(this._unlockNode, this.onCloudClick, this);

                // let transform = this._img.getComponent(UITransform);
                // let pos = new Vec3(0, transform.height, 0);
                // this._unlockNode.position = pos;
                // this._imgClock.position = pos;

                this.refreshUIView();
                this.refreshTimeEx();

                if (this._isLoad) {
                    this.showImg(callBack);
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
        // let rect = new Rect(-216, 0, 432, 216);
        let rect = new Rect(-216, 0, 432, 300);//增加树丛显示高度，防止某些树丛过高
        rect.x += this._pos.x;
        rect.y += this._pos.y;
        return rect;
    }
    /**点击乌云 */
    onCloudClick() {
        if (this._isUnlock) {
            ServiceMgr.buildingService.reqCloudUnlockGet([ToolUtil.replace(TextConfig.Land_Key, this._x, this._y)]);
            return;
        }
        if (null == this._unlockTime) {
            ViewsMgr.showView(PrefabType.CloudConditionView, (node: Node) => {
                node.getComponent(CloudConditionView).init(() => {
                    ServiceMgr.buildingService.reqCloudUnlock([ToolUtil.replace(TextConfig.Land_Key, this._x, this._y)]);
                });
            });
            // ViewsMgr.showConfirm(TextConfig.Cloud_Unlock_Tip, () => {
            //     ServiceMgr.buildingService.reqCloudUnlock([ToolUtil.replace(TextConfig.Land_Key, this._x, this._y)]);
            // });
        } else {
            ViewsMgr.showConfirm(new ConfirmParam(TextConfig.Speed_Words_Tip, TextConfig.Speed_Words_Tip4), () => {
                ServiceMgr.buildingService.reqSpeedWordsGetEx(ToolUtil.replace(TextConfig.Land_Key, this._x, this._y));
            });
        }
    }
    /**乌云散开 */
    showCloudDispose(callBack?: Function) {
        this.clearGrids();
        if (callBack) callBack(this);
        this.dispose();
    }
}


