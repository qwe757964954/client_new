import { c2sBuildingCreate, c2sBuildingEdit, c2sBuildingList, c2sBuildingProduceAdd, c2sBuildingProduceDelete, c2sBuildingProduceGet, c2sBuildingRecycle, c2sBuildingSell, c2sBuildingUpgrade, c2sCloudUnlock, c2sCloudUnlockGet, c2sLandUpdate } from "../models/NetModel";
import { NetMgr } from "../net/NetManager";
import { BaseControll } from "../script/BaseControll";

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
}