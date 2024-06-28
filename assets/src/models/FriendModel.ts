import { InterfacePath } from "../net/InterfacePath";
import { BaseRepPacket } from "./NetModel";

export interface FriendListItemModel {
    friend_id: number;
    user_name: string;
    level: number;
    avatar: string;
    unread_count:number
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

export interface ApplyModifyModel {
    friend_id:number;
    status:number;
}

export enum ApplicationStatus {
    Approved = 1,
    Rejected = 2
}


export class c2sUserFriendApplyModify {
    command_id: string = InterfacePath.Classification_UserFriendApplyModify;//用户好友申请修改拒绝或同意;
    friend_id:number;
    status:number;
}

export class c2sUserDelFriendMessage {
    command_id: string = InterfacePath.Classification_UserDelFriendMessage;//用户好友删除好友消息
    friend_id:number;
}

export class c2sUserFriendMessageList {
    command_id: string = InterfacePath.Classification_UserFriendMessageList;//获取用户好友消息列表
    friend_id:number;
}

export interface SendMessageModel {
    friend_id:number;
    message:string;
}

export class c2sUserSendMessageFriend {
    command_id: string = InterfacePath.Classification_UserSendMessageFriend;//用户给好友发送消息
    friend_id:number;
    message:string;
}

// 定义单个 data 对象的接口
export interface ChatDataItem {
    user_id: number;
    friend_id: number;
    message: string;
    status: number;
    create_time: string;
}

// 定义整个响应对象的接口
export interface ChatMessageResponse extends BaseRepPacket {
    data: ChatDataItem[];
}

export class c2sUserMessageStatusUpdate {
    command_id: string = InterfacePath.Classification_UserMessageStatusUpdate;//用户给好友发送消息
    friend_id:number;
}

export class c2sUserSystemMailList {
    command_id: string = InterfacePath.Classification_UserSystemMailList;//用户给好友发送消息
}


// 奖励类型接口
export interface SystemMailAwards {
    [key: string]: number; // 动态键值对，键是字符串，值是数字
}

// 单个 data 对象的接口
export interface SystemMailItem {
    sm_id: string;
    user_id: number;
    title: string;
    content: string;
    status: number;
    awards: SystemMailAwards;
    create_time: string;
}

// 整个响应对象的接口
export interface SystemMailListResponse extends BaseRepPacket {
    data: SystemMailItem[];
}

export class c2sUserSystemMailDetail {
    command_id: string = InterfacePath.Classification_UserSystemMailDetail;//用户给好友发送消息
    sm_id:string;
}

export class c2sUserSystemAwardGet{
    command_id: string = InterfacePath.Classification_UserSystemAwardGet;//用户给好友发送消息
    sm_id:string;
}

