import { _decorator } from 'cc';
import { WeeklyTask } from './TaskInfo';
import { TaskView } from './TaskView';
const { ccclass, property } = _decorator;

@ccclass('WeeklyTaskView')
export class WeeklyTaskView extends TaskView<WeeklyTask> {
    start() {

    }

    updateData(taskDatas: WeeklyTask[]) {
        super.updateData(taskDatas); // 调用基类方法
    }
}


