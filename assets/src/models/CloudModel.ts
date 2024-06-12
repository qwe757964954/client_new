import { _decorator, Label, Sprite, UITransform, Vec3 } from 'cc';
import { MapConfig } from '../config/MapConfig';
import { LoadManager } from '../manager/LoadManager';
import { BaseComponent } from '../script/BaseComponent';
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

    private _showID: number = 0;//显示id
    private _isLoad: boolean = false;//是否加载图片

    // 初始化数据
    public initData(x: number, y: number, width: number) {
        this._x = x;
        this._y = y;
        this._width = width;
        this.label.node.active = false;
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
    //显示图片
    public showImg(callBack?: Function) {
        LoadManager.loadSprite(MapConfig.cloud[this._showID], this.img).then(() => {
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
}


