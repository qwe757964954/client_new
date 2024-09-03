import { EventType } from "../config/EventType";
import { BuildingData, RecycleData } from "../models/BuildingModel";
import { c2sBuildingBuilt, c2sBuildingBuiltReward, c2sBuildingBuiltSpeed, c2sBuildingCreate, c2sBuildingEdit, c2sBuildingEditBatch, c2sBuildingInfoGet, c2sBuildingList, c2sBuildingProduceAdd, c2sBuildingProduceDelete, c2sBuildingProduceGet, c2sBuildingProduceSpeed, c2sBuildingUpgrade, c2sBuildingUpgradeReward, c2sBuildingUpgradeSpeed, c2sCloudUnlock, c2sCloudUnlockGet, c2sCloudUnlockSpeed, c2sEnterIsland, c2sExitIsland, c2sLandUpdate, c2sPetGetReward, c2sPetInfo, c2sPetInteraction, c2sPetUpgrade, c2sSpeedWordsGet, s2cEnterIsland, s2cExitIsland } from "../models/NetModel";
import { User } from "../models/User";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import { BaseControll } from "../script/BaseControll";
import { EventMgr } from "../util/EventManager";
import { ToolUtil } from "../util/ToolUtil";

/**建筑服务 */
export class BuildingService extends BaseControll {
    constructor() {
        super("BuildingService");
    }
    onInitModuleEvent() {
        this.addModelListener(InterfacePath.c2sEnterIsland, this.repEnterIsland.bind(this));
        this.addModelListener(InterfacePath.c2sExitIsland, this.repExitIsland.bind(this));
    }
    /**建筑列表 */
    reqBuildingList(userID: number) {
        console.log("reqBuildingList", userID);
        let para = new c2sBuildingList();
        para.visited_id = userID;
        NetMgr.sendMsg(para);
    }
    // /**建筑编辑 */
    // reqBuildingEdit(id: number, x: number, y: number, isFlip: boolean = false, hide: number = 0) {
    //     console.log("reqBuildingEdit", id, x, y, isFlip);
    //     let para = new c2sBuildingEdit();
    //     para.id = id;
    //     para.x = x;
    //     para.y = y;
    //     para.direction = isFlip ? 1 : 0;
    //     para.hide = hide;
    //     NetMgr.sendMsg(para);
    // }
    // /**建筑回收 */
    // reqBuildingRecycle(id: number) {
    //     console.log("reqBuildingRecycle", id);
    //     let para = new c2sBuildingRecycle();
    //     para.id = id;
    //     NetMgr.sendMsg(para);
    // }
    // /**新建建筑 */
    // reqBuildingCreate(bid: number, x: number, y: number, idx: number, isFlip: boolean = false) {
    //     console.log("reqBuildingCreate", bid, x, y, idx, isFlip);
    //     let para = new c2sBuildingCreate();
    //     para.bid = bid;
    //     para.x = x;
    //     para.y = y;
    //     para.idx = idx;
    //     para.direction = isFlip ? 1 : 0;
    //     NetMgr.sendMsg(para);
    // }
    /**地块更新 */
    reqLandUpdate(map: { [key: string]: number }) {
        // console.log("reqLandUpdate", map);
        let para = new c2sLandUpdate();
        para.update_land = map;
        NetMgr.sendMsg(para);
    }
    /**建筑升级 */
    reqBuildingUpgrade(id: number, level: number) {
        console.log("reqBuildingUpgrade", id, level);
        let para = new c2sBuildingUpgrade();
        para.id = id;
        para.level = level;
        NetMgr.sendMsg(para);
    }
    // /**建筑卖出 */
    // reqBuildingSell(id: number) {
    //     console.log("reqBuildingSell", id);
    //     let para = new c2sBuildingSell();
    //     para.id = id;
    //     NetMgr.sendMsg(para);
    // }
    /**建筑生产队列添加 */
    reqBuildingProduceAdd(id: number, product_type: number[]) {
        console.log("reqBuildingProduceAdd", id, product_type);
        let para = new c2sBuildingProduceAdd();
        para.id = id;
        para.product_type = product_type;
        NetMgr.sendMsg(para);
    }
    /**建筑生产队列删除 */
    reqBuildingProduceDelete(id: number, product_num: number) {
        console.log("reqBuildingProduceRemove", id, product_num);
        let para = new c2sBuildingProduceDelete();
        para.id = id;
        para.product_num = product_num;
        NetMgr.sendMsg(para);
    }
    /**建筑生产获取 */
    reqBuildingProduceGet(id: number, product_num: number = null) {
        console.log("reqBuildingProduceGet", id, product_num);
        let para = new c2sBuildingProduceGet();
        para.id = id;
        para.product_num = product_num;
        NetMgr.sendMsg(para);
    }
    /**乌云解锁 */
    reqCloudUnlock(ary: string[]) {
        console.log("reqCloudUnlock", ary);
        let para = new c2sCloudUnlock();
        para.unlock_cloud = ary;
        NetMgr.sendMsg(para);
    }
    /**乌云解锁获取 */
    reqCloudUnlockGet(ary: string[]) {
        console.log("reqCloudUnlockGet", ary);
        let para = new c2sCloudUnlockGet();
        para.unlock_cloud = ary;
        NetMgr.sendMsg(para);
    }

