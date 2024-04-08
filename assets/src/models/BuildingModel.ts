import { Asset, Node, Prefab, Vec3, instantiate } from "cc";
import { GridModel } from "./GridModel";
import { LoadManager } from "../manager/LoadManager";
import { PrefabType } from "../config/PrefabType";
import { BuildingBtnView } from "../views/main/BuildingBtnView";

class A {
    private _a:Node = null;
}
class B {
    private _c:Node = null;
}

//建筑模型
export class BuildingModel {
    // y从上往下，x从右往左
    private _x:number;//x格子坐标
    private _y:number;//y格子坐标
    private _width:number;//宽
    private _node:Node = null;//节点
    private _grids:GridModel[];//格子
    private _nodePos:Vec3;//节点位置
    private _isFlip:boolean = false;//是否翻转

    // private _dataX:number;//数据x
    // private _dataY:number;//数据y
    private _dataGrids:GridModel[];//数据格子
    private _dataIsFlip:boolean = false;//数据是否翻转
    private _loadAssetAry:Asset[] = [];//加载资源数组

    constructor(x:number, y:number, width:number, isFlip:boolean, node:Node) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._node = node;
        this.isFlip = isFlip;
        this._dataIsFlip = isFlip;
    }
    // 设置所占格子。清理以前老数据，设置新数据，更新节点位置
    public set grids(grids:GridModel[]) {
        if(grids.length != this._width*this._width){
            return;
        }
        if(this._grids){
            for (let i = 0; i < this._grids.length; i++) {
                this._grids[i].building = null;
            }
        }
        // console.log("set grids",grids);
        this._grids = grids;
        for (let i = 0; i < this._grids.length; i++) {
            this._grids[i].building = this;
        }
        let gridInfo = this._grids[0];
        this._x = gridInfo.x;
        this._y = gridInfo.y;
        let gridPos = gridInfo.pos;
        this._nodePos = new Vec3(gridPos.x, gridPos.y - (this._width - 1)*0.5*gridInfo.height, 0);
        this._node.position = this._nodePos;
        if(!this._dataGrids){
            this._dataGrids = this._grids;
        }
    }
    // public get grids():GridModel[] {
    //     return this._grids;
    // }
    get nodePos():Vec3 {
        return this._nodePos;
    }
    get width():number {
        return this._width;
    }
    set isFlip(isFlip:boolean) {
        this._isFlip = isFlip;
        this._node.scale = new Vec3(isFlip ? -1 : 1, 1, 1);
    }
    get isFlip():boolean {
        return this._isFlip;
    }

    // 显示按钮
    public showBtnView():void {
        LoadManager.loadPrefab(PrefabType.BuildingBtnView).then((prefab:Prefab) => {
            this._loadAssetAry.push(prefab);
            let node = instantiate(prefab);
            let buildingBtnView = node.getComponent(BuildingBtnView);
            let funcs = [//信息、保存、卖出、反转、回收、还原
                null,
                this.saveData.bind(this),
                null,
                this.flip.bind(this),
                null,
                this.resetData.bind(this),
            ];
            buildingBtnView.registerClickCallback(funcs);
            this._node.addChild(node);
        });
    }
    // 还原数据
    public resetData():void {
        this.grids = this._dataGrids;
    }
    // 保存数据
    public saveData():void {
        // this._dataX = this._x;
        // this._dataY = this._y;
        this._dataGrids = this._grids;
        this._dataIsFlip = this._isFlip;
    }
    // 翻转
    public flip():void {
        this.isFlip = !this.isFlip;
    }
}