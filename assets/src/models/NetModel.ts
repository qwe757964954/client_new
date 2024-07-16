/***************************************HTTP**********************************/

import { ItemData } from "../manager/DataMgr";
import { InterfacePath } from "../net/InterfacePath";


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
    // command_id?: number;
    // seq?: number;
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
    stamina_limit: number;//体力上限
    next_stamina_update: number;//下次体力更新时间
}
export class s2cAccountLoginDetail {
    extra: s2cAccountLoginDetailExtra;//额外信息
    item_list: ItemData[];//物品列表
}
export class s2cAccountLogin extends BaseRepPacket {
    user_id: number;//用户id
    token: string;//token
    detail: s2cAccountLoginDetail;
}
/**获取手机验证码 */
export class c2sGetPhoneCode {
    command_id: string = InterfacePath.c2sGetPhoneCode;
    phone: string;//手机号
}
/**获取手机验证码结果 */
export class s2cGetPhoneCode extends BaseRepPacket {
}
/**手机验证码登录 */
export class c2sPhoneCodeLogin {
    command_id: string = InterfacePath.c2sPhoneCodeLogin;
    phone: string;//手机号
    check_code: string;//验证码
}
/**手机验证码登录结果 */
export class s2cPhoneCodeLogin extends BaseRepPacket {
    user_id: number;//用户id
    token: string;//token
    detail: s2cAccountLoginDetail;
}
/**物品更新 */
export class s2cItemUpdate {
    user_id: number;//用户id
    item_list: ItemData[];//物品列表
}
/**体力更新 */
export class c2sStaminaUpdate {
    command_id: string = InterfacePath.c2sStaminaUpdate;
}
/**体力更新返回 */
export class s2cStaminaUpdate extends BaseRepPacket {
    stamina: number;//体力
    stamina_limit: number;//体力上限
    next_stamina_update: number;//下次体力更新时间
}
/**建筑生产信息 */
export class s2cBuildingProduceInfo {
    product_type: number;//生产类型
    remaining_seconds: number;//剩余时间(s)
}
/**建筑建造信息 */
export class s2cBuildingBuiltInfo {
    remaining_seconds: number;//剩余时间(s)
}
/**建筑升级信息 */
export class s2cBuildingUpgradeInfo {
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
    status: number;//建筑状态 0:普通、1:建造中、2:建造完成、3:升级中、4:升级完成
    construct_infos: s2cBuildingBuiltInfo;//建造信息
    product_infos: s2cBuildingProduceInfo[];//生产信息
    upgrade_infos: s2cBuildingUpgradeInfo;//升级信息
}
/**建筑列表返回*/
export class s2cBuildingList extends BaseRepPacket {
    build_list: s2cBuildingListInfo[];//建筑列表
    land_dict: { [key: string]: number };//地块字典
    cloud_dict: { [key: string]: number };//乌云字典
}
/**建筑批量操作 */
export class c2sBuildingEditBatch {
    command_id: string = InterfacePath.c2sBuildingEditBatch;
    type: number = 0;//类型 0:编辑建造 1:商店购买
    insert_list: c2sBuildingCreate[] = [];
    update_list: c2sBuildingEdit[] = [];
    delete_list: number[] = [];
}
/**建筑批量操作返回 */
export class s2cBuildingEditBatch extends BaseRepPacket {
    type: number = 0;//类型 0:编辑建造 1:商店购买
    insert_result: s2cBuildingCreate[] = [];
    update_result: s2cBuildingEdit[] = [];
    delete_result: s2cBuildingSell[] = [];
}

