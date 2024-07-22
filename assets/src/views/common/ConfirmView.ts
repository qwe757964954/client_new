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
    @property(Label)
    public labelSure: Label = null;//确认文字
    @property(Label)
    public labelCancel: Label = null;//取消文字
    @property(Node)
    public btnClose: Node = null;//关闭

    private _sureCall: Function = null;
    private _cancelCall: Function = null;
    private _canClose: boolean = true;

    protected initUI(): void {

    }

    initEvent() {
        CCUtil.onTouch(this.btnSure, this.onSureClick, this);
        CCUtil.onTouch(this.btnCancel, this.onCancelClick, this);
        CCUtil.onTouch(this.btnClose, this.onCancelClick, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.btnSure, this.onSureClick, this);
        CCUtil.offTouch(this.btnCancel, this.onCancelClick, this);
        CCUtil.offTouch(this.btnClose, this.onCancelClick, this);
    }

    init(content: string, sureCall?: Function, cancelCall?: Function, sureStr?: string, cancelStr?: string, canClose: boolean = true) {
        this._sureCall = sureCall;
        this._cancelCall = cancelCall;
        this.label.string = content;
        this.labelSure.string = sureStr ? sureStr : "确定";
        this.labelCancel.string = cancelStr ? cancelStr : "取消";

        this._canClose = canClose;
        if (this._canClose) {
            this.enableClickBlankToClose([this.node.getChildByName("frame")]).then(() => {
                this._cancelCall?.();
            });
        }
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


