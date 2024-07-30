import { _decorator, Component, Node } from 'cc';
import CCUtil from '../../util/CCUtil';
import { EffectUtil } from '../../util/EffectUtil';
const { ccclass, property } = _decorator;

@ccclass('CloudConditionView')
export class CloudConditionView extends Component {
    @property(Node)
    public btnClose: Node = null;//关闭
    @property(Node)
    public btnSure: Node = null;//确定
    @property(Node)
    public plCenter: Node = null;//中间

    private _canClose: boolean = false;
    private _sureCall: Function = null;

    protected onLoad(): void {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }

    initEvent() {
        CCUtil.onTouch(this.btnClose, this.onBtnCloseClick, this);
        CCUtil.onTouch(this.btnSure, this.onBtnSureClick, this);
    }
    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onBtnCloseClick, this);
        CCUtil.offTouch(this.btnSure, this.onBtnSureClick, this);
    }
    /**关闭按钮 */
    onBtnCloseClick() {
        if (!this._canClose) return;
        this._canClose = false;
        EffectUtil.centerClose(this.plCenter, () => {
            this.node.destroy();
        });
    }
    /**确定按钮 */
    onBtnSureClick() {
        if (!this._canClose) return;
        this._canClose = false;
        EffectUtil.centerClose(this.plCenter, () => {
            if (this._sureCall) this._sureCall();
            this.node.destroy();
        });
    }

    init(callBack: Function) {
        this._sureCall = callBack;
        this.show();
    }

    // 显示界面
    show() {
        EffectUtil.centerPopup(this.plCenter, () => {
            this._canClose = true;
        });
    }
}


