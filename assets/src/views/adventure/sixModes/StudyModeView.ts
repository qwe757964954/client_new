import { _decorator, Button, Component, Node, Sprite } from 'cc';
import CCUtil from '../../../util/CCUtil';
import { EventType } from '../../../config/EventType';
import EventManager from '../../../util/EventManager';
const { ccclass, property } = _decorator;

/**学习模式页面 何存发 2024年4月15日15:38:41 */
@ccclass('StudyModeView')
export class StudyModeView extends Component {


    @property({ type: Button, tooltip: "关闭按钮" })
    public btn_close: Button = null;
    @property({ type: Node, tooltip: "收藏按钮" })
    public btn_collect: Node = null;
    @property({ type: Node, tooltip: "更多按钮" })
    public btn_more : Node = null;
    start() {

    }
    onLoad(): void {
        this.initUI();
        this.initEvent();
    }
    private initUI(): void {

    }
    private initEvent(): void {

        CCUtil.onTouch(this.btn_close.node, this.closeView, this);
    }
    private removeEvent(): void {
        CCUtil.offTouch(this.btn_close.node, this.closeView, this);

    }
    private closeView() {
        EventManager.emit(EventType.study_page_switching, [1]);
    }
    onDestroy(): void {
        this.removeEvent();
    }

    update(deltaTime: number) {

    }
    /**是否收藏 */
    private setCollect(isCollect: boolean) {
        this.btn_collect.getComponent(Sprite).grayscale = !isCollect
    }


}


