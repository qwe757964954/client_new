import { Color, Graphics, Sprite, SpriteFrame, Vec3, instantiate, screen, sys } from "cc";
import { MainBaseCtl } from "../main/MainBaseCtl";
import { GridModel } from "../../models/GridModel";
import { MapConfig } from "../../config/MapConfig";
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

    constructor(mainScene:MainScene) {
        super(mainScene);
        this.init();
    }

    // 初始化
    public init(): void {
        this.initData();
        this.initGrid();
        this.initMap();
        this.initLand();
        this.initBuilding();
    }
    // 初始化数据
    initData(): void {
        console.log("MapUICtl initData",this);
        this._cameraHeight = this._mainScene.mapCamera.orthoHeight;
        this._cameraPos = this._mainScene.mapCamera.node.position;
        this._uiCameraHeight = this._mainScene.uiCamera.orthoHeight;
        this._cameraRate = this._cameraHeight / this._uiCameraHeight;
        this._gridAry = [];
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
        let landWidth = MapConfig.landWidth;
        let g = this._mainScene.lineLayer.getComponent(Graphics);
        this._mainScene.lineLayer.active = false;
        for(let i=0;i<col;i++) {
            for(let j=0;j<row;j++) {
                let gridInfo = this.getGridInfo(i, j);
                if(!gridInfo || gridInfo.land) continue;
                let land = instantiate(this._mainScene.landModel);
                this._mainScene.landLayer.addChild(land);
                let laneModel = land.getComponent(LandModel);
                laneModel.initData(i,j,landWidth,MapConfig.landInfo[0]);
                this.setLandGrid(laneModel, i, j);
                laneModel.showLand();

                let pos = gridInfo.pos;
                g.lineWidth = 2;
                g.strokeColor = Color.BLACK;
                g.moveTo(pos.x - 0.5*width*landWidth, pos.y - 0.5*height*(landWidth-1));
                g.lineTo(pos.x, pos.y + 0.5*height);
                g.lineTo(pos.x + 0.5*width*landWidth, pos.y - 0.5*height*(landWidth-1));
                if(!this.getGridInfo(i,j+1)){
                    g.lineTo(pos.x, pos.y - 0.5*height*(2*landWidth-1));
                    if(!this.getGridInfo(i + 1,j)){
                        g.lineTo(pos.x - 0.5*width*landWidth, pos.y - 0.5*height*(landWidth-1));
                    }
                }
                else if(!this.getGridInfo(i + 1,j)){
                    g.moveTo(pos.x, pos.y - 0.5*height*(2*landWidth-1));
                    g.lineTo(pos.x - 0.5*width*landWidth, pos.y - 0.5*height*(landWidth-1));
                }
                g.stroke();
                g.lineWidth = 1;
                g.moveTo(pos.x + 0.5*width, pos.y);
                g.lineTo(pos.x - 0.5*width, pos.y - height);
                g.moveTo(pos.x - 0.5*width, pos.y);
                g.lineTo(pos.x + 0.5*width, pos.y - height);
                g.stroke();
            }
        }
    }
    // 初始化建筑
    initBuilding(){
        let buildingInfo = MapConfig.buildingInfo[1];
        let startX = 20;
        let startY = 20;
        let building = instantiate(this._mainScene.buildingModel);
        this._mainScene.buildingLayer.addChild(building);
        let buildingModel = building.getComponent(BuildingModel);
        buildingModel.initData(startX, startY, buildingInfo.width, buildingInfo.path, false);
        this.setBuildingGrid(buildingModel, startX, startY);
    }
    // 摄像头缩放大小
    get cameraRate():number{
        return this._cameraRate;
    }
    // 缩小地图
    mapZoomOut(){
        this._cameraHeight += this._cameraZoomVal;
        if(this._cameraHeight > this._cameraMaxHeight){
            this._cameraHeight = this._cameraMaxHeight;
            return;
        }
        this._mainScene.mapCamera.orthoHeight = this._cameraHeight;
        this._cameraRate = this._cameraHeight / this._uiCameraHeight;

        this.mapMove(0,0);//限制map位置
        // 摄像头缩放事件通知
        this._mainScene.getMapCtl().onCameraScale(this._cameraRate);
        EventManager.emit(EventType.Map_Scale, this._cameraRate);
    }
    // 放大地图
    mapZoomIn(){
        this._cameraHeight -= this._cameraZoomVal;
        if(this._cameraHeight < this._cameraMinHeight){
            this._cameraHeight = this._cameraMinHeight;
            return;
        }
        this._mainScene.mapCamera.orthoHeight = this._cameraHeight;
        this._cameraRate = this._cameraHeight / this._uiCameraHeight;
        // 摄像头缩放事件通知
        this._mainScene.getMapCtl().onCameraScale(this._cameraRate);
        EventManager.emit(EventType.Map_Scale, this._cameraRate);
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
        let row = landInfo.row;
        let pos = this._mainScene.mapCamera.screenToWorld(new Vec3(x,y,0));
        let i = Math.floor(dtX*2 + dtY*2 - pos.x/width - pos.y/height + 0.5);
        let j = Math.floor(dtY - dtX + pos.x/width - pos.y/height - 0.5);
        // console.log("getTouchGrid",i,j);
        return this.getGridInfo(i,j);
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
}