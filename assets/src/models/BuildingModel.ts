import { Color, Graphics, Label, Node, Rect, Sprite, UITransform, Vec2, Vec3, _decorator } from "cc";
import { EventType } from "../config/EventType";
import { PrefabType } from "../config/PrefabType";
import { TextConfig } from "../config/TextConfig";
import { DataMgr, EditInfo } from "../manager/DataMgr";
import { LoadManager } from "../manager/LoadManager";
import { ViewsManager } from "../manager/ViewsManager";
import { ServiceMgr } from "../net/ServiceManager";
import { BaseComponent } from "../script/BaseComponent";
import CCUtil from "../util/CCUtil";
import EventManager from "../util/EventManager";
import { ToolUtil } from "../util/ToolUtil";
import { BuildingBtnView } from "../views/map/BuildingBtnView";
import { BuildingInfoView } from "../views/map/BuildingInfoView";
import { GridModel } from "./GridModel";
const { ccclass, property } = _decorator;

//建筑模型
@ccclass('BuildingModel')
export class BuildingModel extends BaseComponent {
    @property(Sprite)
    public building: Sprite = null;//建筑
    @property(Node)
    public btnView: Node = null;//建筑按钮界面节点
    @property(Label)
    public label: Label = null;//文本
    @property(Graphics)
    public graphics: Graphics = null;//格子图层

    private _editInfo: EditInfo;//编辑信息
    private _buildingID: number = undefined;//建筑唯一索引id
    private _idx: number;//索引(前端使用)
    // y从上往下，x从右往左
    private _x: number;//x格子坐标
    private _y: number;//y格子坐标
    private _width: number;//宽
    private _grids: GridModel[];//格子
    private _isFlip: boolean = false;//是否翻转
    private _isShow: boolean = false;//是否显示
    private _isNew: boolean = false;//是否是新建

    // private _dataX:number;//数据x
    // private _dataY:number;//数据y
    private _dataGrids: GridModel[];//数据格子
    private _dataIsFlip: boolean = false;//数据是否翻转
    private _dataIsShow: boolean = false;//数据是否显示
    private _btnView: Node = null;//建筑按钮界面

    // private _mapScaleHandle:string//地图缩放事件句柄
    private _pos: Vec3 = new Vec3(0, 0, 0);//位置
    private _isFixImgPos: boolean = false;//是否固定图片位置
    private _isLoad: boolean = false;//是否加载图片

