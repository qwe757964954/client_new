import { _decorator, Asset, Node, Component, Vec3, instantiate, Sprite, Prefab, SpriteFrame, Label, Color, Layers } from "cc";
import { GridModel } from "./GridModel";
import { LoadManager } from "../manager/LoadManager";
import { PrefabType } from "../config/PrefabType";
import { BuildingBtnView } from "../views/map/BuildingBtnView";
import EventManager from "../util/EventManager";
import { EventType } from "../config/EventType";
const { ccclass, property } = _decorator;

//建筑模型
@ccclass('BuildingModel')
export class BuildingModel extends Component {
    @property(Sprite)
    public building:Sprite = null;//建筑
    @property(Node)
    public btnView:Node = null;//建筑按钮界面节点
    @property(Label)
    public label:Label = null;//文本


    // y从上往下，x从右往左
    private _x:number;//x格子坐标
    private _y:number;//y格子坐标
    private _width:number;//宽
    // private _node:Node = null;//节点
    private _grids:GridModel[];//格子
    // private _nodePos:Vec3;//节点位置
    private _isFlip:boolean = false;//是否翻转
    private _isShow:boolean = false;//是否显示
    private _isNew:boolean = false;//是否是新建

    // private _dataX:number;//数据x
    // private _dataY:number;//数据y
    private _dataGrids:GridModel[];//数据格子
    private _dataIsFlip:boolean = false;//数据是否翻转
    private _dataIsShow:boolean = false;//数据是否显示
    private _loadAssetAry:Asset[] = [];//加载资源数组
    private _btnView:Node = null;//建筑按钮界面

    // private _mapScaleHandle:string//地图缩放事件句柄
    private _zIndex:number = 0;//层级

