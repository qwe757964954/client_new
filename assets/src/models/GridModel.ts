import { Vec3 } from "cc";
import { BuildingModel } from "./BuildingModel";
import { CloudModel } from "./CloudModel";
import { LandModel } from "./LandModel";
//格子模型
export class GridModel {
    // y从上往下，x从右往左
    private _x: number;//x格子坐标(上面尖角x)
    private _y: number;//y格子坐标(上面尖角y)
    private _pos: Vec3;//位置(顶点)
    private _width: number;//宽
    private _height: number;//高
    private _building: BuildingModel = null;//建筑（可能是临时的）
    private _land: LandModel = null;//地块
    private _cloud: CloudModel = null;//乌云

    // private _dataBuilding: BuildingModel = null;//数据建筑

    constructor(x: number, y: number, pos: Vec3, width: number, height: number) {
        this._x = x;
        this._y = y;
        this._pos = pos;
        this._width = width;
        this._height = height;
    }

    get pos(): Readonly<Vec3> {
        return this._pos;
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
    get height(): number {
        return this._height;
    }
    get building(): BuildingModel {
        return this._building;
    }
    // set building(model: BuildingModel) {
    //     this._building = model;
    // }
    get land(): LandModel {
        return this._land;
    }
    set land(model: LandModel) {
        this._land = model;
    }
    get cloud(): CloudModel {
        return this._cloud;
    }
    set cloud(model: CloudModel) {
        this._cloud = model;
    }
    //保存数据
    saveData(building: BuildingModel) {
        this._building = building;
        // this._dataBuilding = this._building;
    }
    //恢复数据
    // recoverData() {
    //     this._building = this._dataBuilding;
    // }
    // 置空数据
    resetData() {
        this._building = null;
        // this._dataBuilding = null;
    }
    //是否建筑可以摆放
    isCanBuilding(building: BuildingModel) {
        // console.log("isSameBuilding", this._building, this._dataBuilding);
        // if (this._cloud) return false;
        // if (!this._dataBuilding) return true;
        // return this._building === this._dataBuilding;
        return (null == this._cloud) && ((null == this._building) || (building == this._building));
    }
    /**是否可以摆放新建筑 */
    isCanBuildingNew() {
        // if (!this._dataBuilding) return true;
        return (null == this._cloud) && (null == this._building);
    }
    /**是否是编辑区域 */
    isEditArea() {
        return true;
    }
}