import { _decorator, Component, Label, Node, UITransform } from 'cc';
import { EffectUtil } from '../../util/EffectUtil';
import { TimerMgr } from '../../util/TimerMgr';
import GlobalConfig from '../../GlobalConfig';
const { ccclass, property } = _decorator;

@ccclass('TipView')
export class TipView extends Component {
    @property(Node)
    public bg: Node = null;
    @property(Label)
    public label: Label = null;

    private _callBack: Function = null;//回调

    /**初始化 */
    init(content: string, callBack?: Function) {
        this.label.string = content;
        this._callBack = callBack;
        this.resetSize();
        this.show();
    }
    /** 动态调整大小 */
    resetSize() {
        this.label.updateRenderData();
        let width = this.label.getComponent(UITransform).width + 160;
        width = Math.min(width, GlobalConfig.WIN_SIZE.width - 200);
        width = Math.max(width, 400);
        this.bg.getComponent(UITransform).width = width;
    }
    /**显示 */
    show() {
        EffectUtil.fadingIn(this.bg);
        EffectUtil.centerPopup(this.bg, () => {
            TimerMgr.once(() => {
                EffectUtil.fadingOut(this.bg);
                EffectUtil.centerClose(this.bg, () => {
                    if (this._callBack) this._callBack();
                    this.dispose();
                });
            }, 1000);
        });
    }
    /**销毁 */
    dispose() {
        this.node.destroy();
    }
}


