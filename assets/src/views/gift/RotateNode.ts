import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**无限旋转组件，适用于无限原地360度旋转的Node,如转圈Load图标，奖励页面中的转圈光环 */
@ccclass('RotateNode')
export class RotateNode extends Component {
    @property({ tooltip: "每秒旋转角度" })
    public degreePerSecode: number = 360;

    start() {

    }

    update(dt: number) {
        var eRot: Vec3 = this.node.eulerAngles;
        eRot.z = eRot.z + (this.degreePerSecode * dt);
        this.node.eulerAngles = eRot;
    }
}


