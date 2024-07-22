import { _decorator, Component, instantiate, Layers, Node, Prefab, v3 } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { User } from '../../models/User';
import { NodeUtil } from '../../util/NodeUtil';
const { ccclass, property } = _decorator;

@ccclass('ShopPlayerView')
export class ShopPlayerView extends Component {
    @property({ type: Node, tooltip: "角色容器" })
    public roleContainer: Node = null;
    private _role: Node = null;
    start() {
        this.showRoleDress();
    }

    /**显示角色的骨骼动画 */
    private async showRoleDress() {
        this.roleContainer.removeAllChildren();
        this._role = null;
        const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.RoleModel.path}`, Prefab) as Prefab;
        this._role = instantiate(prefab);
        this._role.setScale(v3(2, 2, 1));
        this.roleContainer.addChild(this._role);
        NodeUtil.setLayerRecursively(this._role, Layers.Enum.UI_2D);
        let roleModel = this._role.getComponent(RoleBaseModel);
        let modelId: number = Number(User.curHeadPropId);
        roleModel.init(modelId, 1, [9500, 9700, 9701, 9702, 9703]);
        roleModel.show(true);
    }
}

