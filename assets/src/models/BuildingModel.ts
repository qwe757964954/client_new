import { Color, Graphics, Node, Rect, Sprite, UITransform, Vec2, Vec3, _decorator, sp } from "cc";
import { EventType } from "../config/EventType";
import { MapConfig } from "../config/MapConfig";
import { PrefabType } from "../config/PrefabType";
import { TextConfig } from "../config/TextConfig";
import { DataMgr, EditInfo, EditType } from "../manager/DataMgr";
import { LoadManager } from "../manager/LoadManager";
import { ViewsManager, ViewsMgr } from "../manager/ViewsManager";
import { ServiceMgr } from "../net/ServiceManager";
import CCUtil from "../util/CCUtil";
import EventManager, { EventMgr } from "../util/EventManager";
import ImgUtil from "../util/ImgUtil";
import { NodeUtil } from "../util/NodeUtil";
import { TimerMgr } from "../util/TimerMgr";
import { ToolUtil } from "../util/ToolUtil";
import { BuildingBtnView } from "../views/map/BuildingBtnView";
import { BuildingInfoView } from "../views/map/BuildingInfoView";
import { CountdownFrame } from "../views/map/CountdownFrame";
import { EditAnimView } from "../views/map/EditAnimView";
import { ProduceItemView } from "../views/map/ProduceItemView";
import { BaseModel } from "./BaseModel";
import { GridModel } from "./GridModel";
import { s2cBuildingListInfo } from "./NetModel";
const { ccclass, property } = _decorator;
export enum BuildingIDType {
    castle = 0,//城堡
    mine = 3,//矿山
}
/**建筑操作类型 */
export enum BuildingOperationType {
    edit = 1,//编辑
    sell = 2,//卖出
    recycle = 3,//回收
    recycleSell = 4,//回收中卖出
}
export enum BuildingState {
    // preBuilding = -1,//预建造
    normal = 0,//正常
    unBuilding = 1,//未建造
    building = 2,//建造中
    buildingOver = 3,//建造完成
    upgrade = 4,//升级中
    upgradeOver = 5,//升级完成
}
/**建筑操作数据 */
export class BuildingOperationData {
    public type: BuildingOperationType = null;//操作类型
    public buildingID: number;//建筑唯一索引id
    public idx: number;//索引(前端使用)
    public editInfo: EditInfo;//编辑数据
    public toLast: boolean = false;//是否回退
    public recycleData: RecycleData = null;//回收数据

    public x: number;//x坐标
    public y: number;//y坐标
    public isFlip: boolean = false;//是否翻转
    public grids: GridModel[] = null;//格子数据

    public dataX: number;//数据x坐标
    public dataY: number;//数据y坐标
    public dataIsFlip: boolean = false;//数据是否翻转
    public dataGrids: GridModel[] = null;//数据格子

    public reset() {
        this.type = null;
        this.buildingID = null;
        this.idx = null;
        this.editInfo = null;
        this.x = null;
        this.y = null;
        this.isFlip = null;
        this.grids = null;
        this.dataX = null;
        this.dataY = null;
        this.dataIsFlip = null;
        this.dataGrids = null;
    }
}

/**回收数据 */
export class RecycleData {
    public bid: number;//建筑id
    public data: BuildingData;//建筑数据
}
/**建筑生产数据(服务端为准) */
class BuildingTimeData {
    type: number;//生产类型
    sec: number;//剩余时间(s)
    time: number;//生产完成时间(s)
}
export class BuildingData {
    public id: number;//建筑唯一索引id
    public idx: number;//索引(前端使用)
    public level: number = 1;//建筑等级
    // 建筑当前状态（普通、建造中、建造完成、升级中、升级完成）
    public state: BuildingState = null;
    public time: number = 0;//建筑时间
    public queueMaxCount: number = 5;//队列最大数量
    // 正在建造的队列（id，时间）
    public queue: BuildingTimeData[] = [];
    public builtData: BuildingTimeData = null;//建造数据
    public upgradeData: BuildingTimeData = null;//升级数据
}

const defaultSpAnim = ["animation", "idle", "click"];

//建筑模型
export class BuildingModel extends BaseModel {
    private _building: Sprite = null;//建筑
    private _graphics: Graphics = null;//格子图层
    private _sp: sp.Skeleton = null;//动画
    private _fence: Node = null;//围栏

    private _editInfo: EditInfo;//编辑信息
    private _buildingID: number = undefined;//建筑唯一索引id
    private _idx: number;//索引(前端使用)
    public buildingData: BuildingData = new BuildingData();//建筑数据
    // y从上往下，x从右往左
    private _x: number;//x格子坐标
    private _y: number;//y格子坐标
    private _width: number;//宽
    private _height: number;//高
    private _grids: GridModel[];//格子
    private _isFlip: boolean = false;//是否翻转
    private _isShowEx: boolean = false;//是否显示
    private _isNew: boolean = false;//是否是新建
    private _isRecycle: boolean = false;//是否是回收
    public isSell: boolean = false;//是否卖出
    private _isRemove: boolean = false;//是否移除
    private _isShowBaseColor: boolean = false;//是否显示底格颜色
    private _isLoadFence: boolean = false;//是否加载围栏

