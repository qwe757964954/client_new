import { _decorator } from 'cc';
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
    public async init(roleID: number) {
        await super.init(roleID, 1, RoleType.role);
    }
    public initSelf() {
        super.initSelf();
        this.init(User.roleID);
        this.clothings = User.userClothes;
    }
    /**跑步 */
    public run() {
        if (!this._isSpLoad) return;
        this.role.setAnimation(0, this._roleInfo.actNames[2], true);
    }
    /**跳跃 */
    public jump() {
        if (!this._isSpLoad) return;
        this.role.setAnimation(0, this._roleInfo.actNames[3], true);
    }
    /**招手 */
    public waved() {
        if (!this._isSpLoad) return;
        this.role.setAnimation(0, this._roleInfo.actNames[4], true);
    }
    /**死亡 */
    public die() {
        if (!this._isSpLoad) return;
        this.role.setAnimation(0, this._roleInfo.actNames[5], true);
    }
}

