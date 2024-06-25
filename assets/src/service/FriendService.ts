import { _decorator } from 'cc';
import { EventType } from '../config/EventType';
import { TextConfig } from '../config/TextConfig';
import { c2sApplyFriendStatus, c2sApplyFriendTo, c2sEmailList, c2sFriendApplyList, c2sFriendDel, c2sFriendList, c2sFriendMsgList, c2sMsgRecAwards, c2sRecommendList, c2sSendFriendMsg, EmailDataInfo, FriendChatInfo, FriendChatNetResponse, FriendResponseData, FriendUnitInfo } from '../models/FriendModel';
import { BaseControll } from '../script/BaseControll';
import EventManager from '../util/EventManager';
const { ccclass, property } = _decorator;

export class FriendService extends BaseControll {

    constructor() {
        super("FriendService");
    }

    onInitModuleEvent() {
        //this.addModelListener(InterfacePath.WordGame_Words, this.onWordGameWords);
    }

    //请求好友列表
    friendList() {
        let para: c2sFriendList = new c2sFriendList();
        //NetMgr.sendMsg(para);
        let data: FriendUnitInfo = {
            FriendId: 101, //朋友ID
            ModelId: "101", //角色ID
            RealName: "小明", //角色名
            Ltmsg: "在线一分钟", //当前在线状态
            BigId: "1", //当前大地图ID
            SmallId: "1", // 当前小地图ID
            Ce: 60000, //角色战力
            UnReadNum: 2, //未读消息数量
            MedalSet: "10101,10104,10302,10502", //奖章列表
        };
        let data2: FriendUnitInfo = {
            FriendId: 102, //朋友ID
            ModelId: "102", //角色ID
            RealName: "小红", //角色名
            Ltmsg: "离线2小时", //当前在线状态
            BigId: "1", //当前大地图ID
            SmallId: "2", // 当前小地图ID
            Ce: 45000, //角色战力
            UnReadNum: 3, //未读消息数量
            MedalSet: "10407,10802,10902,10502", //奖章列表
        };
        let data3: FriendUnitInfo = {
            FriendId: 103, //朋友ID
            ModelId: "103", //角色ID
            RealName: "呆呆", //角色名
            Ltmsg: "在线5小时", //当前在线状态
            BigId: "1", //当前大地图ID
            SmallId: "3", // 当前小地图ID
            Ce: 90000, //角色战力
            UnReadNum: 5, //未读消息数量
            MedalSet: "10102,10202,10303,10406", //奖章列表
        }
        let friendDatas: FriendUnitInfo[] = [data, data2, data3];
        EventManager.emit(EventType.Friend_MyList, friendDatas);
    }

    /**请求推荐好友列表 */
    recommendList() {
        let para: c2sRecommendList = new c2sRecommendList();
        //NetMgr.sendMsg(para);
        let data: FriendUnitInfo = {
            FriendId: 1003, //朋友ID
            ModelId: "101", //角色ID
            RealName: "小白", //角色名
            Ltmsg: "在线三分钟", //当前在线状态
            BigId: "2", //当前大地图ID
            SmallId: "1", // 当前小地图ID
            Ce: 30000, //角色战力
            UnReadNum: 1, //未读消息数量
            MedalSet: "10102,10104,10303,10501", //奖章列表
        };
        let data2: FriendUnitInfo = {
            FriendId: 1002, //朋友ID
            ModelId: "102", //角色ID
            RealName: "小珊", //角色名
            Ltmsg: "离线一小时", //当前在线状态
            BigId: "1", //当前大地图ID
            SmallId: "2", // 当前小地图ID
            Ce: 45000, //角色战力
            UnReadNum: 3, //未读消息数量
            MedalSet: "10407,10802,10902,10502", //奖章列表
        };
        let data3: FriendUnitInfo = {
            FriendId: 103, //朋友ID
            ModelId: "103", //角色ID
            RealName: "郭亮", //角色名
            Ltmsg: "在线2小时", //当前在线状态
            BigId: "2", //当前大地图ID
            SmallId: "3", // 当前小地图ID
            Ce: 10000, //角色战力
            UnReadNum: 3, //未读消息数量
            MedalSet: "10102,10201,10302,10406", //奖章列表
        }
        let friendDatas: FriendUnitInfo[] = [data, data2, data3];
        EventManager.emit(EventType.Friend_RecommendList, friendDatas);
    }

    /**请求好友申请列表 */
    friendApplyList() {
        let para: c2sFriendApplyList = new c2sFriendApplyList();
        //NetMgr.sendMsg(para);
        let data: FriendUnitInfo = {
            FriendId: 1006, //朋友ID
            ModelId: "101", //角色ID
            RealName: "李小亮", //角色名
            Ltmsg: "在线6分钟", //当前在线状态
            BigId: "2", //当前大地图ID
            SmallId: "1", // 当前小地图ID
            Ce: 30000, //角色战力
            UnReadNum: 1, //未读消息数量
            MedalSet: "10102,10104,10303,10501", //奖章列表
        };
        let data2: FriendUnitInfo = {
            FriendId: 1007, //朋友ID
            ModelId: "102", //角色ID
            RealName: "小芳", //角色名
            Ltmsg: "离线2小时", //当前在线状态
            BigId: "3", //当前大地图ID
            SmallId: "2", // 当前小地图ID
            Ce: 15000, //角色战力
            UnReadNum: 3, //未读消息数量
            MedalSet: "10407,10802,10902,10502", //奖章列表
        };
        let data3: FriendUnitInfo = {
            FriendId: 1008, //朋友ID
            ModelId: "103", //角色ID
            RealName: "小雪", //角色名
            Ltmsg: "在线3小时", //当前在线状态
            BigId: "2", //当前大地图ID
            SmallId: "1", // 当前小地图ID
            Ce: 10005, //角色战力
            UnReadNum: 0, //未读消息数量
            MedalSet: "10102,10202,10303,10406", //奖章列表
        }
        let friendDatas: FriendUnitInfo[] = [data, data2, data3];
        EventManager.emit(EventType.Friend_ApplyList, friendDatas);
    }

