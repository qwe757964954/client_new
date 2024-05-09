import { _decorator, Component } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
const { ccclass, property } = _decorator;

@ccclass('ResetPasswordView')
export class ResetPasswordView extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    onCloseClick(){
        console.log('onCloseClick');
        ViewsManager.instance.closeView(PrefabType.ResetPasswordView);
    }

    onCommitClick(){
        console.log('onCommitClick');
    }
}


