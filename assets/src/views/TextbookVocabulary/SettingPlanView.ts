import { _decorator, Label, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import { ScrollViewExtra } from './picker/ScrollViewExtra';
import { TextbookUtil } from './TextbookUtil';
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
    initUI() {
        this.enableClickBlankToClose([this.node.getChildByName("small_dialog_bg")]).then(()=>{
            this.sendPlan();
        });
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
    setLeftRightDatePick() {
        this.levelScroll.initSelectCallFunc((selectedLevel: number) => {
            this.handleLevelSelect(selectedLevel);
        });

        this.dayScroll.initSelectCallFunc((selectedDay: number) => {
            this.handleDaySelect(selectedDay);
        });
    }
    private handleLevelSelect(selectedLevel: number): void {
        if (this._levelSelect === selectedLevel) {
            this.updateDays(selectedLevel);
            return;
        }
        this._levelSelect = selectedLevel;
        console.log("_leftSelect....", selectedLevel);
        this.updateDays(selectedLevel);
    }

    private handleDaySelect(selectedDay: number): void {
        if (this._daySelect === selectedDay) {
            return;
        }
        this._daySelect = selectedDay;
        console.log("_rightSelect....", selectedDay);
        this.updateLevels(selectedDay);
    }

    private updateDays(selectedLevel: number): void {
        const days = TextbookUtil.calculateDays(this._totoal_level, selectedLevel);
        this.dayScroll.scrollToNumber(`${days}`);
    }

    private updateLevels(selectedDay: number): void {
        const levels = TextbookUtil.calculateLevels(this._totoal_level, selectedDay);
        this.levelScroll.scrollToNumber(`${levels}`);
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
                let days = TextbookUtil.calculateDays(this._totoal_level,this._totoal_level);
                this.dayScroll.scrollToNumber(`${days}`)
            }else{
                let days = TextbookUtil.calculateDays(this._totoal_level,5);
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
    }

    onClickSave(){
        console.log("onClickSave");
        this.closePop();
        this.sendPlan();
    }
    sendPlan(){
        let data:PlanSaveData = {
            left:`${this._levelSelect}`,
            right:`${this._daySelect}`,
            isSave:true
        }
        EventMgr.dispatch(EventType.Select_Word_Plan,data);
    }
}