    // 初始化事件
    public initEvent() {
        // this._mapScaleHandle = EventManager.on(EventType.Map_Scale, this.onCameraScale.bind(this));//每个建筑都监听，效率太低了，同时只有一个建筑需要
    }
    // 销毁事件
    public destoryEvent() {
        // EventManager.off(EventType.Map_Scale, this._mapScaleHandle);
    }
    // 初始化数据
    initData(x:number, y:number, width:number, path:string, isFlip:boolean, isNew:boolean) {
        this._x = x;
        this._y = y;
        this._width = width;
        this.isFlip = isFlip;
        this._dataIsFlip = isFlip;
        this._isShow = true;
        this._dataIsShow = true;
        this._isNew = isNew;

        this.label.node.active = false;

        LoadManager.load(path, SpriteFrame).then((spriteFrame:SpriteFrame) => {
            this.building.spriteFrame = spriteFrame;
            this._loadAssetAry.push(spriteFrame);
        });

        this.initEvent();
    }
    // 销毁
    protected onDestroy(): void {
        this.destoryEvent();
        LoadManager.releaseAssets(this._loadAssetAry);
        this._loadAssetAry = [];
    }
    // 设置所占格子。清理以前老数据，设置新数据，更新节点位置
    public set grids(grids:GridModel[]) {
        // console.log("set grids",grids);
        if(!grids || grids.length != this._width*this._width){
            return;
        }
        this.recoverGrids();
        this._grids = grids;
        for (let i = 0; i < this._grids.length; i++) {
            this._grids[i].building = this;
        }
        let gridInfo = this._grids[0];
        this._x = gridInfo.x;
        this._y = gridInfo.y;
        let gridPos = gridInfo.pos;
        let pos = new Vec3(gridPos.x, gridPos.y - 0.5*this._width*gridInfo.height, 0);
        this.node.position = pos;
        // if(!this._dataGrids){
        //     this._dataGrids = this._grids;
        // }
        let index = this._x * this._y;
        this._zIndex = index;
        this.label.string = index.toString();
        this.refreshBtnView();
    }
    // public get grids():GridModel[] {
    //     return this._grids;
    // }
    get width():number {
        return this._width;
    }
    set isFlip(isFlip:boolean) {
        this._isFlip = isFlip;
        this.building.node.scale = new Vec3(isFlip ? -1 : 1, 1, 1);
    }
    get isFlip():boolean {
        return this._isFlip;
    }
    set isShow(isShow:boolean) {
        this._isShow = isShow;
        this.node.active = isShow;
    }
    set isNew(isNew:boolean) {
        this._isNew = isNew;
    }
    get ZIndex():number {
        return this._zIndex;
    }
    // 格子数据还原
    public recoverGrids() {
        // console.log("recoverGrids",this._grids);
        if(!this._grids) return;
        for (let i = 0; i < this._grids.length; i++) {
            // this._grids[i].building = null;
            this._grids[i].recoverData();
        }
    }
    // 格子数据保存
    public saveGrids() {
        if(this._grids){
            this._grids.forEach((grid:GridModel) => {
                grid.saveData();
            });
        }
        if(this._dataGrids){
            this._dataGrids.forEach((grid:GridModel) => {
                if(!this._grids.find(obj => obj === grid)){
                    grid.resetData();
                }
            });
        }
    }
    // 显示按钮界面
    public showBtnView(scale:number):void {
        this.node.setSiblingIndex(-1);//放到最高层
        this.building.color = new Color(255, 255, 255, 180);//半透明
        if(this._btnView){
            this._btnView.active = true;
            this.onCameraScale(scale);
            return;
        }
        LoadManager.loadPrefab(PrefabType.BuildingBtnView.path).then((prefab:Prefab) => {
            this._loadAssetAry.push(prefab);
            this._btnView = instantiate(prefab);
            let buildingBtnView = this._btnView.getComponent(BuildingBtnView);
            let funcs = [//信息、保存、卖出、反转、回收、还原
                null,
                this.saveData.bind(this),
                this.sell.bind(this),
                this.flip.bind(this),
                this.recycleBtnClick.bind(this),
                this.recover.bind(this),
            ];
            buildingBtnView.registerClickCallback(funcs);
            this.node.addChild(this._btnView);
            this.onCameraScale(scale);
            this.refreshBtnView();
        });
    }
    // 关闭按钮界面
    public closeBtnView():void {
        if(this._btnView && this._btnView.active){
            this.building.color = Color.WHITE;
            this._btnView.active = false;
            EventManager.emit(EventType.BuildingBtnView_Close);
            EventManager.emit(EventType.Building_Need_Sort);
        }
    }
    // 刷新按钮界面
    public refreshBtnView():void {
        if(!this._btnView || !this._btnView.active) return;
        let canSure = true;
        for (let i = 0; i < this._grids.length; i++) {
            if(!this._grids[i].isCanBuilding()){
                canSure = false;
                break;
            }
        }
        let buildingBtnView = this._btnView.getComponent(BuildingBtnView);
        buildingBtnView.btnSure.node.active = canSure;
        // buildingBtnView.btnSure.grayscale = !canSure;
    }
    // 还原数据
    public resetData():void {
        this.grids = this._dataGrids;
        this.isFlip = this._dataIsFlip;
        this.isShow = this._dataIsShow;
    }
    // 保存数据
    public saveData():void {
        // this._dataX = this._x;
        // this._dataY = this._y;
        this.saveGrids();//先还原原来格子数据，再保存现在格子数据
        this._dataGrids = this._grids;
        this._dataIsFlip = this._isFlip;
        this._dataIsShow = this._isShow;
        this._isNew = false;
        this.closeBtnView();
    }
    // 卖出
    public sell():void {
        // TODO
        this.recycle();//与回收差别?，如不能还原则需修改逻辑
    }
    // 翻转
    public flip():void {
        this.isFlip = !this.isFlip;
    }
    // 回收按钮点击
    public recycleBtnClick():void {
        this.recycle();
    }
    // protected onDisable(): void {
    //     console.log("onDisable");
    // }
    // protected onEnable(): void {
    //     console.log("onEnable");
    // }
    // 回收
    public recycle(){
        this.recoverGrids();
        this.isShow = false;
        this.saveData();
    }
    // 还原
    public recover(){
        this.resetData();
        this.closeBtnView();
        if(this._isNew){
            this.removeFromScene();
        }
    }
    // 还原数据（不通知按钮界面关闭事件）
    public recoverData():void {
        this.resetData();
        if(this._btnView && this._btnView.active){
            this._btnView.active = false;
        }
        if(this._isNew){
            this.removeFromScene();
        }
    }
    // 摄像头缩放事件
    public onCameraScale(rate:number):void {
        if(this._btnView){
            this._btnView.scale = new Vec3(rate, rate, 1);
        }
    }
    // 画面中移除
    public removeFromScene():void {
        this.isShow = false;
        EventManager.emit(EventType.BuidingModel_Remove, this);
    }
    // 从父节点移除(对象、资源暂未删除)
    public removeFromParent():void {
        this.node.parent = null;
    }
    // 添加到父节点
    public addToParent(parent:Node):void {
        this.node.parent = parent;
    }
    // 设置摄像头类型
    public setCameraType(type:number):void {
        this.node.layer = type;
    }
}