import { Label, _decorator } from 'cc';
import ListItem from '../../util/list/ListItem';
import { TabItemDataInfo } from './TaskInfo';
const { ccclass, property } = _decorator;

@ccclass('TaskTabSubItem')
export class TaskTabSubItem extends ListItem {

    @property(Label)
    sub_text: Label = null;

    initPropsItem(info: TabItemDataInfo): void {
        this.sub_text.string = info.title;
    }
}