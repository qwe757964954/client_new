import { _decorator, Component, Label } from 'cc';
import { PrefabType } from '../../config/PrefabType';
const { ccclass, property } = _decorator;

@ccclass('ApplyLogoutView')
export class ApplyLogoutView extends Component {
    @property(Label)
    public msgLabel: Label = null;

    private _agreeCallback: () => void = null;

    setAgreeCallback(callback: () => void) {
        this._agreeCallback = callback;
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    onClickError(){
        ViewsMgr.closeView(PrefabType.ApplyLogoutView);
    }

    onAgreeContinue(){
        if(this._agreeCallback){
            this._agreeCallback();
        }
        ViewsMgr.closeView(PrefabType.ApplyLogoutView);
    }

}


