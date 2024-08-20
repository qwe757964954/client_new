import { _decorator, Node, Rect, Sprite, Vec3 } from "cc";
import { MapConfig } from "../config/MapConfig";
import { PrefabType } from "../config/PrefabType";
import { DataMgr, EditInfo, LandExtraInfo, LandExtraType } from "../manager/DataMgr";
import { LoadManager } from "../manager/LoadManager";
import { ToolUtil } from "../util/ToolUtil";
import { BaseModel } from "./BaseModel";
import { GridModel } from "./GridModel";
const { ccclass, property } = _decorator;

//地块模型 sprite大小必须设置为2*2的格子大小
export class LandModel extends BaseModel {
    // y从上往下，x从右往左
    private _x: number;//x格子坐标
    private _y: number;//y格子坐标
    private _width: number;//宽
    private _grids: GridModel[];//格子

    private _landInfo: EditInfo;//地块信息
    private _extraInfo: LandExtraInfo;//额外信息

    private _dataLandInfo: EditInfo;//数据地块信息
    private _sprite: Sprite = null;//图片
    private _flowerSprite: Sprite = null;//花朵

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
    public initData(x: number, y: number, width: number, landInfo: EditInfo, parent: Node) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._landInfo = landInfo;
        this._extraInfo = DataMgr.getLandExtraInfo(landInfo.id);
        this._dataLandInfo = landInfo;
        this._parent = parent;
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
        this._pos = pos;
        if (this._node)
            this._node.position = pos;
    }
    public get grids(): GridModel[] {
        return this._grids;
    }
    //显示地块
    public showLand(callBack?: Function) {
        let path;
        // console.log("showLand", this._x, this._y, this._extraInfo);
        if (this._extraInfo && LandExtraType.interval == this._extraInfo.type) {
            path = this._extraInfo.pngs[(this._x + this._y) / 2 % 2];
        } else {
            path = DataMgr.getEditPng(this._landInfo);
        }
        LoadManager.loadSprite(path, this._sprite, true).then(() => {
            if (callBack) callBack();
        });
        if (this.isDefault()) {
            if (this._flowerSprite) {
                this._flowerSprite.node.active = true;
            } else if (ToolUtil.getRandomInt(0, 19) < 1) {
                let flowers = MapConfig.landFlowers;
                let path = flowers[ToolUtil.getRandomInt(0, flowers.length - 1)];
                this._flowerSprite = this._node.getComponentInChildren(Sprite);
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
        this._extraInfo = DataMgr.getLandExtraInfo(landInfo.id);
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
        if (this._node) {
            this._node.active = isShow;
        }
        this._isShow = isShow;
        if (isShow && !this._isLoad) {
            this._isLoad = true;
            if (this._node) {
                this.showLand(callBack);
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
            LoadManager.loadPrefab(PrefabType.LandModel.path, this._parent, true).then((node: Node) => {
                this._node = node;
                this._node.active = this._isShow;
                this._node.position = this._pos;
                this._sprite = this._node.getComponent(Sprite);

                if (this._isLoad) {
                    this.showLand(callBack);
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
        let rect = new Rect(-72, 0, 144, 72);
        // return this._node.getComponent(UITransform).getBoundingBox();
        rect.x += this._pos.x;
        rect.y += this._pos.y;
        return rect;
    }
    /**是否是默认地块 */
    public isDefault() {
        return this._landInfo.id == DataMgr.instance.defaultLand.id;
    }
}