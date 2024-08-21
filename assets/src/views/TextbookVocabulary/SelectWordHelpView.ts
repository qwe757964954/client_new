import { _decorator, Component } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsMgr } from '../../manager/ViewsManager';
const { ccclass, property } = _decorator;

@ccclass('SelectWordHelpView')
export class SelectWordHelpView extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
    onCloseHelpView(){
        ViewsMgr.closeView(PrefabType.SelectWordHelp);
    }
}


