import { _decorator, Label } from 'cc';
import ListItem from '../../util/list/ListItem';
import { ActionModel } from './BagInfo';
const { ccclass, property } = _decorator;

@ccclass('ActionItem')
export class ActionItem extends ListItem {
    @property(Label)
    public theme_name: Label = null;
    start() {

    }

    updateProps(data:ActionModel){
        this.theme_name.string = data.title;
    }
}

