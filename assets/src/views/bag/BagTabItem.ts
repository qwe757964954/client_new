import { Label, _decorator } from 'cc';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('BagTabItem')
export class BagTabItem extends ListItem {

    @property(Label)
    public tab_name: Label = null;

    start() {

    }

    updateTabProps(tab_name: string) {
        this.tab_name.string = tab_name;
    }
}

