import { _decorator, Asset, Component, Label, Sprite, SpriteFrame, Vec3 } from "cc";
import { GridModel } from "./GridModel";
import { LoadManager } from "../manager/LoadManager";
const { ccclass, property } = _decorator;

export class LandInfo {
    public id:number;
    public path:string;
}

//地块模型
@ccclass('LandModel')
export class LandModel  extends Component {
    // y从上往下，x从右往左
    private _x:number;//x格子坐标
    private _y:number;//y格子坐标
    private _width:number;//宽
    private _grids:GridModel[];//格子

    // private _landID:number;//地块id
    private _landInfo:LandInfo;//地块信息
    private _loadAssetAry:Asset[] = [];//加载资源数组

    private _dataLandInfo:LandInfo;//数据地块信息

    // 销毁
    protected onDestroy(): void {
        this.releaseAsset();
    }
    // 释放资源
    public releaseAsset() {
        LoadManager.releaseAssets(this._loadAssetAry);
        this._loadAssetAry = [];
    }
    get width():number {
        return this._width;
    }

    // 初始化数据
    public initData(x:number, y:number, width:number, landInfo:LandInfo) {
        this._x = x;
        this._y = y;
        this._width = width;
        // this._landID = landID;
        this._landInfo = landInfo;
        this._dataLandInfo = landInfo;

        // this.getComponentInChildren(Label).string = x.toString() + "," + y.toString();
        this.getComponentInChildren(Label).node.active = false;
    }

    public set grids(grids:GridModel[]) {
        if(this._grids) return;
        if(grids.length != this._width*this._width){
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
        let pos = new Vec3(gridPos.x, gridPos.y - 0.5*this._width*gridInfo.height, 0);
        this.node.position = pos;
    }
    //显示地块
    public showLand() {
        this.releaseAsset();
        LoadManager.load(this._landInfo.path, SpriteFrame).then((spriteFrame:SpriteFrame) => {
            this.getComponent(Sprite).spriteFrame = spriteFrame;
            this._loadAssetAry.push(spriteFrame);
        });
    }
    // 设置地块
    public set landInfo(landInfo:LandInfo) {
        if(landInfo.id == this._landInfo.id){
            return;
        }
        this._landInfo = landInfo;
        this.showLand();
    }
    // 批量刷地块
    public refreshLand(landInfo:LandInfo) {
        if(!landInfo) return;
        this.landInfo = landInfo;
    }
    // 单个刷地块
    public refreshOneLand(landInfo:LandInfo) {
        if(!landInfo) return;
        if(landInfo.id == this._landInfo.id){
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
}