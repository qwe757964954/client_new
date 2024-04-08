import { Vec3 } from "cc";
import { BuildingModel } from "./BuildingModel";
import { LandModel } from "./LandModel";
//格子模型
export class GridModel {
    // y从上往下，x从右往左
    private _x:number;//x格子坐标
    private _y:number;//y格子坐标
    private _pos:Vec3;//位置
    private _width:number;//宽
    private _height:number;//高
    private _building:BuildingModel = null;//建筑
    private _land:LandModel = null;//地块

    constructor(x:number, y:number, pos:Vec3, width:number, height:number) {
        this._x = x;
        this._y = y;
        this._pos = pos;
        this._width = width;
        this._height = height;
    }

    get pos():Readonly<Vec3> {
        return this._pos;
    }
    get x():number {
        return this._x;
    }
    get y():number {
        return this._y;
    }
    get width():number {
        return this._width;
    }
    get height():number {
        return this._height;
    }
    get building():BuildingModel {
        return this._building;
    }
    set building(model:BuildingModel) {
        this._building = model;
    }
    get land():LandModel {
        return this._land;
    }
    set land(model:LandModel) {
        this._land = model;
    }
}