/**建筑修改（地块修改） */
export class c2sBuildingEdit {
    // command_id: string = InterfacePath.c2sBuildingEdit;
    id: number;//建筑唯一索引id
    // bid: number = undefined;//建筑id
    x: number;//建筑x坐标
    y: number;//建筑y坐标
    direction: number;//建筑方向
    hide: number = 0;//是否回收 0:未回收, 1: 已回收
}
/**建筑修改返回 */
export class s2cBuildingEdit extends BaseRepPacket {
    id: number;//建筑唯一索引id
}
/**新建建筑 */
export class c2sBuildingCreate {
    // command_id: string = InterfacePath.c2sBuildingCreate;
    bid: number;//建筑id
    x: number;//建筑x坐标
    y: number;//建筑y坐标
    idx: number;//建筑索引(前端使用)
    direction: number;//建筑方向
    hide: number = 0;//是否回收 0:未回收, 1: 已回收
}
/**新建建筑返回 */
export class s2cBuildingCreate extends BaseRepPacket {
    idx: number;//建筑索引(前端使用)
    id: number;//建筑唯一索引id
    status: number;//建筑状态 0:普通、1:建造中、2:建造完成、3:升级中、4:升级完成
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
    // level: number;//建筑等级
    status: number;//建筑状态 0:普通、1:建造中、2:建造完成、3:升级中、4:升级完成
    upgrade_infos: s2cBuildingUpgradeInfo;//升级信息
}
/**建筑升级加速 */
export class c2sBuildingUpgradeSpeed {
    command_id: string = InterfacePath.c2sBuildingUpgradeSpeed;
    id: number;//建筑唯一索引id
    word: string;//单词
    answer: string;//答案
}
/**建筑升级加速返回 */
export class s2cBuildingUpgradeSpeed extends BaseRepPacket {
    id: number;//建筑唯一索引id
    status: number;//建筑状态 0:普通、1:建造中、2:建造完成、3:升级中、4:升级完成
    upgrade_infos: s2cBuildingUpgradeInfo;//升级信息
}
/**建筑升级奖励领取 */
export class c2sBuildingUpgradeReward {
    command_id: string = InterfacePath.c2sBuildingUpgradeReward;
    id: number;//建筑唯一索引id
}
/**建筑升级奖励领取返回 */
export class s2cBuildingUpgradeReward extends BaseRepPacket {
    id: number;//建筑唯一索引id
    status: number;//建筑状态 0:普通、1:建造中、2:建造完成、3:升级中、4:升级完成
    level: number;//建筑等级
    award: ItemData[];//奖励
}
/**建筑信息获取 */
export class c2sBuildingInfoGet {
    command_id: string = InterfacePath.c2sBuildingInfoGet;
    id: number;//建筑唯一索引id
}
/**建筑信息获取返回 */
export class s2cBuildingInfoGet extends BaseRepPacket {
    id: number;//建筑唯一索引id
    status: number;//建筑状态 0:普通、1:建造中、2:建造完成、3:升级中、4:升级完成
    construct_infos: s2cBuildingBuiltInfo;//建造信息
    upgrade_infos: s2cBuildingUpgradeInfo;//升级信息
}
/**加速单词获取 */
export class c2sSpeedWordsGet {
    command_id: string = InterfacePath.c2sSpeedWordsGet;
    id: number;//建筑唯一索引id
    unlock_cloud: string;//乌云
    product_num: number;//生产索引
}
/**加速单词信息 */
export class s2cSpeedWordInfo {
    w_id: string;//单词id
    word: string;//单词
    cn: string;//中文解释
    symbol: string;//音标 英标
    symbolus: string;//音标 美标
}
/**加速单词获取返回 */
export class s2cSpeedWordsGet extends BaseRepPacket {
    word_list: s2cSpeedWordInfo[];//单词列表
    id: number;//建筑唯一索引id
    unlock_cloud: string;//乌云
    product_num: number;//生产索引
}
/**建筑卖出 */
export class c2sBuildingSell {
    // command_id: string = InterfacePath.c2sBuildingSell;
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
/**建筑建造 */
export class c2sBuildingBuilt {
    command_id: string = InterfacePath.c2sBuildingBuilt;
    id: number;//建筑唯一索引id
}
/**建筑建造返回 */
export class s2cBuildingBuilt extends BaseRepPacket {
    id: number;//建筑唯一索引id
    status: number;//建筑状态 0:普通、1:建造中、2:建造完成、3:升级中、4:升级完成
    construct_infos: s2cBuildingBuiltInfo;//建造信息
}
/**建筑加速建造 */
export class c2sBuildingBuiltSpeed {
    command_id: string = InterfacePath.c2sBuildingBuiltSpeed;
    id: number;//建筑唯一索引id
    word: string;//单词
    answer: string;//答案
}
/**建筑加速建造返回 */
export class s2cBuildingBuiltSpeed extends BaseRepPacket {
    id: number;//建筑唯一索引id
    status: number;//建筑状态 0:普通、1:建造中、2:建造完成、3:升级中、4:升级完成
    construct_infos: s2cBuildingBuiltInfo;//建造信息
}
/**建筑建造领取奖励 */
export class c2sBuildingBuiltReward {
    command_id: string = InterfacePath.c2sBuildingBuiltReward;
    id: number;//建筑唯一索引id
}
/**建筑建造领取奖励返回 */
export class s2cBuildingBuiltReward extends BaseRepPacket {
    id: number;//建筑唯一索引id
    award: ItemData[];//奖励
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
/**奖励物品 */
export class s2cRewardItem {
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
    product_items: ItemData[];//生产物品
    remaining_infos: s2cBuildingProduceInfo[];//生产信息
}
/**建筑生产加速 */
export class c2sBuildingProduceSpeed {
    command_id: string = InterfacePath.c2sBuildingProduceSpeed;
    id: number;//建筑唯一索引id
    word: string;//单词
    answer: string;//答案
    product_num: number;//生产索引
}
/**建筑生产加速返回 */
export class s2cBuildingProduceSpeed extends BaseRepPacket {
    id: number;//建筑唯一索引id
    product_infos: s2cBuildingProduceInfo[];//生产信息
    product_num: number;//生产索引
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
    award_items: s2cRewardItem[];//奖励物品
}
/**乌云解锁加速 */
export class c2sCloudUnlockSpeed {
    command_id: string = InterfacePath.c2sCloudUnlockSpeed;
    unlock_cloud: string;//乌云位置x_y
    word: string;//单词
    answer: string;//答案
}
/**乌云解锁加速返回 */
export class s2cCloudUnlockSpeed extends BaseRepPacket {
    cloud_dict: { [key: string]: number };//乌云字典
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
    cn: string;//中文释义
}
export class s2cReviewPlanList extends BaseRepPacket {
    today_timestamp: number;//今日时间戳
    need_review_list: s2cReviewPlanListInfo[];//复习规划列表
}
/**复习规划抽奖 */
export class c2sReviewPlanDraw {
    command_id: string = InterfacePath.c2sReviewPlanDraw;
    kind: number;//抽奖类型 1表示单抽 2表示十连抽
}
/**复习规划抽奖返回 */
export class s2cReviewPlanDraw extends BaseRepPacket {
    data: { [key: number]: number }[];//奖励
}
/**复习规划状态与单词列表 */
export class c2sReviewPlanStatus {
    command_id: string = InterfacePath.c2sReviewPlanStatus;
    source: number;//来源 2表示单词大冒险 1表示教材单词
}
/**复习规划单词信息 */
export class s2cReviewPlanWordInfo {
    wp_id: string;//复习计划id
    w_id: string;//单词id
    word: string;//单词
    cn: string;//中文解释
    symbol: string;//音标 英标
    symbolus: string;//音标 美标
}
/**复习规划状态与单词列表返回 */
export class s2cReviewPlanStatus extends BaseRepPacket {
    ws_id: string;//单词复习的状态数据id
    pass_num: number;//已通过单词数
    word_num: number;//复习过单词数
    need_review_num: number;//今日还需要复习单词数
    review_wp_list: s2cReviewPlanWordInfo[];//复习单词列表
    error_wp_info: { [key: string]: number };//错题单词列表
    review_wp_ids: string[];//已复习过单词列表
}
/**复习规划单词提交与结算 */
export class c2sReviewPlanSubmit {
    command_id: string = InterfacePath.c2sReviewPlanSubmit;
    ws_id: string;//单词复习的状态数据id
    wp_id: string;//复习计划id
    word: string;//单词
    answer: string;//答案
    status: number;//1表示正确 2表示错误
    cost_time: number;//耗时毫秒
}
/**复习规划单词提交与结算返回 */
export class s2cReviewPlanSubmit extends BaseRepPacket {
    pass_flag: number;//是否通过 1表示通过 0表示未通过
    pass_num: number;//已通过单词数
    award: s2cRewardItem[];//奖励
}
/**复习规划更新 */
export class c2sReviewPlanUpdate {
    command_id: string = InterfacePath.c2sReviewPlanUpdate;
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
    has_reward: boolean;//是否有探索奖励
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
    explore_award: ItemData[];//奖励信息
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