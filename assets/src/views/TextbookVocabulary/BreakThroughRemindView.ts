import { Label, Node, _decorator } from 'cc';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
import { ITextbookRemindData } from './TextbookRemindView';
const { ccclass, property } = _decorator;

@ccclass('BreakThroughRemindView')
export class BreakThroughRemindView extends BasePopup {
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

    public _callFunc:(isSure:boolean)=>void = null;
    public initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("frame")]).then(() => {

        });
    }
    initEvent() {
        CCUtil.onBtnClick(this.btn_blue, this.onClickSure.bind(this));
        CCUtil.onBtnClick(this.btn_green, this.onClickCancel.bind(this));
    }

    initRemind(data:ITextbookRemindData){
        this.sure_text.string = data.sure_text;
        this.cancel_text.string = data.cancel_text;
        this.content_text.string = data.content_text;
        this._callFunc = data.callFunc;
        console.log("this._callFunc....",this._callFunc);
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


