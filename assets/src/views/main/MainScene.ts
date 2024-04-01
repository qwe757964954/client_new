import { _decorator, Camera, Canvas, Component, EventMouse, EventTouch, instantiate, Label, Node, Prefab, screen, Sprite, SpriteFrame, sys, Texture2D, Vec2, Vec3, View } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import { ToolUtil } from '../../util/ToolUtil';
import GlobalConfig from '../../GlobalConfig';
import { MapConfig } from '../../config/MapConfig';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {
    @property(Prefab)
    public gridView:Prefab = null;//格子地图
    @property(Prefab)
    public landView:Prefab = null;//地块
    @property(Node)
    public bgLayer:Node = null;//背景层
    @property(Node)
    public landLayer:Node = null;//地块层
    @property(Node)
    public mapLayer:Node = null;//地图层
    @property(Camera)
    public mapCamera:Camera = null;//地图摄像机
    @property(Canvas)
    public uiCanvas:Canvas = null;//ui画布
    @property(Camera)
    public uiCamera:Camera = null;//ui摄像机

    private _uiCameraHeight:number;//ui摄像机高度
    private _cameraRate:number;//地图摄像机与UI的比例
    private _cameraHeight:number;//地图摄像机高度
    private _cameraPos:Vec3;//地图摄像机位置
    private _cameraZoomVal:number = 50;//地图摄像机缩放值
    private _cameraMinHeight:number = 200;//地图摄像机最小高度
    private _cameraMaxHeight:number = 1300;//地图摄像机最大高度

    private _mapMaxHeight:number = screen.windowSize.height;//地图最大高度
    private _mapMaxWidth:number = screen.windowSize.width;//地图最大宽度

    private _lastTouchPos:Vec2;//上一次触摸位置

    start() {
        this.initData();
        this.initEvent();
        this.initMap();
        this.initLand();
    }

    update(deltaTime: number) {
        
    }
    // 初始化数据
    initData(){
        this._cameraHeight = this.mapCamera.orthoHeight;
        this._cameraPos = this.mapCamera.node.position;
        this._uiCameraHeight = this.uiCamera.orthoHeight;
        this._cameraRate = this._cameraHeight / this._uiCameraHeight;
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
        for(let j=0;j<row;j++) {
            for(let i=0;i<col;i++) {
                let bg = instantiate(this.gridView);
                let id = j*col+i+1;
                let path = ToolUtil.replace(bgInfo.path, id);
                LoadManager.load(path, SpriteFrame).then((spriteFrame:SpriteFrame) => {
                    bg.getComponent(Sprite).spriteFrame = spriteFrame;
                    if(id == bgInfo.num){
                        console.log("use time",sys.now() - time);
                    }
                })
                bg.position = new Vec3((i-midCol+0.5)*width, (midRow-j-0.5)*height, 0);
                this.bgLayer.addChild(bg);
            }
        }
        this._mapMaxWidth = width*col;
        this._mapMaxHeight = height*row;
    }
    //初始化地块层
    initLand(){
        let landInfo = MapConfig.landInfo;
        let width = landInfo.width;
        let height = landInfo.height;
        let col = landInfo.col;
        let row = landInfo.row;
        LoadManager.load(landInfo.path, SpriteFrame).then((spriteFrame:SpriteFrame) => {
            let index = 1;
            for(let j=0;j<row;j++) {
                for(let i=0;i<col;i++) {
                    let land = instantiate(this.landView);
                    land.getComponent(Sprite).spriteFrame = spriteFrame;
                    // land.getChildByPath("Label").getComponent(Label).string = index.toString();
                    index++;
                    land.position = new Vec3((i-j)*0.5*width, (i+j - row)*0.5*height, 0);
                    this.landLayer.addChild(land);
                }
            }
        });
    }
    // 初始化事件
    initEvent(){
        this.uiCanvas.node.on(Node.EventType.MOUSE_WHEEL, this.onMapMouseWheel, this);
        this.uiCanvas.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.uiCanvas.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.uiCanvas.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.uiCanvas.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    // 移除事件
    removeEvent(){
        this.uiCanvas.node.off(Node.EventType.MOUSE_WHEEL);
        this.uiCanvas.node.off(Node.EventType.TOUCH_START);
        this.uiCanvas.node.off(Node.EventType.TOUCH_MOVE);
        this.uiCanvas.node.off(Node.EventType.TOUCH_END);
        this.uiCanvas.node.off(Node.EventType.TOUCH_CANCEL);
    }
    // 滚轮事件
    onMapMouseWheel(e:EventMouse){
        if(e.getScrollY()>0){
            this.mapZoomIn();
        }else{
            this.mapZoomOut();
        }
        // console.log("onMapZoom",this._cameraHeight);
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
    }
    // 移动地图
    mapMove(dtX:number, dtY:number){
        console.log("mapMove",dtX, dtY);
        this._cameraPos.x += dtX;
        this._cameraPos.y += dtY;
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
        this._cameraPos = this.mapCamera.node.position.clone();
        this._lastTouchPos = e.getUILocation();
    }
    // 点击移动
    onTouchMove(e:EventTouch){
        let touchPos = e.getUILocation();
        this.mapMove((this._lastTouchPos.x - touchPos.x)*this._cameraRate, (this._lastTouchPos.y - touchPos.y)*this._cameraRate);
        this._lastTouchPos = touchPos;
    }
    // 点击结束
    onTouchEnd(e:EventTouch){
        this._lastTouchPos = null;
    }
    // 点击取消
    onTouchCancel(e:EventTouch){
        this._lastTouchPos = null;
    }
    // 销毁
    protected onDestroy(): void {
        this.removeEvent();
    }
}

