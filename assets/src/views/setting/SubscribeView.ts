import { _decorator, Component, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsMgr } from '../../manager/ViewsManager';
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
        ViewsMgr.closeView(PrefabType.SubscribeView);
    }
}


