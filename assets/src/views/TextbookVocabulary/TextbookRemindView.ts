import { _decorator, Component, Label } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
const { ccclass, property } = _decorator;

export interface ITextbookRemindData {
    sure_text: string;
    cancel_text: string;
    content_text: string;
    callFunc:(isSure:boolean)=>void;
}

@ccclass('TextbookRemindView')
export class TextbookRemindView extends Component {

    @property(Label)
    public sure_text: Label = null;

    @property(Label)
    public cancel_text: Label = null;

    @property(Label)
    public content_text: Label = null;
    
    private _callFunc:(isSure:boolean)=>void = null;

    start() {

    }

    initRemind(data:ITextbookRemindData){
        this.sure_text.string = data.sure_text;
        this.cancel_text.string = data.cancel_text;
        this.content_text.string = data.content_text;
        this._callFunc = data.callFunc;
    }

    onClickSure(){
        if(this._callFunc){
            this._callFunc(true);
        }
        ViewsManager.instance.closeView(PrefabType.TextbookRemindView);
    }

    onClickCancel(){
        if(this._callFunc){
            this._callFunc(false);
        }
        ViewsManager.instance.closeView(PrefabType.TextbookRemindView);
    }

}


