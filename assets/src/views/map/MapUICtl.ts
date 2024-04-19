import { Color, Graphics, Rect, Sprite, SpriteFrame, UITransform, Vec3, instantiate, math, screen, sys } from "cc";
import { MainBaseCtl } from "../main/MainBaseCtl";
import { GridModel } from "../../models/GridModel";
import { EditInfo, MapConfig } from "../../config/MapConfig";
import { ToolUtil } from "../../util/ToolUtil";
import { LoadManager } from "../../manager/LoadManager";
import { LandModel } from "../../models/LandModel";
import { BuildingModel } from "../../models/BuildingModel";
import EventManager from "../../util/EventManager";
import { EventType } from "../../config/EventType";
import GlobalConfig from "../../GlobalConfig";
import { MainScene } from "../main/MainScene";
import { BgModel } from "../../models/BgModel";
import { RoleModel } from "../../models/RoleModel";
import { BaseComponent } from "../../script/BaseComponent";

// 地图UI控制器
export class MapUICtl extends MainBaseCtl {

    private _uiCameraHeight: number;//ui摄像机高度
    private _cameraRate: number;//地图摄像机与UI的比例
    private _cameraHeight: number;//地图摄像机高度
    private _cameraPos: Vec3;//地图摄像机位置
    private _cameraZoomVal: number = 50;//地图摄像机缩放值
    private _cameraMinHeight: number = 200;//地图摄像机最小高度
    private _cameraMaxHeight: number = 1300;//地图摄像机最大高度
    private _mapMaxHeight: number = screen.windowSize.height;//地图最大高度
    private _mapMaxWidth: number = screen.windowSize.width;//地图最大宽度

    private _gridAry: GridModel[][] = [];//格子数组(y从上往下，x从右往左)
    private _bgModelAry: BgModel[] = [];//背景模型数组
    private _roleModelAry: RoleModel[] = [];//角色模型数组
    private _buidingSortHandler: string;//建筑需要重新排序handle
    private _roleMoveHandler: string;//角色需要移动handle
    private _roleSortHandler: string;//角色需要重新排序handle
    private _roleIsShow: boolean = true;//角色是否显示

    constructor(mainScene: MainScene) {
        super(mainScene);
        this.init();
    }
    // 销毁
    public dispose(): void {
        // this._gridAry.forEach(element => {
        //     element.dispose();
        // });
        this._bgModelAry.forEach(element => {
            element.dispose();
        });
        this._roleModelAry.forEach(element => {
            element.dispose();
        });
        this._gridAry = [];
        this._bgModelAry = [];
        this._roleModelAry = [];
        this.removeEvent();
    }

