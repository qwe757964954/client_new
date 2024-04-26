/***************************************HTTP**********************************/

import { InterfacePath } from "../net/InterfacePath";

//公告检测
export class c2sCheckNotice {
    channel_id: number;
    client_version: string;
}
export class s2cMaintenanceInfo {
    maintenance_id: number;
    content: string;
}
export class s2cCheckNotice {
    code: number;
    data: s2cMaintenanceInfo;
}
// token登录
export class c2sTokenLogin {
    LoginToken: string;
}
export class s2cTokenLogin {
    WebSocketAddr: string;//socket地址
    WebSocketPort: number;//socket端口
    MemberToken: string;//token
    TotalTime: string;
    LastTime: string;
    WebPort: number;//提交评测端口
    op_code: string;//返回信息 disable账号被禁用 die账号密码错误 iplimit受限IP

    Code: number;//返回码
    UnionId: string;//微信unionid

}
// moble登录
export class c2sMobileLogin {
    Mobile: string;//手机号
    UnionId: string;//微信unionid（非必须？）
}
// 请求验证码
export class c2sReqSms {
    Mobile: string;//手机号
}
// 短信登录
export class c2sSmsLogin {
    Mobile: string;//手机号
    RandomCode: string;//验证码
    UnionId: string;//微信unionid（非必须）
}
// 微信登录
export class c2sWechatLogin {
    Code: string;//微信code
}
// 账号密码登录
export class c2sAccountLogin {
    AccountName: string;//账号
    LoginPwd: string;//密码
    SysType: number;//系统类型 0:教室端 1:家庭端
}
/*****************************************************************************/


/**********************************SOCKET*************************************/
//新手引导
export class c2sAccountStep {
    Path: string = InterfacePath.Account_Step;
    Step: number;//新手引导步骤
}

//用户信息
export class c2sAccountInfo {
    Path: string = InterfacePath.Account_Info;
    AccountId: string;//用户id
}

//初始数据
export class c2sAccountInit {
    Path: string = InterfacePath.Account_Init;
    MemberToken: string;//token
}

// 道具列表
export class c2sPropMyList {
    Path: string = InterfacePath.Prop_MyList;
    ModuleId: number;   // 道具类型
}

// 修改名称
export class c2sAccountEditRealName {
    Path: string = InterfacePath.Account_EditRealName;
    RealName: string;   // 名称
}

// 学生通关单词
export class c2sAccountStudyWord {
    Path: string = InterfacePath.Account_StudyWord;
}

//单词大冒险获取单词数据
export class c2sWordGameWords {
    Path: string = InterfacePath.WordGame_Words;
    BigId: number;
    SmallId: number;
    MicroId: number;
    GameMode: number;
}

//获取单词详情
export class c2sClassificationWord {
    Path: string = InterfacePath.Classification_Word;
    Word: string;
}

/*****************************************************************************/