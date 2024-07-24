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

    private _max_value:number = 1;

    protected initUI(): void {
        
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.reduce_btn,this.reduceClickEvent.bind(this));
        CCUtil.onBtnClick(this.add_btn,this.addClickEvent.bind(this));
    }

    reduceClickEvent(){
        console.log("reduceClickEvent");
        let num = parseInt(this.cale_text.string);
        if(num > 1){
            num--;
            this.cale_text.string = num.toString();
        }
        
    }

    addClickEvent(){
        console.log("addClickEvent");
        let num = parseInt(this.cale_text.string);
        num++;
        if(num >= this._max_value){
            num = this._max_value;
        }
        this.cale_text.string = num.toString();
    }

    getCaleNumber(){
        return parseInt(this.cale_text.string);
    }

    setCaleMax(max:number){
        this._max_value = max;
    }
}

