import { _decorator, Component, Label, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { EventMgr } from '../../util/EventManager';
import { ScrollViewExtra } from './picker/ScrollViewExtra';
const { ccclass, property } = _decorator;

export interface PlanSaveData {
    left:string;
    right:string;
    isSave:boolean
}


@ccclass('SettingPlanView')
export class SettingPlanView extends Component {
    @property(ScrollViewExtra)
    public leftScroll:ScrollViewExtra = null
    @property(ScrollViewExtra)
    public rightScroll:ScrollViewExtra = null

    @property(Label)
    public book_title:Label = null

    private _leftSelectString:string = "1";
    private _rightSelectString:string = "1";
    private _isModify:boolean = false;
    start() {
        this.setLeftRightDatePick();
    }
    setLeftRightDatePick() {
        this.leftScroll.initSelectCallFunc((plan_text:string)=>{
            this._leftSelectString = plan_text;
        })
        this.rightScroll.initSelectCallFunc((plan_text:string)=>{
            this._rightSelectString = plan_text;
        })
    }

    onLoadLeftVerticalList(item:Node, idx:number){
        console.log("onLoadLeftVerticalList",item,idx);
        let label = item.getComponent(Label);
        // let indexNum = idx + 1;
        let indexNum = idx + 0;
        let bookImgUrl = `${indexNum}`;
        label.string = bookImgUrl;
    }   

    onLoadRightVerticalList(item:Node, idx:number){
        console.log("onLoadRightVerticalList",item,idx);
        let label = item.getComponent(Label);
        let indexNum = idx + 0;
        let bookImgUrl = `${indexNum}`;
        label.string = bookImgUrl;
    }
    onClickCancel(){
        console.log("onClickCancel");
        ViewsManager.instance.closeView(PrefabType.SettingPlanView);
        let data:PlanSaveData = {
            left:this._leftSelectString,
            right:this._rightSelectString,
            isSave:false
        }
        EventMgr.dispatch(EventType.Select_Word_Plan,data);
    }

    onClickSave(){
        console.log("onClickSave");
        ViewsManager.instance.closeView(PrefabType.SettingPlanView);
        let data:PlanSaveData = {
            left:this._leftSelectString,
            right:this._rightSelectString,
            isSave:true
        }
        EventMgr.dispatch(EventType.Select_Word_Plan,data);
    }
}


