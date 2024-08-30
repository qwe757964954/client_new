import { _decorator, Component, Node, Sprite, SpriteFrame, Texture2D } from 'cc';
import CCUtil from '../../util/CCUtil';
import { WxApi } from '../../util/third/WxApi';
import { ToolUtil } from '../../util/ToolUtil';
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
        WxApi.wxLoginQrcode((code) => {
            console.log("wxLogin 1:", code);
        }, (data: string) => {
            let img = new Image();
            img.onload = () => {
                let texture = new Texture2D();
                texture.reset({
                    width: img.width,
                    height: img.height
                });
                texture.uploadData(img, 0, 0);
                let sp = new SpriteFrame();
                sp.texture = texture;
                this.qrcode.spriteFrame = sp;
                CCUtil.fixNodeScale(this.qrcode.node, 300, 300);
            };
            img.src = ToolUtil.imgBase64(data);
        });
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