    // 初始化事件
    public initEvent() {
        // this._mapScaleHandle = EventManager.on(EventType.Map_Scale, this.onCameraScale.bind(this));//每个建筑都监听，效率太低了，同时只有一个建筑需要
    }
    // 销毁事件
    public destoryEvent() {
        // EventManager.off(EventType.Map_Scale, this._mapScaleHandle);
    }
    // 初始化数据
    initData(x: number, y: number, editInfo: EditInfo, isFlip: boolean, isNew: boolean) {
        // console.log("initData", x, y, editInfo, isFlip, isNew);
        this._idx = ToolUtil.getIdx();
        this._editInfo = editInfo;
        this._x = x;
        this._y = y;
        this._width = editInfo.width;
        this.isFlip = isFlip;
        this._dataIsFlip = isFlip;
        this._isShow = true;
        this._dataIsShow = true;
        this._isNew = isNew;

        this.label.node.active = false;
        this.graphics.node.active = false;

        // LoadManager.loadSprite(DataMgr.getEditPng(this._editInfo), this.building);

        this.initEvent();
        if (isNew) {
            this.show(true);
        }
    }
    set buildingID(id: number) {
        if (this._buildingID) return;
        this._buildingID = id;
    }
    get buildingID(): number {
        return this._buildingID;
    }
    get idx(): number {
        return this._idx;
    }
    get editInfo() {
        return this._editInfo;
    }
    // 销毁
    protected onDestroy(): void {
        this.destoryEvent();
    }
    // 设置所占格子。清理以前老数据，设置新数据，更新节点位置
    public set grids(grids: GridModel[]) {
        // console.log("set grids",grids);
        if (!grids || grids.length != this._width * this._width) {
            return;
        }
        this.recoverGrids();
        this._grids = grids;
        for (let i = 0; i < this._grids.length; i++) {
            this._grids[i].building = this;
            if (!this.isNew && !this._dataGrids) {//初始化已有建筑
                this._grids[i].saveData();
                // console.log("set grids saveData", i, this.isNew);
            }
        }
        let gridInfo = this._grids[0];
        this._x = gridInfo.x;
        this._y = gridInfo.y;
        let gridPos = gridInfo.pos;
        let pos = new Vec3(gridPos.x, gridPos.y - 0.5 * this._width * gridInfo.height, 0);
        this.pos = pos;
        if (!this._isFixImgPos) {
            this.building.node.position = new Vec3(0, -0.5 * this._width * gridInfo.height, 0);
            this._isFixImgPos = true;
        }
        if (!this.isNew && !this._dataGrids) {//初始化已有建筑
            this._dataGrids = this._grids;
            // console.log("set grids this._dataGrids");
        }
        let index = -pos.y;//(this._x + this._width*0.5) * (this._y + this._width*0.5);
        this._zIndex = index;
        this.label.string = index.toString();
        this.refreshBtnView();
        this.drawGridRect();
    }
    public get grids(): GridModel[] {
        return this._grids;
    }
    get width(): number {
        return this._width;
    }
    set isFlip(isFlip: boolean) {
        this._isFlip = isFlip;
        this.building.node.scale = new Vec3(isFlip ? -1 : 1, 1, 1);
    }
    get isFlip(): boolean {
        return this._isFlip;
    }
    set isShow(isShow: boolean) {
        this._isShow = isShow;
        this.node.active = isShow;
    }
    set isNew(isNew: boolean) {
        this._isNew = isNew;
    }
    get isNew(): boolean {
        return this._isNew;
    }
    public get pos(): Readonly<Vec3> {
        return this._pos;
    }
    public set pos(pos: Vec3) {
        this._pos = pos;
        this.node.position = pos;
    }
    // 格子数据还原
    public recoverGrids() {
        // console.log("recoverGrids",this._grids);
        if (!this._grids) return;
        for (let i = 0; i < this._grids.length; i++) {
            // this._grids[i].building = null;
            this._grids[i].recoverData();
        }
    }
    /**格子数据置空 */
    public resetGrids() {
        if (!this._grids) return;
        for (let i = 0; i < this._grids.length; i++) {
            this._grids[i].resetData();
        }
    }
    // 格子数据保存
    public saveGrids() {
        if (this._grids) {
            this._grids.forEach((grid: GridModel) => {
                grid.saveData();
            });
        }
        if (this._dataGrids) {
            this._dataGrids.forEach((grid: GridModel) => {
                if (!this._grids.find(obj => obj === grid)) {
                    grid.resetData();
                }
            });
        }
    }
    // 显示按钮界面
    public showBtnView(scale: number): void {
        this.topZIndex = true;
        this.node.setSiblingIndex(-1);//放到最高层
        this.graphics.node.active = true;//画图层显示
        this.building.color = new Color(255, 255, 255, 180);//半透明
        if (this._btnView) {
            this._btnView.active = true;
            this.onCameraScale(scale);
            return;
        }
        LoadManager.loadPrefab(PrefabType.BuildingBtnView.path, this.node).then((node: Node) => {
            this._btnView = node;
            this._btnView.position = new Vec3(0, 0.5 * this._width * this._grids[0].height, 0);
            let buildingBtnView = this._btnView.getComponent(BuildingBtnView);
            let funcs = [//信息、保存、卖出、反转、回收、还原
                this.showInfo.bind(this),
                this.reqSaveData.bind(this),
                this.reqSell.bind(this),
                this.flip.bind(this),
                this.recycleBtnClick.bind(this),
                this.recover.bind(this),
            ];
            buildingBtnView.sellBtnStatus = this._editInfo.sell > 0;
            buildingBtnView.registerClickCallback(funcs);
            this.onCameraScale(scale);
            this.refreshBtnView();
            this.drawGridRect();
        });
    }
    // 关闭按钮界面
    public closeBtnView(): void {
        if (this._btnView && this._btnView.active) {
            this.building.color = Color.WHITE;
            this._btnView.active = false;
            this.topZIndex = false;
            EventManager.emit(EventType.BuildingBtnView_Close);
            EventManager.emit(EventType.Building_Need_Sort);
        }
        this.graphics.node.active = false;
    }
    // 刷新按钮界面
    public refreshBtnView(): void {
        if (!this._btnView || !this._btnView.active) return;
        let canSure = true;
        for (let i = 0; i < this._grids.length; i++) {
            if (!this._grids[i].isCanBuilding()) {
                canSure = false;
                break;
            }
        }
        let buildingBtnView = this._btnView.getComponent(BuildingBtnView);
        buildingBtnView.sureBtnStatus = canSure;
    }
    // 还原数据
    public resetData(): void {
        this.grids = this._dataGrids;
        this.isFlip = this._dataIsFlip;
        this.isShow = this._dataIsShow;
    }
    /** 信息按钮 */
    public showInfo(): void {
        ViewsManager.instance.showView(PrefabType.BuildingInfoView, (node: Node) => {
            node.getComponent(BuildingInfoView).initData(this._editInfo);
        });
    }
    // 保存数据
    public saveData(status: boolean = true): void {
        if (!status) {
            ViewsManager.showTip(TextConfig.Building_Sure_Tip);
            return;
        }
        // this._dataX = this._x;
        // this._dataY = this._y;
        this.saveGrids();//先还原原来格子数据，再保存现在格子数据
        this._dataGrids = this._grids;
        this._dataIsFlip = this._isFlip;
        this._dataIsShow = this._isShow;
        this._isNew = false;
        this.closeBtnView();
    }
    /**请求保存 */
    public reqSaveData(status: boolean = true) {
        if (!status) {
            ViewsManager.showTip(TextConfig.Building_Sure_Tip);
            return;
        }
        if (this._buildingID) {
            ServiceMgr.buildingService.reqBuildingEdit(this._buildingID, this._x, this._y, this._isFlip);
        } else {
            ServiceMgr.buildingService.reqBuildingCreate(this._editInfo.id, this._x, this._y, this._idx, this._isFlip);
        }
    }
    // 卖出
    public sell(canCell: boolean): void {
        if (!canCell) {
            ViewsManager.showTip(TextConfig.Building_Cell_Tip);
            return;
        }
        this.recycle();//与回收差别?，如不能还原则需修改逻辑
    }
    /**请求卖出 */
    public reqSell(canCell: boolean) {
        if (!canCell) {
            ViewsManager.showTip(TextConfig.Building_Cell_Tip);
            return;
        }
    }
    // 翻转
    public flip(): void {
        this.isFlip = !this.isFlip;
    }
    // 回收按钮点击
    public recycleBtnClick(): void {
        this.recycle();
    }
    // 回收
    public recycle() {
        this.resetGrids();
        this.isShow = false;
        this.saveData();

        this.removeFromScene(true);
    }
    // 还原
    public recover() {
        this.resetData();
        this.closeBtnView();
        if (this._isNew) {
            this.removeFromScene(true);
        }
    }
    // 还原数据（不通知按钮界面关闭事件）
    public recoverData(): void {
        this.resetData();
        if (this._btnView && this._btnView.active) {
            this.building.color = Color.WHITE;
            this._btnView.active = false;
            this.topZIndex = false;
        }
        this.graphics.node.active = false;
        if (this._isNew) {
            this.removeFromScene(true);
        }
    }
    // 摄像头缩放事件
    public onCameraScale(rate: number): void {
        if (this._btnView) {
            this._btnView.scale = new Vec3(rate, rate, 1);
        }
    }
    // 画面中移除
    public removeFromScene(isDestory: boolean = false): void {
        this.isShow = false;
        EventManager.emit(EventType.BuidingModel_Remove, this);
        if (isDestory) {
            this.node.destroy();
        }
    }
    // 从父节点移除(对象、资源暂未删除)
    public removeFromParent(): void {
        this.node.parent = null;
    }
    // 添加到父节点
    public addToParent(parent: Node): void {
        this.node.parent = parent;
    }
    // 设置摄像头类型
    public setCameraType(type: number): void {
        this.node.layer = type;
        this.node.children.forEach(child => {
            child.layer = type;
        });
    }
    /**是否点击到自己 像素点击，可能会出现性能问题*/
    public isTouchSelf(worldPos: Vec3): boolean {
        let transform = this.building.getComponent(UITransform);
        let rect: Rect = new Rect(0, 0, transform.width, transform.height);
        rect.x = -transform.anchorX * transform.width;
        rect.y = -transform.anchorY * transform.height;
        let pos = transform.convertToNodeSpaceAR(worldPos);
        if (!rect.contains(new Vec2(pos.x, pos.y))) {
            return false;
        }
        // console.log("isTouchSelf 1:", pos.x, pos.y);
        let x = Math.floor(pos.x + transform.anchorX * transform.width);
        let y = Math.floor(pos.y + transform.anchorY * transform.height);
        // console.log("isTouchSelf 2:", x, y);
        let colors = CCUtil.readPixels(this.building.spriteFrame, x, y);
        return colors[3] >= 50;
    }
    /** 画格子区域 */
    public drawGridRect() {
        if (!this.graphics.node.active) return;
        let g = this.graphics;
        g.clear();
        let grids = this._grids;
        if (!grids || grids.length < 1) return;
        let pos0 = grids[0].pos.clone();
        pos0.y = pos0.y - 0.5 * this._width * grids[0].height;
        g.fillColor = new Color(99, 210, 198, 180);
        grids.forEach(grid => {
            if (grid.isCanBuilding()) return;
            let pos = grid.pos;
            let x = pos.x - pos0.x;
            let y = pos.y - pos0.y;
            g.moveTo(x, y);
            g.lineTo(x + 0.5 * grid.width, y - 0.5 * grid.height);
            g.lineTo(x, y - grid.height);
            g.lineTo(x - 0.5 * grid.width, y - 0.5 * grid.height);
        });
        g.fill();
    }
    /**显示与否 */
    public show(isShow: boolean, callBack?: Function) {
        this.node.active = isShow;
        if (isShow && !this._isLoad) {
            this._isLoad = true;
            LoadManager.loadSprite(DataMgr.getEditPng(this._editInfo), this.building).then(() => {
                if (callBack) callBack();
            });
        } else {
            if (callBack) callBack();
        }
    }
    /**获取显示范围 */
    public getRect() {
        let rect = this.building.getComponent(UITransform).getBoundingBox().clone();
        rect.x = this.pos.x + rect.x;
        rect.y = this.pos.y + rect.y;
        return rect;
    }
}