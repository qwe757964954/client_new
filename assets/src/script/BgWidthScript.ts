import { _decorator, Component, UITransform } from 'cc';
import GlobalConfig from '../GlobalConfig';
const { ccclass, property } = _decorator;

// 背景图适配屏幕
@ccclass('BgWidthScript')
export class BgWidthScript extends Component {

    public onLoad() {
        let transform = this.getComponent(UITransform);
        let imgRate = transform.width / transform.height;
        if (GlobalConfig.WIN_RATE > imgRate) {
            let rate = GlobalConfig.WIN_RATE / imgRate;
            transform.width = Math.ceil(transform.width * rate);
            transform.height = Math.ceil(transform.height * rate);
        }
    }
}


