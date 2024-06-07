import { Label, _decorator } from 'cc';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('TaskTabItem')
export class TaskTabItem extends ListItem {
    @property(Label)
    name_lab:Label = null;

    private tabArr:string[] = ["每周任务","成就勋章"];

    initPropsItem(idx:number) {
        this.name_lab.string = this.tabArr[idx];
    }

}


