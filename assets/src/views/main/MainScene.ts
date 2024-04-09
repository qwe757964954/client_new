import { _decorator, Asset, Camera, Canvas, Color, Component, EventMouse, EventTouch, Graphics, instantiate, Intersection2D, Label, Node, Prefab, screen, Sprite, SpriteFrame, sys, Texture2D, UITransform, Vec2, Vec3, View } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import { ToolUtil } from '../../util/ToolUtil';
import GlobalConfig from '../../GlobalConfig';
import { MapConfig } from '../../config/MapConfig';
import CCUtil from '../../util/CCUtil';
import { GridModel } from '../../models/GridModel';
import { BuildingModel } from '../../models/BuildingModel';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
import { MapNormalCtl } from '../map/MapNormalCtl';
import { MapEditCtl } from '../map/MapEditCtl';
import { LandEditCtl } from '../map/LandEditCtl';
import { RecycleCtl } from '../map/RecycleCtl';
import { BuildEditCtl } from '../map/BuildEditCtl';
import { MainUICtl } from './MainUICtl';
import { MainUIView } from './MainUIView';
import { LandModel } from '../../models/LandModel';
const { ccclass, property } = _decorator;

export enum MapStatus{//地图状态
    DEFAULT = 0,//默认状态
    EDIT = 1,//编辑状态
    BUILD_EDIT = 2,//建筑编辑状态
    LAND_EDIT = 3,//地块编辑状态
    RECYCLE = 4,//回收状态
};

@ccclass('MainScene')
export class MainScene extends Component {
    @property(Prefab)
    public mapGridView:Prefab = null;//格子地图
    @property(Prefab)
    public landModel:Prefab = null;//地块
    @property(Prefab)
    public buildingModel:Prefab = null;//建筑
    @property(Node)
    public bgLayer:Node = null;//背景层
    @property(Node)
    public landLayer:Node = null;//地块层
    @property(Node)
    public lineLayer:Node = null;//编辑层
    @property(Node)
    public buildingLayer:Node = null;//建筑层
    @property(Camera)
    public mapCamera:Camera = null;//地图摄像机
    @property(Canvas)
    public touchCanvas:Canvas = null;//监听点击画布
    @property(Camera)
    public uiCamera:Camera = null;//ui摄像机
    
    /**=========================ui元素============================ */
    @property(MainUIView)
    public mainUIView:MainUIView = null;//主界面ui
    // @property(Sprite)
    // public btnTest:Sprite = null;//测试按钮
    // @property(Sprite)
    // public btnBackTest:Sprite = null;//测试按钮

    /**=========================变量============================ */
    private _loadAssetAry:Asset[] = [];//加载资源数组

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

    private _mapStatus:MapStatus = MapStatus.DEFAULT;//地图状态
    private _mapNormalCtl:MapNormalCtl = null;//普通地图控制器
    private _mapEditCtl:MapEditCtl = null;//编辑地图控制器
    private _buildingEditCtl:BuildEditCtl = null;//建筑编辑控制器
    private _landEditCtl:LandEditCtl = null;//地块编辑控制器
    private _recycleCtl:RecycleCtl = null;//地图回收控制器
    private _mainUICtl:MainUICtl = null;//主界面控制器


    /**=========================事件handle============================ */
    private _buildingBtnViewCloseHandle:string;//建筑按钮视图关闭事件

    start() {
        this.initData();
        this.initEvent();
        this.initGrid();
        this.initMap();
        this.initLand();
        this.initBuilding();
    }

