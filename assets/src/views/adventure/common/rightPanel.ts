import { _decorator, Component, Node, tween, v3 } from 'cc';
import CCUtil from '../../../util/CCUtil';
import EventManager from '../../../util/EventManager';
import { EventType } from '../../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('rightPanel')
export class rightPanel extends Component {
    @property({ type: Node, tooltip: "关闭按钮" })
    public btn_close: Node = null;
    @property({ type: Node, tooltip: "怪物模型" })
    public monster: Node = null;
    private _eveId: string;
    start() {

    }

    update(deltaTime: number) {

    }

    onLoad() {
        this.initEvent();
    }

    initUI() {

    }

    initEvent() {
        CCUtil.onTouch(this.btn_close, this.onBtnCloseClick, this);
        this._eveId = EventManager.on(EventType.Expand_the_level_page, this.openView.bind(this));

    }
    /** 打开界面 */
    private openView() {
        this.node.active = true
        tween(this.node).to(0.3, { position: v3(-125, 125, 0) }).call(() => {
        }).start()
    }

    onBtnCloseClick() {
        tween(this.node).to(0.3, { position: v3(900, 125, 0) }).call(() => {
            this.node.active = false
        }).start()


    }

    removeEvent() {
        CCUtil.offTouch(this.btn_close, this.onBtnCloseClick, this);
        EventManager.off(EventType.Expand_the_level_page, this._eveId);

    }

    onDestroy() {

    }
}


