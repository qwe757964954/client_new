import { Color, Graphics, Node, Rect, Vec3, instantiate, screen } from "cc";
import GlobalConfig from "../../GlobalConfig";
import { EventType } from "../../config/EventType";
import { MapConfig } from "../../config/MapConfig";
import { PrefabType } from "../../config/PrefabType";
import { TextConfig } from "../../config/TextConfig";
import { DataMgr, EditInfo, EditType } from "../../manager/DataMgr";
import { ViewsMgr } from "../../manager/ViewsManager";
import { BaseModel } from "../../models/BaseModel";
import { BgModel } from "../../models/BgModel";
import { BuildingModel, BuildingOperationData, BuildingOperationType, BuildingState, RecycleData } from "../../models/BuildingModel";
import { CloudModel } from "../../models/CloudModel";
import { GridModel } from "../../models/GridModel";
import { LandModel } from "../../models/LandModel";
import { MapSpModel } from "../../models/MapSpModel";
import { s2cBuildingBuilt, s2cBuildingBuiltReward, s2cBuildingBuiltSpeed, s2cBuildingEditBatch, s2cBuildingInfoGet, s2cBuildingList, s2cBuildingListInfo, s2cBuildingProduceAdd, s2cBuildingProduceDelete, s2cBuildingProduceGet, s2cBuildingProduceSpeed, s2cBuildingUpgrade, s2cBuildingUpgradeReward, s2cBuildingUpgradeSpeed, s2cCloudUnlock, s2cCloudUnlockGet, s2cCloudUnlockSpeed, s2cPetGetReward, s2cPetInfoRep, s2cPetUpgrade, s2cSpeedWordsGet } from "../../models/NetModel";
import { RoleType } from "../../models/RoleBaseModel";
import { RoleDataModel } from "../../models/RoleDataModel";
import { User } from "../../models/User";
import { InterfacePath } from "../../net/InterfacePath";
import { ServiceMgr } from "../../net/ServiceManager";
import EventManager, { EventMgr } from "../../util/EventManager";
import { TimerMgr } from "../../util/TimerMgr";
import { ToolUtil } from "../../util/ToolUtil";
import { MainBaseCtl } from "../main/MainBaseCtl";
import { MainScene } from "../main/MainScene";
import { BuildingSuccessType, BuildingSuccessView } from "./BuildingSuccessView";
import { SpeedWordsView } from "./SpeedWordsView";

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

    private _cameraRateRecord: number = 0;//地图摄像机与UI的比例记录
    private _cameraPosRecord: Vec3;//地图摄像机位置记录

    private _gridAry: GridModel[][] = [];//格子数组(y从上往下，x从右往左)
    private _bgModelAry: BgModel[] = [];//背景模型数组
    private _landModelAry: LandModel[] = [];//地块模型数组
    private _buidingModelAry: BuildingModel[] = [];//建筑模型数组
    private _roleModelAry: RoleDataModel[] = [];//角色模型数组
    private _cloudModelAry: CloudModel[] = [];//乌云模型数组
    private _mapSpModeAry: MapSpModel[] = [];//地图动画模型数组
    private _recycleBuildingAry: RecycleData[] = [];//回收建筑信息
    private _buyBuildingCacheAry: RecycleData[] = [];//购买建筑缓存信息
    private _isNeedUpdateVisible: boolean = false;//是否需要更新可视区域
    private _isNeedSort: boolean = false;//是否需要重新排序
    private _roleIsShow: boolean = true;//角色是否显示
    private _buildingUIIsShow: boolean = true;//建筑UI是否显示

    private _callBack: Function = null;//加载完成回调
    private _loadCount: number = 0;//加载计数
    private _needLoadCallBack: boolean = false;//是否需要加载回调
    private _checkPetTimer: number = null;//检查宠物定时器
    private _selfPet: RoleDataModel = null;//自己宠物
    private _lastSortChildren: BaseModel[] = null;//上一次排序的节点

    constructor(mainScene: MainScene, callBack?: Function) {
        super(mainScene);
        this._callBack = callBack;
        this.init();
    }
    private disposeModel(ary: BaseModel[]) {
        ary.forEach(element => {
            element.dispose();
        });
    }
    // 销毁
    public dispose(): void {
        this.disposeModel(this._landModelAry);
        this.disposeModel(this._buidingModelAry);
        this.disposeModel(this._roleModelAry);
        this.disposeModel(this._cloudModelAry);
        this.disposeModel(this._mapSpModeAry);
        this._gridAry = [];
        this._bgModelAry = [];
        this._landModelAry = [];
        this._buidingModelAry = [];
        this._roleModelAry = [];
        this._cloudModelAry = [];
        this._mapSpModeAry = [];
        this._recycleBuildingAry = [];
        this.removeEvent();
    }

    // 初始化
    public async init() {
        this._needLoadCallBack = true;
        this._loadCount++;
        // ToolUtil.clearCountKey("showBg");
        console.time("MapUICtl");
        this.initData();
        this.initEvent();
        this.initGrid();
        this.initMap();
        this.initMapSpine();

        ServiceMgr.buildingService.reqPetInfo();
        ServiceMgr.buildingService.reqBuildingList();
        this.mapMove(-288, 588);
        // console.log("MapUICtl showBg", ToolUtil.getCountKey("showBg"), this._bgModelAry.length, this._landModelAry.length, this._buidingModelAry.length, this._roleModelAry.length, this._cloudModelAry.length);
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
        this.addEvent(EventType.Building_Need_Sort, this.buildingSort.bind(this));
        this.addEvent(EventType.Role_Need_Move, this.roleMove.bind(this));
        this.addEvent(EventType.Role_Need_Sort, this.roleSort.bind(this));
        this.addEvent(InterfacePath.c2sBuildingList, this.onBuildingList.bind(this));
        this.addEvent(InterfacePath.c2sBuildingProduceAdd, this.onBuildingProduceAdd.bind(this));
        this.addEvent(InterfacePath.c2sBuildingProduceDelete, this.onBuildingProduceDelete.bind(this));
        this.addEvent(InterfacePath.c2sBuildingProduceGet, this.onBuildingProduceGet.bind(this));
        this.addEvent(InterfacePath.c2sCloudUnlock, this.onCloudUnlock.bind(this));
        this.addEvent(InterfacePath.c2sCloudUnlockGet, this.onCloudUnlockGet.bind(this));
        this.addEvent(InterfacePath.c2sPetInfo, this.onRepPetInfo.bind(this));
        this.addEvent(InterfacePath.c2sPetGetReward, this.onRepPetGetReward.bind(this));
        this.addEvent(InterfacePath.c2sPetUpgrade, this.onRepPetUpgrade.bind(this));
        this.addEvent(EventType.Mood_Score_Update, this.onMoodUpdate.bind(this));
        this.addEvent(EventType.BuidingModel_Remove, this.onBuildingRemove.bind(this));
        this.addEvent(EventType.Building_Flipx, this.onBuildingFlipX.bind(this));
        this.addEvent(EventType.Building_Shop_Buy, this.onShopBuyBuilding.bind(this));
        this.addEvent(InterfacePath.c2sBuildingEditBatch, this.onRepBuildingEditBatch.bind(this));
        this.addEvent(InterfacePath.c2sBuildingBuilt, this.onRepBuildingBuilt.bind(this));
        this.addEvent(InterfacePath.c2sBuildingBuiltReward, this.onRepBuildingBuiltReward.bind(this));
        this.addEvent(InterfacePath.c2sBuildingUpgrade, this.onRepBuildingUpgrade.bind(this));
        this.addEvent(InterfacePath.c2sBuildingUpgradeReward, this.onRepBuildingUpgradeReward.bind(this));
        this.addEvent(InterfacePath.c2sBuildingInfoGet, this.onRepBuildingInfoGet.bind(this));
        this.addEvent(InterfacePath.c2sSpeedWordsGet, this.onRepSpeedWordGet.bind(this));
        this.addEvent(InterfacePath.c2sBuildingBuiltSpeed, this.onRepBuildingBuiltSpeed.bind(this));
        this.addEvent(InterfacePath.c2sBuildingUpgradeSpeed, this.onRepBuildingUpgradeSpeed.bind(this));
        this.addEvent(InterfacePath.c2sBuildingProduceSpeed, this.onRepBuildingProduceSpeed.bind(this));
        this.addEvent(InterfacePath.c2sCloudUnlockSpeed, this.onRepCloudUnlockSpeed.bind(this));
    }
    // 移除事件
    removeEvent() {
        this.clearEvent();
    }
    // 获取格子信息
    getGridInfo(i: number, j: number) {
        if (this._gridAry && this._gridAry[i] && this._gridAry[i][j]) {
            return this._gridAry[i][j];
        }
        return null;
    }
    //是否是解锁的乌云
    cloudIsUnlock(i: number, j: number) {
        let range = MapConfig.cloud.range;
        for (let k = 0; k < range.length; k++) {
            let item = range[k];
            if (item.is <= i && i < item.ie && item.js <= j && j < item.je) {
                return true;
            }
        }
        return false;
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
        console.time("initGrid");
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
        console.timeEnd("initGrid");
    }
    //初始化地图
    initMap() {
        console.time("initMap");
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
        console.timeEnd("initMap");
    }
    /**初始化地图动画 */
    public initMapSpine() {
        let mapSpInfo = MapConfig.mapSp;
        mapSpInfo.forEach(item => {
            let model = new MapSpModel();
            model.init(item, this._mainScene.mapSpLayer);
            this._mapSpModeAry.push(model);
        });
    }
    //初始化地块层
    initLand(map: { [key: string]: number }) {
        console.time("initLand");
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
                // let land = instantiate(this._mainScene.landModel);
                // this._mainScene.landLayer.addChild(land);
                // let laneModel = land.getComponent(LandModel);
                let laneModel = new LandModel();
                let landInfo = defaultInfo;
                if (map) {
                    let key = ToolUtil.replace(TextConfig.Land_Key, i, j);
                    if (map.hasOwnProperty(key)) {
                        landInfo = DataMgr.instance.editInfo[map[key]];
                    }
                }
                User.addLand(landInfo.id);
                laneModel.initData(i, j, landWidth, landInfo, this._mainScene.landLayer);
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
        console.timeEnd("initLand");

    }
    // 初始化建筑
    initBuilding(list: s2cBuildingListInfo[]) {
        if (!list || list.length <= 0) return;
        console.time("initBuilding");
        // list.push({ id: 1, bid: 3, x: 0, y: 0, direction: 0 });
        list.forEach(element => {
            User.addBuilding(element.bid);

            if (element.hide) {
                let recycleData = new RecycleData();
                recycleData.bid = element.bid;
                recycleData.data = BuildingModel.getBuildingDataByMsg(element);
                this.addRecycleBuilding(recycleData);
                return;
            }
            let editInfo = DataMgr.instance.editInfo[element.bid];
            let building = this.newBuilding(editInfo, element.x, element.y, 1 == element.direction, false);
            building.buildingID = element.id;
            building.buildingLevel = element.level;
            building.setProducts(element.product_infos);
            building.setBuiltData(element.construct_infos.remaining_seconds);
            building.setUpgradeData(element.upgrade_infos.remaining_seconds);
            building.buildingState = element.status;

            // if (BuildingIDType.castle == element.bid) {
            //     let pos = building.node.position;
            //     this.mapMoveTo(pos.x, pos.y);
            // }
        });
        console.timeEnd("initBuilding");
    }
    /** 初始化角色 */
    public initRole() {
        if (!User.roleID) return;
        console.time("initRole");
        // 角色
        {
            let roleModel = new RoleDataModel();
            roleModel.initSelfRole();
            roleModel.parent = this._mainScene.buildingLayer;
            let grid = this.getGridInfo(12, 12);
            roleModel.grid = grid;
            this.roleMove(roleModel);
            this._roleModelAry.push(roleModel);
            this.buildingRoleSort();
        }
        // 精灵
        if (null != User.petLevel) {
            let roleModel = new RoleDataModel();
            roleModel.initSelfPet();
            roleModel.parent = this._mainScene.buildingLayer;
            let grid = this.getGridInfo(12, 12);
            roleModel.grid = grid;
            this.roleMove(roleModel);
            this._roleModelAry.push(roleModel);
            this.buildingRoleSort();

            this._selfPet = roleModel;
            this.checkPetShow();
        }
        console.timeEnd("initRole");
    }
    /**初始化乌云 */
    public initCloud(map: { [key: string]: number }) {
        if (!map) return;
        console.time("initCloud");
        // console.log("initCloud 1", i, this._landModelAry.length);
        let gridInfo = MapConfig.gridInfo;
        let col = gridInfo.col;
        let row = gridInfo.row;
        let cloudWidth = MapConfig.cloud.width;
        let index = 0;
        for (let i = 0; i < col; i += cloudWidth) {
            for (let j = 0; j < row; j += cloudWidth) {
                if (this.cloudIsUnlock(i, j)) continue;
                let gridInfo = this.getGridInfo(i, j);
                if (!gridInfo || gridInfo.cloud) continue;
                let key = ToolUtil.replace(TextConfig.Land_Key, i, j);
                let leftTime = null;
                if (map.hasOwnProperty(key)) {
                    leftTime = map[key];
                    if (leftTime < 0) continue;
                }
                let cloud = new CloudModel();
                cloud.initData(i, j, cloudWidth, leftTime, this._mainScene.buildingLayer);
                this._cloudModelAry.push(cloud);
                this.setCloudGrid(cloud, i, j);
                cloud.showID = index;
                index++;
            }
        }
        // this.refreshCloudShowType();
        this.updateCameraVisible();
        console.timeEnd("initCloud");
    }
    /**是否存在乌云 */
    public hasCloud(x: number, y: number): boolean {
        let gridInfo = this.getGridInfo(x, y);
        if (!gridInfo) return false;
        return gridInfo.cloud != null;
    }
    /**刷新乌云显示类型 */
    // public refreshCloudShowType() {
    //     this._cloudModelAry.forEach(element => {
    //         let x = element.x;
    //         let y = element.y;
    //         let width = element.width;
    //         let has1 = this.getGridInfo(x + width, y);
    //         let has2 = this.getGridInfo(x, y - width);
    //         if (!has1 && !has2) {
    //             element.showID = 0;
    //             return;
    //         }
    //         let has3 = this.getGridInfo(x - width, y);
    //         if (!has2 && !has3) {
    //             element.showID = 1;
    //             return;
    //         }
    //         let has4 = this.getGridInfo(x, y + width);
    //         if (!has1 && !has4) {
    //             element.showID = 4;
    //             return;
    //         }
    //         if (!has3 && !has4) {
    //             element.showID = 3;
    //             return;
    //         }
    //         element.showID = 2;
    //     });
    // }
    // 摄像头缩放大小
    get cameraRate(): number {
        return this._cameraRate;
    }
    /**摄像头位置 */
    get cameraPos(): Vec3 {
        return this._cameraPos;
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
        this._mainScene.mapUICamera.orthoHeight = this._cameraHeight;
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
        this._mainScene.mapUICamera.node.position = this._cameraPos;

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
        let children = this._lastSortChildren;//this._buidingModelAry;
        // for (let i = children.length - 1; i >= 0; i--) {
        for (let i = 0; i < children.length; i++) {
            const model = children[i];
            if (model instanceof BuildingModel) {
                if (model.isTouchSelf(worldPos)) {
                    return model;
                }
                // console.log("building worldPos", pos.x, pos.y);
            }
        }
        // console.log("getTouchBuilding", worldPos.x, worldPos.y, children.length);
        return null;
    }
    /**点击到乌云 */
    getTouchCloud(x: number, y: number) {
        let grid = this.getTouchGrid(x, y);
        return grid?.cloud;
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
            for (let j = 0; j < building.height; j++) {
                let grid = this.getGridInfo(gridX + i, gridY + j);
                if (!grid) {
                    // console.log("setBuildingGrid error",gridX,gridY);
                    return false;
                }
                grids.push(grid);
            }
        }
        building.grids = grids;
        return true;
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
    /**设置乌云格子 */
    setCloudGrid(cloud: CloudModel, gridX: number, gridY: number) {
        let grids: GridModel[] = [];
        for (let i = 0; i < cloud.width; i++) {
            for (let j = 0; j < cloud.width; j++) {
                let grid = this.getGridInfo(gridX + i, gridY + j);
                if (!grid) {
                    // console.log("setCloudGrid error",gridX,gridY);
                    return;
                }
                grids.push(grid);
            }
        }
        cloud.grids = grids;
    }
    /**回收建筑 */
    addRecycleBuilding(data: RecycleData) {
        if (!data) return;
        // console.log("addRecycleBuilding", data);
        this._recycleBuildingAry.push(data);
    }
    /**获取回收数据 */
    findRecycleData(idx: number) {
        let data: RecycleData = null;
        for (let i = 0; i < this._recycleBuildingAry.length; i++) {
            let element = this._recycleBuildingAry[i];
            if (element.data.idx == idx) {
                data = element;
                break;
            }
        }
        return data;
    }
    findRecycleDataByBid(bid: number) {
        let ary: RecycleData[] = [];
        for (let i = 0; i < this._recycleBuildingAry.length; i++) {
            let element = this._recycleBuildingAry[i];
            if (element.bid == bid) {
                ary.push(element);
            }
        }
        ary.sort((a, b) => {
            if (BuildingState.unBuilding == a.data.state) return -1;
            if (BuildingState.unBuilding == b.data.state) return 1;
            return a.data.state - b.data.state;
        });
        return ary;
    }
    /**移除回收数据 */
    removeRecycleData(data: RecycleData) {
        for (let i = 0; i < this._recycleBuildingAry.length; i++) {
            if (data == this._recycleBuildingAry[i]) {
                this._recycleBuildingAry.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    /**获取回收建筑 */
    getRecycleBuilding(bid: number) {
        // console.log("getRecycleBuilding", bid, this._recycleBuildingAry);
        let index = -1;
        let data = null;
        for (let i = 0; i < this._recycleBuildingAry.length; i++) {
            let element = this._recycleBuildingAry[i];
            if (element.bid == bid) {
                index = i;
                data = element;
                break;
            }
        }
        if (index > -1) {
            this._recycleBuildingAry.splice(index, 1);
            return data;
        }
        return data;
    }
    getRecycleBuildingByBuildingID(buildingID: number) {
        if (null == buildingID) return null;
        // console.log("getRecycleBuilding", bid, this._recycleBuildingAry);
        let index = -1;
        let data = null;
        for (let i = 0; i < this._recycleBuildingAry.length; i++) {
            let element = this._recycleBuildingAry[i];
            if (element.data.id == buildingID) {
                index = i;
                data = element;
                break;
            }
        }
        if (index > -1) {
            this._recycleBuildingAry.splice(index, 1);
            return data;
        }
        return data;
    }
    /**回收建筑是否包含指定建筑 */
    isRecycleBuildingContain(bid: number) {
        return undefined != this._recycleBuildingAry.find(element => element.bid == bid);
    }
    /**还原数据转换操作数据 */
    recycleDataToOperationData(recycleData: RecycleData, type: BuildingOperationType, editInfo: EditInfo) {
        let data = new BuildingOperationData();
        data.reset();
        data.type = type;
        data.buildingID = recycleData.data.id;
        data.idx = recycleData.data.idx;
        data.editInfo = editInfo;
        data.recycleData = recycleData;
        return data;
    }
    /**商店购买建筑 */
    onShopBuyBuilding(data: RecycleData) {
        this._buyBuildingCacheAry.push(data);
    }
    /**建筑批量修改返回 */
    onRepBuildingEditBatch(data: s2cBuildingEditBatch) {
        if (200 != data.code) {
            return;
        }
        if (1 == data.type) {
            ViewsMgr.showTip(TextConfig.Building_Shop_Buy_Success);
            data.insert_result.forEach((item) => {
                let index = -1;
                let tmpData = null;
                for (let i = 0; i < this._buyBuildingCacheAry.length; i++) {
                    let element = this._buyBuildingCacheAry[i];
                    if (element.data.idx == item.idx) {
                        index = i;
                        tmpData = element;
                        tmpData.data.id = item.id;
                        tmpData.data.state = item.status;
                        break;
                    }
                }
                if (index > -1) {
                    this._buyBuildingCacheAry.splice(index, 1);
                    this.addRecycleBuilding(tmpData);
                    User.addBuilding(tmpData.bid);
                    EventMgr.emit(EventType.EditUIView_Refresh);
                }
            });
        } else if (2 == data.type) {
            data.delete_result.forEach((id) => {
                let building = this.findBuilding(id);
                if (!building) return;
                building.sell(true);
                User.deleteBuilding(building.editInfo.id);
            });
        }
    }
    /**移除建筑 */
    removeBuilding(building: BuildingModel) {
        let idx = this._buidingModelAry.findIndex((item) => item == building);
        if (-1 !== idx) {
            this._buidingModelAry.splice(idx, 1);
        }
    }
    // 新建建筑物
    newBuilding(data: EditInfo, gridX: number, gridY: number, isFlip: boolean = false, isNew: boolean = true, idx: number = null) {
        let buildingModel = new BuildingModel();
        buildingModel.addToParent(this._mainScene.buildingLayer);
        buildingModel.initData(gridX, gridY, data, isFlip, isNew, idx);
        this.setBuildingGrid(buildingModel, gridX, gridY);
        this._buidingModelAry.push(buildingModel);
        return buildingModel;
    }
    newBuildingEx(data: EditInfo, gridX: number, gridY: number, isFlip: boolean = false) {
        if (data.type != EditType.Decoration) {
            if (this.findBuildingBytypeID(data.id)) return null;
        }
        let building = this.newBuilding(data, gridX, gridY, isFlip);
        if (building) {
            let recycleData = this.getRecycleBuilding(data.id);
            if (null != recycleData) {
                building.restoreRecycleData(recycleData);
            }
        }
        return building;
    }
    newBuildingInCamera(data: EditInfo, gridModel?: GridModel) {
        let winSize = GlobalConfig.SCREEN_SIZE;
        let grid = gridModel ? gridModel : this.getTouchGrid(winSize.width * 0.5, winSize.height * 0.5);
        if (grid) {
            for (let i = 0; i < data.width; i++) {
                for (let j = 0; j < data.height; j++) {
                    if (i == 0 && j == 0) continue;
                    let tmpGrid = this.getGridInfo(grid.x + i, grid.y + j);
                    if (!tmpGrid) {
                        return null;
                    }
                }
            }
            return this.newBuildingEx(data, grid.x, grid.y);
        }
        return null;
    }
    newBuildingFromBuilding(building: BuildingModel) {
        let width = building.width;
        let height = building.height;
        let isFlip = building.isFlip;
        let xAry = [0, width, -width, 0];
        let yAry = [height, 0, 0, -height];
        let gridInfo = building?.grids[0];
        if (!gridInfo) return null;
        let editInfo = building.editInfo;
        if (editInfo.type != EditType.Decoration) {
            if (this.findBuildingBytypeID(editInfo.id)) return null;
        }
        // console.log("newBuildingFromBuilding", gridInfo.x, gridInfo.y, width, height, isFlip);
        for (let i = 0; i < xAry.length; i++) {
            let x = gridInfo.x + xAry[i];
            let y = gridInfo.y + yAry[i];
            let canCreate = true;
            for (let m = 0; m < width; m++) {
                for (let n = 0; n < height; n++) {
                    let grid = this.getGridInfo(x + m, y + n);
                    // console.log("newBuildingFromBuilding for", grid, x, y, m, n);
                    if (grid && grid.isCanBuildingNew()) {
                        continue;
                    }
                    // console.log("newBuildingFromBuilding break", i, m, n);
                    canCreate = false;
                    break;
                }
                if (!canCreate) break;
            }
            if (canCreate) {
                return this.newBuildingEx(editInfo, x, y, isFlip);
            }
        }
        return this.newBuildingEx(editInfo, gridInfo.x + xAry[0], gridInfo.y + yAry[0], isFlip);
    }
    /**记录当前摄像头 */
    recordCamera() {
        this._cameraPosRecord = this._cameraPos.clone();
        this._cameraRateRecord = this._cameraRate;
    }
    /**还原摄像头到上次记录位置 */
    restoreCamera() {
        this.mapMoveToPos(this._cameraPosRecord, 1 / this._cameraRateRecord);
    }
    // 摄像头移动到指定建筑
    moveCameraToBuilding(building: BuildingModel, plPos: Vec3, scale: number = 1) {
        let pos = building.pos;
        // let winSize = GlobalConfig.WIN_SIZE;
        // console.log("moveCameraToBuilding",pos.x, pos.y, plPos.x, plPos.y);
        this.mapMoveTo(pos.x - plPos.x / scale, pos.y - plPos.y / scale);
        this.mapZoomTo(this._uiCameraHeight / scale);
        this.updateCameraVisible(true);
    }
    /** 摄像头移动到指定位置 */
    mapMoveToPos(pos: Vec3, scale: number = 1) {
        this.mapMoveTo(pos.x, pos.y);
        this.mapZoomTo(this._uiCameraHeight / scale);
        this.updateCameraVisible(true);
    }
    // 更新摄像头可见范围内元素
    updateCameraVisible(immediately: boolean = false) {
        if (!immediately) {
            this._isNeedUpdateVisible = true;
            return;
        }
        // console.log("updateCameraVisible", immediately);
        this._isNeedUpdateVisible = false;

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
        /**地图加载 */
        this._bgModelAry.forEach(element => {
            element.show(visibleRect.intersects(element.getRect()), this.getLoadOverCall());
        });
        //地块动态加载
        this._landModelAry.forEach(element => {
            element.show(visibleRect.intersects(element.getRect()), this.getLoadOverCall());
        });
        /**地图动画加载 */
        this._mapSpModeAry.forEach(element => {
            element.show(visibleRect.intersects(element.getRect()), this.getLoadOverCall());
        });
        //建筑动态加载
        this._buidingModelAry.forEach(element => {
            element.show(visibleRect.intersects(element.getRect()), this.getLoadOverCall());
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
        /**角色动态加载 */
        this._roleModelAry.forEach(element => {
            element.show(visibleRect.intersects(element.getRect()), this.getLoadOverCall());
        });
        /**乌云动态加载 */
        this._cloudModelAry.forEach(element => {
            element.show(visibleRect.intersects(element.getRect()), this.getLoadOverCall());
        });

        this.buildingRoleSortEx();
        this._isNeedSort = false;
    }
    // 角色移动
    roleMove(roleModel: RoleDataModel) {
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
            if (grid1 && grid1.isCanBuildingNew()) grids.push(grid1);
            if (grid2 && grid2.isCanBuildingNew()) grids.push(grid2);
            if (grid3 && grid3.isCanBuildingNew()) grids.push(grid3);
            if (grid4 && grid4.isCanBuildingNew()) grids.push(grid4);
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
    roleSort(roleModel: RoleDataModel) {
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
        // console.time("buildingRoleSortEx use");
        let children: BaseModel[] = [];
        let tmpAry: BaseModel[] = [].concat(this._buidingModelAry, this._roleModelAry, this._cloudModelAry);
        tmpAry.forEach(element => {
            if (element.isShow && element.node && this._mainScene.buildingLayer == element.node.parent) {
                children.push(element);
            }
        });
        children.sort((a, b) => {
            if (a.topZIndex) return -1;
            if (b.topZIndex) return 1;
            return b.ZIndex - a.ZIndex;
        });
        if (ToolUtil.compareArray(this._lastSortChildren, children)) {
            // console.timeEnd("buildingRoleSortEx use");
            return;
        }
        this._lastSortChildren = children;
        let maxindex = this._mainScene.buildingLayer.children.length - 1;
        for (const element of children) {
            element.node.setSiblingIndex(maxindex);
            maxindex--;
        }
        // children.sort((a, b) => {
        //     if (a.topZIndex) return 1;
        //     if (b.topZIndex) return -1;
        //     return a.ZIndex - b.ZIndex;
        // });
        // let maxindex = this._mainScene.buildingLayer.children.length;
        // for (const element of children) {
        //     element.node.setSiblingIndex(maxindex);
        // }
        // console.timeEnd("buildingRoleSortEx use");
    }
    /** 是否显示所有角色 */
    public set roleIsShow(isShow: boolean) {
        if (this._roleIsShow == isShow) return;
        this._roleIsShow = isShow;
        this._roleModelAry.forEach(element => {
            element.isActive = isShow;
        });
    }
    /** 是否显示所有建筑UI */
    public set buildingUIIsShow(isShow: boolean) {
        if (this._buildingUIIsShow == isShow) return;
        // this._mainScene.mapUICamera.node.active = isShow;
        this._buildingUIIsShow = isShow;
        this._buidingModelAry.forEach(building => {
            if (isShow) {
                building.showUIView();
            } else {
                building.hideUIView();
            }
        });
        this._cloudModelAry.forEach(cloud => {
            if (isShow) {
                cloud.showUIView();
            } else {
                cloud.hideUIView();
            }
        })
    }
    /**每帧更新 */
    update(dt: number): void {
        if (this._isNeedSort) {
            this.buildingRoleSortEx();
            this._isNeedSort = false;
        }
        if (this._isNeedUpdateVisible) {
            this.updateCameraVisible(true);
        }
        this.updateLoadModelNode(dt);
    }
    /**加载回调 */
    loadOverCall() {
        this._loadCount--;
        // console.log("loadOverCall", this._loadCount);
        if (this._loadCount <= 0) {
            this._loadCount = 0;
            console.timeEnd("MapUICtl");
            if (this._callBack) {
                this._callBack();
                this._callBack = null;
            }
        }
    }
    /**获取加载回调 */
    getLoadOverCall() {
        if (!this._needLoadCallBack) return null;
        this._loadCount++;
        return this.loadOverCall.bind(this);
    }
    /**建筑列表 */
    onBuildingList(data: s2cBuildingList) {
        console.time("onBuildingList");
        this.initBuilding(data.build_list);
        this.initLand(data.land_dict);
        this.initRole();
        this.initCloud(data.cloud_dict);

        // this.updateCameraVisible();
        this.updateCameraVisible(true);
        this._needLoadCallBack = false;
        this.loadOverCall();
        console.timeEnd("onBuildingList");
    }
    /**查找建筑 */
    findBuilding(id: number) {
        let children = this._buidingModelAry;
        for (let i = 0; i < children.length; i++) {
            const building = children[i];
            if (building.buildingID == id) return building;
        }
        return null;
    }
    findBuildingByIdx(idx: number) {
        if (null == idx) return null;
        let children = this._buidingModelAry;
        for (let i = 0; i < children.length; i++) {
            const building = children[i];
            if (building.idx == idx) return building;
        }
        return null;
    }
    findBuildingBytypeID(typeID: number) {
        let children = this._buidingModelAry;
        for (let i = 0; i < children.length; i++) {
            const building = children[i];
            if (building.editInfo.id == typeID) return building;
        }
        return null;
    }
    findAllBuilding(typeID: number) {
        let ary = [];
        let children = this._buidingModelAry;
        for (let i = 0; i < children.length; i++) {
            const building = children[i];
            if (building.editInfo.id == typeID) ary.push(building);
        }
        return ary;
    }
    /**建筑生产队列添加 */
    onBuildingProduceAdd(data: s2cBuildingProduceAdd) {
        let building = this.findBuilding(data.id);
        if (!building) return;
        building.setProducts(data.remaining_infos);
    }
    /**建筑生产队列移除 */
    onBuildingProduceDelete(data: s2cBuildingProduceDelete) {
        let building = this.findBuilding(data.id);
        if (!building) return;
        building.setProducts(data.remaining_infos);
    }
    /**建筑生产获取 */
    onBuildingProduceGet(data: s2cBuildingProduceGet) {
        let building = this.findBuilding(data.id);
        if (!building) return;
        building.setProducts(data.remaining_infos);

        // let list = ToolUtil.itemMapToList(data.product_items);
        ViewsMgr.showRewards(data.product_items);
    }
    /**乌云解锁结果 */
    onCloudUnlock(data: s2cCloudUnlock) {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        for (const key in data.cloud_dict) {
            let ary = key.split("_");
            let x = Number(ary[0]);
            let y = Number(ary[1]);
            let gridInfo = this.getGridInfo(x, y);
            if (!gridInfo) return;
            let cloud = gridInfo.cloud;
            if (!cloud) return;
            cloud.unlockTime = data.cloud_dict[key];
        }
    }
    /**乌云解锁获取结果 */
    onCloudUnlockGet(data: s2cCloudUnlockGet) {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        for (const key in data.cloud_dict) {
            let ary = key.split("_");
            let x = Number(ary[0]);
            let y = Number(ary[1]);
            let gridInfo = this.getGridInfo(x, y);
            if (!gridInfo) return;
            let cloud = gridInfo.cloud;
            if (!cloud) return;
            cloud.showCloudDispose(() => {
                this._cloudModelAry = this._cloudModelAry.filter(element => element != cloud);
            });
        }
        let list = ToolUtil.itemMapToList(data.award_items);
        ViewsMgr.showRewards(list);
    }
    /**宠物信息 */
    onRepPetInfo(data: s2cPetInfoRep) {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        let petInfo = data.pet_info;
        User.moodScore = petInfo.mood;
        User.petID = User.roleID;
        User.petLevel = petInfo.level;
        User.petHasReward = petInfo.has_reward;

        this.checkPetShow();
        this.setCheckPetTimer(petInfo.next_explore_second);
    }
    /**清理检测宠物定时器 */
    clearCheckPetTimer() {
        if (this._checkPetTimer) {
            TimerMgr.stop(this._checkPetTimer);
            this._checkPetTimer = null;
        }
    }
    /**设置检测宠物定时器 */
    setCheckPetTimer(time: number) {
        this.clearCheckPetTimer();
        if (User.petHasReward) return;//有精灵奖励了不需要定时去刷新
        this._checkPetTimer = TimerMgr.once(() => {
            ServiceMgr.buildingService.reqPetInfo();
            this.clearCheckPetTimer();
        }, time * 1000);
    }
    /**检测宠物显示 */
    checkPetShow() {
        if (!this._selfPet) return;
        if (User.petHasReward) {
            this._selfPet.showGift();
        } else {
            this._selfPet.hideGift();
        }
        let config = DataMgr.getMoodConfig(User.moodScore);
        if (config) {
            this._selfPet.showMood();
        } else {
            this._selfPet.hideMood();
        }
    }
    /**领取奖励返回 */
    onRepPetGetReward(data: s2cPetGetReward) {
        console.log("onRepPetGetReward", data);
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        ViewsMgr.showRewards(data.explore_award);
        User.petHasReward = false;
        this.checkPetShow();
        this.setCheckPetTimer(data.next_explore_second);
    }
    /**宠物升级 */
    onRepPetUpgrade(data: s2cPetUpgrade) {
        if (200 != data.code) {
            return;
        }
        for (let i = 0; i < this._roleModelAry.length; i++) {
            const element = this._roleModelAry[i];
            if (RoleType.sprite == element.roleType && element.isSelf) {
                element.updateLevel(data.level);
                break;
            }
        }
    }
    /**获取建筑数组 */
    getBuildingModelAry() {
        return this._buidingModelAry;
    }
    /**建筑移除事件 */
    onBuildingRemove(building: BuildingModel): void {
        if (building.isRecycle || (building.buildingID && !building.isSell)) {
            this.addRecycleBuilding(building.getRecycleData());
        }
        if (building.parent == this._mainScene.buildingLayer) {
            this.removeBuilding(building);
        }
    }
    /**建筑翻转事件 */
    onBuildingFlipX(building: BuildingModel) {
        // 翻转后暂用格子可能会发生变化
        if (building.width == building.height) return;
        let grid = building?.grids[0];
        if (!grid) return;
        let mx = grid.x + Math.floor((building.height - 1) / 2);
        let my = grid.y + Math.floor((building.width - 1) / 2);
        let x = grid.y - my + mx;
        let y = grid.x - mx + my;
        // console.log("onBuildingFlipX", grid.x, grid.y, x, y, mx, my, building.width, building.height);
        if (!this.setBuildingGrid(building, x, y)) {
            building.isFlip = !building.isFlip;
            ViewsMgr.showTip(TextConfig.Building_Flipx_Failed);
        }
    }
    /**心情分变化 */
    onMoodUpdate() {
        this.checkPetShow();
    }
    private _loadCloudNodeIdx = 0;
    private _loadLandNodeIdx = 0;
    private _updateLoadMaxCount = 30;
    private _isupdateLoadModelNodeOver = false;
    /**每帧加载node */
    updateLoadModelNode(dt: number): void {
        if (this._isupdateLoadModelNodeOver) return;
        if (dt > 1 / 60) {
            if (this._updateLoadMaxCount > 10)
                this._updateLoadMaxCount -= 5;
        } else {
            this._updateLoadMaxCount += 5;
        }
        let count = 0;
        if (this._loadCloudNodeIdx < this._cloudModelAry.length) {
            let count = 0;
            while (this._loadCloudNodeIdx < this._cloudModelAry.length) {
                let model = this._cloudModelAry[this._loadCloudNodeIdx];
                model.loadNode();
                count++;
                this._loadCloudNodeIdx++;
                if (count >= this._updateLoadMaxCount) break;
            }
        }
        if (this._loadLandNodeIdx < this._landModelAry.length) {
            while (this._loadLandNodeIdx < this._landModelAry.length) {
                let model = this._landModelAry[this._loadLandNodeIdx];
                model.loadNode();
                count++;
                this._loadLandNodeIdx++;
                if (count >= this._updateLoadMaxCount) break;
            }
        }
        if (0 == count && this._loadCloudNodeIdx > 0 && this._loadLandNodeIdx > 0) {
            this._isupdateLoadModelNodeOver = true;
        }
    }
    /**还原建筑通过操作数据 */
    recoverByOperationData(data: BuildingOperationData) {
        if (BuildingOperationType.recycleSell == data.type) {
            if (data.toLast) {
                this.addRecycleBuilding(data.recycleData);
            } else {
                this.removeRecycleData(data.recycleData);
            }
            return;
        }
        let building = this.findBuildingByIdx(data.idx);
        console.log("recoverByOperationData", data, building);
        if (!building) {
            building = new BuildingModel();
            building.addToParent(this._mainScene.buildingLayer);
            building.initData(data.x, data.y, data.editInfo, building.isFlip, true, data.idx);
            let recycleData = this.getRecycleBuildingByBuildingID(data.buildingID);
            if (null != recycleData) {
                building.restoreRecycleData(recycleData);
                EventMgr.emit(EventType.EditUIView_Refresh);
            } else {
                building.buildingID = data.buildingID;
            }
            this._buidingModelAry.push(building);
        }
        building.restoreOperationData(data);
    }
    /**切换底格颜色 */
    changeBaseColor(isBaseColor: boolean) {
        this._buidingModelAry.forEach(element => {
            element.isShowBaseColor = isBaseColor;
        });
    }
    /**建筑建造返回 */
    onRepBuildingBuilt(data: s2cBuildingBuilt) {
        if (200 != data.code) {
            return;
        }
        let building = this.findBuilding(data.id);
        if (!building) return;
        building.setBuiltData(data.construct_infos.remaining_seconds);
        building.buildingState = data.status;
    }
    /**建筑建筑奖励返回 */
    onRepBuildingBuiltReward(data: s2cBuildingBuiltReward) {
        if (200 != data.code) {
            ViewsMgr.showTip(data.msg);
            return;
        }
        let building = this.findBuilding(data.id);
        if (!building) return;
        building.buildingState = data.status;
        ViewsMgr.showView(PrefabType.BuildingSuccessView, (node: Node) => {
            let view = node.getComponent(BuildingSuccessView);
            view.initData(data.award, BuildingSuccessType.built);
        });
    }
    /**建筑升级返回 */
    onRepBuildingUpgrade(data: s2cBuildingUpgrade) {
        if (200 != data.code) {
            return;
        }
        let building = this.findBuilding(data.id);
        if (!building) return;
        building.setUpgradeData(data.upgrade_infos.remaining_seconds);
        building.buildingState = data.status;
    }
    /**建筑升级奖励返回 */
    onRepBuildingUpgradeReward(data: s2cBuildingUpgradeReward) {
        if (200 != data.code) {
            ViewsMgr.showTip(data.msg);
            return;
        }
        let building = this.findBuilding(data.id);
        if (!building) return;
        building.buildingLevel = data.level;
        building.buildingState = data.status;
        ViewsMgr.showView(PrefabType.BuildingSuccessView, (node: Node) => {
            let view = node.getComponent(BuildingSuccessView);
            view.initData(data.award, BuildingSuccessType.upgrade);
        });
    }
    /**建筑信息获取返回 */
    onRepBuildingInfoGet(data: s2cBuildingInfoGet) {
        if (200 != data.code) {
            return;
        }
        let building = this.findBuilding(data.id);
        if (!building) return;
        building.setBuiltData(data.construct_infos.remaining_seconds);
        building.setUpgradeData(data.upgrade_infos.remaining_seconds);
        building.buildingState = data.status;
    }
    /**获取加速单词回调 */
    onRepSpeedWordGet(data: s2cSpeedWordsGet) {
        if (200 != data.code) {
            if (1600 == data.code) {
                ViewsMgr.showTip(data.msg);
            }
            return;
        }
        if (data.id) {
            let building = this.findBuilding(data.id);
            if (!building) return;
            let product_num = data.product_num;
            let sec = 0;
            if (null != data.product_num) {
                sec = building.getProduceLeftTime(product_num);
            } else {
                sec = building.getCountDownTime();
            }
            if (sec <= 0) return;
            ViewsMgr.showView(PrefabType.SpeedWordsView, (node: Node) => {
                let view = node.getComponent(SpeedWordsView);
                view.initData(data.id, data.word_list, building.buildingState, data.product_num);
                view.setRemainTime(sec);
                view.buildingName = building.editInfo.name;
            });
        } else if (data.unlock_cloud) {
            let ary = data.unlock_cloud.split("_");
            let x = Number(ary[0]);
            let y = Number(ary[1]);
            let gridInfo = this.getGridInfo(x, y);
            if (!gridInfo) return;
            let cloud = gridInfo.cloud;
            if (!cloud) return;
            if (cloud.isUnlock || null == cloud.unlockTime) return;
            ViewsMgr.showView(PrefabType.SpeedWordsView, (node: Node) => {
                let view = node.getComponent(SpeedWordsView);
                view.initDataEx(data.unlock_cloud, data.word_list);
                view.setRemainTime(cloud.getLeftTime());
            });
        }
    }
    /**乌云解锁加速回调 */
    onRepCloudUnlockSpeed(data: s2cCloudUnlockSpeed) {
        if (200 != data.code) {
            return;
        }
        let unlock_cloud: string = null;
        let time: number = null;
        for (const key in data.cloud_dict) {
            unlock_cloud = key;
            time = data.cloud_dict[key];
        }
        if (null == unlock_cloud) return;
        let ary = unlock_cloud.split("_");
        let x = Number(ary[0]);
        let y = Number(ary[1]);
        let gridInfo = this.getGridInfo(x, y);
        if (!gridInfo) return;
        let cloud = gridInfo.cloud;
        if (!cloud) return;
        cloud.unlockTime = time;
    }
    /**建筑建造加速回调 */
    onRepBuildingBuiltSpeed(data: s2cBuildingBuiltSpeed) {
        if (200 != data.code) {
            return;
        }
        let building = this.findBuilding(data.id);
        if (!building) return;
        building.setBuiltData(data.construct_infos.remaining_seconds);
        building.buildingState = data.status;
    }
    /**建筑升级加速回调 */
    onRepBuildingUpgradeSpeed(data: s2cBuildingUpgradeSpeed) {
        if (200 != data.code) {
            return;
        }
        let building = this.findBuilding(data.id);
        if (!building) return;
        building.setUpgradeData(data.upgrade_infos.remaining_seconds);
        building.buildingState = data.status;
    }
    /**建筑生产加速回调 */
    onRepBuildingProduceSpeed(data: s2cBuildingProduceSpeed) {
        if (200 != data.code) {
            return;
        }
        let building = this.findBuilding(data.id);
        if (!building) return;
        building.setProducts(data.product_infos);
    }
}