    // private _dataX:number;//数据x
    // private _dataY:number;//数据y
    private _dataGrids: GridModel[];//数据格子
    private _dataIsFlip: boolean = false;//数据是否翻转
    private _dataIsShow: boolean = false;//数据是否显示
    private _btnView: Node = null;//建筑按钮界面
    private _btnViewShowScale: number = null;//建筑按钮界面显示scale
    private _longView: EditAnimView = null;//长按界面
    private _longViewShow: boolean = false;//长按界面是否显示
    private _countdownFrame: CountdownFrame = null;//倒计时界面
    private _countdownFrameLoad: boolean = false;//倒计时界面是否加载
    private _countdownFrameShow: boolean = false;//倒计时界面是否显示
    private _produceItemView: ProduceItemView = null;//生产物品界面
    private _produceItemViewShow: boolean = false;//生产物品界面是否显示
    private _uiNode: Node = null;//ui节点
    private _uiNodeShow: boolean = true;//ui节点是否显示
    private _builtSuccessView: Node = null;//建造完成界面
    private _upgradeSuccessView: Node = null;//升级完成界面

    private _isFixImgPos: boolean = false;//是否固定图片位置
    private _isLoadOver: boolean = false;//图片是否加载完成
    public isCanEdit: boolean = true;//是否可以编辑
    private _timer: number = null;//每秒定时器
    private _produceItemAry: number[] = [];//可以领取的生产物品类型

