import { _decorator, Node } from 'cc';
import { TaskBaseData } from '../../models/TaskModel';
import { MainTaskItem } from './MainTaskItem';
import { TaskView } from './TaskView';
const { ccclass, property } = _decorator;

@ccclass('MainTaskView')
export class MainTaskView extends TaskView<TaskBaseData> {
    protected _className = "MainTaskView";
    start() {

    }

    onLoadTaskVertical(item:Node, idx:number){
        let item_sript:MainTaskItem = item.getComponent(MainTaskItem);
        let data = this._weekTask[idx];
        item_sript.initPropsItem(data);
    }
}