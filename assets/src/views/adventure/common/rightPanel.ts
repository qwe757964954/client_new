import { _decorator, Component, Node } from 'cc';
import CCUtil from '../../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('rightPanel')
export class rightPanel extends Component {
    @property({ type: Node, tooltip: "关闭按钮" })
    public btn_close: Node = null;
    @property({ type: Node, tooltip: "怪物模型" })
    public monster: Node = null;
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
    }

    onBtnCloseClick() {

    }

    removeEvent() {
        CCUtil.offTouch(this.btn_close, this.onBtnCloseClick, this);

    }

    onDestroy() {

    }
}


