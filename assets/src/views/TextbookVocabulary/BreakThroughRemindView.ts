import { Label, Node, _decorator } from 'cc';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;
export interface ITextbookRemindData {
    sure_text?: string;
    cancel_text?: string;
    content_text?: string;
    callFunc?:(isSure:boolean)=>void;
}
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
    public closeIcon: Node = null;

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
        CCUtil.onBtnClick(this.closeIcon, this.onCloseClick.bind(this));
    }

    onCloseClick(){
        this.closePop();
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
}


