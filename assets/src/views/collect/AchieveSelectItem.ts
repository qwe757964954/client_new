import { _decorator, Node } from 'cc';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('AchieveSelectItem')
export class AchieveSelectItem extends ListItem {

    @property(Node)
    achieveIcon: Node = null;

    start() {

    }

    update(deltaTime: number) {
        
    }
}

