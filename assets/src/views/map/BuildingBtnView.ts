import { _decorator, Component, Node, Sprite } from 'cc';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('BuildingBtnView')
export class BuildingBtnView extends Component {
    @property(Node)
    public btnInfo: Node = null;//信息按钮
    @property(Node)
    public btnSure: Node = null;//确定按钮
    @property(Node)
    public btnSell: Node = null;//卖出按钮
    @property(Node)
    public btnTurn: Node = null;//翻转按钮
    @property(Node)
    public btnBack: Node = null;//回收按钮
    @property(Node)
    public btnClose: Node = null;//关闭按钮
    @property(Node)
    public imgSureBg: Node = null;//确定按钮背景

    private _funcs: Function[] = [];//回调函数
    private _isCanSell: boolean = false;//是否可以卖出

    onLoad() {
        this.init();
        this.btnSell.active = false;
    }
    protected onDestroy(): void {
        this.removeEvent();
    }

    update(deltaTime: number) {

    }
    // 初始化
    init() {
        this.imgSureBg.active = false;
        this.initEvent();
    }
    // 初始化事件
    initEvent() {
        CCUtil.onTouch(this.btnInfo, this.onBtnInfoClick, this);
        CCUtil.onTouch(this.btnSure, this.onBtnSureClick, this);
        CCUtil.onTouch(this.btnSell, this.onBtnSellClick, this);
        CCUtil.onTouch(this.btnTurn, this.onBtnTurnClick, this);
        CCUtil.onTouch(this.btnBack, this.onBtnBackClick, this);
        CCUtil.onTouch(this.btnClose, this.onBtnCloseClick, this);
    }
    // 销毁事件
    removeEvent() {
        CCUtil.offTouch(this.btnInfo, this.onBtnInfoClick, this);
        CCUtil.offTouch(this.btnSure, this.onBtnSureClick, this);
        CCUtil.offTouch(this.btnSell, this.onBtnSellClick, this);
        CCUtil.offTouch(this.btnTurn, this.onBtnTurnClick, this);
        CCUtil.offTouch(this.btnBack, this.onBtnBackClick, this);
        CCUtil.offTouch(this.btnClose, this.onBtnCloseClick, this);
    }
    // 注册点击回调
    registerClickCallback(funcs: Function[]) {
        this._funcs = funcs;
    }
    // 点击信息按钮
    onBtnInfoClick() {
        this.onBtnClick(0);
    }
    // 点击确定按钮
    onBtnSureClick() {
        this.onBtnClick(1, this.imgSureBg.active);
    }
    // 点击卖出按钮
    onBtnSellClick() {
        this.onBtnClick(2, this._isCanSell);
    }
    // 点击翻转按钮
    onBtnTurnClick() {
        this.onBtnClick(3);
    }
    // 点击回收按钮
    onBtnBackClick() {
        this.onBtnClick(4);
    }
    // 点击关闭按钮
    onBtnCloseClick() {
        this.onBtnClick(5);
    }
    // 点击按钮
    onBtnClick(id: number, arg?: any) {
        if (this._funcs && this._funcs[id]) {
            this._funcs[id](arg);
        }
    }
    /**确定按钮状态 */
    set sureBtnStatus(state: boolean) {
        this.imgSureBg.active = state;
    }
    /**出售按钮状态 */
    set sellBtnStatus(state: boolean) {
        this._isCanSell = state;
        this.btnSell.getChildByName("Sprite").getComponent(Sprite).grayscale = !state;
    }
}


