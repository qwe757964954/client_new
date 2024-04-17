import { _decorator, Button, Component, Node, RichText } from 'cc';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('BaseRemindView')
export class BaseRemindView extends Component {


    @property({ type: RichText, tooltip: "文本内容" })
    public content: RichText = null;
    @property({ type: Button, tooltip: "确定按钮" })
    public btn_determine: Button = null;
    @property({ type: Button, tooltip: "取消按钮" })
    public btn_cancel: Button = null;

    start() {

    }
    protected onLoad(): void {
        this.initEvent()
    }
    /**初始化监听事件 */
    initEvent() {
        CCUtil.onTouch(this.btn_cancel, this.oncancel, this)
        CCUtil.onTouch(this.btn_determine, this.ondetermine, this)
    }
    /**取消回调 */
    private oncancel() {
        if (this.fun2 && this.fun1) {
            this.fun2()
        }

    }
    /**确认按钮回调 */
    private ondetermine() {
        if (this.fun1) {
            this.fun1()
            this.fun2()
        }
    }
    /**初始化方法
     * @param str 文本内容<富文本>
     * @param fun1 确认回调
     * @param fun2 取消回调
     */
    init(str: string, fun1?: Function, fun2?: Function) {
        this.content.string = str
        this.fun1 = fun1
        this.fun2 = fun2;
    }
    private fun1: Function = null;
    private fun2: Function = null;
    /**移除监听 */
    removeEvent() {
        CCUtil.offTouch(this.btn_cancel, this.oncancel, this)
        CCUtil.offTouch(this.btn_determine, this.ondetermine, this)
    }
    onDestroy(): void {
        this.removeEvent()
    }
    update(deltaTime: number) {

    }
}


