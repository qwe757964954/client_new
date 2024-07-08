import { Label, _decorator } from 'cc';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('AchievementHeadItem')
export class AchievementHeadItem extends ListItem {

    @property(Label)
    public name_text: Label = null;

    start() {

    }

}

