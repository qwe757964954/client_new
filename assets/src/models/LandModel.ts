import { _decorator, Component, Label, Sprite, UITransform, Vec3 } from "cc";
import { MapConfig } from "../config/MapConfig";
import { DataMgr, EditInfo } from "../manager/DataMgr";
import { LoadManager } from "../manager/LoadManager";
import { ToolUtil } from "../util/ToolUtil";
import { GridModel } from "./GridModel";
const { ccclass, property } = _decorator;

//地块模型 sprite大小必须设置为2*2的格子大小
@ccclass('LandModel')
export class LandModel extends Component {
    // y从上往下，x从右往左
    private _x: number;//x格子坐标
    private _y: number;//y格子坐标
    private _width: number;//宽
    private _grids: GridModel[];//格子

    // private _landID:number;//地块id
    private _landInfo: EditInfo;//地块信息

    private _dataLandInfo: EditInfo;//数据地块信息
    private _isLoad: boolean = false;//是否加载图片
    private _flowerSprite: Sprite = null;//花朵

    // 销毁
    protected onDestroy(): void {
        this.releaseAsset();
    }
    // 释放资源
    public releaseAsset() {
    }
    get x(): number {
        return this._x;
    }
    get y(): number {
        return this._y;
    }
    get width(): number {
        return this._width;
    }
    get bid() {
        return this._landInfo.id;
    }

    // 初始化数据
    public initData(x: number, y: number, width: number, landInfo: EditInfo) {
        this._x = x;
        this._y = y;
        this._width = width;
        // this._landID = landID;
        this._landInfo = landInfo;
        this._dataLandInfo = landInfo;

        // this.getComponentInChildren(Label).string = x.toString() + "," + y.toString();
        this.getComponentInChildren(Label).node.active = false;
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
            this._grids[i].land = this;
        }
        let gridInfo = this._grids[0];
        this._x = gridInfo.x;
        this._y = gridInfo.y;
        let gridPos = gridInfo.pos;
        let pos = new Vec3(gridPos.x, gridPos.y - this._width * gridInfo.height, 0);
        this.node.position = pos;
    }
    //显示地块
    public showLand(callBack?: Function) {
        this.releaseAsset();
        LoadManager.loadSprite(DataMgr.getEditPng(this._landInfo), this.getComponent(Sprite)).then(() => {
            if (callBack) callBack();
        });
        if (this.isDefault()) {
            if (this._flowerSprite) {
                this._flowerSprite.node.active = true;
            } else if (ToolUtil.getRandomInt(0, 19) < 1) {
                let flowers = MapConfig.landFlowers;
                let path = flowers[ToolUtil.getRandomInt(0, flowers.length - 1)];
                this._flowerSprite = this.getComponentInChildren(Sprite);
                this._flowerSprite.node.active = true;
                this._flowerSprite.node.scale = new Vec3(0.5, 0.5, 1);
                LoadManager.loadSprite(path, this._flowerSprite);
            }
        } else {
            if (this._flowerSprite) this._flowerSprite.node.active = false;
        }
    }
    // 设置地块
    public set landInfo(landInfo: EditInfo) {
        if (landInfo.id == this._landInfo.id) {
            return;
        }
        this._landInfo = landInfo;
        this.showLand();
    }
    // 批量刷地块
    public refreshLand(landInfo: EditInfo) {
        if (!landInfo) return;
        this.landInfo = landInfo;
    }
    // 单个刷地块
    public refreshOneLand(landInfo: EditInfo) {
        if (!landInfo) return;
        if (landInfo.id == this._landInfo.id) {
            this.recover();
            return;
        }
        this.landInfo = landInfo;
    }
    // 保存信息
    public saveData() {
        this._dataLandInfo = this._landInfo;
    }
    // 还原
    public recover() {
        this.landInfo = this._dataLandInfo;
    }
    /**显示与否 */
    public show(isShow: boolean, callBack?: Function) {
        this.node.active = isShow;
        if (isShow && !this._isLoad) {
            this._isLoad = true;
            this.showLand(callBack);
        } else {
            if (callBack) callBack();
        }
    }
    /**获取显示范围 */
    public getRect() {
        return this.node.getComponent(UITransform).getBoundingBox();
    }
    /**是否是默认地块 */
    public isDefault() {
        return this._landInfo.id == DataMgr.instance.defaultLand.id;
    }
}