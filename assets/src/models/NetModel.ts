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
export class c2sTokenLoginOld {
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
    command_id?: number;
    seq?: number;
}
/**账号密码登录 */
export class c2sAccountLogin {
    command_id: string = InterfacePath.c2sAccountLogin;
    user_name: string;//账号
    password: string;//密码
}
/**token登录 */
export class c2sTokenLogin {
    command_id: string = InterfacePath.c2sTokenLogin;
    token: string;//token
}
/**登录返回 */
export class s2cAccountLoginDetailExtra {
    coin: number;//金币
    diamond: number;//钻石
    amethyst: number;//紫晶石
    stamina: number;//体力
    role_id: number;//角色id
    level: number;//等级
    exp: number;//经验
    nick_name: string;//昵称
    avatar: string;//头像
    phone: string;//手机号
}
export class s2cAccountLoginDetail {
    extra: s2cAccountLoginDetailExtra;//额外信息
}
export class s2cAccountLogin extends BaseRepPacket {
    user_id: number;//用户id
    token: string;//token
    detail: s2cAccountLoginDetail;
}
/**建筑生产信息 */
export class s2cBuildingProduceInfo {
    product_type: number;//生产类型
    remaining_seconds: number;//剩余时间(s)
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
    level: number;//建筑等级
    hide: number;//是否回收 0:未回收, 1: 已回收
    remaining_infos: s2cBuildingProduceInfo[];//生产信息
}
/**建筑列表返回*/
export class s2cBuildingList extends BaseRepPacket {
    build_list: s2cBuildingListInfo[];//建筑列表
    land_dict: { [key: string]: number };//地块字典
    cloud_dict: { [key: string]: number };//乌云字典
}
/**建筑修改（地块修改） */
export class c2sBuildingEdit {
    command_id: string = InterfacePath.c2sBuildingEdit;
    id: number;//建筑唯一索引id
    bid: number = undefined;//建筑id
    x: number;//建筑x坐标
    y: number;//建筑y坐标
    direction: number;//建筑方向
    hide: number;//是否回收 0:未回收, 1: 已回收
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
/**建筑升级 */
export class c2sBuildingUpgrade {
    command_id: string = InterfacePath.c2sBuildingUpgrade;
    id: number;//建筑唯一索引id
    level: number;//建筑等级
}
/**建筑升级返回 */
export class s2cBuildingUpgrade extends BaseRepPacket {
    id: number;//建筑唯一索引id
    level: number;//建筑等级
}
/**建筑卖出 */
export class c2sBuildingSell {
    command_id: string = InterfacePath.c2sBuildingSell;
    id: number;//建筑唯一索引id
}
/**建筑卖出返回 */
export class s2cBuildingSell extends BaseRepPacket {
    id: number;//建筑唯一索引id
}
/**建筑回收 */
export class c2sBuildingRecycle {
    command_id: string = InterfacePath.c2sBuildingRecycle;
    id: number;//建筑唯一索引id
}
/**建筑回收返回 */
export class s2cBuildingRecycle extends BaseRepPacket {
    id: number;//建筑唯一索引id
}
/**建筑生产队列添加 */
export class c2sBuildingProduceAdd {
    command_id: string = InterfacePath.c2sBuildingProduceAdd;
    id: number;//建筑唯一索引id
    product_type: number[];//生产类型
}
/**建筑生产队列添加返回 */
export class s2cBuildingProduceAdd extends BaseRepPacket {
    id: number;//建筑唯一索引id
    remaining_infos: s2cBuildingProduceInfo[];//生产信息
}
/**建筑生产队列删除 */
export class c2sBuildingProduceDelete {
    command_id: string = InterfacePath.c2sBuildingProduceDelete;
    id: number;//建筑唯一索引id
    product_num: number;//生产索引
}
/**建筑生产队列删除返回 */
export class s2cBuildingProduceDelete extends BaseRepPacket {
    id: number;//建筑唯一索引id
    remaining_infos: s2cBuildingProduceInfo[];//生产信息
}
/**建筑生产物品 */
export class s2cProductItem {
    coin: number;//金币
    diamond: number;//钻石
}
/**建筑生产领取 */
export class c2sBuildingProduceGet {
    command_id: string = InterfacePath.c2sBuildingProduceGet;
    id: number;//建筑唯一索引id
    product_num: number;//生产索引
}
/**建筑生产领取返回 */
export class s2cBuildingProduceGet extends BaseRepPacket {
    id: number;//建筑唯一索引id
    product_items: s2cProductItem[];//生产物品
    remaining_infos: s2cBuildingProduceInfo[];//生产信息
}
/**乌云解锁 */
export class c2sCloudUnlock {
    command_id: string = InterfacePath.c2sCloudUnlock;
    unlock_cloud: string[];//乌云位置x_y数组
}
/**乌云解锁返回 */
export class s2cCloudUnlock extends BaseRepPacket {
    cloud_dict: { [key: string]: number };//乌云字典
}
/**乌云解锁获取 */
export class c2sCloudUnlockGet {
    command_id: string = InterfacePath.c2sCloudUnlockGet;
    unlock_cloud: string[];//乌云位置x_y数组
}
/**乌云解锁获取返回 */
export class s2cCloudUnlockGet extends BaseRepPacket {
    cloud_dict: { [key: string]: number };//乌云字典
    award_items: s2cProductItem[];//奖励物品
}

/**复习规划 */
export class c2sReviewPlan {
    command_id: string = InterfacePath.c2sReviewPlan;
}
/**复习规划返回 */
export class s2cReviewPlanInfo {
    study_num: number;//学习单词数
    review_num: number;//复习单词数
    today_need_review_num: number;//今日需要复习单词数
    today_review_num: number;//今日已复习单词数
}
export class s2cReviewPlan extends BaseRepPacket {
    classification: s2cReviewPlanInfo;//教材单词
    word_game: s2cReviewPlanInfo;//单词大冒险
}
/**复习规划列表 */
export class c2sReviewPlanList {
    command_id: string = InterfacePath.c2sReviewPlanList;
    review_type: string;//复习类型 today 表示今日待复习 all 表示所有待复习
    source: number;//来源 2表示单词大冒险 1表示教材单词
}
/**复习规划列表返回 */
export class s2cReviewPlanListInfo {
    w_id: string;//单词id
    word: string;//单词
    next_review_time: number;//下次复习时间
}
export class s2cReviewPlanList extends BaseRepPacket {
    today_timestamp: number;//今日时间戳
    need_review_list: s2cReviewPlanListInfo[];//复习规划列表
}
/**宠物信息 */
export class c2sPetInfo {
    command_id: string = InterfacePath.c2sPetInfo;
}
/**宠物信息返回 */
export class s2cPetInfo {
    user_id: number;//用户id
    level: number;//等级
    mood: number;//心情分
    intimacy: number;//亲密度
    daily_counts: number[];//每日互动次数
    explore_award: boolean;//是否有探索奖励
    next_update_second: number;//下次心情状态和亲密度更新时间
    next_explore_second: number;//下次探索奖励更新时间
}
export class s2cPetInfoRep extends BaseRepPacket {
    pet_info: s2cPetInfo;//宠物信息
}
/**宠物互动 */
export class c2sPetInteraction {
    private command_id: string = InterfacePath.c2sPetInteraction;
    interact_id: number;//互动id
}
/**宠物互动返回 */
export class s2cPetInteraction extends BaseRepPacket {
    pet_info: s2cPetInfo;//宠物信息
}
/**宠物升级 */
export class c2sPetUpgrade {
    command_id: string = InterfacePath.c2sPetUpgrade;
    level: number;//等级
}
/**宠物升级返回 */
export class s2cPetUpgrade extends BaseRepPacket {
    level: number;//等级
}
/**领取探索奖励 */
export class c2sPetGetReward {
    command_id: string = InterfacePath.c2sPetGetReward;
}
/**领取探索奖励返回 */
export class s2cPetGetReward extends BaseRepPacket {
    explore_award: s2cProductItem[];//奖励信息
    next_explore_second: number;//下次探索奖励更新时间
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