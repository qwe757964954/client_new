import { _decorator, Component, Sprite } from 'cc';
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

    private _mainScene: MainScene = null;//主场景

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
        this.clearLoadAsset();
    }
    protected onDisable(): void {
        this.clearLoadAsset();
    }
    //清理资源
    clearLoadAsset() {
    }
    //初始化数据
    initData(landInfo: EditInfo) {
        LoadManager.loadSprite(DataMgr.getEditPng(landInfo), this.img);
    }
    //初始化事件
    initEvent() {
        CCUtil.onTouch(this.btnSure, this.onBtnSureClick, this);
        CCUtil.onTouch(this.btnClose, this.onBtnCloseClick, this);
    }
    //移除事件
    removeEvent() {
        CCUtil.offTouch(this.btnSure, this.onBtnSureClick, this);
        CCUtil.offTouch(this.btnClose, this.onBtnCloseClick, this);
    }
    //点击确定
    onBtnSureClick() {
        this._mainScene.confirmEvent();
    }
    //点击关闭
    onBtnCloseClick() {
        this._mainScene.cancelEvent();
    }
}

