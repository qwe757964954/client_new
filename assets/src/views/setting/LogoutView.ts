import { _decorator, Component } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
const { ccclass, property } = _decorator;

@ccclass('LogoutView')
export class LogoutView extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
    
    onCloseClick(){
        console.log('onCloseClick');
        ViewsManager.instance.closeView(PrefabType.LogoutView);
    }

    onCommitLogoutClick() {
        console.log('onCommitLogoutClick');
    }
}