    /**宠物信息 */
    reqPetInfo(userID: number) {
        console.log("reqPetInfo", userID);
        let para = new c2sPetInfo();
        para.visited_id = userID;
        NetMgr.sendMsg(para);
    }
    /**宠物互动 */
    reqPetInteraction(id: number, userID: number) {
        console.log("reqPetInteraction", id);
        let para = new c2sPetInteraction();
        para.visited_id = userID;
        para.interact_id = id;
        NetMgr.sendMsg(para);
    }
    /**宠物升级 */
    reqPetUpgrade(level: number) {
        console.log("reqPetUpgrade", level);
        let para = new c2sPetUpgrade();
        para.level = level;
        NetMgr.sendMsg(para);
    }
    /**宠物领取奖励 */
    reqPetGetReward() {
        console.log("reqPetGetReward");
        let para = new c2sPetGetReward();
        NetMgr.sendMsg(para);
    }
    /**建筑批量编辑 */
    reqBuildingEditBatch(createAry: c2sBuildingCreate[], updateAry: c2sBuildingEdit[], deleteAry: number[], type: number = 0) {
        console.log("reqBuildingEditBatch", createAry, updateAry, deleteAry, type);
        let para = new c2sBuildingEditBatch();
        para.type = type;
        para.insert_list = createAry;
        para.update_list = updateAry;
        para.delete_list = deleteAry;
        NetMgr.sendMsg(para);
    }
    /**购买建筑 */
    reqBuyBuilding(id: number) {
        console.log("reqBuyBuilding", id);
        let idx = ToolUtil.getIdx();
        let obj = new c2sBuildingCreate();
        obj.idx = idx;
        obj.bid = id;
        obj.x = 0;
        obj.y = 0;
        obj.direction = 0;
        obj.hide = 1;

        let data = new RecycleData();
        data.bid = id;
        let buildingData = new BuildingData();
        data.data = buildingData;
        buildingData.idx = idx;
        EventMgr.emit(EventType.Building_Shop_Buy, data);
        this.reqBuildingEditBatch([obj], [], [], 1);
    }



    /**建筑建造 */
    reqBuildingBuilt(buildingID: number) {
        console.log("reqBuildingBuilt", buildingID);
        let para = new c2sBuildingBuilt();
        para.id = buildingID;
        NetMgr.sendMsg(para);
    }
    /**建筑建造领取奖励 */
    reqBuildingBuiltReward(buildingID: number) {
        console.log("reqBuildingBuiltReward", buildingID);
        let para = new c2sBuildingBuiltReward();
        para.id = buildingID;
        NetMgr.sendMsg(para);
    }
    /**建筑升级领取奖励 */
    reqBuildingUpgradeReward(buildingID: number) {
        console.log("reqBuildingUpgradeReward", buildingID);
        let para = new c2sBuildingUpgradeReward();
        para.id = buildingID;
        NetMgr.sendMsg(para);
    }
    /**建筑信息获取 */
    reqBuildingInfoGet(buildingID: number) {
        console.log("reqBuildingInfoGet", buildingID);
        let para = new c2sBuildingInfoGet();
        para.id = buildingID;
        NetMgr.sendMsg(para);
    }
    /**获取加速单词 */
    reqSpeedWordsGet(buildingID: number, product_num: number = null) {
        console.log("reqSpeedWordsGet", buildingID, product_num);
        let para = new c2sSpeedWordsGet();
        para.id = buildingID;
        para.product_num = product_num;
        NetMgr.sendMsg(para);
    }
    reqSpeedWordsGetEx(unlock_cloud: string) {
        console.log("reqSpeedWordsGetEx", unlock_cloud);
        let para = new c2sSpeedWordsGet();
        para.unlock_cloud = unlock_cloud;
        NetMgr.sendMsg(para);
    }
    /**乌云加速 */
    reqCloudUnlockSpeed(unlock_cloud: string, word: string, answer: string) {
        console.log("reqCloudUnlockSpeed", unlock_cloud);
        let para = new c2sCloudUnlockSpeed();
        para.unlock_cloud = unlock_cloud;
        para.word = word;
        para.answer = answer;
        NetMgr.sendMsg(para);
    }
    /**建筑建造加速 */
    reqBuildingBuiltSpeed(buildingID: number, word: string, answer: string) {
        console.log("reqBuildingBuiltSpeed", buildingID);
        let para = new c2sBuildingBuiltSpeed();
        para.id = buildingID;
        para.word = word;
        para.answer = answer;
        NetMgr.sendMsg(para);
    }
    /**建筑升级加速 */
    reqBuildingUpgradeSpeed(buildingID: number, word: string, answer: string) {
        console.log("reqBuildingUpgradeSpeed", buildingID);
        let para = new c2sBuildingUpgradeSpeed();
        para.id = buildingID;
        para.word = word;
        para.answer = answer;
        NetMgr.sendMsg(para);
    }
    /**建筑生产加速 */
    reqBuildingProduceSpeed(buildingID: number, word: string, answer: string, product_num: number) {
        console.log("reqBuildingProduceSpeed", buildingID, product_num);
        let para = new c2sBuildingProduceSpeed();
        para.id = buildingID;
        para.word = word;
        para.answer = answer;
        para.product_num = product_num;
        NetMgr.sendMsg(para);
    }

    /**用户进入小岛 */
    reqEnterIsland(bID: number) {
        console.log("reqEnterIsland", bID);
        let para = new c2sEnterIsland();
        para.visited_id = bID;
        NetMgr.sendMsg(para);
    }
    repEnterIsland(data: s2cEnterIsland) {
        if (1601 == data.code) {
            User.curMapDataUserID = null;
            return;
        }
        if (200 != data.code) {
            return;
        }
        User.curMapDataUserID = data.visited_id;
    }
    /**用户退出小岛 */
    reqExitIsland(bID: number) {
        console.log("reqExitIsland", bID);
        let para = new c2sExitIsland();
        para.visited_id = bID;
        NetMgr.sendMsg(para);
    }
    repExitIsland(data: s2cExitIsland) {
        if (200 != data.code) {
            return;
        }
        User.curMapDataUserID = null;
    }
}