import { _decorator, Component } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
const { ccclass, property } = _decorator;

@ccclass('SelectWordHelpView')
export class SelectWordHelpView extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
    onCloseHelpView(){
        ViewsManager.instance.closeView(PrefabType.SelectWordHelp);
    }
}


