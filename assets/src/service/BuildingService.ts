import { EventType } from "../config/EventType";
import { BuildingData, RecycleData } from "../models/BuildingModel";
import { c2sBuildingBuilt, c2sBuildingBuiltReward, c2sBuildingCreate, c2sBuildingEdit, c2sBuildingEditBatch, c2sBuildingInfoGet, c2sBuildingList, c2sBuildingProduceAdd, c2sBuildingProduceDelete, c2sBuildingProduceGet, c2sBuildingRecycle, c2sBuildingSell, c2sBuildingUpgrade, c2sBuildingUpgradeReward, c2sCloudUnlock, c2sCloudUnlockGet, c2sLandUpdate, c2sPetGetReward, c2sPetInfo, c2sPetInteraction, c2sPetUpgrade } from "../models/NetModel";
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
        // this.addModelListener(InterfacePath.c2sBuildingList);
    }
    /**建筑列表 */
    reqBuildingList() {
        let para = new c2sBuildingList();
        NetMgr.sendMsg(para);
    }
    /**建筑编辑 */
    reqBuildingEdit(id: number, x: number, y: number, isFlip: boolean = false, hide: number = 0) {
        console.log("reqBuildingEdit", id, x, y, isFlip);
        let para = new c2sBuildingEdit();
        para.id = id;
        para.x = x;
        para.y = y;
        para.direction = isFlip ? 1 : 0;
        para.hide = hide;
        NetMgr.sendMsg(para);
    }
    /**建筑回收 */
    reqBuildingRecycle(id: number) {
        console.log("reqBuildingRecycle", id);
        let para = new c2sBuildingRecycle();
        para.id = id;
        NetMgr.sendMsg(para);
    }
    /**新建建筑 */
    reqBuildingCreate(bid: number, x: number, y: number, idx: number, isFlip: boolean = false) {
        console.log("reqBuildingCreate", bid, x, y, idx, isFlip);
        let para = new c2sBuildingCreate();
        para.bid = bid;
        para.x = x;
        para.y = y;
        para.idx = idx;
        para.direction = isFlip ? 1 : 0;
        NetMgr.sendMsg(para);
    }
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
    /**建筑卖出 */
    reqBuildingSell(id: number) {
        console.log("reqBuildingSell", id);
        let para = new c2sBuildingSell();
        para.id = id;
        NetMgr.sendMsg(para);
    }
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
    reqPetInfo() {
        console.log("reqPetInfo");
        let para = new c2sPetInfo();
        NetMgr.sendMsg(para);
    }
    /**宠物互动 */
    reqPetInteraction(id: number) {
        console.log("reqPetInteraction", id);
        let para = new c2sPetInteraction();
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
        console.log("repBuildingInfo", buildingID);
        let para = new c2sBuildingInfoGet();
        para.id = buildingID;
        NetMgr.sendMsg(para);
    }
}