import { _decorator } from 'cc';
import { DataMgr } from '../manager/DataMgr';
import { RoleBaseModel, RoleType } from './RoleBaseModel';
import { User } from './User';
const { ccclass, property } = _decorator;
const slotsAry = [
    [9500, 9700, 9701, 9702, 9703],
    [9550, 9800, 9801, 9802, 9803, 9805],
    [9600, 9900, 9901, 9902, 9903]
];

/**角色 */
@ccclass('RoleModel')
export class RoleModel extends RoleBaseModel {
    // 初始化
    public async init(roleID: number, level: number = 1, slots: number[] = []) {
        await super.init(roleID, level, slots, RoleType.role, this.updateSpineSlot.bind(this));
    }
    public initSelf() {
        let roleID = User.roleID;
        if (roleID < 100) roleID += 100;
        let id = this._roleID;
        if (id > 100) id -= 100;
        this.init(roleID, 1, slotsAry[id - 1]);
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

