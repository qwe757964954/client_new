import { _decorator } from 'cc';
import { TaskWeekData } from '../../models/TaskModel';
import { TaskView } from './TaskView';
const { ccclass, property } = _decorator;

@ccclass('DailyTaskView')
export class DailyTaskView extends TaskView<TaskWeekData> {
    protected _className = "DailyTaskView";
    start() {

    }

}