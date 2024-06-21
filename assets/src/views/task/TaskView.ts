import { Node, _decorator, isValid } from 'cc';
import { TaskBaseData } from '../../models/TaskModel';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { WeekTaskItem } from './WeekTaskItem';
const { ccclass, property } = _decorator;

@ccclass('TaskView')
export class TaskView<T extends TaskBaseData> extends BaseView {
    protected _className = "TaskView";
    @property(List)
    public taskList:List = null;

    protected _weekTask:T[] = null;

    async initUI(){
            
    }
    updateData(taskDatas:T[]){
        this._weekTask = taskDatas;
        this.showTaskList();
    }

    showTaskList(){
        this.taskList.numItems = this._weekTask.length;
        this.taskList.selectedId = 0;
        this.taskList.update();
    }

    showTask(){
        this.node.active = true;
        this.showTaskList();
    }

    onLoadTaskVertical(item:Node, idx:number){
        let item_sript:WeekTaskItem = item.getComponent(WeekTaskItem);
        let data = this._weekTask[idx];
        item_sript.initPropsItem(data);
    }

    onTaskListVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTaskListHorizontalSelected",selectedId);
    }

}