    // 初始化事件
    public initEvent() {
    }
    // 销毁事件
    public destoryEvent() {
    }
    // 初始化数据
    initData(x: number, y: number, editInfo: EditInfo, isFlip: boolean, isNew: boolean, idx: number) {
        // console.log("initData", x, y, editInfo, isFlip, isNew);
        this._idx = idx ? idx : ToolUtil.getIdx();
        this._editInfo = editInfo;
        this._x = x;
        this._y = y;
        this._width = editInfo.width;
        this._height = editInfo.height;
        this.isFlip = isFlip;
        this._dataIsFlip = isFlip;
        this._isShowEx = true;
        this._dataIsShow = true;
        this._isNew = isNew;
        this.buildingData.idx = this._idx;

        this.initEvent();
        if (isNew) {
            this.show(true);
        }
        /**是否是矿山，需特殊处理 */
        if (BuildingIDType.mine == editInfo.id) {
            this.isCanEdit = false;
            this.pos = new Vec3(MapConfig.minePos.x, MapConfig.minePos.y, 0);
        }
        this.clearTimer();
        if (EditType.Buiding == editInfo.type || EditType.LandmarkBuiding == editInfo.type) {
            this._timer = TimerMgr.loop(this.updateBySec.bind(this), 1000);
        }
    }
    set buildingState(state: BuildingState) {
        this.buildingData.state = state;

        this.refreshUIView();
        this.refreshBuildingShow();
    }
    get buildingState(): BuildingState {
        return this.buildingData.state;
    }
    set buildingLevel(level: number) {
        this.buildingData.level = level;
    }
    get buildingLevel(): number {
        return this.buildingData.level;
    }
    set buildingID(id: number) {
        if (this._buildingID) return;
        this._buildingID = id;
        this.buildingData.id = id;
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
    dispose(): void {
        this.destoryEvent();
        this.clearTimer();
        EventManager.emit(EventType.EditUIView_Refresh);
    }
    /**清理定时器 */
    public clearTimer() {
        if (this._timer) {
            TimerMgr.stopLoop(this._timer);
            this._timer = null;
        }
    }
    // 设置所占格子。清理以前老数据，设置新数据，更新节点位置
    public set grids(grids: GridModel[]) {
        // console.log("set grids",grids);
        if (!grids || grids.length != this._width * this._height) {
            return;
        }
        // this.recoverGrids();
        this._grids = grids;
        if (!this.isNew && !this._dataGrids) {//初始化已有建筑
            this.saveGrids();
        }
        // for (let i = 0; i < this._grids.length; i++) {
        //     this._grids[i].building = this;
        //     if (!this.isNew && !this._dataGrids) {//初始化已有建筑
        //         this._grids[i].saveData();
        //         // console.log("set grids saveData", i, this.isNew);
        //     }
        // }
        let gridInfo = this._grids[0];
        this._x = gridInfo.x;
        this._y = gridInfo.y;
        let gridPos = gridInfo.pos;
        let pos = new Vec3(gridPos.x, gridPos.y - 0.5 * this._height * gridInfo.height, 0);
        this.pos = pos;
        this.fixImgPos();
        if (!this.isNew && !this._dataGrids) {//初始化已有建筑
            this._dataGrids = this._grids;
            // console.log("set grids this._dataGrids");
        }
        let index = -pos.y;//(this._x + this._width*0.5) * (this._y + this._width*0.5);
        this._zIndex = index;
        this.refreshBtnView();
        this.drawGridRect();
    }
    public fixImgPos() {
        if (!this._isFixImgPos && this._building && this._grids) {
            let gridInfo = this._grids[0];
            let i = this.width / 2;
            let j = this.height / 2;
            // this._building.node.position = new Vec3((j - i) * 0.5 * gridInfo.width, -(i + j) * 0.5 * gridInfo.height, 0);
            this._building.node.position = new Vec3(0, -(i + j) * 0.5 * gridInfo.height, 0);
            // this.node.getChildByName("SpriteSplash").position = this._building.node.position;
            // this._building.node.position = new Vec3(0, -0.5 * this._width * gridInfo.height, 0);
            this._isFixImgPos = true;
        }
    }
    public get grids(): GridModel[] {
        return this._grids;
    }
    get width(): number {
        return this._width;
    }
    get height(): number {
        return this._height;
    }
    set isFlip(isFlip: boolean) {
        this._isFlip = isFlip;
        this.fixGridWidthAndHeight();
        if (this._building) {
            this._building.node.scale = new Vec3(isFlip ? -1 : 1, 1, 1);
            this._isFixImgPos = false;
            this.fixImgPos();
        }
    }
    get isFlip(): boolean {
        return this._isFlip;
    }
    set isShowEx(isShow: boolean) {
        this._isShowEx = isShow;
        if (this._node)
            this._node.active = isShow;
    }
    set isNew(isNew: boolean) {
        this._isNew = isNew;
    }
    get isNew(): boolean {
        return this._isNew;
    }
    get isRecycle(): boolean {
        return this._isRecycle;
    }
    public get pos(): Readonly<Vec3> {
        return this._pos;
    }
    public set pos(pos: Vec3) {
        this._pos = pos;
        if (this._node)
            this._node.position = pos;
    }
    public set isShowBaseColor(isShow: boolean) {
        this._isShowBaseColor = isShow;
        if (this._graphics) {
            this._graphics.node.active = isShow;
        }
        // if (!this._btnView || !this._btnView.active) {
        //     if (isShow) {
        //         if (this._fence) {
        //             this._fence.active = false;
        //         }
        //         if (this._building) {
        //             this._building.node.active = false;
        //         }
        //     } else {
        //         this.refreshBuildingShow();
        //     }
        // }
        this.refreshBuildingShow();
        this.drawGridRect();
    }
    // 格子数据还原
    // public recoverGrids() {
    //     // console.log("recoverGrids",this._grids);
    //     if (!this._grids) return;
    //     for (let i = 0; i < this._grids.length; i++) {
    //         // this._grids[i].building = null;
    //         this._grids[i].recoverData();
    //     }
    // }
    /**格子数据置空 */
    public resetGrids() {
        if (!this._grids) return;
        this._grids.forEach((grid: GridModel) => {
            if (grid.building == this) {
                grid.resetData();
            }
        });
        // for (let i = 0; i < this._grids.length; i++) {
        //     this._grids[i].resetData();
        // }
    }
    // 格子数据保存
    public saveGrids() {
        if (this._dataGrids) {
            this._dataGrids.forEach((grid: GridModel) => {
                if (grid.building == this) {
                    grid.resetData();
                }
            });
        }
        if (this._grids) {
            this._grids.forEach((grid: GridModel) => {
                grid.saveData(this);
            });
        }
        // if (this._dataGrids) {
        //     this._dataGrids.forEach((grid: GridModel) => {
        //         if (!this._grids.find(obj => obj === grid)) {
        //             grid.resetData();
        //         }
        //     });
        // }
    }
    // 显示按钮界面
    public showBtnView(scale: number): void {
        if (!this._node) {
            this._btnViewShowScale = scale;
            return;
        }
        this.topZIndex = true;
        this._node.setSiblingIndex(-1);//放到最高层
        this._graphics.node.active = true;//画图层显示
        this._building.color = new Color(255, 255, 255, 180);//半透明
        if (this._isShowBaseColor) {
            this._building.node.active = true;//建筑显示
        }
        if (this._btnView) {
            this._btnView.active = true;
            this.onCameraScale(scale);
            return;
        }
        LoadManager.loadPrefab(PrefabType.BuildingBtnView.path, this._node).then((node: Node) => {
            this._btnView = node;
            console.log("showBtnView", this._btnView);
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
            this._building.color = Color.WHITE;
            this._btnView.active = false;
            this.topZIndex = false;
            EventManager.emit(EventType.BuildingBtnView_Close);
            EventManager.emit(EventType.Building_Need_Sort);
        }
        if (this._isShowBaseColor) {
            this._building.node.active = false;
        } else {
            if (this._graphics) {
                this._graphics.node.active = false;
            }
        }
    }
    // 刷新按钮界面
    public refreshBtnView(): void {
        if (!this._btnView || !this._btnView.active) return;
        let canSure = true;
        for (let i = 0; i < this._grids.length; i++) {
            if (!this._grids[i].isCanBuilding(this)) {
                canSure = false;
                break;
            }
        }
        let buildingBtnView = this._btnView.getComponent(BuildingBtnView);
        buildingBtnView.sureBtnStatus = canSure;
    }
    // 还原数据
    public resetData(): void {
        this.isFlip = this._dataIsFlip;
        this.grids = this._dataGrids;
        this.isShowEx = this._dataIsShow;
    }
    /** 信息按钮 */
    public showInfo(): void {
        ViewsMgr.showView(PrefabType.BuildingInfoView, (node: Node) => {
            node.getComponent(BuildingInfoView).initData(this._editInfo);
        });
    }
    /**数据是否变化 */
    public isDataChange(): boolean {
        if (this.isNew) return true;
        if (this._isFlip != this._dataIsFlip) return true;
        if (this._isShowEx != this._dataIsShow) return true;
        if (this._grids && this._dataGrids) {
            for (let i = 0; i < this._grids.length; i++) {
                if (this._grids[i] != this._dataGrids[i]) return true;
            }
        }
        return false;
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
        this._dataIsShow = this._isShowEx;
        this._isNew = false;
        this._isRecycle = false;
        this.closeBtnView();
        this.closeLongView();
        this.refreshBuildingShow();
    }
    /**请求保存 */
    public reqSaveData(status: boolean = true) {
        if (!status) {
            ViewsManager.showTip(TextConfig.Building_Sure_Tip);
            // TODO 回收占位建筑recycle()
            return;
        }
        EventMgr.emit(EventType.Building_Save, this);
        // if (this._buildingID) {
        //     ServiceMgr.buildingService.reqBuildingEdit(this._buildingID, this._x, this._y, this._isFlip);
        // } else {
        //     ServiceMgr.buildingService.reqBuildingCreate(this._editInfo.id, this._x, this._y, this._idx, this._isFlip);
        // }
    }
    // 卖出
    public sell(canCell: boolean): void {
        if (!canCell) {
            ViewsManager.showTip(TextConfig.Building_Cell_Tip);
            return;
        }
        this.isSell = true;
        this.resetGrids();
        this.isShowEx = false;
        this.closeBtnView();
        this.closeLongView();
        this.removeFromScene();
    }
    /**请求卖出 */
    public reqSell(canCell: boolean) {
        if (!canCell) {
            ViewsManager.showTip(TextConfig.Building_Cell_Tip);
            return;
        }
        EventMgr.emit(EventType.Building_Sell, this);
        // if (this._buildingID) {
        //     ServiceMgr.buildingService.reqBuildingSell(this._buildingID);
        // } else {
        //     this.sell(true);
        // }
    }
    // 翻转
    public flip(): void {
        this.isFlip = !this.isFlip;
        EventMgr.emit(EventType.Building_Flipx, this);
    }
    // 回收按钮点击
    public recycleBtnClick() {
        if (this.buildingData.queue.length > 0) {
            ViewsMgr.showTip(TextConfig.Building_Recycle_Error1);
            return;
        }
        if (this.buildingData.queue.length > 0) {
            ViewsMgr.showTip(TextConfig.Building_Recycle_Error2);
            return;
        }
        EventMgr.emit(EventType.Building_Recycle, this);
    }
    // 回收
    public recycle() {
        this._isRecycle = true;
        EventMgr.emit(EventType.Building_RecycleEx, this);
        this.resetGrids();
        this.isShowEx = false;
        this.closeBtnView();
        this.closeLongView();
        this.removeFromScene();
    }
    // 还原
    public recover() {
        this.resetData();
        this.closeBtnView();
        this.closeLongView();
        if (this._isNew) {
            this.removeFromScene();
        }
    }
    // 还原数据（不通知按钮界面关闭事件）
    public recoverData(): void {
        this.resetData();
        if (this._btnView && this._btnView.active) {
            this._building.color = Color.WHITE;
            this._btnView.active = false;
            this.topZIndex = false;
        }
        if (!this._isShowBaseColor) {
            this._graphics.node.active = false;
        }
        if (this._isNew) {
            this.removeFromScene();
        }
    }
    // 摄像头缩放事件
    public onCameraScale(rate: number): void {
        if (this._btnView) {
            this._btnView.scale = new Vec3(rate, rate, 1);
        }
    }
    // 画面中移除
    public removeFromScene(): void {
        if (this._isRemove) return;
        this._isRemove = true;
        this.isShowEx = false;
        EventManager.emit(EventType.BuidingModel_Remove, this);
        if (this._node) {
            this._node.destroy();
        }
        this.dispose();
    }
    // 从父节点移除(对象、资源暂未删除)
    public removeFromParent(): void {
        this._parent = null;
        if (this._node)
            this._node.parent = null;
    }
    // 添加到父节点
    public addToParent(parent: Node): void {
        this._parent = parent;
        if (this._node)
            this._node.parent = parent;
    }
    // 设置摄像头类型
    public setCameraType(type: number): void {
        NodeUtil.setLayerRecursively(this._node, type);
    }
    /**是否点击到自己 像素点击，可能会出现性能问题*/
    public isTouchSelf(worldPos: Vec3): boolean {
        if (this._btnView && this._btnView.active) {
            let transform = this._btnView.getComponent(UITransform);
            let rect: Rect = new Rect(0, 0, transform.width, transform.height);
            rect.x = -transform.anchorX * transform.width;
            rect.y = -transform.anchorY * transform.height;
            let pos = transform.convertToNodeSpaceAR(worldPos);
            if (rect.contains(new Vec2(pos.x, pos.y))) {
                return true;
            }
        }
        // if (this._editInfo.id != 30) return false;//争对某类建筑测试
        let transform = this._building.getComponent(UITransform);
        let rect: Rect = new Rect(0, 0, transform.width, transform.height);
        rect.x = -transform.anchorX * transform.width;
        rect.y = -transform.anchorY * transform.height;
        let pos = transform.convertToNodeSpaceAR(worldPos);
        if (!rect.contains(new Vec2(pos.x, pos.y))) {
            // console.log("isTouchSelf 3:", pos.x, pos.y);
            // console.log("isTouchSelf 4:", rect.x, rect.y, rect.width, rect.height);
            return false;
        }
        // console.log("isTouchSelf 1:", pos.x, pos.y);
        // console.log("isTouchSelf transform:", transform.anchorX, transform.width, transform.anchorY, transform.height);
        let x = Math.floor(pos.x + transform.anchorX * transform.width);
        let y = Math.floor(pos.y + transform.anchorY * transform.height);
        // console.log("isTouchSelf 2:", x, y);
        if (Sprite.SizeMode.TRIMMED == this._building.sizeMode) {
            let spriteFrame = this._building.spriteFrame;
            const size = spriteFrame.originalSize;
            const offset = spriteFrame.offset;
            x = x + offset.x + (size.width - rect.width) / 2;
            y = y + offset.y + (size.height - rect.height) / 2;
            // console.log("isTouchSelf 5:", x, y);
        }
        // let spriteFrame = CaptureUtils.capture(this._building.node);
        // let colors = CCUtil.readPixels(spriteFrame, pos.x, pos.y);
        let colors = CCUtil.readPixel(this._building.spriteFrame, x, y);
        return colors[3] >= 50;
    }
    /** 画格子区域 */
    public drawGridRect() {
        if (!this._graphics || !this._graphics.node.active) return;
        let g = this._graphics;
        g.clear();
        let grids = this._grids;
        if (!grids || grids.length < 1) return;
        let pos0 = grids[0].pos.clone();
        pos0.y = pos0.y - 0.5 * this._height * grids[0].height;
        let isFill = false;
        grids.forEach(grid => {
            if (grid.isCanBuilding(this)) return;
            isFill = true;
            let pos = grid.pos;
            let x = pos.x - pos0.x;
            let y = pos.y - pos0.y;
            g.moveTo(x, y);
            g.lineTo(x + 0.5 * grid.width, y - 0.5 * grid.height);
            g.lineTo(x, y - grid.height);
            g.lineTo(x - 0.5 * grid.width, y - 0.5 * grid.height);
        });
        if (isFill) {
            g.fillColor = new Color(180, 0, 0, 180);
            g.fill();
        }
        if (!this._isShowBaseColor) return;
        isFill = false;
        grids.forEach(grid => {
            if (!grid.isCanBuilding(this)) return;
            isFill = true;
            let pos = grid.pos;
            let x = pos.x - pos0.x;
            let y = pos.y - pos0.y;
            g.moveTo(x, y);
            g.lineTo(x + 0.5 * grid.width, y - 0.5 * grid.height);
            g.lineTo(x, y - grid.height);
            g.lineTo(x - 0.5 * grid.width, y - 0.5 * grid.height);
        });
        if (isFill) {
            g.fillColor = new Color(this.editInfo.baseColor);
            g.fill();
        }
    }
    /**显示与否 */
    public show(isShow: boolean, callBack?: Function) {
        if (this._node) {
            this._node.active = isShow;
        }
        this._isShow = isShow;
        if (isShow && !this._isLoad) {
            this._isLoad = true;
            LoadManager.loadPrefab(PrefabType.BuildingModel.path, this._parent, true).then((node: Node) => {
                if (this._isRemove) {
                    if (callBack) callBack();
                    node.destroy();
                    return;
                }
                this._node = node;
                this._node.active = this._isShow;
                this._node.position = this._pos;
                this._building = this._node.getComponentInChildren(Sprite);
                this.isFlip = this._isFlip;
                this.fixImgPos();
                this._sp = this._node.getComponentInChildren(sp.Skeleton);
                this._graphics = this._node.getComponentInChildren(Graphics);
                this._graphics.node.active = false;
                this._fence = this._node.getChildByName("Fence");
                this._uiNode = this._node.getChildByName("UI");
                this._builtSuccessView = this._uiNode.getChildByName("img_right1");
                this._upgradeSuccessView = this._uiNode.getChildByName("img_right2");
                this.refreshUIView();
                this.refreshBuildingShow();

                LoadManager.loadSprite(DataMgr.getEditPng(this._editInfo), this._building, true).then(() => {
                    this._isLoadOver = true;
                    if (callBack) callBack();
                });
                let animation = this._editInfo.animation;
                if (animation && animation.length > 0) {
                    LoadManager.loadSpine(animation, this._sp).then(() => {
                        if (this._sp.findAnimation(defaultSpAnim[0])) {
                            this._sp.setAnimation(0, defaultSpAnim[0], true);
                        } else if (this._sp.findAnimation(defaultSpAnim[2])) {
                            this._sp.setAnimation(0, defaultSpAnim[2], true);
                        } else {
                            this._sp.setAnimation(0, defaultSpAnim[1], true);
                        }

                        if (this._editInfo.animpos) {
                            this._sp.node.position = this._editInfo.animpos;
                        } else {
                            let pos = this._building.node.position.clone();
                            pos.x = 32;
                            pos.y = 194;
                            this._sp.node.position = pos;
                            console.log("pos", pos.x, pos.y);
                        }
                    });
                }
                if (null != this._btnViewShowScale) {
                    this.showBtnView(this._btnViewShowScale);
                    this._btnViewShowScale = null;
                }
                EventManager.emit(EventType.Building_Need_Sort);
            });
        } else {
            if (callBack) callBack();
        }
    }
    /**获取显示范围 */
    public getRect() {
        let rect = new Rect(-350, 0, 700, 800);
        if (this._building) {
            rect = this._building.getComponent(UITransform).getBoundingBox().clone();
        }
        rect.x = this.pos.x + rect.x;
        rect.y = this.pos.y + rect.y;
        return rect;
    }
    /**显示长按界面 */
    public showLongView(scale: number = 1.0) {
        this._longViewShow = true;
        if (this._longView) {
            this._longView.node.active = true;
            this._longView.node.scale = new Vec3(scale, scale, 1);
            this._longView.showAnim();
            return;
        }
        LoadManager.loadPrefab(PrefabType.EditAnimView.path, this._node).then((node: Node) => {
            let pos = new Vec3(this._building.node.position);
            pos.y += this._building.getComponent(UITransform).height;
            this._longView = node.getComponent(EditAnimView);
            this._longView.showAnim();
            node.position = pos;
            node.scale = new Vec3(scale, scale, 1);
            node.active = this._longViewShow;
        });
    }
    /**关闭长按界面 */
    public closeLongView() {
        this._longViewShow = false;
        if (!this._longView) {
            return;
        }
        this._longView.node.active = this._longViewShow;
        this._longView.stopAnim();
    }
    /**显示倒计时 */
    public showCountDownView() {
        this._countdownFrameShow = true;
        // console.log("showCountDownView", this.editInfo.id, this.buildingState);
        if (BuildingState.building != this.buildingState && BuildingState.upgrade != this.buildingState) {
            this.closeCountDownView();
            return;
        }
        if (this._countdownFrame) {
            this._countdownFrame.node.active = true;
            this.setCountDown();
            return;
        }
        if (!this._node || this._countdownFrameLoad) return;
        this._countdownFrameLoad = true;
        LoadManager.loadPrefab(PrefabType.CountdownFrame.path, this._node).then((node: Node) => {
            let height = this._grids ? this._grids[0]?.height : 0;
            node.position = new Vec3(0, -0.5 * this._width * height, 0);
            node.active = this._countdownFrameShow;
            this._countdownFrame = node.getComponent(CountdownFrame);
            this.setCountDown();
        });
    }
    /**关闭倒计时 */
    public closeCountDownView() {
        this._countdownFrameShow = false;
        // console.log("closeCountDownView", this.editInfo.id, this.buildingState);
        if (!this._countdownFrame) {
            return;
        }
        this._countdownFrame.node.active = this._countdownFrameShow;
    }
    /**获取倒计时时间 */
    public getCountDownTime() {
        if (BuildingState.building != this.buildingState && BuildingState.upgrade != this.buildingState) {
            return 0;
        }
        let time = (BuildingState.building == this.buildingState) ? this.buildingData.builtData.time : this.buildingData.upgradeData.time;
        let sec = time - ToolUtil.now();
        return sec < 0 ? 0 : sec;
    }
    /**设置倒计时 */
    public setCountDown() {
        if (BuildingState.building != this.buildingState && BuildingState.upgrade != this.buildingState) {
            return;
        }
        let time = (BuildingState.building == this.buildingState) ? this.buildingData.builtData.time : this.buildingData.upgradeData.time;
        let sec = time - ToolUtil.now();
        if (sec <= 0) {//如果显示时间小于0，更新建筑状态
            ServiceMgr.buildingService.reqBuildingInfoGet(this.buildingID);
            return;
        }
        if (this._countdownFrame) {
            this._countdownFrame.init(sec, () => {
                let str = BuildingState.building == this.buildingState ? TextConfig.Speed_Words_Tip1 : TextConfig.Speed_Words_Tip2;
                ViewsMgr.showConfirm(str, () => {
                    ServiceMgr.buildingService.reqSpeedWordsGet(this.buildingID);
                });
            }, () => {
                ServiceMgr.buildingService.reqBuildingInfoGet(this.buildingID);
            });
        }
    }
    /**显示建筑成功UI */
    public showBuiltSuccessUI() {
        if (BuildingState.buildingOver != this.buildingState) {
            this.hideBuiltSuccessUI();
            return;
        }
        if (!this._builtSuccessView || !this._uiNode) return;
        this._builtSuccessView.active = true;
    }
    /**显示升级成功UI */
    public showUpgradeSuccessUI() {
        if (BuildingState.upgradeOver != this.buildingState) {
            this.hideUpgradeSuccessUI();
            return;
        }
        if (!this._upgradeSuccessView || !this._uiNode) return;
        this._upgradeSuccessView.active = true;
    }
    /**隐藏建筑成功UI */
    public hideBuiltSuccessUI() {
        if (!this._builtSuccessView) return;
        this._builtSuccessView.active = false;
    }
    /**隐藏升级成功UI */
    public hideUpgradeSuccessUI() {
        if (!this._upgradeSuccessView) return;
        this._upgradeSuccessView.active = false;
    }
    /**显示UI */
    public showUIView() {
        this._uiNodeShow = true;
        this.refreshUIView();
    }
    /**更新UI */
    public refreshUIView() {
        // console.log("refreshUIView", this.editInfo.id, this._uiNodeShow, this.buildingState);
        if (this._uiNodeShow) {
            this.showCountDownView();
            this.showBuiltSuccessUI();
            this.showUpgradeSuccessUI();
            this.showProduces();
        } else {
            this.closeCountDownView();
            this.hideBuiltSuccessUI();
            this.hideUpgradeSuccessUI();
            this.hideProduces();
        }
    }
    /**更新建筑显示 */
    public refreshBuildingShow() {
        if (BuildingState.unBuilding == this.buildingState || BuildingState.building == this.buildingState) {
            if (this.isNew) {
                this.showFence(false);
                if (this._building) {
                    this._building.node.active = true;
                }
            } else {
                this.showFence(true);
                if (this._building) {
                    this._building.node.active = false;
                }
            }
        } else {
            this.showFence(false);
            if (this._building) {
                this._building.node.active = true;
            }
        }

        if (!this._btnView || !this._btnView.active) {
            if (this._isShowBaseColor) {
                if (this._fence) {
                    this._fence.active = false;
                }
                if (this._building && this.isCanEdit) {
                    this._building.node.active = false;
                }
            }
        }
    }
    /**隐藏UI */
    public hideUIView() {
        this._uiNodeShow = false;
        this.refreshUIView();
    }
    /**添加生产队列 */
    public addProduct(type: number, sec: number) {
        let data = new BuildingTimeData;
        data.type = type;
        data.sec = sec;
        data.time = ToolUtil.now() + sec;
        this.buildingData.queue.push(data);
    }
    /**设置生产队列 */
    public setProducts(ary: { product_type: number, remaining_seconds: number }[]) {
        if (!ary) return;
        this.clearProduct();
        ary.forEach(element => {
            this.addProduct(element.product_type, element.remaining_seconds);
        });
        if (EditType.Buiding == this._editInfo.type || EditType.LandmarkBuiding == this._editInfo.type) {
            this.checkProduce();
        }
    }
    /**清理生产队列 */
    public clearProduct() {
        this.buildingData.queue = [];
        this._produceItemAry = [];
    }
    /**设置建造数据 */
    public setBuiltData(remaining_seconds: number) {
        if (null == remaining_seconds) return;
        let builtData = this.buildingData.builtData;
        if (!builtData) {
            builtData = new BuildingTimeData();
            this.buildingData.builtData = builtData;
        }
        builtData.sec = remaining_seconds;
        builtData.time = ToolUtil.now() + remaining_seconds;
        // this.setCountDown();
    }
    /**设置升级数据 */
    public setUpgradeData(remaining_seconds: number) {
        if (null == remaining_seconds) return;
        let upgradeData = this.buildingData.upgradeData;
        if (!upgradeData) {
            upgradeData = new BuildingTimeData();
            this.buildingData.upgradeData = upgradeData;
        }
        upgradeData.sec = remaining_seconds;
        upgradeData.time = ToolUtil.now() + remaining_seconds;
        // this.setCountDown();
    }
    /**每秒刷新 */
    public updateBySec() {
        this.checkProduce();
    }
    /**检测生产物品 */
    public checkProduce() {
        if (!this._isLoadOver) return;
        let ary = [];
        let now = ToolUtil.now();
        this.buildingData.queue.forEach(element => {
            if (element.time <= now) {
                ary.push(element.type);
            }
        });
        if (ary.length <= 0) {
            this.hideProduces();
            return;
        }
        if (ToolUtil.arrayIsChange(this._produceItemAry, ary)) {
            this._produceItemAry = ary;
            this.showProduces();
        }
    }
    /**检测生产物品是否在生产中 */
    public checkIsProducing(product_num: number) {
        if (product_num >= this.buildingData.queue.length) return false;
        let data = this.buildingData.queue[product_num];
        if (data.time <= ToolUtil.now()) {
            return false;
        }
        return true;
    }
    /**领取生产物品 */
    public getProduce() {
        if (this.buildingData.queue.length == 0) return false;
        let canGet = false;
        let now = ToolUtil.now();
        for (let i = 0; i < this.buildingData.queue.length; i++) {
            const element = this.buildingData.queue[i];
            if (element.time <= now) {
                canGet = true;
                break;
            }
        }
        if (canGet) {
            ServiceMgr.buildingService.reqBuildingProduceGet(this._buildingID);
        }
        return canGet;
    }
    /**获取生产物品图片 */
    public getProduceImg() {
        let produceInfo = DataMgr.instance.buildProduceInfo[this._editInfo.id];
        let ary = [];
        this._produceItemAry.forEach(type => {
            let info = produceInfo.data[type];
            ary.push(info.res_png);
        })
        return ary;
    }
    /**显示生产物品 */
    public showProduces() {
        this._produceItemViewShow = true;
        if (this._produceItemAry.length <= 0) return;
        if (this._produceItemView) {
            this._produceItemView.node.active = true;
            this._produceItemView.init(this.getProduceImg());
            return;
        }
        if (!this._isLoadOver) return;
        LoadManager.loadPrefab(PrefabType.ProduceItemView.path, this._node).then((node: Node) => {
            let pos = new Vec3(this._building.node.position);
            pos.y += this._building.getComponent(UITransform).height;
            node.position = pos;
            this._produceItemView = node.getComponent(ProduceItemView);
            this._produceItemView.node.active = this._produceItemViewShow;
            if (this._produceItemViewShow) {
                this._produceItemView.init(this.getProduceImg());
            }
        });
    }
    /**隐藏生产物品 */
    public hideProduces() {
        if (!this._produceItemViewShow) return;
        this._produceItemViewShow = false;
        if (!this._produceItemView) {
            return;
        }
        this._produceItemView.node.active = this._produceItemViewShow;
    }
    /**获取生产物品时间 */
    public getProduceLeftTime(product_num: number) {
        if (product_num >= this.buildingData.queue.length) return 0;
        let data = this.buildingData.queue[product_num];
        let sec = data.time - ToolUtil.now();
        return sec > 0 ? sec : 0;
    }
    /**获取回收数据 */
    public getRecycleData() {
        let data = new RecycleData();
        data.bid = this._editInfo.id;
        data.data = this.buildingData;
        return data;
    }
    /**从回收数据还原 */
    public restoreRecycleData(data: RecycleData) {
        console.log("restoreRecycleData", data, this._buildingID, this._editInfo.id);
        if (this._buildingID || data.bid != this._editInfo.id) return;
        this.buildingID = data.data.id;
        this._idx = data.data.idx;
        this.buildingData = data.data;
        if (EditType.Buiding == this._editInfo.type || EditType.LandmarkBuiding == this._editInfo.type) {
            this.checkProduce();
        }
    }
    /**消息对象转换成数据 */
    static getBuildingDataByMsg(msg: s2cBuildingListInfo) {
        let data = new BuildingData();
        data.id = msg.id;
        data.idx = ToolUtil.getIdx();
        data.level = msg.level;
        data.state = msg.status;
        let now = ToolUtil.now();
        msg.product_infos.forEach(element => {
            let tmpData = new BuildingTimeData();
            tmpData.type = element.product_type;
            tmpData.sec = element.remaining_seconds;
            tmpData.time = now + element.remaining_seconds;
            data.queue.push(tmpData);
        });
        if (msg.construct_infos) {
            let tmpData = new BuildingTimeData();
            tmpData.sec = msg.construct_infos.remaining_seconds;
            tmpData.time = now + msg.construct_infos.remaining_seconds;
            data.builtData = tmpData;
        }
        if (msg.upgrade_infos) {
            let tmpData = new BuildingTimeData();
            tmpData.sec = msg.upgrade_infos.remaining_seconds;
            tmpData.time = now + msg.upgrade_infos.remaining_seconds;
            data.upgradeData = tmpData;
        }
        return data;
    }
    /**调整宽高 */
    public fixGridWidthAndHeight() {
        this._width = this._isFlip ? this._editInfo.height : this._editInfo.width;
        this._height = this._isFlip ? this._editInfo.width : this._editInfo.height;
    }
    /**操作数据 */
    public getOperationData(type: BuildingOperationType) {
        let data = new BuildingOperationData();
        data.type = type;
        data.buildingID = this._buildingID;
        data.idx = this._idx;
        data.editInfo = this._editInfo;
        data.x = this._x;
        data.y = this._y;
        data.isFlip = this._isFlip;
        data.grids = this._grids.concat();
        data.dataIsFlip = this._dataIsFlip;
        if (this._dataGrids) {
            let grid = this._dataGrids[0];
            if (grid) {
                data.dataX = grid.x;
                data.dataY = grid.y;
            }
            data.dataGrids = this._dataGrids.concat();
        }
        return data;
    }
    /**从操作数据还原 */
    public restoreOperationData(data: BuildingOperationData) {
        console.log("BuildingModel restoreOperationData", this._buildingID, this._idx);
        if (data.grids) {
            this.grids = data.grids;
            this.isFlip = data.isFlip;
            this.saveData();
        } else {
            this.isSell = BuildingOperationType.sell == data.type;
            this.resetGrids();
            this.isShowEx = false;
            this.removeFromScene();
        }
        // if (EditType.Buiding == this._editInfo.type || EditType.LandmarkBuiding == this._editInfo.type) {
        //     this.checkProduce();
        // }
    }
    /**显示围栏 */
    public showFence(isShow: boolean) {
        if (!this._fence) return;
        this._fence.active = isShow;
        if (this._isLoadFence) return;
        let grids = this._grids;
        if (!grids || grids.length < 1) return;
        let pos0 = grids[0].pos.clone();
        pos0.y = pos0.y - 0.5 * this._height * grids[0].height;
        let maxi = this._width - 1;
        let maxj = this._height - 1;
        let node1 = this._fence.getChildByName("Node1");
        let node2 = this._fence.getChildByName("Node2");
        let node3 = this._fence.getChildByName("Node3");
        let fenceConfig = MapConfig.fence;
        for (let i = 0; i <= maxi; i++) {
            for (let j = 0; j <= maxj; j++) {
                let grid = grids[i * this._height + j];
                let pos = grid.pos;
                let x = pos.x - pos0.x;
                let y = pos.y - pos0.y;

                let land = ImgUtil.create_Sprite();
                let node = land.node;
                node.position = new Vec3(x, y - grid.height * 0.5, 0);
                node3.addChild(node);
                LoadManager.loadSprite(fenceConfig.land, land);

                if (i != 0 && i != maxi && j != 0 && j != maxj) continue;

                let sprite = ImgUtil.create_Sprite();
                node = sprite.node;
                node.position = new Vec3(x, y, 0);
                node2.addChild(node);
                LoadManager.loadSprite(fenceConfig.pillar, sprite);

                // if (i == maxi && j == maxj) continue;

                let line = ImgUtil.create_Sprite();
                node = line.node;
                node1.addChild(node);
                LoadManager.loadSprite(fenceConfig.line, line);

                if (0 == i && j != maxj) {
                    node.position = new Vec3(x + grid.width * 0.25, y - grid.height * 0.25, 0);
                } else if (0 == j && 0 != i) {
                    node.scale = new Vec3(-1, 1, 1);
                    node.position = new Vec3(x + grid.width * 0.25, y + grid.height * 0.25, 0);
                } else if (i == maxi && 0 != j) {
                    node.position = new Vec3(x - grid.width * 0.25, y + grid.height * 0.25, 0);
                } else if (maxj == j && i != maxi) {
                    node.scale = new Vec3(-1, 1, 1);
                    node.position = new Vec3(x - grid.width * 0.25, y - grid.height * 0.25, 0);
                }
            }
        }
    }
}