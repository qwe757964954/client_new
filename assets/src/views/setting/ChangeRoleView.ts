import { _decorator, EventTouch, instantiate, Layers, Node, Prefab, sp, tween, Vec3 } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { UserPlayerDetail, UserPlayerModifyModel } from '../../models/SettingModel';
import { BaseView } from '../../script/BaseView';
import { STServer } from '../../service/SettingService';
import CCUtil from '../../util/CCUtil';
import { NodeUtil } from '../../util/NodeUtil';
import { SettingRoleItem } from './SettingRoleItem';
const { ccclass, property } = _decorator;

@ccclass('ChangeRoleView')
export class ChangeRoleView extends BaseView {

    @property([Node])
    public roleList: Node[] = [];

    @property(Prefab)
    public roleModel: Prefab = null; //角色

    @property(Prefab)
    public petModel: Prefab = null; //宠物

    private _currentRoleId: number = null;

    private roleConfig: Map<number, number[]> = new Map([
        [101, [9500, 9700, 9701, 9702, 9703]],
        [102, [9550, 9800, 9801, 9802, 9803, 9805]],
        [103, [9600, 9900, 9901, 9902, 9903]],
    ]);

    protected initUI(): void {
        for (let index = 0; index < this.roleList.length; index++) {
            const roleItem = this.roleList[index];
            let count = 101 + index;
            roleItem.getComponent(SettingRoleItem).role_id = count;
            CCUtil.onTouch(roleItem, this.onItemClick, this);

            // this.initRoleSkeleton(roleItem, count);
            this.initPetSkeleton(roleItem.getChildByName("correct"), count);
        }
        this.moveRoleToCenter(this._currentRoleId);
    }

    updateData(data: UserPlayerDetail) {
        this._currentRoleId = data.role_id;
    }

    async initRoleSkeleton(parent: Node, count: number) {
        let role = instantiate(this.roleModel);
        parent.addChild(role);
        NodeUtil.setLayerRecursively(role, Layers.Enum.UI_2D);
        let roleModel = role.getComponent(RoleBaseModel);
        await roleModel.initSelf();
        role.setScale(2, 2, 2);
        roleModel.show(true);
    }

    initPetSkeleton(parent: Node, count: number) {
        let pet = instantiate(this.petModel);
        parent.addChild(pet);
        NodeUtil.setLayerRecursively(pet, Layers.Enum.UI_2D);
        let petModel = pet.getComponent(RoleBaseModel);
        petModel.initSelf();
        pet.setScale(1, 1, 1);
        petModel.show(true);
    }

    // New method to move a role to the center based on ID
    moveRoleToCenter(roleId: number) {

        const index = roleId - 101;
        if (index < 0 || index >= this.roleList.length) {
            console.error(`Invalid roleId: ${roleId}`);
            return;
        }
        const [pos1, pos2, pos3] = this.roleList.map(role => role.getPosition());

        // Rotate roles to set the specified role to the center
        const rotationSteps = (3 - index) % 3; // Calculate steps needed to rotate to the center
        for (let i = 0; i < rotationSteps; i++) {
            [this.roleList[0], this.roleList[1], this.roleList[2]] = [this.roleList[2], this.roleList[0], this.roleList[1]];
        }

        // Apply animations
        this.animateRoles(pos1, pos2, pos3);
    }

    onItemClick(event: EventTouch) {
        const index = this.roleList.indexOf(event.currentTarget as Node);
        const roleId = 101 + index;
        this.moveRoleToCenter(roleId);
        this._currentRoleId = event.currentTarget.getComponent(SettingRoleItem).role_id;
    }

    // Helper function to animate the roles
    animateRoles(pos1: Vec3, pos2: Vec3, pos3: Vec3) {
        tween(this.roleList[0]).to(0.5, { position: pos1 }).call(() => {
            this.setRoleStatus(this.roleList[0], true);
        }).start();
        tween(this.roleList[1]).to(0.5, { position: pos2 }).call(() => {
            this.setRoleStatus(this.roleList[1], false);
        }).start();
        tween(this.roleList[2]).to(0.5, { position: pos3 }).call(() => {
            this.setRoleStatus(this.roleList[2], false);
        }).start();
    }

    setRoleStatus(node: Node, isCurrent: boolean) {
        const role_sk = node.getChildByName("role_sk");
        const scaleNum = isCurrent ? 0.8 : 0.7;
        const ani_name = isCurrent ? "book" : "idle";
        role_sk.setScale(scaleNum, scaleNum, scaleNum);
        const sk = role_sk.getComponent(sp.Skeleton);
        sk.setAnimation(0, ani_name, true);
    }

    onSelectRoleClick() {
        console.log("onSelectRoleClick____________", this._currentRoleId);
        let param: UserPlayerModifyModel = {
            role_id: this._currentRoleId
        };
        STServer.reqUserPlayerModify(param);
        ViewsManager.instance.closeView(PrefabType.ChangeRoleView);
    }

    onBackClose() {
        console.log("onBackClose____________");
        ViewsManager.instance.closeView(PrefabType.ChangeRoleView);
    }
}
