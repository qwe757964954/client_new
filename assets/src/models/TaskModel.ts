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
    task_id:number
}

//领取主线任务奖励
export class c2sGetWeekTaskReward{
    command_id: string = InterfacePath.Classification_GetWeekTaskReward;
    task_id:number
}

//领取宝箱周任务奖励
export class c2sGetBoxTaskReward{
    command_id: string = InterfacePath.Classification_GetBoxTaskReward;
    box_id:number
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

// 表示数据数组中宝箱状态
export interface BoxWeekData {
    box_id: number;            // 用户ID
    status: number;            // 任务ID
    user_id: number;             // 状态 (0表示未完成，1表示完成等)
    week_num: number;            // 任务进度
}

export interface UserWeekTaskData extends BaseRepPacket{
    weekly_task: TaskWeekData[];           // 任务数据数组
    weekly_live: number;
    weekly_box: BoxWeekData[];
}

export interface UserMainTaskData extends BaseRepPacket{
    data: TaskBaseData[];           // 任务数据数组
}

export interface UserMainTaskData extends BaseRepPacket{
    data: TaskBaseData[];           // 任务数据数组
}

export interface ChallengeTaskReward extends BaseRepPacket{
    exp:number; 
    live_num:number;
    task_id:number;
}

export interface ChallengeBoxRewardData extends BaseRepPacket{
    box_id:number;
}
