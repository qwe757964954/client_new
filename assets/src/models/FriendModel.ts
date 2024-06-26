import { Node } from "cc";
import { InterfacePath } from "../net/InterfacePath";
import { BaseRepPacket } from "./NetModel";

/**模拟查找好友返回数据 */
export interface FriendResponseData {
    Code: number,
    Msg: string
}



/**我的好友列表点击时传过去的数据 */
export interface EmailItemClickInfo {
    info: EmailDataInfo; //朋友数据
    node: Node;  //角色所在的结点
}

/**邮件数据结构 */
export interface EmailDataInfo {
    Id: number;   //邮件ID
    FromName: string; // 发件人
    createtime: string; //发件时间字符串
    Content: string; //邮件内容
    RecFlag: number; // 奖励领取情况 0: 未邻取且可领取，邮件上有红点 1: 已领取
    Awards: string;  //json形式字符串奖励
}

/**聊天消息 */
export interface FriendChatInfo {
    CreateTime: number; //聊天的消息时间戳
    isShow: boolean; //日期是否显示
    AccountId: number; //聊天者的userId,
    Message: number;  //聊天者发送的图片ID
}

/**聊天网络消息 */
export interface FriendChatNetResponse {
    Code: number;  //消息码
    Data: FriendChatInfo[]; //聊天消息
}

//申请好友列表
export class c2sFriendList {
    command_id: string = "-1";//InterfacePath.Island_Status;
}

//申请推荐好友列表
export class c2sRecommendList {
    command_id: string = "-1";//InterfacePath.Island_Status;
}

//申请邮件列表
export class c2sEmailList {
    command_id: string = "-1";//InterfacePath.Island_Status;
}

//申请添加好友
export class c2sApplyFriendTo {
    command_id: string = "-1";//InterfacePath.Island_Status;
    userId: number; //角色id
}

//同意/拒绝好友申请请求
export class c2sApplyFriendStatus {
    command_id: string = "-1";//InterfacePath.Island_Status;
    userId: number; //角色id
    status: number; //同意 1 拒绝 2
}

// 获取邮件的附件奖励  
export class c2sMsgRecAwards {
    command_id: string = "-1";//InterfacePath.Island_Status;
    msgId: number;  //邮件奖励
}

// 删除好友
export class c2sFriendDel {
    command_id: string = "-1";//InterfacePath.Island_Status;
    Id: number;  //好友UserID
}

// 收到好友发来的消息列表
export class c2sFriendMsgList {
    command_id: string = "-1";//InterfacePath.Island_Status;
    Id: number;  //好友UserID
}

// 向好友发消息
export class c2sSendFriendMsg {
    command_id: string = "-1";//InterfacePath.Island_Status;
    FriendId: number;  //好友UserID
    Message: number; //表情消息ID
}

export interface FriendListItemModel {
    friend_id: number;
    user_name: string;
    level: number;
    avatar: string;
}

// Interface for the response data
export interface DataFriendListResponse extends BaseRepPacket {
    data: FriendListItemModel[];
}

export class c2sUserFriendList {
    command_id: string = InterfacePath.Classification_UserFriendList;//InterfacePath.Island_Status;
}


export class c2sUserFriendAdd {
    command_id: string = InterfacePath.Classification_UserFriendAdd;//InterfacePath.Island_Status;
    friend_id: number;
}

// Interface for the inner data object
export interface UserFriendData {
    user_id: number;
    user_name: string;
    code: number;
    msg: string;
}

export interface DataFriendSearchResponse extends BaseRepPacket {
    data: UserFriendData;
}


export class c2sUserFriendSearch {
    command_id: string = InterfacePath.Classification_UserFriendSearch;//InterfacePath.Island_Status;
    search_id: string;
}

export class c2sUserFriendApplyList {
    command_id: string = InterfacePath.Classification_UserFriendApplyList;//InterfacePath.Island_Status;
}

export interface UserApplyModel {
    user_name: string;
    nick_name: string;
    user_id: number;
    level: number;
    avatar: string;
}

export interface DataFriendApplyListResponse extends BaseRepPacket {
    data: UserApplyModel[];
}
