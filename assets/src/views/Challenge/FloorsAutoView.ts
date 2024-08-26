import { _decorator, CCInteger, Component, Node, UITransform, view } from 'cc';
import { ViewsManager } from '../../manager/ViewsManager';
import { RoleBaseModel } from '../../models/RoleBaseModel';
const { ccclass, property } = _decorator;

@ccclass('FloorsAutoView')
export class FloorsAutoView extends Component {
    @property(Node)
    public floors1: Node = null;
    @property(Node)
    public floors2: Node = null;
    @property(Node)
    public role_node: Node = null;
    @property({ type: CCInteger })
    private speed: number = 0;
    start() {
        this.setFloorProps();
        this.initRolePlayer();
    }

    setFloorProps() {
        let winWidth = view.getVisibleSize().width;
        this.floors2.getComponent(UITransform).width = winWidth;
        this.floors2.setPosition(winWidth, this.floors2.getPosition().y, 0);
    }

    async initRolePlayer() {
        const role = await ViewsManager.addRoleToNode(this.role_node);
        const roleModel = role.getComponent(RoleBaseModel);
        roleModel.walk();
    }
    update(deltaTime: number) {
        let pos1 = this.floors1.getPosition().x - this.speed * deltaTime;
        let pos2 = this.floors2.getPosition().x - this.speed * deltaTime;
        this.floors1.setPosition(pos1, this.floors1.getPosition().y, 0);
        this.floors2.setPosition(pos2, this.floors1.getPosition().y, 0);
        let bgWidth = this.floors2.getComponent(UITransform).width;
        let winWidth = view.getVisibleSize().width;
        if (this.floors1.getPosition().x < -winWidth) {
            this.floors1.setPosition(bgWidth + this.floors2.getPosition().x, this.floors1.getPosition().y, 0);
        }
        if (this.floors2.getPosition().x < -winWidth) {
            this.floors2.setPosition(bgWidth + this.floors1.getPosition().x, this.floors1.getPosition().y, 0);
        }
    }
}


