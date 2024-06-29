import { EventType } from "../config/EventType";
import { c2sStaminaUpdate, s2cStaminaUpdate } from "../models/NetModel";
import { User } from "../models/User";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import { BaseControll } from "../script/BaseControll";


export class UserService extends BaseControll {

    constructor() {
        super("UserService");
    }

    onInitModuleEvent() {
        this.addModelListener(EventType.Stamina_Timeout, this.reqStaminaUpdate);
        this.addModelListener(InterfacePath.c2sStaminaUpdate, this.onStaminaUpdate);
    }

    /**体力值更新 */
    reqStaminaUpdate() {
        console.log("reqStaminaUpdate");
        let para = new c2sStaminaUpdate();
        NetMgr.sendMsg(para);
    }
    /**体力值更新返回 */
    onStaminaUpdate(data: s2cStaminaUpdate) {
        if (200 != data.code) return;
        User.stamina = data.stamina;
        User.updateStaminaLimitAndTime(data.stamina_limit, data.nex_stamina_update);
    }
}