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
// export class c2sAccountLogin {
//     AccountName: string;//账号
//     LoginPwd: string;//密码
//     SysType: number;//系统类型 0:教室端 1:家庭端
// }
/*****************************************************************************/


/**********************************SOCKET*************************************/
/**基础接口类 */
export class BaseDataPacket {
    command_id: number;//命令号
    data: any;//数据对象
}
/**基础返回接口类 */
export class BaseRepPacket {
    code: number;//返回码
    msg: string;//返回信息
}
/**账号密码登录 */
export class c2sAccountLogin {
    command_id: string = InterfacePath.c2sAccountLogin;
    user_name: string;//账号
    password: string;//密码
}
/**登录返回 */
export class s2cAccountLogin extends BaseRepPacket {
    user_id: number;//用户id
    token: string;//token
}
/**建筑列表 */
export class c2sBuildingList {
    command_id: string = InterfacePath.c2sBuildingList;
}
export class s2cBuildingListInfo {
    id: number;//建筑唯一索引id
    bid: number;//建筑id
    x: number;//建筑x坐标
    y: number;//建筑y坐标
    direction: number;//建筑方向 0:未翻转, 1: 翻转
}
/**建筑列表返回*/
export class s2cBuildingList extends BaseRepPacket {
    build_list: s2cBuildingListInfo[];//建筑列表
    land_dict: { [key: string]: number };//地块字典
}
/**建筑修改（地块修改） */
export class c2sBuildingEdit {
    command_id: string = InterfacePath.c2sBuildingEdit;
    id: number;//建筑唯一索引id
    bid: number = undefined;//建筑id
    x: number;//建筑x坐标
    y: number;//建筑y坐标
    direction: number;//建筑方向
}
/**建筑修改返回 */
export class s2cBuildingEdit extends BaseRepPacket {
    id: number;//建筑唯一索引id
}
/**新建建筑 */
export class c2sBuildingCreate {
    command_id: string = InterfacePath.c2sBuildingCreate;
    bid: number;//建筑id
    x: number;//建筑x坐标
    y: number;//建筑y坐标
    idx: number;//建筑索引(前端使用)
    direction: number;//建筑方向
}
/**新建建筑返回 */
export class s2cBuildingCreate extends BaseRepPacket {
    idx: number;//建筑索引(前端使用)
    id: number;//建筑唯一索引id
}
/**地块更新 */
export class c2sLandUpdate {
    command_id: string = InterfacePath.c2sLandUpdate;
    update_land: { [key: string]: number };//地块字典
}
/**地块更新返回 */
export class s2cLandUpdate extends BaseRepPacket {
}

/**********************************以上是新接口*************************************/

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

/*****************************************************************************/