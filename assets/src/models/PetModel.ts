import { _decorator } from 'cc';
import { RoleBaseModel, RoleType } from './RoleBaseModel';
const { ccclass, property } = _decorator;
/**精灵 */
@ccclass('PetModel')
export class PetModel extends RoleBaseModel {
    // 初始化
    public async init(roleID: number, level: number = 1, slots: number[] = []) {
        await super.init(roleID, level, slots, RoleType.sprite);
    }

    public hit() {
        return new Promise((resolve) => {
            this.role.setCompleteListener(() => {
                this.role.setCompleteListener(null);
                this.role.setAnimation(0, 'idle', true);
                resolve(true);
            })
            this.role.setAnimation(0, 'skill', false);
        });
    }
}


