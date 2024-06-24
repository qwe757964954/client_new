import { Label, Node, _decorator } from 'cc';
import ListItem from '../../util/list/ListItem';
import { FriendTabInfos } from './FriendInfo';
const { ccclass, property } = _decorator;

@ccclass('FriendTabItem')
export class FriendTabItem extends ListItem {

    @property(Label)
    public tab_name: Label = null;

    @property(Node)
    public redIcon: Node = null;

    start() {

    }

    updateTabItemProps(idx: number){
        this.tab_name.string = FriendTabInfos[idx].title;
        this.redIcon.active = false;
    }
}


