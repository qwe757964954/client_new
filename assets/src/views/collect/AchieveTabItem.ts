import { _decorator, Label } from 'cc';
import ListItem from '../../util/list/ListItem';
import { MonsterCardTabInfo } from './CollectInfo';
const { ccclass, property } = _decorator;

@ccclass('AchieveTabItem')
export class AchieveTabItem extends ListItem {
    @property(Label)
    public tab_name: Label = null;
    start() {

    }

    updateTabItem(data:MonsterCardTabInfo){
        this.tab_name.string = data.title;
    }
}

