import { Node } from "cc";
import { InterfacePath } from "../net/InterfacePath";

/**模拟查找好友返回数据 */
export interface FriendResponseData {
    Code: number,
    Msg: string
}
/**我的好友数据 */
export interface FriendUnitInfo {
    FriendId: number, //朋友ID
    ModelId: string,  //角色模型ID
    RealName: string, //角色真名
    Ltmsg: string,    //角色当前在线离线状态
    BigId: string,    //当前所在的大地图
    SmallId: string,  //当前小地图
    Ce: number,  //角色战力
    UnReadNum: number, ////未读消息数量
    MedalSet: string, //奖章列表
}

/**模拟查找好友返回数据 */
export interface NetSearchFriendInfo {
    Code: number, //状态码
    UserInfo: FriendUnitInfo, //用户信息
}

/**我的好友列表点击时传过去的数据 */
export interface FriendItemClickInfo {
    info: FriendUnitInfo; //朋友数据
    node: Node;  //角色所在的结点
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

//申请好友申请列表
export class c2sFriendApplyList {
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


