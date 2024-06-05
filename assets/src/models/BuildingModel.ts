import { Color, Graphics, Label, Node, Rect, Sprite, UITransform, Vec2, Vec3, _decorator, sp } from "cc";
import { EventType } from "../config/EventType";
import { MapConfig } from "../config/MapConfig";
import { PrefabType } from "../config/PrefabType";
import { TextConfig } from "../config/TextConfig";
import { DataMgr, EditInfo, EditType } from "../manager/DataMgr";
import { LoadManager } from "../manager/LoadManager";
import { ViewsManager } from "../manager/ViewsManager";
import { ServiceMgr } from "../net/ServiceManager";
import { BaseComponent } from "../script/BaseComponent";
import CCUtil from "../util/CCUtil";
import EventManager from "../util/EventManager";
import { NodeUtil } from "../util/NodeUtil";
import { TimerMgr } from "../util/TimerMgr";
import { ToolUtil } from "../util/ToolUtil";
import { BuildingBtnView } from "../views/map/BuildingBtnView";
import { BuildingInfoView } from "../views/map/BuildingInfoView";
import { CountdownFrame } from "../views/map/CountdownFrame";
import { EditAnimView } from "../views/map/EditAnimView";
import { ProduceItemView } from "../views/map/ProduceItemView";
import { GridModel } from "./GridModel";
import { s2cBuildingListInfo } from "./NetModel";
const { ccclass, property } = _decorator;
export enum BuildingIDType {
    castle = 0,//城堡
    mine = 3,//矿山
}
/**回收数据 */
export class RecycleData {
    public bid: number;//建筑id
    public data: BuildingData;//建筑数据
}
/**建筑数据(服务端为准) */
class BuildingProduceData {
    type: number;//生产类型
    sec: number;//剩余时间(s)
    time: number;//生产完成时间(s)
}
export class BuildingData {
    public id: number;//建筑唯一索引id
    public level: number = 1;//建筑等级
    // TODO
    // 建筑当前状态（普通、生产中、生产完成、升级中、升级完成）
    public time: number = 0;//建筑时间
    public queueMaxCount: number = 5;//队列最大数量
    // 正在建造的队列（id，时间）
    public queue: BuildingProduceData[] = [];
}

const defaultSpAnim = ["animation", "idle"];

//建筑模型
@ccclass('BuildingModel')
export class BuildingModel extends BaseComponent {
    @property(Sprite)
    public building: Sprite = null;//建筑
    @property(Label)
    public label: Label = null;//文本
    @property(Graphics)
    public graphics: Graphics = null;//格子图层
    @property(sp.Skeleton)
    public sp: sp.Skeleton = null;//动画

    private _editInfo: EditInfo;//编辑信息
    private _buildingID: number = undefined;//建筑唯一索引id
    private _idx: number;//索引(前端使用)
    public buildingData: BuildingData = new BuildingData();//建筑数据
    // y从上往下，x从右往左
    private _x: number;//x格子坐标
    private _y: number;//y格子坐标
    private _width: number;//宽
    private _grids: GridModel[];//格子
    private _isFlip: boolean = false;//是否翻转
    private _isShow: boolean = false;//是否显示
    private _isNew: boolean = false;//是否是新建
    private _isRecycle: boolean = false;//是否是回收
    public isSell: boolean = false;//是否卖出

    // private _dataX:number;//数据x
    // private _dataY:number;//数据y
    private _dataGrids: GridModel[];//数据格子
    private _dataIsFlip: boolean = false;//数据是否翻转
    private _dataIsShow: boolean = false;//数据是否显示
    private _btnView: Node = null;//建筑按钮界面
    // private _btnViewShow: boolean = false;//建筑按钮界面是否显示
    private _longView: EditAnimView = null;//长按界面
    private _longViewShow: boolean = false;//长按界面是否显示
    private _countdownFrame: CountdownFrame = null;//倒计时界面
    private _countdownFrameShow: boolean = false;//倒计时界面是否显示
    private _produceItemView: ProduceItemView = null;//生产物品界面
    private _produceItemViewShow: boolean = false;//生产物品界面是否显示