    update(deltaTime: number) {
        
    }
    // 初始化数据
    initData(){
        this._cameraHeight = this.mapCamera.orthoHeight;
        this._cameraPos = this.mapCamera.node.position;
        this._uiCameraHeight = this.uiCamera.orthoHeight;
        this._cameraRate = this._cameraHeight / this._uiCameraHeight;

        this._mapNormalCtl = new MapNormalCtl(this);
        this._mapEditCtl = new MapEditCtl(this);
        this._buildingEditCtl = new BuildEditCtl(this);
        this._landEditCtl = new LandEditCtl(this);
        this._recycleCtl = new RecycleCtl(this);

        this.mainUIView.mainScene = this;
    }
    // 点击到格子
    getTouchGrid(x:number, y:number){
        let landInfo = MapConfig.gridInfo;
        let width = landInfo.width;
        let height = landInfo.height;
        let dtX = landInfo.dtX;
        let dtY = landInfo.dtY;
        let row = landInfo.row;
        let pos = this.mapCamera.screenToWorld(new Vec3(x,y,0));
        let i = Math.floor(dtX*2 + dtY*2 - pos.x/width - pos.y/height + 0.5);
        let j = Math.floor(dtY - dtX + pos.x/width - pos.y/height - 0.5);
        // console.log("getTouchGrid",i,j);
        return this.getGridInfo(i,j);
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
            let ary = [];
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
                let bg = instantiate(this.mapGridView);
                let id = j*col+i+1;
                let path = this.isCommonBg(id) ? bgInfo.commonPath : ToolUtil.replace(bgInfo.path, id);
                LoadManager.load(path, SpriteFrame).then((spriteFrame:SpriteFrame) => {
                    this._loadAssetAry.push(spriteFrame);
                    bg.getComponent(Sprite).spriteFrame = spriteFrame;
                    if(id == bgInfo.num){
                        console.log("use time",sys.now() - time);
                    }
                })
                bg.position = new Vec3((i-midCol+0.5)*width, (midRow-j-0.5)*height, 0);
                // bg.setSiblingIndex(0); //设置层级
                this.bgLayer.addChild(bg);
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
        let g = this.lineLayer.getComponent(Graphics);
        this.lineLayer.active = false;
        for(let i=0;i<col;i++) {
            for(let j=0;j<row;j++) {
                let gridInfo = this.getGridInfo(i, j);
                if(!gridInfo || gridInfo.land) continue;
                let land = instantiate(this.landModel);
                this.landLayer.addChild(land);
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
        let building = instantiate(this.buildingModel);
        this.buildingLayer.addChild(building);
        let buildingModel = building.getComponent(BuildingModel);
        buildingModel.initData(startX, startY, buildingInfo.width, buildingInfo.path, false);
        this.setBuildingGrid(buildingModel, startX, startY);
    }
    // 初始化事件
    initEvent(){
        this.touchCanvas.node.on(Node.EventType.MOUSE_WHEEL, this.onMapMouseWheel, this);
        this.touchCanvas.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchCanvas.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchCanvas.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchCanvas.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        // CCUtil.onTouch(this.btnTest, this.onBtnTestClick, this);
        // CCUtil.onTouch(this.btnBackTest, this.onBtnBackTestClick, this);
        this._buildingBtnViewCloseHandle = EventManager.on(EventType.BuildingBtnView_Close, this.onBuildingBtnViewClose.bind(this));
    }
    // 移除事件
    removeEvent(){
        this.touchCanvas.node.off(Node.EventType.MOUSE_WHEEL);
        this.touchCanvas.node.off(Node.EventType.TOUCH_START);
        this.touchCanvas.node.off(Node.EventType.TOUCH_MOVE);
        this.touchCanvas.node.off(Node.EventType.TOUCH_END);
        this.touchCanvas.node.off(Node.EventType.TOUCH_CANCEL);

        // CCUtil.offTouch(this.btnTest, this.onBtnTestClick, this);
        // CCUtil.offTouch(this.btnTest, this.onBtnBackTestClick, this);
        EventManager.off(EventType.BuildingBtnView_Close, this._buildingBtnViewCloseHandle);
    }
    // 移除加载资源
    removeLoadAsset(){
        for(let i=0;i<this._loadAssetAry.length;i++){
            let asset = this._loadAssetAry[i];
            LoadManager.releaseAsset(asset);
        }
        this._loadAssetAry = [];
    }
    // 测试按钮点击事件
    onBtnTestClick(){
        this.getMapCtl().confirmEvent();
        // this.changeMapStatus(MapStatus.EDIT);
    }
    onBtnBackTestClick(){
        this.getMapCtl().cancelEvent();
        if(MapStatus.DEFAULT == this._mapStatus || MapStatus.EDIT == this._mapStatus){
            this.changeMapStatus(MapStatus.DEFAULT);
        }
        else {
            this.changeMapStatus(MapStatus.EDIT);
        }
    }
    // 滚轮事件
    onMapMouseWheel(e:EventMouse){
        this.getMapCtl().onMapMouseWheel(e);
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
        this.mapCamera.orthoHeight = this._cameraHeight;
        this._cameraRate = this._cameraHeight / this._uiCameraHeight;

        this.mapMove(0,0);//限制map位置
        // 摄像头缩放事件通知
        this.getMapCtl().onCameraScale(this._cameraRate);
        EventManager.emit(EventType.Map_Scale, this._cameraRate);
    }
    // 放大地图
    mapZoomIn(){
        this._cameraHeight -= this._cameraZoomVal;
        if(this._cameraHeight < this._cameraMinHeight){
            this._cameraHeight = this._cameraMinHeight;
            return;
        }
        this.mapCamera.orthoHeight = this._cameraHeight;
        this._cameraRate = this._cameraHeight / this._uiCameraHeight;
        // 摄像头缩放事件通知
        this.getMapCtl().onCameraScale(this._cameraRate);
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
        this.mapCamera.node.position = this._cameraPos;
    }
    // 点击开始
    onTouchStart(e:EventTouch){
        this.getMapCtl().onTouchStart(e);
    }
    // 点击移动
    onTouchMove(e:EventTouch){
        this.getMapCtl().onTouchMove(e);
    }
    // 点击结束
    onTouchEnd(e:EventTouch){
        this.getMapCtl().onTouchEnd(e);
    }
    // 点击取消
    onTouchCancel(e:EventTouch){
        this.getMapCtl().onTouchCancel(e);
    }
    // 销毁
    protected onDestroy(): void {
        this.removeEvent();
        this.removeLoadAsset();
    }
    // 建筑点击
    onBuildingClick(building:BuildingModel){
        if(!building) return;
        console.log("onBuildingClick",building);
        if(MapStatus.EDIT == this._mapStatus){
            this._buildingEditCtl.selectBuilding = building;
            this.changeMapStatus(MapStatus.BUILD_EDIT);
        }
    }
    // 建筑按钮界面关闭
    onBuildingBtnViewClose(){
        this.changeMapStatus(MapStatus.EDIT);
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
    // 场景状态切换
    changeMapStatus(status:MapStatus){
        let oldStatus = this._mapStatus;
        if(status == oldStatus) return;
        console.log("changeMapStatus",oldStatus, status);
        this.lineLayer.active = MapStatus.DEFAULT != status;
        let ctl = this.getMapCtl();
        ctl.clearData();
        this._mapStatus = status;
        EventManager.emit(EventType.MapStatus_Change,{oldStatus:oldStatus,status:status});
    }
    // 获取当前场景控制器
    getMapCtl(){
        if(MapStatus.DEFAULT == this._mapStatus){
            return this._mapNormalCtl;
        }
        if(MapStatus.EDIT == this._mapStatus){
            return this._mapEditCtl;
        }
        if(MapStatus.BUILD_EDIT == this._mapStatus){
            return this._buildingEditCtl;
        }
        if(MapStatus.LAND_EDIT == this._mapStatus){
            return this._landEditCtl;
        }
        if(MapStatus.RECYCLE == this._mapStatus){
            return this._recycleCtl;
        }
        return this._mapNormalCtl;
    }
    getMapCtlByStatus(status:MapStatus){
        if(MapStatus.DEFAULT == status){
            return this._mapNormalCtl;
        }
        if(MapStatus.EDIT == status){
            return this._mapEditCtl;
        }
        if(MapStatus.BUILD_EDIT == status){
            return this._buildingEditCtl;
        }
        if(MapStatus.LAND_EDIT == status){
            return this._landEditCtl;
        }
        if(MapStatus.RECYCLE == status){
            return this._recycleCtl;
        }
        return this._mapNormalCtl;
    }
}

