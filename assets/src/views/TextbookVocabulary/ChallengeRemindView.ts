import { _decorator, Component, Label, RichText } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
const { ccclass, property } = _decorator;

export interface IChallengeRemindData {
    sure_text?: string;
    cancel_text?: string;
    content_text?: string;
    callFunc?:(isSure:boolean)=>void;
}

@ccclass('ChallengeRemindView')
export class ChallengeRemindView extends Component {

    @property(Label)
    public sure_text: Label = null;

    @property(RichText)
    public content_text: RichText = null;
    
    private _callFunc:(isSure:boolean)=>void = null;

    start() {

    }

    initRemind(data:IChallengeRemindData){
        this.sure_text.string = data.sure_text;
        this.content_text.string = data.content_text;
        this._callFunc = data.callFunc;
    }

    onClickSure(){
        if(this._callFunc){
            this._callFunc(true);
        }
        ViewsManager.instance.closeView(PrefabType.ChallengeRemindView);
    }

    onClickCancel(){
        if(this._callFunc){
            this._callFunc(false);
        }
        ViewsManager.instance.closeView(PrefabType.ChallengeRemindView);
    }

}


