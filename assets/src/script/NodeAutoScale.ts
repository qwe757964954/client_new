import { _decorator, Component, UITransform } from 'cc';
import GlobalConfig from '../GlobalConfig';
const { ccclass, property } = _decorator;

@ccclass('NodeAutoScale')
export class NodeAutoScale extends Component {
    protected onLoad(): void {
        let transform = this.getComponent(UITransform);
        let imgRate = transform.width / transform.height;
        if (GlobalConfig.WIN_RATE > imgRate) {
            let rate = GlobalConfig.WIN_RATE / imgRate;
            this.node.setScale(rate, rate);
        }
    }
}


