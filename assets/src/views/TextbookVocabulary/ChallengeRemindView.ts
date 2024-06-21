import { Label, Node, RichText, _decorator } from 'cc';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

export interface IChallengeRemindData {
    sure_text?: string;
    cancel_text?: string;
    content_text?: string;
    callFunc?:(isSure:boolean)=>void;
}

@ccclass('ChallengeRemindView')
export class ChallengeRemindView extends BasePopup {

    @property(Label)
    public sure_text: Label = null;

    @property(RichText)
    public content_text: RichText = null;
    
    @property(Node)
    public btn_blue: Node = null;

    private _callFunc:(isSure:boolean)=>void = null;
    public initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("frame")]).then(()=>{
            if(this._callFunc){
                this._callFunc(false);
            }
        });
    }
    initEvent() {
        CCUtil.onTouch(this.btn_blue, this.onClickSure, this);
    }

    /**移除监听 */
    removeEvent() {
        CCUtil.offTouch(this.btn_blue, this.onClickSure, this);
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
        this.closePop();
    }

    onClickCancel(){
        if(this._callFunc){
            this._callFunc(false);
        }
        this.closePop();
    }

}


