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
    public levelScroll:ScrollViewExtra = null
    @property(ScrollViewExtra)
    public dayScroll:ScrollViewExtra = null

    @property(Label)
    public book_title:Label = null

    private _levelSelect:number = 0;
    private _daySelect:number = 0;
    private _isModify:boolean = false;

    private _totoal_level:number = 20;

    start() {
        this.setLeftRightDatePick();
        this.scheduleOnce(()=>{
            this.dayScroll.scrollToNumber(`${7}`)
        },0.5);
    }

    calculateDays(challengesPerDay: number){
        return Math.ceil(this._totoal_level / challengesPerDay);
    }

    calculateLevels(days:number){
        return Math.ceil(this._totoal_level / days);
    }

    setLeftRightDatePick() {
        this.levelScroll.initSelectCallFunc((select_num:number)=>{
            if(this._levelSelect === select_num){
                return;
            }
            this._levelSelect = select_num;
            console.log("_leftSelect....",select_num);
            let days = this.calculateDays(select_num);
            this.dayScroll.scrollToNumber(`${days}`)
        })
        this.dayScroll.initSelectCallFunc((select_num:number)=>{
            if(this._daySelect === select_num){
                return;
            }
            console.log("_rightSelect....",select_num);
            this._daySelect = select_num;
            let levels = this.calculateLevels(select_num);
            this.levelScroll.scrollToNumber(`${levels}`)
        })
    }

    updateTitleName(title:string) {
        this.book_title.string = title;
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
            left:`${this._levelSelect}`,
            right:`${this._daySelect}`,
            isSave:false
        }
        EventMgr.dispatch(EventType.Select_Word_Plan,data);
    }

    onClickSave(){
        console.log("onClickSave");
        ViewsManager.instance.closeView(PrefabType.SettingPlanView);
        let data:PlanSaveData = {
            left:`${this._levelSelect}`,
            right:`${this._daySelect}`,
            isSave:true
        }
        EventMgr.dispatch(EventType.Select_Word_Plan,data);
    }
}


