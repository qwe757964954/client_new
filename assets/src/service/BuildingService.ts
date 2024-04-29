import { c2sBuildingCreate, c2sBuildingEdit, c2sBuildingList } from "../models/NetModel";
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
    reqBuildingEdit(id: number, x: number, y: number, isFlip: boolean = false) {
        console.log("reqBuildingEdit", id, x, y, isFlip);
        let para = new c2sBuildingEdit();
        para.id = id;
        para.x = x;
        para.y = y;
        para.direction = isFlip ? 1 : 0;
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
}