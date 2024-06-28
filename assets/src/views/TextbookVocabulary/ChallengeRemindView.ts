import { Label, Node, RichText, _decorator } from 'cc';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

export interface IChallengeRemindData {
    sure_text?: string;
    cancel_text?: string;
    content_text?: string;
    callFunc?: (isSure: boolean) => void;
}

@ccclass('ChallengeRemindView')
export class ChallengeRemindView extends BasePopup {

    @property(Label)
    public sure_text: Label = null;

    @property(RichText)
    public content_text: RichText = null;
    
    @property(Node)
    public btn_blue: Node = null;

    private _callFunc: (isSure: boolean) => void = () => {};
    public initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("frame")])
            .then(() => this._callFunc(false));
    }
    initEvent() {
        CCUtil.onBtnClick(this.btn_blue, this.onClickSure.bind(this));
    }
    initRemind(data:IChallengeRemindData){
        this.sure_text.string = data.sure_text || '';
        this.content_text.string = data.content_text || '';
        this._callFunc = data.callFunc || (() => {});
    }

    onClickSure(){
        this._callFunc?.(true);
        this.closePop();
    }

    onClickCancel(){
        this._callFunc?.(false);
        this.closePop();
    }

}


