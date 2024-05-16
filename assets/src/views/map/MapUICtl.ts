import { Color, Graphics, Rect, Vec3, instantiate, screen } from "cc";
import GlobalConfig from "../../GlobalConfig";
import { EventType } from "../../config/EventType";
import { MapConfig } from "../../config/MapConfig";
import { TextConfig } from "../../config/TextConfig";
import { DataMgr, EditInfo } from "../../manager/DataMgr";
import { BgModel } from "../../models/BgModel";
import { BuildingModel } from "../../models/BuildingModel";
import { GridModel } from "../../models/GridModel";
import { LandModel } from "../../models/LandModel";
import { s2cBuildingList, s2cBuildingListInfo } from "../../models/NetModel";
import { RoleBaseModel } from "../../models/RoleBaseModel";
import { RoleModel } from "../../models/RoleModel";
import { InterfacePath } from "../../net/InterfacePath";
import { ServiceMgr } from "../../net/ServiceManager";
import { BaseComponent } from "../../script/BaseComponent";
import EventManager, { EventMgr } from "../../util/EventManager";
import { TimerMgr } from "../../util/TimerMgr";
import { ToolUtil } from "../../util/ToolUtil";
import { MainBaseCtl } from "../main/MainBaseCtl";
import { MainScene } from "../main/MainScene";

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
    private _landModelAry: LandModel[] = [];//地块模型数组
    private _roleModelAry: RoleBaseModel[] = [];//角色模型数组
    private _isNeedSort: boolean = false;//是否需要重新排序
    private _buidingSortHandler: string;//建筑需要重新排序handle
    private _roleMoveHandler: string;//角色需要移动handle
    private _roleSortHandler: string;//角色需要重新排序handle
    private _buildingListHandle: string;//建筑列表handle
    private _roleIsShow: boolean = true;//角色是否显示

    private _callBack: Function = null;//加载完成回调
    private _loadCount: number = 0;//加载计数

    constructor(mainScene: MainScene, callBack?: Function) {
        super(mainScene);
        this._callBack = callBack;
        this.init();
    }
    // 销毁
    public dispose(): void {
        // this._gridAry.forEach(element => {
        //     element.dispose();
        // });
        // this._bgModelAry.forEach(element => {
        //     element.dispose();
        // });
        // this._roleModelAry.forEach(element => {
        //     element.dispose();
        // });
        this._gridAry = [];
        this._bgModelAry = [];
        this._landModelAry = [];
        this._roleModelAry = [];
        this.removeEvent();
    }

    // 初始化
    public async init() {
        this.initData();
        this.initEvent();
        this.initGrid();
        this.initMap();

        if (GlobalConfig.OLD_SERVER) {
            this.initLand({});
            // this.initBuilding();
            // this.initRole();
            this.updateCameraVisible();
            return;
        }
        ServiceMgr.buildingService.reqBuildingList();
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
        this._buidingSortHandler = EventMgr.on(EventType.Building_Need_Sort, this.buildingSort.bind(this));
        this._roleMoveHandler = EventMgr.on(EventType.Role_Need_Move, this.roleMove.bind(this));
        this._roleSortHandler = EventMgr.on(EventType.Role_Need_Sort, this.roleSort.bind(this));
        this._buildingListHandle = EventMgr.on(InterfacePath.c2sBuildingList, this.onBuildingList.bind(this));
    }
    // 移除事件
    removeEvent() {
        EventMgr.off(EventType.Building_Need_Sort, this._buidingSortHandler);
        EventMgr.off(EventType.Role_Need_Move, this._roleMoveHandler);
        EventMgr.off(EventType.Role_Need_Sort, this._roleSortHandler);
        EventMgr.off(InterfacePath.c2sBuildingList, this._buildingListHandle);
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
        this._mapMaxWidth = bgInfo.maxWidth;
        this._mapMaxHeight = bgInfo.maxHeight;
    }
    //初始化地块层
    initLand(map: { [key: string]: number }) {
        let gridInfo = MapConfig.gridInfo;
        let width = gridInfo.width;
        let height = gridInfo.height;
        let col = gridInfo.col;
        let row = gridInfo.row;
        let defaultInfo = DataMgr.instance.defaultLand;
        let landWidth = defaultInfo.width;
        let g = this._mainScene.lineLayer.getComponent(Graphics);
        this._mainScene.lineLayer.active = false;
        for (let i = 0; i < col; i++) {
            for (let j = 0; j < row; j++) {
                let gridInfo = this.getGridInfo(i, j);
                if (!gridInfo || gridInfo.land) continue;
                let land = instantiate(this._mainScene.landModel);
                this._mainScene.landLayer.addChild(land);
                let laneModel = land.getComponent(LandModel);
                let landInfo = defaultInfo;
                if (map) {
                    let key = ToolUtil.replace(TextConfig.Land_Key, i, j);
                    if (map.hasOwnProperty(key)) {
                        landInfo = DataMgr.instance.editInfo[map[key]];
                    }
                }
                laneModel.initData(i, j, landWidth, landInfo);
                this.setLandGrid(laneModel, i, j);
                this._landModelAry.push(laneModel);

                let pos = gridInfo.pos;
                g.lineWidth = 4;
                g.strokeColor = new Color(255, 255, 255, 200);
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
    initBuilding(list: s2cBuildingListInfo[]) {
        if (!list || list.length <= 0) return;
        list.push({ id: 1, bid: 3, x: 0, y: 0, direction: 0 });
        list.forEach(element => {
            let editInfo = DataMgr.instance.editInfo[element.bid];
            let building = this.newBuilding(editInfo, element.x, element.y, 1 == element.direction, false);
            building.buildingID = element.id;
        });
    }
    /** 初始化角色 */
    public async initRole() {
        // for test 人物角色
        {
            let role = instantiate(this._mainScene.roleModel);
            this._mainScene.buildingLayer.addChild(role);
            let roleModel = role.getComponent(RoleBaseModel);
            roleModel.init(101, 1, [9500, 9700, 9701, 9702, 9703]);
            let grid = this.getGridInfo(20, 20);
            roleModel.grid = grid;
            this.roleMove(roleModel);
            this._roleModelAry.push(roleModel);
            this.buildingRoleSort();
        }
        {
            let role = instantiate(this._mainScene.roleModel);
            this._mainScene.buildingLayer.addChild(role);
            let roleModel = role.getComponent(RoleBaseModel);
            roleModel.init(102, 1, [9550, 9800, 9801, 9802, 9803, 9805]);
            let grid = this.getGridInfo(35, 40);
            roleModel.grid = grid;
            this.roleMove(roleModel);
            this._roleModelAry.push(roleModel);
            this.buildingRoleSort();
        }
        {
            let role = instantiate(this._mainScene.roleModel);
            this._mainScene.buildingLayer.addChild(role);
            let roleModel = role.getComponent(RoleBaseModel);
            roleModel.init(103, 1, [9600, 9900, 9901, 9902, 9903]);
            let grid = this.getGridInfo(20, 40);
            roleModel.grid = grid;
            this.roleMove(roleModel);
            this._roleModelAry.push(roleModel);
            this.buildingRoleSort();
        }
        // for test 精灵
        {
            let role = instantiate(this._mainScene.petModel);
            this._mainScene.buildingLayer.addChild(role);
            let roleModel = role.getComponent(RoleBaseModel);
            roleModel.init(103, 1);
            let grid = this.getGridInfo(21, 21);
            roleModel.grid = grid;
            this.roleMove(roleModel);
            this._roleModelAry.push(roleModel);
            this.buildingRoleSort();
        }
        {
            let role = instantiate(this._mainScene.petModel);
            this._mainScene.buildingLayer.addChild(role);
            let roleModel = role.getComponent(RoleBaseModel);
            roleModel.init(103, 2);
            let grid = this.getGridInfo(35, 30);
            roleModel.grid = grid;
            this.roleMove(roleModel);
            this._roleModelAry.push(roleModel);
            this.buildingRoleSort();
        }
        {
            let role = instantiate(this._mainScene.petModel);
            this._mainScene.buildingLayer.addChild(role);
            let roleModel = role.getComponent(RoleBaseModel);
            roleModel.init(103, 3);
            let grid = this.getGridInfo(21, 41);
            roleModel.grid = grid;
            this.roleMove(roleModel);
            this._roleModelAry.push(roleModel);
            this.buildingRoleSort();
        }
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
    /**点击到建筑 */
    getTouchBuilding(x: number, y: number) {
        let worldPos = this._mainScene.mapCamera.screenToWorld(new Vec3(x, y, 0));
        let children = this._mainScene.buildingLayer.children;
        for (let i = children.length - 1; i >= 0; i--) {
            const element = children[i];
            let model = element.getComponent(BuildingModel);
            if (model) {
                if (model.isTouchSelf(worldPos)) {
                    return model;
                }
                // console.log("building worldPos", pos.x, pos.y);
            }
        }
        // console.log("getTouchBuilding", worldPos.x, worldPos.y, children.length);
        return null;
    }
    /** 点击到角色 */
    getTouchRole(x: number, y: number) {
        let pos = this._mainScene.screenPosToMapPos(x, y);
        for (const element of this._roleModelAry) {
            if (element.isTouchSelf(pos.x, pos.y)) {
                return element;
            }
        }
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
        buildingModel.initData(gridX, gridY, data, isFlip, isNew);
        this.setBuildingGrid(buildingModel, gridX, gridY);
        return buildingModel;
    }
    newBuildingInCamera(data: EditInfo) {
        let winSize = GlobalConfig.SCREEN_SIZE;
        let grid = this.getTouchGrid(winSize.width * 0.5, winSize.height * 0.5);
        if (grid) {
            for (let i = 0; i < data.width; i++) {
                for (let j = 0; j < data.width; j++) {
                    if (i == 0 && j == 0) continue;
                    let tmpGrid = this.getGridInfo(grid.x + i, grid.y + j);
                    if (!tmpGrid) {
                        return null;
                    }
                }
            }
            return this.newBuilding(data, grid.x, grid.y);
        }
        return null;
        // return this.newBuilding(data, 20, 20);
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
        let width = winSize.width * this._cameraRate + 200;//额外增加显示区域
        let height = winSize.height * this._cameraRate + 150;//额外增加显示区域
        visibleRect.x = pos.x - width * 0.5;
        visibleRect.y = pos.y - height * 0.5;
        visibleRect.width = width;
        visibleRect.height = height;
        // console.log("updateCameraVisible", visibleRect);
        //for test 显示区域
        // let g = this._mainScene.lineLayer.getComponent(Graphics);
        // g.clear();
        this._bgModelAry.forEach(element => {
            element.show(visibleRect.intersects(element.getRect()), this.getLoadOverCall());
        });
        //地块动态加载
        this._landModelAry.forEach(element => {
            element.show(visibleRect.intersects(element.getRect()), this.getLoadOverCall());
        });
        //建筑动态加载
        this._mainScene.buildingLayer.children.forEach(element => {
            let building = element.getComponent(BuildingModel);
            if (!building) {
                let role = element.getComponent(RoleBaseModel);
                if (!role) return;
                role.show(visibleRect.intersects(role.getRect()), this.getLoadOverCall());
                return;
            };
            building.show(visibleRect.intersects(building.getRect()), this.getLoadOverCall());
            //for test 显示区域
            // {
            //     let rect = building.getRect();
            //     this._mainScene.lineLayer.active = true;

            //     g.lineWidth = 4;
            //     g.strokeColor = Color.RED;
            //     g.moveTo(rect.x, rect.y);
            //     g.lineTo(rect.x + rect.width, rect.y);
            //     g.lineTo(rect.x + rect.width, rect.y + rect.height);
            //     g.lineTo(rect.x, rect.y + rect.height);
            //     g.lineTo(rect.x, rect.y);
            //     g.stroke();
            // }
        });
    }
    // 角色移动
    roleMove(roleModel: RoleBaseModel) {
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
        this._isNeedSort = true;//统一排序
    }
    buildingRoleSortEx() {
        let children = this._mainScene.buildingLayer.children.concat();
        children.sort((a, b) => {
            let aModel = a.getComponent(BaseComponent);
            let bModel = b.getComponent(BaseComponent);
            if (aModel.topZIndex) return 1;
            if (bModel.topZIndex) return -1;
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
    /**每帧更新 */
    update(dt: number): void {
        if (this._isNeedSort) {
            this.buildingRoleSortEx();
            this._isNeedSort = false;
        }
    }
    /**加载回调 */
    loadOverCall() {
        this._loadCount--;
        // console.log("loadOverCall", this._loadCount);
        if (this._loadCount <= 0) {
            this._loadCount = 0;
            this.buildingRoleSort();
            if (this._callBack) {
                this._callBack();
                this._callBack = null;
            }
        }
    }
    /**获取加载回调 */
    getLoadOverCall() {
        this._loadCount++;
        return this.loadOverCall.bind(this);
    }
    /**建筑列表 */
    onBuildingList(data: s2cBuildingList) {
        this.initBuilding(data.build_list);
        this.initLand(data.land_dict);
        // this.initRole();

        TimerMgr.once(this.getLoadOverCall(), 500);//注意一定要加延时
        this.updateCameraVisible();
    }
    /**查找建筑 */
    findBuilding(id: number) {
        let children = this._mainScene.buildingLayer.children;
        for (let i = 0; i < children.length; i++) {
            const element = children[i];
            let building = element.getComponent(BuildingModel);
            if (!building) continue;
            if (building.buildingID == id) return building;
        }
        return null;
    }
    findBuildingByIdx(idx: number) {
        let children = this._mainScene.buildingLayer.children;
        for (let i = 0; i < children.length; i++) {
            const element = children[i];
            let building = element.getComponent(BuildingModel);
            if (!building) continue;
            if (building.idx == idx) return building;
        }
        return null;
    }
}