import { _decorator, Component, Label, Node, Sprite } from 'cc';
import CCUtil from '../../util/CCUtil';
import { EffectUtil } from '../../util/EffectUtil';
const { ccclass, property } = _decorator;

@ccclass('PopView')
export class PopView extends Component {
    @property(Sprite)
    public bg: Sprite = null;
    @property(Label)
    public label: Label = null;
    @property(Sprite)
    public btnClose: Sprite = null;
    @property(Node)
    public btnSure: Node = null;
    @property(Label)
    public extraLabel: Label = null;//额外文字

    private _canClose: boolean = false;
    private _callBack: Function = null;//回调

    protected start(): void {
        this.initEvent();
    }
    // 初始化
    init(content: string, callBack?: Function) {
        this.label.string = content;
        this._callBack = callBack;
        this.show();
    }
    //销毁
    dispose() {
        this.removeEvent();
        this.node.destroy();
    }
    // 初始化事件
    initEvent() {
        CCUtil.onTouch(this, this.onBtnCloseClick, this);
        CCUtil.onTouch(this.btnClose, this.onBtnCloseClick, this);
        CCUtil.onTouch(this.btnSure, this.onBtnCloseClick, this);
    }
    // 移除监听
    removeEvent() {
        CCUtil.offTouch(this, this.onBtnCloseClick, this);
        CCUtil.offTouch(this.btnClose, this.onBtnCloseClick, this);
        CCUtil.offTouch(this.btnSure, this.onBtnCloseClick, this);
    }
    // 关闭按钮点击
    onBtnCloseClick() {
        if (!this._canClose) return;
        this._canClose = false;
        EffectUtil.centerClose(this.bg.node, () => {
            if (this._callBack) this._callBack();
            this.dispose();
        });
    }
    // 显示界面
    show() {
        EffectUtil.centerPopup(this.bg.node, () => {
            this._canClose = true;
        });
    }
    /** 显示额外文字 */
    showExtraLabel(content: string) {
        this.extraLabel.string = content;
        this.extraLabel.node.active = true;
    }
}


