import { Label, Node, ProgressBar, _decorator } from 'cc';
import { TaskBaseData, TaskStatusType } from '../../models/TaskModel';
import ListItem from '../../util/list/ListItem';
import { TKConfig } from './TaskConfig';
import { WeeklyTask } from './TaskInfo';
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
    public challenge_btn:Node = null

    @property(Node)
    has_challenge_btn: Node = null;
// // 定义一个枚举来表示任务状态
// export enum TaskStatusType {
//     Uncompleted = 0,  // 未完成
//     Completed = 1,    // 已完成
//     RewardClaimed = 2 // 已领取奖励
// }
    initPropsItem<T extends TaskBaseData>(data: T): void {
        let weekTask:WeeklyTask = TKConfig.getTaskFromWeek(data.task_id);
        this.desc_name.string = weekTask.name;
        this.clearAllBtns();
        switch (data.status) {
            case TaskStatusType.Uncompleted:
                this.task_go_btn.active = true;
                break;
            case TaskStatusType.Completed:
                this.challenge_btn.active = true;
                break;
            case TaskStatusType.RewardClaimed:
                this.has_challenge_btn.active = true;
                break;
        }
    }

    clearAllBtns(){
        this.task_go_btn.active = false;
        this.challenge_btn.active = false;
        this.has_challenge_btn.active = false;
    }
}