    private _pos: Vec3 = new Vec3(0, 0, 0);//位置
    private _isFixImgPos: boolean = false;//是否固定图片位置
    private _isLoad: boolean = false;//是否加载图片
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
    protected onDestroy(): void {
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
        this._isRecycle = false;
        this.closeBtnView();
        this.closeLongView();
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
        this.isSell = true;
        this.recycle();//与回收差别?，如不能还原则需修改逻辑
    }
    /**请求卖出 */
    public reqSell(canCell: boolean) {
        if (!canCell) {
            ViewsManager.showTip(TextConfig.Building_Cell_Tip);
            return;
        }
        ServiceMgr.buildingService.reqBuildingSell(this._buildingID);
    }
    // 翻转
    public flip(): void {
        this.isFlip = !this.isFlip;
    }
    // 回收按钮点击
    public recycleBtnClick(): void {
        if (!this._isRecycle && this._buildingID) {
            ServiceMgr.buildingService.reqBuildingRecycle(this._buildingID);
        } else {
            this.recycle();
        }
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
        this.closeLongView();
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
        NodeUtil.setLayerRecursively(this.node, type);
    }
    /**是否点击到自己 像素点击，可能会出现性能问题*/
    public isTouchSelf(worldPos: Vec3): boolean {
        // if (this._editInfo.id != 30) return false;//争对某类建筑测试
        let transform = this.building.getComponent(UITransform);
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
        if (Sprite.SizeMode.TRIMMED == this.building.sizeMode) {
            let spriteFrame = this.building.spriteFrame;
            const size = spriteFrame.originalSize;
            const offset = spriteFrame.offset;
            x = x + offset.x + (size.width - rect.width) / 2;
            y = y + offset.y + (size.height - rect.height) / 2;
            // console.log("isTouchSelf 5:", x, y);
        }
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
                this._isLoadOver = true;
                if (callBack) callBack();
            });
            let animation = this._editInfo.animation;
            if (animation && animation.length > 0) {
                LoadManager.loadSpine(animation, this.sp).then(() => {
                    if (this.sp.findAnimation(defaultSpAnim[0])) {
                        this.sp.setAnimation(0, defaultSpAnim[0], true);
                    } else {
                        this.sp.setAnimation(0, defaultSpAnim[1], true);
                    }

                    if (this._editInfo.animpos) {
                        this.sp.node.position = this._editInfo.animpos;
                    } else {
                        let pos = this.building.node.position.clone();
                        pos.x = -16;
                        pos.y = - pos.y;
                        this.sp.node.position = pos;
                        console.log("pos", pos.x, pos.y);
                    }
                });
            }
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
    /**显示长按界面 */
    public showLongView(scale: number = 1.0) {
        this._longViewShow = true;
        if (this._longView) {
            this._longView.node.active = true;
            this._longView.node.scale = new Vec3(scale, scale, 1);
            this._longView.showAnim();
            return;
        }
        LoadManager.loadPrefab(PrefabType.EditAnimView.path, this.node).then((node: Node) => {
            let pos = new Vec3(this.building.node.position);
            pos.y += this.building.getComponent(UITransform).height;
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
        if (true) return;
        // TODO 判断本建筑是否需要显示逻辑
        this._countdownFrameShow = true;
        if (this._countdownFrame) {
            this._countdownFrame.node.active = true;
            return;
        }
        LoadManager.loadPrefab(PrefabType.CountdownFrame.path, this.node).then((node: Node) => {
            let height = this._grids ? this._grids[0]?.height : 0;
            node.position = new Vec3(0, -0.5 * this._width * height, 0);
            node.active = this._countdownFrameShow;
            this._countdownFrame = node.getComponent(CountdownFrame);
            this._countdownFrame.init(200);
        });
    }
    /**关闭倒计时 */
    public closeCountDownView() {
        this._countdownFrameShow = false;
        if (!this._countdownFrame) {
            return;
        }
        this._countdownFrame.node.active = this._countdownFrameShow;
    }
    /**添加生产队列 */
    public addProduct(type: number, sec: number) {
        let data = new BuildingProduceData;
        data.type = type;
        data.sec = sec;
        data.time = ToolUtil.now() + sec;
        this.buildingData.queue.push(data);
    }
    /**设置生产队列 */
    public setProducts(ary: { product_type: number, remaining_seconds: number }[]) {
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
        if (this._produceItemView) {
            this._produceItemView.node.active = true;
            this._produceItemView.init(this.getProduceImg());
            return;
        }
        LoadManager.loadPrefab(PrefabType.ProduceItemView.path, this.node).then((node: Node) => {
            let pos = new Vec3(this.building.node.position);
            pos.y += this.building.getComponent(UITransform).height;
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
        this.buildingData = data.data;
        this._isRecycle = true;
        if (EditType.Buiding == this._editInfo.type || EditType.LandmarkBuiding == this._editInfo.type) {
            this.checkProduce();
        }
    }
    /**消息对象转换成数据 */
    static getBuildingDataByMsg(msg: s2cBuildingListInfo) {
        let data = new BuildingData();
        data.id = msg.id;
        data.level = msg.level;
        let now = ToolUtil.now();
        msg.remaining_infos.forEach(element => {
            let tmpData = new BuildingProduceData();
            tmpData.type = element.product_type;
            tmpData.sec = element.remaining_seconds;
            tmpData.time = now + element.remaining_seconds;
            data.queue.push(tmpData);
        });
        return data;
    }
}