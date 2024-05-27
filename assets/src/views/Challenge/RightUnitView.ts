import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
import { NetConfig } from '../../config/NetConfig';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ViewsManager } from '../../manager/ViewsManager';
import { BookPlanDetail, CurrentBookStatus } from '../../models/TextbookModel';
import CCUtil from '../../util/CCUtil';
import ImgUtil from '../../util/ImgUtil';
import { SettingPlanView } from '../TextbookVocabulary/SettingPlanView';
const { ccclass, property } = _decorator;

@ccclass('RightUnitView')
export class RightUnitView extends Component {
    @property(Label)
    public title_label:Label = null;
    @property(Label)
    public grade_label:Label = null;
    @property(Label)
    public study_label:Label = null;
    @property(Label)
    public total_label:Label = null;
    @property(Label)
    public plan_label:Label = null;

    @property(ProgressBar)
    public study_progress:ProgressBar = null;

    @property(Node)
    public current_img:Node = null;

    @property(Node)
    public change_textbook:Node = null;
    @property(Node)
    public  break_through_btn:Node = null;
    @property(Node)
    public review_btn:Node = null;
    @property(Node)
    public check_word_btn:Node = null;
    @property(Node)
    public modify_plan_btn:Node = null;

    private _curUnitStatus:CurrentBookStatus = null;

    private _unitTotal:number = null;

    private _modifyCallback:(isSave:boolean)=>void = null;

    private _breakThroughCallback:()=>void = null;

    private _changeCallback:()=>void = null;

    private _checkWordCallback:()=>void = null;

    start() {
        this.initEvent();
    }
    initEvent() {
        CCUtil.onTouch(this.change_textbook, this.onChangeTextbookClick, this);
        CCUtil.onTouch(this.break_through_btn, this.onBreakThroughClick, this);
        CCUtil.onTouch(this.review_btn, this.onReviewClick, this);
        CCUtil.onTouch(this.check_word_btn, this.onCheckWordClick, this);
        CCUtil.onTouch(this.modify_plan_btn, this.onModifyPlanClick, this);
    }

    /**移除监听 */
    removeEvent() {
        CCUtil.offTouch(this.change_textbook, this.onChangeTextbookClick, this);
        CCUtil.offTouch(this.break_through_btn, this.onBreakThroughClick, this);
        CCUtil.offTouch(this.review_btn, this.onReviewClick, this);
        CCUtil.offTouch(this.check_word_btn, this.onCheckWordClick, this);
        CCUtil.offTouch(this.modify_plan_btn, this.onModifyPlanClick, this);
    }
    updateRightPlan(data:BookPlanDetail) {
        this.plan_label.string = `${data.rank_num}/${data.num}`;
    }

    updateUnitTotal(total_level:number){
        this._unitTotal = total_level;
    }

    updateUnitProps(unitData:CurrentBookStatus){
        console.log("updateUnitProps",unitData);
        this.plan_label.string = `${unitData.rank_num}/${unitData.num}`;
        this._curUnitStatus = unitData;
        this.title_label.string = unitData.book_name;
        this.grade_label.string = unitData.grade;
        this.study_label.string = unitData.study_word_num.toString();
        this.total_label.string = unitData.total_word_num.toString();
        this.study_progress.progress = unitData.study_word_num / unitData.total_word_num;
        let bookImgUrl = `${NetConfig.assertUrl}/imgs/bookcover/${unitData.book_name}/${unitData.grade}.jpg`;
        ImgUtil.loadRemoteImage(bookImgUrl,this.current_img,188.573,255.636);
    }

    setModifyCallback(callback:(isSave:boolean)=>void){
        this._modifyCallback = callback;
    }

    setBreakThroughCallback(callback:()=>void){
        this._breakThroughCallback = callback;
    }

    setChangeBookCallback(callback:()=>void){
        this._changeCallback = callback;
    }

    setCheckWordCallback(callback:()=>void){
        this._checkWordCallback = callback;
    }

    onReviewClick(){
        ViewsManager.showTip(TextConfig.Function_Tip);
    }

    onBreakThroughClick(){
        console.log("onBreakThroughClick");
        if(this._breakThroughCallback){
            this._breakThroughCallback();
        }
    }

    onCheckWordClick(){
        if(this._checkWordCallback){
            this._checkWordCallback();
        }
    }
    onModifyPlanClick(){
        
        ViewsManager.instance.showPopup(PrefabType.SettingPlanView).then((node: Node)=>{
            let nodeScript:SettingPlanView = node.getComponent(SettingPlanView);
            let titleBookName = `${this._curUnitStatus.book_name}${this._curUnitStatus.grade}`;
            nodeScript.updateTitleName(titleBookName,this._unitTotal);
        })
    }
    onChangeTextbookClick(){
        if(this._changeCallback){
            this._changeCallback();
        }
    }
    onDestroy(): void{
        this.removeEvent();
    }
}


