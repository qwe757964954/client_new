import { InterfacePath } from "../net/InterfacePath";
import { BaseRepPacket } from "./NetModel";

//获取用户主线任务进度信息
export class c2sUserMainTask{
    command_id: string = InterfacePath.Classification_UserMainTask;
}

//获取用户每周任务进度信息
export class c2sUserWeekTask{
    command_id: string = InterfacePath.Classification_UserWeekTask;
}

//领取主线任务奖励
export class c2sGetMainTaskReward{
    command_id: string = InterfacePath.Classification_GetMainTaskReward;
    task_id:string
}

//领取主线任务奖励
export class c2sGetWeekTaskReward{
    command_id: string = InterfacePath.Classification_GetWeekTaskReward;
    task_id:number
}

//领取宝箱周任务奖励
export class c2sGetBoxTaskReward{
    command_id: string = InterfacePath.Classification_GetBoxTaskReward;
    box_id:string
}

//周任务进度发生变更
export class c2sUserWeekTaskChange{
    command_id: string = InterfacePath.Classification_UserWeekTaskChange;
    user_id:number
}

//主线任务进度发生变更
export class c2sUserMainTaskChange{
    command_id: string = InterfacePath.Classification_UserMainTaskChange;
    user_id:number
}

//完成每周任务
export class c2sCompleteWeekTask{
    command_id: string = InterfacePath.Classification_CompleteWeekTask;
    user_id:number
}

//完成主线任务
export class c2sCompleteMainTask{
    command_id: string = InterfacePath.Classification_CompleteMainTask;
    user_id:number
}

//达成每周任务宝箱
export class c2sCompleteBoxWeekTask{
    command_id: string = InterfacePath.Classification_CompleteBoxWeekTask;
    user_id:number
}

// 定义一个枚举来表示任务状态
export enum TaskStatusType {
    Uncompleted = 0,  // 未完成
    Completed = 1,    // 已完成
    RewardClaimed = 2 // 已领取奖励
}


// 表示数据数组中的每个任务项的接口基类
export interface TaskBaseData {
    user_id: number;            // 用户ID
    task_id: number;            // 任务ID
    status: number;             // 状态 (0表示未完成，1表示完成等)
    process: number;            // 任务进度
}

// 表示数据数组中的每个任务项的接口
export interface TaskWeekData extends TaskBaseData {
    week_num: number;           // 周数
    extra: {
        login_days: string[];  // Array of strings representing login dates
    };
    
}

export interface UserWeekTaskData extends BaseRepPacket{
    weekly_task: TaskWeekData[];           // 任务数据数组
    weekly_live: number;
}

export interface UserMainTaskData extends BaseRepPacket{
    data: TaskBaseData[];           // 任务数据数组
}