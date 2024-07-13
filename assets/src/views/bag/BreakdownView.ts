import { _decorator, Node } from 'cc';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('BreakdownView')
export class BreakdownView extends BasePopup {
    @property(Node)
    public source_node: Node = null;
    @property(Node)
    public target_node: Node = null;

    @property(Node)
    public sure_btn: Node = null;

    public initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("frame")]);
    }
    initEvent() {
        CCUtil.onBtnClick(this.sure_btn, this.onClickSure.bind(this));
    }

    onClickSure(){
        this.closePop();
    }
}


