import { _decorator } from 'cc';
import { Task } from './TaskInfo';
import { TaskView } from './TaskView';
const { ccclass, property } = _decorator;

@ccclass('DailyTaskView')
export class DailyTaskView extends TaskView<Task> {
    protected _className = "DailyTaskView";
    start() {

    }

}