import { _decorator, Label } from 'cc';
import ListItem from '../../util/list/ListItem';
import { MonsterCardTabInfo } from './CollectInfo';
const { ccclass, property } = _decorator;

@ccclass('MonsterTabItem')
export class MonsterTabItem extends ListItem {
    @property(Label)
    public tab_name: Label = null;
    start() {

    }

    updateTabItem(data:MonsterCardTabInfo){
        this.tab_name.string = data.title;
    }
}

