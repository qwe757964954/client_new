import { _decorator, Label, Sprite, UITransform, Vec3 } from 'cc';
import { MapConfig } from '../config/MapConfig';
import { TextConfig } from '../config/TextConfig';
import { LoadManager } from '../manager/LoadManager';
import { ViewsMgr } from '../manager/ViewsManager';
import { ServiceMgr } from '../net/ServiceManager';
import { BaseComponent } from '../script/BaseComponent';
import { TimerMgr } from '../util/TimerMgr';
import { ToolUtil } from '../util/ToolUtil';
import { GridModel } from './GridModel';
const { ccclass, property } = _decorator;
/**云 */
@ccclass('CloudModel')
export class CloudModel extends BaseComponent {
    @property(Sprite)
    public img: Sprite = null;//图片
    @property(Label)
    public label: Label = null;//文字

    // y从上往下，x从右往左
    private _x: number;//x格子坐标
    private _y: number;//y格子坐标
    private _width: number;//宽
    private _grids: GridModel[];//格子
    private _unlockTime: number = null;//解锁时间
    private _isUnlock: boolean = false;//是否解锁

    private _showID: number = 0;//显示id
    private _isLoad: boolean = false;//是否加载图片
    private _isLoadOver: boolean = false;//图片是否加载完成
    private _timer: number = null;//定时器

    protected onDestroy(): void {
        this.clearTimer();
    }

    // 初始化数据
    public initData(x: number, y: number, width: number, leftTime?: number) {
        this._x = x;
        this._y = y;
        this._width = width;
        this.unlockTime = leftTime;
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
        this.node.position = pos;
        this._zIndex = -pos.y;
    }
    public set showID(showID: number) {
        this._showID = showID;
    }
    public set unlockTime(leftTime: number) {
        if (null != leftTime) {
            // console.log("set unlockTime", leftTime);
            this._unlockTime = ToolUtil.now() + leftTime;
            this.label.node.active = true;
            if (leftTime > 0) {
                this.clearTimer();
                this._timer = TimerMgr.loop(this.updateBySec.bind(this), 1000);
            }
            this.refreshTimeEx();
        } else {
            this.label.node.active = false;
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
    /**刷新时间显示 */
    public refreshTime() {
        if (!this._isLoadOver || null == this._unlockTime || this._isUnlock) return;
        this.refreshTimeEx();
    }
    public refreshTimeEx() {
        let leftTime = this._unlockTime - ToolUtil.now();
        if (leftTime > 0) {
            this.label.string = ToolUtil.getSecFormatStr(leftTime);
        } else {
            this.label.string = "已解锁";
            this._isUnlock = true;
        }
    }
    //显示图片
    public showImg(callBack?: Function) {
        LoadManager.loadSprite(MapConfig.cloud[this._showID], this.img).then(() => {
            this._isLoadOver = true;
            this.refreshTime();
            if (callBack) callBack();
        });
    }
    /**显示与否 */
    public show(isShow: boolean, callBack?: Function) {
        this.node.active = isShow;
        if (isShow && !this._isLoad) {
            this._isLoad = true;
            this.showImg(callBack);
        } else {
            if (callBack) callBack();
        }
    }
    /**获取显示范围 */
    public getRect() {
        return this.node.getComponent(UITransform).getBoundingBox();
    }
    /**点击乌云 */
    onCloudClick() {
        if (this._isUnlock) {
            ServiceMgr.buildingService.reqCloudUnlockGet([ToolUtil.replace(TextConfig.Land_Key, this._x, this._y)]);
            return;
        }
        if (null == this._unlockTime) {
            ViewsMgr.showConfirm(TextConfig.Cloud_Unlock_Tip, () => {
                ServiceMgr.buildingService.reqCloudUnlock([ToolUtil.replace(TextConfig.Land_Key, this._x, this._y)]);
            });
        }
    }
    /**乌云散开 */
    showCloudDispose(callBack?: Function) {
        this.clearGrids();
        if (callBack) callBack(this);
        this.node.destroy();
    }
}


