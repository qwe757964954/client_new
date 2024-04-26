import { Label, Node, _decorator } from 'cc';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('ChallengeItem')
export class ChallengeItem extends ListItem {
    @property(Label)
    public unit_name: Label = null;
    @property(Label)
    public unit_num: Label = null;
    @property(Node)
    public focus_node: Node = null;
    @property([Node])
    public star_list_nodes: Node[] = [];
    start() {

    }

    update(deltaTime: number) {
        
    }
}


