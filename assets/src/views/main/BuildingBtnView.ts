import { _decorator, Button, Component, Node, Sprite } from 'cc';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('BuildingBtnView')
export class BuildingBtnView extends Component {
    @property(Sprite)
    public btnInfo:Sprite = null;//信息按钮
    @property(Sprite)
    public btnSure:Sprite = null;//确定按钮
    @property(Sprite)
    public btnSell:Sprite = null;//卖出按钮
    @property(Sprite)
    public btnTurn:Sprite = null;//翻转按钮
    @property(Sprite)
    public btnBack:Sprite = null;//回收按钮
    @property(Sprite)
    public btnClose:Sprite = null;//关闭按钮

    private _funcs:Function[] = [];//回调函数

    start() {
        this.init();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }

    update(deltaTime: number) {
        
    }
    // 初始化
    init(){
        this.initEvent();
    }
    // 初始化事件
    initEvent(){
        CCUtil.onTouch(this.btnInfo, this.onBtnInfoClick, this);
        CCUtil.onTouch(this.btnSure, this.onBtnSureClick, this);
        CCUtil.onTouch(this.btnSell, this.onBtnSellClick, this);
        CCUtil.onTouch(this.btnTurn, this.onBtnTurnClick, this);
        CCUtil.onTouch(this.btnBack, this.onBtnBackClick, this);
        CCUtil.onTouch(this.btnClose, this.onBtnCloseClick, this);
    }
    // 销毁事件
    removeEvent(){
        CCUtil.offTouch(this.btnInfo, this.onBtnInfoClick, this);
        CCUtil.offTouch(this.btnSure, this.onBtnSureClick, this);
        CCUtil.offTouch(this.btnSell, this.onBtnSellClick, this);
        CCUtil.offTouch(this.btnTurn, this.onBtnTurnClick, this);
        CCUtil.offTouch(this.btnBack, this.onBtnBackClick, this);
        CCUtil.offTouch(this.btnClose, this.onBtnCloseClick, this);
    }
    // 注册点击回调
    registerClickCallback(funcs:Function[]){
        this._funcs = funcs;
    }
    // 点击信息按钮
    onBtnInfoClick(){
        this.onBtnClick(0);
    }
    // 点击确定按钮
    onBtnSureClick(){
        this.onBtnClick(1);    
    }
    // 点击卖出按钮
    onBtnSellClick(){
        this.onBtnClick(2);
    }
    // 点击翻转按钮
    onBtnTurnClick(){
        this.onBtnClick(3);
    }
    // 点击回收按钮
    onBtnBackClick(){
        this.onBtnClick(4);
    }
    // 点击关闭按钮
    onBtnCloseClick(){
        this.onBtnClick(5);
    }
    // 点击按钮
    onBtnClick(id){
        if(this._funcs && this._funcs[id]){
            this._funcs[id]();
        }
        if(0 == id || 3 == id) return;
        EventManager.emit(EventType.BuildingBtnView_Close);
        this.node.destroy();
    }
}


