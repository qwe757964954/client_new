import { Label, _decorator } from 'cc';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('WeekAchievementItem')
export class WeekAchievementItem extends ListItem {

    @property(Label)
    num_text:Label = null;

    @property(Label)
    total_text:Label = null;

    @property(Label)
    title_text:Label = null;

    start() {

    }

    update(deltaTime: number) {
        
    }
}


