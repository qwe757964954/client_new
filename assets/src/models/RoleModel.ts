import { _decorator } from 'cc';
import { DataMgr } from '../manager/DataMgr';
import { RoleBaseModel, RoleType } from './RoleBaseModel';
const { ccclass, property } = _decorator;
/**角色 */
@ccclass('RoleModel')
export class RoleModel extends RoleBaseModel {
    // 初始化
    public async init(roleID: number, level: number = 1, slots: number[] = []) {
        await super.init(roleID, level, slots, RoleType.role);
        this.updateSpineSlot();
    }
    // 更新spine插槽
    public updateSpineSlot() {
        let roleSlot = DataMgr.instance.roleSlot[this._roleID];
        let roleSlotConfig = DataMgr.instance.roleSlotConfig;
        let showSlot = [];
        this._slots.forEach(propID => {
            showSlot = showSlot.concat(roleSlotConfig[propID].Ass);
        });
        roleSlot.slots.forEach(slotName => {
            if (-1 == showSlot.indexOf(slotName)) {
                let slot = this.role.findSlot(slotName);
                slot?.setAttachment(null);//有些插槽是不存在的
            }
        });
    }
}

