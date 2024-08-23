import { _decorator, Node } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
const { ccclass, property } = _decorator;

@ccclass('AchieveSelectView')
export class AchieveSelectView extends BaseView {
    
    @property(Node)
    saveBtn: Node = null;

    @property(List)
    achieveList: List = null;

    protected initUI(): void {
        this.offViewAdaptSize();
        this.achieveList.numItems = 5;
    }
}

