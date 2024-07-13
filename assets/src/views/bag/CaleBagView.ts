import { _decorator, Label, Node } from 'cc';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('CaleBagView')
export class CaleBagView extends BaseView {
    @property(Node)
    public reduce_btn:Node = null;

    @property(Node)
    public add_btn:Node = null;

    @property(Label)
    public cale_text: Label = null;

    protected initUI(): void {
        
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.reduce_btn,this.reduceClickEvent.bind(this));
        CCUtil.onBtnClick(this.add_btn,this.addClickEvent.bind(this));
    }

    reduceClickEvent(){
        console.log("reduceClickEvent");
        let num = parseInt(this.cale_text.string);
        if(num > 0){
            num--;
            this.cale_text.string = num.toString();
        }
        
    }

    addClickEvent(){
        console.log("addClickEvent");
        let num = parseInt(this.cale_text.string);
        num++;
        this.cale_text.string = num.toString();
    }

    getCaleNumber(){
        return parseInt(this.cale_text.string);
    }

}

