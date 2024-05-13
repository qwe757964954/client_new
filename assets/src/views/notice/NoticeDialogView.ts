import { _decorator, Component, Label, Node, Sprite } from 'cc';
import CCUtil from '../../util/CCUtil';
import { EffectUtil } from '../../util/EffectUtil';
const { ccclass, property } = _decorator;

@ccclass('NoticeDialogView')
export class NoticeDialogView extends Component {
    @property(Node)
    public content: Node = null;
    @property(Label)
    public txtNotice: Label = null;

    @property(Sprite)
    public btnClose: Sprite = null;

    private _canClose: boolean = false;

    // 初始化
    init(content: string) {
        this.txtNotice.string = content;
        //this._callBack = callBack;
        this.show();
    }

    //销毁
    dispose() {
        this.removeEvent();
        this.node.destroy();
    }
    // 初始化事件
    initEvent() {

        CCUtil.onTouch(this.btnClose, this.onBtnCloseClick, this);
    }
    // 移除监听
    removeEvent() {

        CCUtil.offTouch(this.btnClose, this.onBtnCloseClick, this);
    }

    // 显示界面
    show() {
        EffectUtil.centerPopup(this.content);
        setTimeout(() => {
            this._canClose = true;
        })
    }

    // 关闭按钮点击
    onBtnCloseClick() {
        if (!this._canClose) return;
        this._canClose = false;
        EffectUtil.centerClose(this.content, () => {
            //if (this._callBack) this._callBack();
            this.dispose();
        });
    }

    start() {
        this.initEvent();
    }

    update(deltaTime: number) {

    }
}


