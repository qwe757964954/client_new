import { _decorator, Component, Node } from 'cc';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';
const { ccclass, property } = _decorator;

@ccclass('SubscribeView')
export class SubscribeView extends Component {
    @property(Node)
    public qrCode:Node = null;          // 个人中心

    start() {

    }

    update(deltaTime: number) {
        
    }

    
    // 关闭
    btnCloseFunc() {
        console.log("btnCloseFunc");
        ViewsManager.instance.closeView(PrefabType.SubscribeView);
    }
}


