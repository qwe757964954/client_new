import { Color, Graphics, Sprite, SpriteFrame, UITransform, Vec3, instantiate, math, screen, sys } from "cc";
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

// 地图UI控制器
export class MapUICtl extends MainBaseCtl {

    private _uiCameraHeight:number;//ui摄像机高度
    private _cameraRate:number;//地图摄像机与UI的比例
    private _cameraHeight:number;//地图摄像机高度
    private _cameraPos:Vec3;//地图摄像机位置
    private _cameraZoomVal:number = 50;//地图摄像机缩放值
    private _cameraMinHeight:number = 200;//地图摄像机最小高度
    private _cameraMaxHeight:number = 1300;//地图摄像机最大高度
    private _mapMaxHeight:number = screen.windowSize.height;//地图最大高度
    private _mapMaxWidth:number = screen.windowSize.width;//地图最大宽度

    private _gridAry:GridModel[][] = [];//格子数组(y从上往下，x从右往左)
    private _buidingSortHandler:string;//建筑需要重新排序handle

    constructor(mainScene:MainScene) {
        super(mainScene);
        this.init();
    }
    // 销毁
    public dispose(): void {
        this.removeEvent();
    }

    // 初始化
    public init(): void {
        this.initData();
        this.initEvent();
        this.initGrid();
        this.initMap();
        this.initLand();
        this.initBuilding();
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
    }
    // 移除事件
    removeEvent() {
        EventManager.off(EventType.Building_Need_Sort, this._buidingSortHandler);
    }
    // 获取格子信息
    getGridInfo(i:number, j:number){
        if(this._gridAry && this._gridAry[i] && this._gridAry[i][j]){
            return this._gridAry[i][j];
        }
        return null;
    }
    //是否是可编辑的格子
    gridIsCanEdit(i:number, j:number){
        let landInfo = MapConfig.gridInfo;
        let range = landInfo.range;
        for(let k=0;k<range.length;k++) {
            let item = range[k];
            if(i < landInfo.col && j < landInfo.row && item.is <= i && i < item.ie && item.js <= j && j < item.je){
                return true;
            }
        }
        return false;
    }
    // 初始化格子
    initGrid(){
        let landInfo = MapConfig.gridInfo;
        let width = landInfo.width;
        let height = landInfo.height;
        let col = landInfo.col;
        let row = landInfo.row;
        let dtX = landInfo.dtX;
        let dtY = landInfo.dtY;
        for(let i=0;i<col;i++) {
            let ary:GridModel[] = [];
            this._gridAry[i] = ary;
            for(let j=0;j<row;j++) {
                if(!this.gridIsCanEdit(i,j)) continue;
                let pos = new Vec3((j - i)*0.5*width + dtX*width, (-i-j)*0.5*height + dtY*height, 0);
                ary[j] = new GridModel(i, j, pos, width, height);
            }
        }
    }
    private isCommonBg(id:number){
        let ary = MapConfig.bgInfo.commonAry;
        for(let i=0;i<ary.length;i++){
            if(id == ary[i]){
                return true;
            }
        }
        return false;
    }
    //初始化地图
    initMap() {
        let bgInfo = MapConfig.bgInfo;
        let width = bgInfo.width;
        let height = bgInfo.height;
        let col = bgInfo.col;
        let row = bgInfo.row;
        let midCol = col/2;
        let midRow = row/2;
        let time = sys.now();
        for(let i=0;i<col;i++) {
            for(let j=0;j<row;j++) {
                let bg = instantiate(this._mainScene.mapGridView);
                let id = j*col+i+1;
                let path = this.isCommonBg(id) ? bgInfo.commonPath : ToolUtil.replace(bgInfo.path, id);
                LoadManager.load(path, SpriteFrame).then((spriteFrame:SpriteFrame) => {
                    this._mainScene.addLoadAsset(spriteFrame);
                    bg.getComponent(Sprite).spriteFrame = spriteFrame;
                    if(id == bgInfo.num){
                        console.log("use time",sys.now() - time);
                    }
                })
                bg.position = new Vec3((i-midCol+0.5)*width, (midRow-j-0.5)*height, 0);
                // bg.setSiblingIndex(0); //设置层级
                this._mainScene.bgLayer.addChild(bg);
            }
        }
        this._mapMaxWidth = width*col;
        this._mapMaxHeight = height*row;
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
    initLand(){
        let gridInfo = MapConfig.gridInfo;
        let width = gridInfo.width;
        let height = gridInfo.height;
        let col = gridInfo.col;
        let row = gridInfo.row;
        let landInfo = MapConfig.editInfo[3];
        let landWidth = landInfo.width;
        let g = this._mainScene.lineLayer.getComponent(Graphics);
        this._mainScene.lineLayer.active = false;
        for(let i=0;i<col;i++) {
            for(let j=0;j<row;j++) {
                let gridInfo = this.getGridInfo(i, j);
                if(!gridInfo || gridInfo.land) continue;
                let land = instantiate(this._mainScene.landModel);
                this._mainScene.landLayer.addChild(land);
                let laneModel = land.getComponent(LandModel);
                laneModel.initData(i,j,landWidth,landInfo);
                this.setLandGrid(laneModel, i, j);
                laneModel.showLand();

                let pos = gridInfo.pos;
                g.lineWidth = 2;
                g.strokeColor = Color.BLACK;
                g.moveTo(pos.x - 0.5*width*landWidth, pos.y - 0.5*height*landWidth);
                g.lineTo(pos.x, pos.y);
                g.lineTo(pos.x + 0.5*width*landWidth, pos.y - 0.5*height*landWidth);
                if(!this.getGridInfo(i,j+1)){
                    g.lineTo(pos.x, pos.y - height*landWidth);
                    if(!this.getGridInfo(i + 1,j)){
                        g.lineTo(pos.x - 0.5*width*landWidth, pos.y - 0.5*height*landWidth);
                    }
                }
                else if(!this.getGridInfo(i + 1,j)){
                    g.moveTo(pos.x, pos.y - height*landWidth);
                    g.lineTo(pos.x - 0.5*width*landWidth, pos.y - 0.5*height*landWidth);
                }
                g.stroke();
                g.lineWidth = 1;
                g.moveTo(pos.x + 0.5*width, pos.y - 0.5*height);
                g.lineTo(pos.x - 0.5*width, pos.y - 1.5*height);
                g.moveTo(pos.x - 0.5*width, pos.y - 0.5*height);
                g.lineTo(pos.x + 0.5*width, pos.y - 1.5*height);
                g.stroke();
            }
        }
    }
    // 初始化建筑
    initBuilding(){
        this.newBuilding(MapConfig.editInfo[1], 30, 30, false, false);//TEST 测试数据
    }
    // 摄像头缩放大小
    get cameraRate():number{
        return this._cameraRate;
    }
    // 缩放地图
    mapZoom(scale:number){//变化缩放
        this.mapZoomTo(Math.floor(this._cameraHeight*scale));
    }
    mapZoomTo(value:number){//缩放到
        this._cameraHeight = value;
        if(this._cameraHeight > this._cameraMaxHeight){
            this._cameraHeight = this._cameraMaxHeight;
            return;
        }
        if(this._cameraHeight < this._cameraMinHeight){
            this._cameraHeight = this._cameraMinHeight;
            return;
        }
        this._mainScene.mapCamera.orthoHeight = this._cameraHeight;
        this._cameraRate = this._cameraHeight / this._uiCameraHeight;
        this.mapMove(0,0);//限制map位置
        // 摄像头缩放事件通知
        this._mainScene.getMapCtl().onCameraScale(this._cameraRate);
        EventManager.emit(EventType.Map_Scale, this._cameraRate);
    }
    // 缩小地图
    mapZoomOut(){
        this.mapZoomTo(this._cameraHeight + this._cameraZoomVal);
    }
    // 放大地图
    mapZoomIn(){
        this.mapZoomTo(this._cameraHeight - this._cameraZoomVal);
    }
    // 移动地图
    mapMove(dtX:number, dtY:number){
        // console.log("mapMove",dtX, dtY);
        this.mapMoveTo(this._cameraPos.x + dtX*this._cameraRate, this._cameraPos.y + dtY*this._cameraRate);
    }
    mapMoveTo(x:number, y:number){
        this._cameraPos.x = x;
        this._cameraPos.y = y;

        let winSize = GlobalConfig.WIN_SIZE;
        let maxX = (this._mapMaxWidth - winSize.width*this._cameraRate)/2;
        let maxY = (this._mapMaxHeight - winSize.height*this._cameraRate)/2;

        if(this._cameraPos.x > maxX){
            this._cameraPos.x = maxX;
        }else if(this._cameraPos.x < -maxX){
            this._cameraPos.x = -maxX;
        }
        if(this._cameraPos.y > maxY){
            this._cameraPos.y = maxY;
        }else if(this._cameraPos.y < -maxY){
            this._cameraPos.y = -maxY;
        }
        this._mainScene.mapCamera.node.position = this._cameraPos;
    }
    // 点击到格子
    getTouchGrid(x:number, y:number){
        let landInfo = MapConfig.gridInfo;
        let width = landInfo.width;
        let height = landInfo.height;
        let dtX = landInfo.dtX;
        let dtY = landInfo.dtY;
        let worldPos = this._mainScene.mapCamera.screenToWorld(new Vec3(x,y,0));
        let pos = this._mainScene.landLayer.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        let i = Math.floor(dtX + dtY - pos.x/width - pos.y/height);
        let j = Math.floor(dtY - dtX + pos.x/width - pos.y/height);
        // console.log("getTouchGrid",i,j);
        return this.getGridInfo(i,j);
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
    buildingSort(){
        let children = this._mainScene.buildingLayer.children.concat();
        children.sort((a,b)=>{
            let aModel = a.getComponent(BuildingModel);
            let bModel = b.getComponent(BuildingModel);
            return aModel.ZIndex - bModel.ZIndex;
        });
        let maxLen = children.length;
        for (const node of children) {
            // console.log("buildingSort",node.getComponent(BuildingModel).ZIndex);
            node.setSiblingIndex(maxLen);
        }
    }
    // 设置建筑物格子
    setBuildingGrid(building:BuildingModel, gridX:number, gridY:number){
        let grids:GridModel[] = [];
        for (let i = 0; i < building.width; i++) {
            for (let j = 0; j < building.width; j++) {
                let grid = this.getGridInfo(gridX + i, gridY + j);
                if(!grid) {
                    // console.log("setBuildingGrid error",gridX,gridY);
                    return;
                }
                grids.push(grid);
            }
        }
        building.grids = grids;
    }
    // 设置地块格子
    setLandGrid(land:LandModel, gridX:number, gridY:number){
        let grids:GridModel[] = [];
        for (let i = 0; i < land.width; i++) {
            for (let j = 0; j < land.width; j++) {
                let grid = this.getGridInfo(gridX + i, gridY + j);
                if(!grid) {
                    // console.log("setLandGrid error",gridX,gridY);
                    return;
                }
                grids.push(grid);
            }
        }
        land.grids = grids;
    }
    // 新建建筑物
    newBuilding(data:EditInfo, gridX:number, gridY:number, isFlip:boolean = false, isNew:boolean = true){
        let building = instantiate(this._mainScene.buildingModel);
        // this._mainScene.buildingLayer.addChild(building);
        let buildingModel = building.getComponent(BuildingModel);
        buildingModel.addToParent(this._mainScene.buildingLayer);
        buildingModel.initData(gridX, gridY, data.width, data.path, isFlip, isNew);
        this.setBuildingGrid(buildingModel, gridX, gridY);
        return buildingModel;
    }
    newBuildingInCamera(data:EditInfo){
        let winSize = GlobalConfig.SCREEN_SIZE;
        let grid = this.getTouchGrid(winSize.width*0.5, winSize.height*0.5);
        if(grid){
            return this.newBuilding(data, grid.x, grid.y);
        }
        return this.newBuilding(data, 20, 20);
    }
    // 摄像头移动到指定建筑
    moveCameraToBuilding(building:BuildingModel, plPos:Vec3){
        let pos = building.node.position;
        let winSize = GlobalConfig.WIN_SIZE;
        // console.log("moveCameraToBuilding",pos.x, pos.y, plPos.x, plPos.y);
        this.mapMoveTo(pos.x - plPos.x, pos.y - plPos.y);
        this.mapZoomTo(this._uiCameraHeight);
    }
}