import { TaskTabIds, TaskTabInfo } from "../task/TaskInfo";

// 定义 CollectTabInfos 数组
export const ActivityTabInfos: TaskTabInfo[] = [
    {
        id: TaskTabIds.NewbieGift,
        title: "新人豪礼",
        red_point:true,
        subTabItems: []
    },
    {
        id: TaskTabIds.WeekendCarousel,
        red_point:true,
        title: "周末转盘",
        subTabItems: []
    },
    {
        id: TaskTabIds.InvitationEvent,
        red_point:false,
        title: "邀请活动",
        subTabItems:[]
    },
    {
        id: TaskTabIds.ActivityOther,
        red_point:false,
        title: "其他",
        subTabItems: []
    }
];

export interface SignActivity {
    sign_num: number;
    reward: number[];
}

export interface DrawActivity {
    weights: number;
    reward: number[];
}

export interface ActivityData {
    sign_activity: SignActivity[];
    draw_activity: DrawActivity[];
}

export const ActivityDayChinese = ["第一天","第二天","第三天","第四天","第五天","第六天","第七天"]

export const MaxCarouseCount = 2;