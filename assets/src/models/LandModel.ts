import { _decorator, Asset, Component, Sprite, SpriteFrame, Vec3 } from "cc";
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

    // 销毁
    protected onDestroy(): void {
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
    }

    public set grids(grids:GridModel[]) {
        if(this._grids) return;
        if(grids.length != this._width*this._width){
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
        let pos = new Vec3(gridPos.x, gridPos.y - (this._width - 1)*0.5*gridInfo.height, 0);
        this.node.position = pos;
    }
    //显示地块
    public showLand() {
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
}