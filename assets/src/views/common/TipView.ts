import { _decorator, Component, Label, Node, RichText, UITransform } from 'cc';
import GlobalConfig from '../../GlobalConfig';
import { EffectUtil } from '../../util/EffectUtil';
import { TimerMgr } from '../../util/TimerMgr';

const { ccclass, property } = _decorator;

@ccclass('TipView')
export class TipView extends Component {
    @property(Node)
    public bg: Node = null;

    @property(Label)
    public label: Label = null;

    @property(RichText)
    public richText: RichText = null;

    private _callBack: (() => void) | null = null; // 回调函数

    /** 初始化视图 */
    init(content: string, isRichText: boolean = false, callBack?: () => void) {
        this._callBack = callBack;

        if (isRichText) {
            this.richText.node.active = true;
            this.label.node.active = false;
            this.richText.string = content;
            this.resetSizeByRichText();
        } else {
            this.richText.node.active = false;
            this.label.node.active = true;
            this.label.string = content;
            this.resetSize();
        }

        this.show();
    }

    /** 根据 RichText 更新背景大小 */
    private resetSizeByRichText() {
        this.updateWidth(this.richText.getComponent(UITransform).width);
    }

    /** 根据 Label 更新背景大小 */
    private resetSize() {
        this.updateWidth(this.label.getComponent(UITransform).width);
    }

    /** 更新背景宽度 */
    private updateWidth(contentWidth: number) {
        let width = contentWidth + 160;
        width = Math.min(width, GlobalConfig.WIN_SIZE.width - 200);
        width = Math.max(width, 400);
        this.bg.getComponent(UITransform).width = width;
    }

    /** 显示视图 */
    private show() {
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

    /** 销毁视图 */
    private dispose() {
        this.node.destroy();
    }
}
