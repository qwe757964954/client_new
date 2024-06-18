import { _decorator } from 'cc';
import { TaskWeekData } from '../../models/TaskModel';
import { TaskView } from './TaskView';
const { ccclass, property } = _decorator;

@ccclass('WeeklyTaskView')
export class WeeklyTaskView extends TaskView<TaskWeekData> {
    start() {

    }

    updateData(taskDatas: TaskWeekData[]) {
        super.updateData(taskDatas); // 调用基类方法
    }
}


