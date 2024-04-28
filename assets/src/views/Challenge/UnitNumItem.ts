import { _decorator, Node, Sprite } from 'cc';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('UnitNumItem')
export class UnitNumItem extends ListItem {
    @property(Node)
    public rewad_progress:Node = null;
    start() {

    }

    updateRewardStatus(isComplete:boolean = false) {
        this.rewad_progress.getComponent(Sprite).grayscale = !isComplete;
    }
}


