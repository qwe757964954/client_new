import { _decorator, Button, Component, Node } from 'cc';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('WordStudyDialog')
export class WordStudyDialog extends Component {
    @property({ type: Button, tooltip: "关闭按钮" })
    public btn_close: Button = null;

    start() {

    }

    update(deltaTime: number) {

    }
    initEvent() {
        CCUtil.onTouch(this.btn_close.node, this.onBtnCloseClick, this);
    }
    onBtnCloseClick() {
        EventManager.emit(EventType.study_page_switching, [6])
    }
    removeEvent() {

        CCUtil.offTouch(this.btn_close.node, this.onBtnCloseClick, this);

    }
    protected onLoad(): void {
        this.initU();
        this.initEvent();
    }
    initU() {

    }


    protected onDestroy(): void {

    }
}


