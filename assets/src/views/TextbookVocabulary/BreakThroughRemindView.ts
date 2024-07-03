import { _decorator } from 'cc';
import { TextbookRemindView } from './TextbookRemindView';
const { ccclass, property } = _decorator;

@ccclass('BreakThroughRemindView')
export class BreakThroughRemindView extends TextbookRemindView {

    public initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("frame")]).then(() => {

        });
    }
}