    //请求邮件列表
    sysMsgList() {
        let para: c2sEmailList = new c2sEmailList(); //
        //NetMgr.sendMsg(para);
        // 下面是模拟 
        let data1: EmailDataInfo = {
            Id: 1001,
            FromName: "老村长",
            createtime: "2024-05-20 00:10:18",
            Content: "您的摇石树已经到了收成的时候，请注意查收奖励。",
            RecFlag: 0,
            Awards: "[{\"id\": 1, \"num\":100}, {\"id\": 2, \"num\":200}, {\"id\": 3, \"num\":150}]",
        };

        let data2: EmailDataInfo = {
            Id: 1002,
            FromName: "小村长",
            createtime: "2024-05-21 08:11:16",
            Content: "今天是您的补偿时间，请注意查收奖励。",
            RecFlag: 1,
            Awards: "[{\"id\": 1, \"num\":50}, {\"id\": 2, \"num\":300}, {\"id\": 3, \"num\":110}]",
        };

        let data3: EmailDataInfo = {
            Id: 1003,
            FromName: "总族长",
            createtime: "2024-05-22 10:00:23",
            Content: "今天是二十年周庆，请查收您的奖励。",
            RecFlag: 0,
            Awards: "[{\"id\": 1, \"num\":350}, {\"id\": 2, \"num\":200}, {\"id\": 3, \"num\":160}]",
        };

        let emails: EmailDataInfo[] = [data1, data2, data3];

        EventManager.emit(EventType.Friend_SysMsg_List, emails);
    }

    //申请添加好友
    applyFriendTo(userId: number) {
        let para: c2sApplyFriendTo = new c2sApplyFriendTo();
        para.userId = userId;
        //NetMgr.sendMsg(para);
        //下面是模拟
        let sockData: FriendResponseData = {
            Code: 200,
            Msg: TextConfig.Friend_AddSuccess,
        }
        EventManager.emit(EventType.Friend_AddFriend, sockData);
    }

    //同意/忽略添加好友申请
    friendApplyStatus(userId: number, status: number) {
        let para: c2sApplyFriendStatus = new c2sApplyFriendStatus();
        para.userId = userId;
        para.status = status;
        //NetMgr.sendMsg(para);
        //下面是模拟
        let responseStr: string = TextConfig.Friend_AcceptApply;
        if (status === 2) {
            responseStr = TextConfig.Friend_RefuseApply;
        }
        let sockData: FriendResponseData = {
            Code: 200,
            Msg: responseStr,
        }
        EventManager.emit(EventType.Friend_ApplyStatus, sockData)
    }

    //获取邮件奖励
    sysMsgRecAwards(msgId: number) {
        let para: c2sMsgRecAwards = new c2sMsgRecAwards();
        para.msgId = msgId;
        //NetMgr.sendMsg(para);
        //下面是模拟
        let sockData: FriendResponseData = {
            Code: 200,
            Msg: TextConfig.Friend_RecvAwardSucc,
        }
        EventManager.emit(EventType.Friend_RecvAward, sockData)
    }

    // 删除好友
    friendDel(friendId: number) {
        let para: c2sFriendDel = new c2sFriendDel();
        para.Id = friendId;
        //NetMgr.sendMsg(para);
        //下面是模拟
        let sockData: FriendResponseData = {
            Code: 200,
            Msg: TextConfig.Friend_DelFriendSucc,
        }
        EventManager.emit(EventType.Friend_DelFriend, sockData)
    }

    // 请求该好友给我发来的消息
    friendMsgList(friendId: number) {
        let para: c2sFriendMsgList = new c2sFriendMsgList();
        para.Id = friendId;
        //NetMgr.sendMsg(para);
        //下面是模拟
        let data1: FriendChatInfo = {
            CreateTime: 1716450171, // 2024-05-23 15:42:51
            isShow: true,
            AccountId: 1101,
            Message: 100
        };
        let data2: FriendChatInfo = {
            CreateTime: 1716450531, // 2024-05-23 15:48:51
            isShow: true,
            AccountId: 5,
            Message: 101
        };
        let data3: FriendChatInfo = {
            CreateTime: 1716450605, // 2024-05-23 15:55:51
            isShow: true,
            AccountId: 1102,
            Message: 33
        };

        let data: FriendChatNetResponse = {
            Code: 200,
            Data: [data1, data2, data3],
        };

        EventManager.emit(EventType.Friend_MsgList, data);
    }

    /**发送给好友表情 */
    friendMsgSend(friendId: number, Message: number) {
        let para: c2sSendFriendMsg = new c2sSendFriendMsg();
        para.FriendId = friendId;
        para.Message = Message
        //NetMgr.sendMsg(para);

        //let 

        EventManager.emit(EventType.Friend_MsgSend, null);

    }



}


