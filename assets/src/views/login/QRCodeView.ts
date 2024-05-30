import { _decorator, Component, Node, Sprite } from 'cc';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('QRCodeView')
export class QRCodeView extends Component {
    @property(Node)
    public btnBack: Node = null;// 返回按钮
    @property(Sprite)
    public qrcode: Sprite = null;// 二维码

    private _backCall: Function = null;// 返回回调

    start() {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    /**初始化事件 */
    initEvent() {
        CCUtil.onTouch(this.btnBack, this.onBtnBackClick, this);
    }
    /** 移除事件 */
    removeEvent() {
        CCUtil.offTouch(this.btnBack, this.onBtnBackClick, this);
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
    /**设置返回回调 */
    setBackCall(callback: Function) {
        this._backCall = callback;
    }
}


