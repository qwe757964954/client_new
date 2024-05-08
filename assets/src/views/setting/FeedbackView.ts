import { _decorator, Component, EditBox } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
const { ccclass, property } = _decorator;

@ccclass('FeedbackView')
export class FeedbackView extends Component {

    @property(EditBox)
    public editBox: EditBox = null;



    start() {

    }

    update(deltaTime: number) {
        
    }

    onCompleteClick(){
        console.log('onCompleteClick');
    }

    onCloseClick(){
        console.log('onCloseClick');
        ViewsManager.instance.closeView(PrefabType.FeedbackView);
    }
}


