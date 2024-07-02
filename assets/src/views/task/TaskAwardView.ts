import { _decorator, isValid, Label, Node, ProgressBar } from 'cc';
import { EventType } from '../../config/EventType';
import { BoxWeekData, TaskStatusType } from '../../models/TaskModel';
import { BaseView } from '../../script/BaseView';
import { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import { TaskAwardItem } from './TaskAwardItem';
import { TKConfig } from './TaskConfig';
import { boxAniData, WeeklyTaskBox } from './TaskInfo';
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

    private _taskProcess:number = 0;
    private _weekly_box:BoxWeekData[] = [];
    protected initUI(): void {
        
    }

    updateTaskAwardProgress(val: number, weekly_box: BoxWeekData[]) {
        // Sort weekly_box by box_id
        this._weekly_box = weekly_box.sort((a, b) => a.box_id - b.box_id);
        this._taskProcess = val;
        val = val ? val : 0;
        this.award_progress.progress = val / 100;
        this.progress_label.string = `${val}`;
        this.award_scroll.numItems = boxAniData.length;
        this.scheduleOnce(() => {
            for (let index = 0; index < this._weekly_box.length; index++) {
                const box_data: BoxWeekData = this._weekly_box[index];
                let item: Node = this.award_scroll.getItemByListId(index);
                let item_script: TaskAwardItem = item.getComponent(TaskAwardItem);
    
                if (isValid(box_data) && box_data.status === TaskStatusType.RewardClaimed) {
                    item_script.changeBoxAni("idle_empty", index, true);
                }
            }
        });
    }

    onLoadTaskHorizontal(item:Node, idx:number){
        let item_sript:TaskAwardItem = item.getComponent(TaskAwardItem);
        item_sript.initPropsItem(idx,this._taskProcess);
    }

    onTaskListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        let boxInfo:WeeklyTaskBox = TKConfig.taskConfigInfo.task_week_box[selectedId];
        const box_data:BoxWeekData = this._weekly_box[selectedId];
        if(isValid(box_data) && box_data.status === TaskStatusType.RewardClaimed){
            return;
        }
        if(this._taskProcess < boxInfo.need_live_num ){
            return;
        }
        console.log("onTaskListHorizontalSelected",boxInfo);
        EventMgr.dispatch(EventType.Box_Challenge_Reward,boxInfo);
    }
}


