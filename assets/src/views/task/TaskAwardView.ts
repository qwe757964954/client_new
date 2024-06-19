import { _decorator, isValid, Label, Node, ProgressBar } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { TaskAwardItem } from './TaskAwardItem';
import { boxAniData } from './TaskInfo';
const { ccclass, property } = _decorator;

@ccclass('TaskAwardView')
export class TaskAwardView extends BaseView {
    protected _className = "TaskAwardView";
    @property(Label)
    public progress_label:Label = null;

    @property(List)
    public award_scroll:List = null;

    @property(ProgressBar)
    public award_progress:ProgressBar = null;

    protected initUI(): void {
        this.award_scroll.numItems = boxAniData.length;
    }

    updateTaskAwardProgress(val: number) {
        if(!isValid(this.award_progress))return;
        this.award_progress.progress = val / 100;
        this.progress_label.string = `${val}`;
    }

    onLoadTaskHorizontal(item:Node, idx:number){
        let item_sript:TaskAwardItem = item.getComponent(TaskAwardItem);
        item_sript.initPropsItem(idx);
    }

    onTaskListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTaskListHorizontalSelected",selectedId);
    }
}


