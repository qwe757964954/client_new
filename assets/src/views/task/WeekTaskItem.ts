import { Label, Node, ProgressBar, _decorator } from 'cc';
import ListItem from '../../util/list/ListItem';
import { taskInfos } from './TaskInfo';
const { ccclass, property } = _decorator;

@ccclass('WeekTaskItem')
export class WeekTaskItem extends ListItem {
    @property(Label)
    public task_name:Label = null
    @property(Label)
    public desc_name:Label = null

    @property(ProgressBar)
    public task_progress:ProgressBar = null

    @property(Label)
    public task_progress_label:Label = null

    @property(Node)
    public task_go_btn:Node = null
    @property(Node)
    public get_btn:Node = null


    initPropsItem(idx: number): void {
        this.task_name.string = taskInfos[idx].title;
        this.desc_name.string = taskInfos[idx].description;
    }
}


