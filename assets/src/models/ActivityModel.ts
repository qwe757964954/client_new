import { ItemData } from "../manager/DataMgr";
import { InterfacePath } from "../net/InterfacePath";
import { BaseRepPacket } from "./NetModel";

//获取运营活动信息
export class c2sGetActivityInfo{
    command_id: string = InterfacePath.Classification_GetActivityInfo;
}

//签到奖励领取
export class c2sSignRewardDraw{
    command_id: string = InterfacePath.Classification_SignRewardDraw;
}

//周末大转盘抽奖
export class c2sWeekendCarouselDraw{
    command_id: string = InterfacePath.Classification_WeekendCarouselDraw;
}

export interface UserSignActivity {
    user_id: number;
    day: string;
    week_num: number;
    status: number;
    activity_id: number;
}


export interface ActivityInfoResponse  extends BaseRepPacket  {
    sign_activity: boolean;
    sign_status_list: UserSignActivity[];
    draw_activity: boolean;
    draw_status_list: any[];
}

export interface SignRewardDrawAward {
    id: number;
    num: number;
}

export interface SignRewardDrawResponse extends BaseRepPacket {
    award: ItemData[];
}