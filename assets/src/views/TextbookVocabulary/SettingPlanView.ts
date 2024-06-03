import { _decorator, Label, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import { ScrollViewExtra } from './picker/ScrollViewExtra';
const { ccclass, property } = _decorator;

export interface PlanSaveData {
    left:string;
    right:string;
    isSave:boolean
}


@ccclass('SettingPlanView')
export class SettingPlanView extends BasePopup {
    @property(ScrollViewExtra)
    public levelScroll:ScrollViewExtra = null;
    @property(ScrollViewExtra)
    public dayScroll:ScrollViewExtra = null;

    @property(Label)
    public book_title:Label = null;

    @property(Node)
    public saveBtn:Node = null;

    @property(Node)
    public cancelBtn:Node = null;

    private _levelSelect:number = 0;
    private _daySelect:number = 0;
    private _isModify:boolean = false;

    private _totoal_level:number = 20;

    start() {
        this.enableClickBlankToClose([this.node.getChildByName("small_dialog_bg")]).then(()=>{
            let data:PlanSaveData = {
                left:`${this._levelSelect}`,
                right:`${this._daySelect}`,
                isSave:false
            }
            EventMgr.dispatch(EventType.Select_Word_Plan,data);
        });
        this.initEvent();
    }
    initEvent() {
        CCUtil.onTouch(this.saveBtn, this.onClickSave, this);
        CCUtil.onTouch(this.cancelBtn, this.onClickCancel, this);
    }

    /**移除监听 */
    removeEvent() {
        CCUtil.offTouch(this.saveBtn, this.onClickSave, this);
        CCUtil.offTouch(this.cancelBtn, this.onClickCancel, this);
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
    updateTitleName(title:string,total_level:number) {
        this.book_title.string = title;
        this._totoal_level = total_level;
        this.levelScroll.setTotalLevel(total_level);
        this.dayScroll.setTotalLevel(total_level);
        console.log('this._totoal_level',this._totoal_level);
        this.setLeftRightDatePick();
        this.scheduleOnce(()=>{
            if(this._totoal_level <= 5){
                let days = this.calculateDays(this._totoal_level);
                this.dayScroll.scrollToNumber(`${days}`)
            }else{
                let days = this.calculateDays(5);
                this.dayScroll.scrollToNumber(`${days}`)
            }
        },0.2)
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
        this.closePop();
        let data:PlanSaveData = {
            left:`${this._levelSelect}`,
            right:`${this._daySelect}`,
            isSave:false
        }
        EventMgr.dispatch(EventType.Select_Word_Plan,data);
    }

    onClickSave(){
        console.log("onClickSave");
        this.closePop();
        let data:PlanSaveData = {
            left:`${this._levelSelect}`,
            right:`${this._daySelect}`,
            isSave:true
        }
        EventMgr.dispatch(EventType.Select_Word_Plan,data);
    }
    onDestroy(): void {
        this.removeEvent();
    }
}


