import { _decorator, Component, director, EditBox, Node } from 'cc';
import { SceneType } from '../../config/PrefabType';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('ActivationCodeView')
export class ActivationCodeView extends Component {
    @property(Node)
    public btnBack: Node = null;// 返回按钮
    @property(Node)
    public btnSure: Node = null;// 确认按钮
    @property(EditBox)
    public edit: EditBox = null;// 激活码输入框
    @property(Node)
    public btnNext: Node = null;// 跳过

    private _backCall: Function = null;// 返回回调
    private _sureCall: Function = null;// 确认回调

    start() {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    /**初始化事件 */
    initEvent() {
        CCUtil.onTouch(this.btnBack, this.onBtnBackClick, this);
        CCUtil.onTouch(this.btnSure, this.onBtnSureClick, this);
        CCUtil.onTouch(this.btnNext, this.onBtnNextClick, this);
    }
    /** 移除事件 */
    removeEvent() {
        CCUtil.offTouch(this.btnBack, this.onBtnBackClick, this);
        CCUtil.offTouch(this.btnSure, this.onBtnSureClick, this);
        CCUtil.offTouch(this.btnNext, this.onBtnNextClick, this);
    }
    protected onEnable(): void {

    }
    protected onDisable(): void {

    }
    /**返回点击 */
    onBtnBackClick() {
        if (this._backCall) {
            this._backCall();
        }
    }
    /**设置回调 */
    setCallFunc(backCall: Function, sureCall?: Function) {
        this._backCall = backCall;
        this._sureCall = sureCall;
    }
    /**确认点击 */
    onBtnSureClick() {
        if (this._sureCall) {
            this._sureCall(this.edit.string);
        }
    }
    /**跳过点击 */
    onBtnNextClick() {
        director.loadScene(SceneType.MainScene);
    }
}


