import { Label, _decorator } from 'cc';
import ListItem from '../../util/list/ListItem';
import { AchevementRewardInfos } from './TaskInfo';
const { ccclass, property } = _decorator;

@ccclass('TaskTabSubItem')
export class TaskTabSubItem extends ListItem {

    @property(Label)
    sub_text: Label = null;

    initPropsItem(idx: number): void {
        this.sub_text.string = AchevementRewardInfos[idx].title;
    }
}


