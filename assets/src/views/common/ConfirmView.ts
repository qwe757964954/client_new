import { _decorator, Label, Node } from 'cc';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('ConfirmView')
export class ConfirmView extends BasePopup {
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

    protected initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("frame")]).then(()=>{
            this._cancelCall?.();
        });
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
    }
    // 确定按钮点击
    onSureClick() {
        this._sureCall?.();
        this.closePop();
    }
    // 关闭按钮点击
    onCancelClick() {
        this._cancelCall?.();
        this.closePop();
    }
}


