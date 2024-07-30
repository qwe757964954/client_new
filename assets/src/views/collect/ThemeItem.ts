import { _decorator, Label } from 'cc';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('ThemeItem')
export class ThemeItem extends ListItem {
    @property(Label)
    public theme_name: Label = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
}

