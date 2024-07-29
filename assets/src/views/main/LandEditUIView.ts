import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { DataMgr, EditInfo } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import CCUtil from '../../util/CCUtil';
import { MainScene } from './MainScene';
const { ccclass, property } = _decorator;

@ccclass('LandEditUIView')
export class LandEditUIView extends Component {
    @property(Sprite)
    public btnSure: Sprite = null;//确定按钮
    @property(Sprite)
    public btnClose: Sprite = null;//关闭按钮
    @property(Sprite)
    public img: Sprite = null;//图片
    @property(Node)
    public plBaseColor: Node = null;//底格颜色开关
    @property(Sprite)
    public imgBaseColor: Sprite = null;//底格颜色图片
    @property(Sprite)
    public imgBaseColor2: Sprite = null;//底格颜色图片2
    @property([SpriteFrame])
    public spriteFramesBaseColor: SpriteFrame[] = [];//底格颜色图片资源

    private _mainScene: MainScene = null;//主场景
    private _isBaseColor: boolean = false;//底格颜色开关

    start() {
        this.initEvent();
    }
    //设置主场景
    public set mainScene(mainScene: MainScene) {
        this._mainScene = mainScene;
    }
    //销毁
    onDestroy() {
        this.removeEvent();
    }
    protected onEnable(): void {
        this._isBaseColor = false;
        this.showBtnBaseColor();
    }
    protected onDisable(): void {
        if (this._isBaseColor) {
            this._mainScene?.changeBaseColor(false);
        }
    }
    //初始化数据
    initData(landInfo: EditInfo) {
        LoadManager.loadSprite(DataMgr.getEditPng(landInfo), this.img);
    }
    //初始化事件
    initEvent() {
        CCUtil.onTouch(this.btnSure, this.onBtnSureClick, this);
        CCUtil.onTouch(this.btnClose, this.onBtnCloseClick, this);
        CCUtil.onTouch(this.plBaseColor, this.onBaseColorClick, this);
    }
    //移除事件
    removeEvent() {
        CCUtil.offTouch(this.btnSure, this.onBtnSureClick, this);
        CCUtil.offTouch(this.btnClose, this.onBtnCloseClick, this);
        CCUtil.offTouch(this.plBaseColor, this.onBaseColorClick, this);
    }
    //点击确定
    onBtnSureClick() {
        this._mainScene.confirmEvent();
    }
    //点击关闭
    onBtnCloseClick() {
        this._mainScene.cancelEvent();
    }
    /**底格颜色开关点击 */
    onBaseColorClick() {
        this._isBaseColor = !this._isBaseColor;
        this.showBtnBaseColor();
        this._mainScene?.changeBaseColor(this._isBaseColor);
    }
    /**底格颜色开关显示 */
    showBtnBaseColor() {
        if (this._isBaseColor) {
            this.imgBaseColor.spriteFrame = this.spriteFramesBaseColor[0];
            this.imgBaseColor2.spriteFrame = this.spriteFramesBaseColor[1];
        } else {
            this.imgBaseColor.spriteFrame = this.spriteFramesBaseColor[2];
            this.imgBaseColor2.spriteFrame = this.spriteFramesBaseColor[3];
        }
    }
}


