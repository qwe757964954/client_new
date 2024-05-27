import { _decorator, Label, Node } from 'cc';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

export interface ITextbookRemindData {
    sure_text?: string;
    cancel_text?: string;
    content_text?: string;
    callFunc?:(isSure:boolean)=>void;
}

@ccclass('TextbookRemindView')
export class TextbookRemindView extends BasePopup {

    @property(Label)
    public sure_text: Label = null;

    @property(Label)
    public cancel_text: Label = null;

    @property(Label)
    public content_text: Label = null;

    @property(Node)
    public btn_blue: Node = null;

    @property(Node)
    public btn_green: Node = null;

    private _callFunc:(isSure:boolean)=>void = null;

    start() {
        this.enableClickBlankToClose([this.node.getChildByName("frame")]).then(() => {
            if(this._callFunc){
                this._callFunc(false);
            }
        });
        this.initEvent();
    }

    initEvent() {
        CCUtil.onTouch(this.btn_blue, this.onClickSure, this);
        CCUtil.onTouch(this.btn_green, this.onClickCancel, this);
    }

    /**移除监听 */
    removeEvent() {
        CCUtil.offTouch(this.btn_blue, this.onClickSure, this);
        CCUtil.offTouch(this.btn_green, this.onClickCancel, this);
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
        this.closePop();
    }

    onClickCancel(){
        if(this._callFunc){
            this._callFunc(false);
        }
        this.closePop();
    }
    onDestroy(): void {
        this.removeEvent();
    }
}


