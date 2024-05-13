import { _decorator, Component, EventTouch, instantiate, Layers, Node, Prefab, sp, tween } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import CCUtil from '../../util/CCUtil';
import { NodeUtil } from '../../util/NodeUtil';
const { ccclass, property } = _decorator;

@ccclass('ChangeRoleView')
export class ChangeRoleView extends Component {

    @property([Node])
    public roleList:Node[] = [];

    @property(Prefab)
    public roleModel: Prefab = null;//角色

    @property(Prefab)
    public petModel: Prefab = null;//角色

    private roleConfig:Map<number,number[]> = new Map([
        [101,[9500, 9700, 9701, 9702, 9703]],
        [102,[9550, 9800, 9801, 9802, 9803, 9805]],
        [103,[9600, 9900, 9901, 9902, 9903]],
    ])

    start() {
        for (let index = 0; index < this.roleList.length; index++) {
            const roleItem = this.roleList[index];
            CCUtil.onTouch(roleItem, this.onItemClick, this);
            let count = 101 + index;
            // this.initRoleSkeleton(roleItem, count);
            this.initPetSkeleton(roleItem.getChildByName("correct"), count);
        }
    }

    async initRoleSkeleton(parent:Node,count:number) {
        let role = instantiate(this.roleModel);
        parent.addChild(role);
        NodeUtil.setLayerRecursively(role,Layers.Enum.UI_2D);
        let roleModel = role.getComponent(RoleBaseModel);
        await roleModel.init(count, 1, this.roleConfig.get(count));
        role.setScale(2,2,2);
        roleModel.show(true);
    }

    initPetSkeleton(parent:Node,count:number) {
        let pet = instantiate(this.petModel);
        parent.addChild(pet);
        NodeUtil.setLayerRecursively(pet,Layers.Enum.UI_2D);
        let petModel = pet.getComponent(RoleBaseModel);
        petModel.init(count, 1);
        pet.setScale(1,1,1);
        petModel.show(true);
    }


    onItemClick(event: EventTouch) {
        // console.log("onItemClick", event);
        let pos1 = this.roleList[0].getPosition();
        let pos2 = this.roleList[1].getPosition();
        let pos3 = this.roleList[2].getPosition();
    
        // 点击中间元素
        if (event.currentTarget == this.roleList[0]) {
            console.log("点击中间");
        }
        // 点击左边元素
        else if (event.currentTarget == this.roleList[1]) {
            console.log("点击左边 逆时针");
            // 逆时针交换位置
            [this.roleList[0], this.roleList[1], this.roleList[2]] = [this.roleList[1], this.roleList[2], this.roleList[0]];
        }
        // 点击右边元素
        else if (event.currentTarget == this.roleList[2]) {
            console.log("点击右边 顺时针");
            // 顺时针交换位置
            [this.roleList[0], this.roleList[1], this.roleList[2]] = [this.roleList[2], this.roleList[0], this.roleList[1]];
        }
        tween(this.roleList[0]).to(0.5,{position: pos1}).call(()=>{
            this.setRoleStatus(this.roleList[0],true);
        }).start();
        tween(this.roleList[1]).to(0.5,{position: pos2}).call(()=>{
            this.setRoleStatus(this.roleList[1],false);
        }).start();
        tween(this.roleList[2]).to(0.5,{position: pos3}).call(()=>{
            this.setRoleStatus(this.roleList[2],false);
        }).start();
    }
    
    setRoleStatus(node:Node,isCurent:boolean) {
        let role_sk = node.getChildByName("role_sk");
        let scaleNum = isCurent?0.8:0.7;
        let ani_name = isCurent?"book":"idle";
        role_sk.setScale(scaleNum,scaleNum,scaleNum);
        let sk = role_sk.getComponent(sp.Skeleton);
        sk.setAnimation(0,ani_name,true);
    }

    onSelectRoleClick(){
        console.log("onSelectRoleClick____________");
        
    }

    onBackClose(){
        console.log("onBackClose____________");
        ViewsManager.instance.closeView(PrefabType.ChangeRoleView);
    }
}


