import { _decorator, Component, Label, Node } from 'cc';
import CCUtil from '../../util/CCUtil';
import { EffectUtil } from '../../util/EffectUtil';
const { ccclass, property } = _decorator;

@ccclass('ConfirmView')
export class ConfirmView extends Component {
    @property(Node)
    public bg: Node = null;
    @property(Label)
    public label: Label = null;//文字
    @property(Node)
    public btnSure: Node = null;//确认
    @property(Node)
    public btnCancel: Node = null;//取消

    private _sureCall: Function = null;
    private _cancelCall: Function = null;
    private _canClose: boolean = false;

    start() {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }

    initEvent() {
        CCUtil.onTouch(this.btnSure, this.onSureClick, this);
        CCUtil.onTouch(this.btnCancel, this.onCancelClick, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.btnSure, this.onSureClick, this);
        CCUtil.offTouch(this.btnCancel, this.onCancelClick, this);
    }

    init(content: string, sureCall?: Function, cancelCall?: Function) {
        this._sureCall = sureCall;
        this._cancelCall = cancelCall;
        this.label.string = content;
        this.show();
    }
    //销毁
    dispose() {
        this.removeEvent();
        this.node.destroy();
    }
    // 确定按钮点击
    onSureClick() {
        this.close(this._sureCall);
    }
    // 关闭按钮点击
    onCancelClick() {
        this.close(this._cancelCall);
    }
    // 显示界面
    show() {
        EffectUtil.centerPopup(this.bg, () => {
            this._canClose = true;
        });
    }
    /** 关闭界面 */
    close(callBack?: Function) {
        if (!this._canClose) return;
        this._canClose = false;
        EffectUtil.centerClose(this.bg, () => {
            if (callBack) callBack();
            this.dispose();
        });
    }
}