    // 初始化
    public init(): void {
        this.initData();
        this.initEvent();
        this.initGrid();
        this.initMap();
        this.initLand();
        // this.initBuilding();
        this.initRole();

        this.buildingSort();
        this.updateCameraVisible();
    }
    // 初始化数据
    initData(): void {
        this._cameraHeight = this._mainScene.mapCamera.orthoHeight;
        this._cameraPos = this._mainScene.mapCamera.node.position;
        this._uiCameraHeight = this._mainScene.uiCamera.orthoHeight;
        this._cameraRate = this._cameraHeight / this._uiCameraHeight;
        this._gridAry = [];
        console.log("MapUICtl initData", this._cameraHeight);
    }
    // 初始化事件
    initEvent() {
        this._buidingSortHandler = EventManager.on(EventType.Building_Need_Sort, this.buildingSort.bind(this));
        this._roleMoveHandler = EventManager.on(EventType.Role_Need_Move, this.roleMove.bind(this));
        this._roleSortHandler = EventManager.on(EventType.Role_Need_Sort, this.roleSort.bind(this));
    }
    // 移除事件
    removeEvent() {
        EventManager.off(EventType.Building_Need_Sort, this._buidingSortHandler);
        EventManager.off(EventType.Role_Need_Move, this._roleMoveHandler);
        EventManager.off(EventType.Role_Need_Sort, this._roleSortHandler);
    }
    // 获取格子信息
    getGridInfo(i: number, j: number) {
        if (this._gridAry && this._gridAry[i] && this._gridAry[i][j]) {
            return this._gridAry[i][j];
        }
        return null;
    }
    //是否是可编辑的格子
    gridIsCanEdit(i: number, j: number) {
        let landInfo = MapConfig.gridInfo;
        let range = landInfo.range;
        for (let k = 0; k < range.length; k++) {
            let item = range[k];
            if (i < landInfo.col && j < landInfo.row && item.is <= i && i < item.ie && item.js <= j && j < item.je) {
                return true;
            }
        }
        return false;
    }
    // 初始化格子
    initGrid() {
        let landInfo = MapConfig.gridInfo;
        let width = landInfo.width;
        let height = landInfo.height;
        let col = landInfo.col;
        let row = landInfo.row;
        let dtX = landInfo.dtX;
        let dtY = landInfo.dtY;
        for (let i = 0; i < col; i++) {
            let ary: GridModel[] = [];
            this._gridAry[i] = ary;
            for (let j = 0; j < row; j++) {
                if (!this.gridIsCanEdit(i, j)) continue;
                let pos = new Vec3((j - i) * 0.5 * width + dtX * width, (-i - j) * 0.5 * height + dtY * height, 0);
                ary[j] = new GridModel(i, j, pos, width, height);
            }
        }
    }
    //初始化地图
    initMap() {
        let bgInfo = MapConfig.bgInfo;
        let width = bgInfo.width;
        let height = bgInfo.height;
        let col = bgInfo.col;
        let row = bgInfo.row;
        for (let i = 0; i < col; i++) {
            for (let j = 0; j < row; j++) {
                let bg = instantiate(this._mainScene.bgModel);
                this._mainScene.bgLayer.addChild(bg);
                let id = j * col + i + 1;
                let bgModel = bg.getComponent(BgModel);
                bgModel.init(id, i, j);
                this._bgModelAry.push(bgModel);
            }
        }
        this._mapMaxWidth = width * col;
        this._mapMaxHeight = height * row;
    }
    //是否是可编辑的地块
    // private landIsCanEdit(i:number, j:number){
    //     let landInfo = MapConfig.landBaseInfo;
    //     let range = landInfo.range;
    //     for(let k=0;k<range.length;k++) {
    //         let item = range[k];
    //         if(i < landInfo.col && j < landInfo.row && item.is <= i && i < item.ie && item.js <= j && j < item.je){
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    //初始化地块层
    initLand() {
        let gridInfo = MapConfig.gridInfo;
        let width = gridInfo.width;
        let height = gridInfo.height;
        let col = gridInfo.col;
        let row = gridInfo.row;
        let landInfo = MapConfig.editInfo[3];
        let landWidth = landInfo.width;
        let g = this._mainScene.lineLayer.getComponent(Graphics);
        this._mainScene.lineLayer.active = false;
        for (let i = 0; i < col; i++) {
            for (let j = 0; j < row; j++) {
                let gridInfo = this.getGridInfo(i, j);
                if (!gridInfo || gridInfo.land) continue;
                let land = instantiate(this._mainScene.landModel);
                this._mainScene.landLayer.addChild(land);
                let laneModel = land.getComponent(LandModel);
                laneModel.initData(i, j, landWidth, landInfo);
                this.setLandGrid(laneModel, i, j);
                laneModel.showLand();

                let pos = gridInfo.pos;
                g.lineWidth = 4;
                g.strokeColor = Color.BLACK;
                g.moveTo(pos.x - 0.5 * width * landWidth, pos.y - 0.5 * height * landWidth);
                g.lineTo(pos.x, pos.y);
                g.lineTo(pos.x + 0.5 * width * landWidth, pos.y - 0.5 * height * landWidth);
                if (!this.getGridInfo(i, j + 2)) {
                    g.lineTo(pos.x, pos.y - height * landWidth);
                    if (!this.getGridInfo(i + 2, j)) {
                        g.lineTo(pos.x - 0.5 * width * landWidth, pos.y - 0.5 * height * landWidth);
                    }
                }
                else if (!this.getGridInfo(i + 2, j)) {
                    g.moveTo(pos.x, pos.y - height * landWidth);
                    g.lineTo(pos.x - 0.5 * width * landWidth, pos.y - 0.5 * height * landWidth);
                }
                g.stroke();
                g.lineWidth = 2;
                g.moveTo(pos.x + 0.5 * width, pos.y - 0.5 * height);
                g.lineTo(pos.x - 0.5 * width, pos.y - 1.5 * height);
                g.moveTo(pos.x - 0.5 * width, pos.y - 0.5 * height);
                g.lineTo(pos.x + 0.5 * width, pos.y - 1.5 * height);
                g.stroke();
            }
        }
    }
    // 初始化建筑
    initBuilding() {
        // for test
        this.newBuilding(MapConfig.editInfo[1], 30, 30, false, false);//TEST 测试数据
    }
    /** 初始化角色 */
    public async initRole() {
        // for test
        let role = instantiate(this._mainScene.roleModel);
        this._mainScene.buildingLayer.addChild(role);
        let roleModel = role.getComponent(RoleModel);
        await roleModel.init(101, [9500, 9700, 9701, 9702, 9703]);
        let grid = this.getGridInfo(20, 20);
        roleModel.grid = grid;
        this.roleMove(roleModel);
        this._roleModelAry.push(roleModel);
    }
    // 摄像头缩放大小
    get cameraRate(): number {
        return this._cameraRate;
    }
    // 缩放地图
    mapZoom(scale: number) {//变化缩放
        this.mapZoomTo(Math.floor(this._cameraHeight * scale));
    }
    mapZoomTo(value: number) {//缩放到
        this._cameraHeight = value;
        if (this._cameraHeight > this._cameraMaxHeight) {
            this._cameraHeight = this._cameraMaxHeight;
            return;
        }
        if (this._cameraHeight < this._cameraMinHeight) {
            this._cameraHeight = this._cameraMinHeight;
            return;
        }
        this._mainScene.mapCamera.orthoHeight = this._cameraHeight;
        this._cameraRate = this._cameraHeight / this._uiCameraHeight;
        this.mapMove(0, 0);//限制map位置
        // 摄像头缩放事件通知
        this._mainScene.getMapCtl().onCameraScale(this._cameraRate);
        EventManager.emit(EventType.Map_Scale, this._cameraRate);
    }
    // 缩小地图
    mapZoomOut() {
        this.mapZoomTo(this._cameraHeight + this._cameraZoomVal);
    }
    // 放大地图
    mapZoomIn() {
        this.mapZoomTo(this._cameraHeight - this._cameraZoomVal);
    }
    // 移动地图
    mapMove(dtX: number, dtY: number) {
        // console.log("mapMove",dtX, dtY);
        this.mapMoveTo(this._cameraPos.x + dtX * this._cameraRate, this._cameraPos.y + dtY * this._cameraRate);
    }
    mapMoveTo(x: number, y: number) {
        this._cameraPos.x = x;
        this._cameraPos.y = y;

        let winSize = GlobalConfig.WIN_SIZE;
        let maxX = (this._mapMaxWidth - winSize.width * this._cameraRate) / 2;
        let maxY = (this._mapMaxHeight - winSize.height * this._cameraRate) / 2;

        if (this._cameraPos.x > maxX) {
            this._cameraPos.x = maxX;
        } else if (this._cameraPos.x < -maxX) {
            this._cameraPos.x = -maxX;
        }
        if (this._cameraPos.y > maxY) {
            this._cameraPos.y = maxY;
        } else if (this._cameraPos.y < -maxY) {
            this._cameraPos.y = -maxY;
        }
        this._mainScene.mapCamera.node.position = this._cameraPos;

        this.updateCameraVisible();
    }
    // 点击到格子
    getTouchGrid(x: number, y: number) {
        let landInfo = MapConfig.gridInfo;
        let width = landInfo.width;
        let height = landInfo.height;
        let dtX = landInfo.dtX;
        let dtY = landInfo.dtY;
        let pos = this._mainScene.screenPosToMapPos(x, y);
        let i = Math.floor(dtX + dtY - pos.x / width - pos.y / height);
        let j = Math.floor(dtY - dtX + pos.x / width - pos.y / height);
        // console.log("getTouchGrid",i,j);
        return this.getGridInfo(i, j);
    }
    /** 点击到角色 */
    getTouchRole(x: number, y: number) {
        let pos = this._mainScene.screenPosToMapPos(x, y);
        console.log("getTouchRole", pos);
        this._roleModelAry.forEach(element => {
            if (element.isTouchSelf(pos.x, pos.y)) {
                return element;
            }
        });
        return null;
    }
    /**
     * 根据坐标获取格子
     */
    getGridByPos(x: number, y: number) {
        let landInfo = MapConfig.gridInfo;
        let width = landInfo.width;
        let height = landInfo.height;
        let dtX = landInfo.dtX;
        let dtY = landInfo.dtY;
        let i = Math.floor(dtX + dtY - x / width - y / height);
        let j = Math.floor(dtY - dtX + x / width - y / height);
        // console.log("getGridByPos",i,j);
        return this.getGridInfo(i, j);
    }
    /**
     * 根据坐标获取最近格子
     */
    getGridByPosEx(x: number, y: number) {
        let landInfo = MapConfig.gridInfo;
        let width = landInfo.width;
        let height = landInfo.height;
        let dtX = landInfo.dtX;
        let dtY = landInfo.dtY;
        let i = Math.floor(dtX + dtY - x / width - y / height);
        let j = Math.floor(dtY - dtX + x / width - y / height);
        let grid = this.getGridInfo(i, j);
        if (grid) return grid;
        let col = landInfo.col;
        let row = landInfo.row;
        if (i >= col) i = col - 1;
        if (j >= row) j = row - 1;
        for (let index = 0; index < col; index++) {
            let grid = this.getGridInfo(i - index, j);
            if (grid) return grid;
        }
        for (let index = 0; index < row; index++) {
            let grid = this.getGridInfo(i, j - index);
            if (grid) return grid;
        }
        return null;
    }
    // getTouchGridEx(x:number, y:number){
    //     let landInfo = MapConfig.gridInfo;
    //     let width = landInfo.width;
    //     let height = landInfo.height;
    //     let dtX = landInfo.dtX;
    //     let dtY = landInfo.dtY;
    //     let pos = this._mainScene.mapCamera.convertToUINode(Vec3.ZERO, this._mainScene.landLayer);
    //     // console.log("getTouchGrid",worldPos,pos);
    //     let i = Math.floor(dtX + dtY - pos.x/width - pos.y/height);
    //     let j = Math.floor(dtY - dtX + pos.x/width - pos.y/height);
    //     // console.log("getTouchGrid",i,j);
    //     return this.getGridInfo(i,j);
    // }
    // 建筑物层级排序
    buildingSort() {
        this.buildingRoleSort();
    }
    // 设置建筑物格子
    setBuildingGrid(building: BuildingModel, gridX: number, gridY: number) {
        let grids: GridModel[] = [];
        for (let i = 0; i < building.width; i++) {
            for (let j = 0; j < building.width; j++) {
                let grid = this.getGridInfo(gridX + i, gridY + j);
                if (!grid) {
                    // console.log("setBuildingGrid error",gridX,gridY);
                    return;
                }
                grids.push(grid);
            }
        }
        building.grids = grids;
    }
    // 设置地块格子
    setLandGrid(land: LandModel, gridX: number, gridY: number) {
        let grids: GridModel[] = [];
        for (let i = 0; i < land.width; i++) {
            for (let j = 0; j < land.width; j++) {
                let grid = this.getGridInfo(gridX + i, gridY + j);
                if (!grid) {
                    // console.log("setLandGrid error",gridX,gridY);
                    return;
                }
                grids.push(grid);
            }
        }
        land.grids = grids;
    }
    // 新建建筑物
    newBuilding(data: EditInfo, gridX: number, gridY: number, isFlip: boolean = false, isNew: boolean = true) {
        let building = instantiate(this._mainScene.buildingModel);
        let buildingModel = building.getComponent(BuildingModel);
        buildingModel.addToParent(this._mainScene.buildingLayer);
        buildingModel.initData(gridX, gridY, data.width, data.path, isFlip, isNew);
        this.setBuildingGrid(buildingModel, gridX, gridY);
        return buildingModel;
    }
    newBuildingInCamera(data: EditInfo) {
        let winSize = GlobalConfig.SCREEN_SIZE;
        let grid = this.getTouchGrid(winSize.width * 0.5, winSize.height * 0.5);
        if (grid) {
            return this.newBuilding(data, grid.x, grid.y);
        }
        return this.newBuilding(data, 20, 20);
    }
    // 摄像头移动到指定建筑
    moveCameraToBuilding(building: BuildingModel, plPos: Vec3) {
        let pos = building.node.position;
        let winSize = GlobalConfig.WIN_SIZE;
        // console.log("moveCameraToBuilding",pos.x, pos.y, plPos.x, plPos.y);
        this.mapMoveTo(pos.x - plPos.x, pos.y - plPos.y);
        this.mapZoomTo(this._uiCameraHeight);
    }
    // 更新摄像头可见范围内元素
    updateCameraVisible() {
        let visibleRect = new Rect();
        let pos = this._cameraPos;
        let winSize = GlobalConfig.WIN_SIZE;
        visibleRect.x = pos.x - winSize.width * 0.5 * this._cameraRate;
        visibleRect.y = pos.y - winSize.height * 0.5 * this._cameraRate;
        visibleRect.width = winSize.width * this._cameraRate;
        visibleRect.height = winSize.height * this._cameraRate;
        // console.log("updateCameraVisible", visibleRect);
        this._bgModelAry.forEach(element => {
            if (!element.isLoad && visibleRect.intersects(element.getRect())) {
                element.show();
            }
        });
        // TODO 地块动态加载
        // TODO 建筑动态加载
    }
    // 角色移动
    roleMove(roleModel: RoleModel) {
        let pos = roleModel.pos;
        let grid = this.getGridByPosEx(pos.x, pos.y);
        if (!grid) {
            console.log("roleMove error", pos);
            return;
        }
        let grids: GridModel[] = [];
        let start = 2;
        let end = 5;
        for (let i = start; i < end; i++) {
            // for (let j = start; j < end; j++) {
            //     let grid1 = this.getGridInfo(grid.x + i, grid.y + j);
            //     let grid2 = this.getGridInfo(grid.x - i, grid.y - j);
            //     let grid3 = this.getGridInfo(grid.x - i, grid.y + j);
            //     let grid4 = this.getGridInfo(grid.x + i, grid.y - j);
            //     if(grid1 && !grid1.building) grids.push(grid1);
            //     if(grid2 && !grid2.building) grids.push(grid2);
            //     if(grid3 && !grid3.building) grids.push(grid3);
            //     if(grid4 && !grid4.building) grids.push(grid4);
            // }
            let grid1 = this.getGridInfo(grid.x + i, grid.y);
            let grid2 = this.getGridInfo(grid.x - i, grid.y);
            let grid3 = this.getGridInfo(grid.x, grid.y + i);
            let grid4 = this.getGridInfo(grid.x, grid.y - i);
            if (grid1 && !grid1.building) grids.push(grid1);
            if (grid2 && !grid2.building) grids.push(grid2);
            if (grid3 && !grid3.building) grids.push(grid3);
            if (grid4 && !grid4.building) grids.push(grid4);
        }
        if (0 == grids.length) {
            roleModel.standby();
            return;
        }
        grids.sort(() => { return Math.random() - 0.5; }); // 随机打乱
        roleModel.moveToGrid(grids[0]);
        // roleModel.moveTo(grids[0].pos);
    }
    // 角色排序
    roleSort(roleModel: RoleModel) {
        let pos = roleModel.pos;
        let grid = this.getGridByPos(pos.x, pos.y);
        roleModel.grid = grid;

        this.buildingRoleSort();
    }
    // 建筑与角色排序
    buildingRoleSort() {
        let children = this._mainScene.buildingLayer.children.concat();
        children.sort((a, b) => {
            let aModel = a.getComponent(BaseComponent);
            let bModel = b.getComponent(BaseComponent);
            return aModel.ZIndex - bModel.ZIndex;
        });
        let maxLen = children.length;
        for (const node of children) {
            node.setSiblingIndex(maxLen);
        }
    }
    /** 是否显示所有角色 */
    public set roleIsShow(isShow: boolean) {
        if (this._roleIsShow == isShow) return;
        this._roleIsShow = isShow;
        this._roleModelAry.forEach(element => {
            element.isActive = isShow;
        });
    }
}