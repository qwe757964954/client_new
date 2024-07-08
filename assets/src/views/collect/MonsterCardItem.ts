import { _decorator, Node } from 'cc';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('MonsterCardItem')
export class MonsterCardItem extends ListItem {
    @property(Node)
    public monster_icon: Node = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
}

