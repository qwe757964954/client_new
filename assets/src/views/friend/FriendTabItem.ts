import { Label, _decorator } from 'cc';
import ListItem from '../../util/list/ListItem';
import { FriendTabInfos } from './FriendInfo';
const { ccclass, property } = _decorator;

@ccclass('FriendTabItem')
export class FriendTabItem extends ListItem {

    @property(Label)
    public tab_name: Label = null;

    start() {

    }

    updateTabItemProps(idx: number){
        this.tab_name.string = FriendTabInfos[idx].title;
    }
}


