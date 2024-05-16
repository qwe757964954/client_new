import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
import { NetConfig } from '../../config/NetConfig';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ViewsManager } from '../../manager/ViewsManager';
import { BookAwardListModel, BookPlanDetail, CurrentBookStatus } from '../../models/TextbookModel';
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

    private _curUnitStatus:CurrentBookStatus = null;

    private _modifyCallback:(isSave:boolean)=>void = null;

    private _breakThroughCallback:()=>void = null;

    private _changeCallback:()=>void = null;

    start() {

    }

    updateRightPlan(data:BookPlanDetail) {
        
    }

    updateStudyProgress(data:BookAwardListModel){
        
        
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
        /*
        this.title_label.string = unitData.bookname;
        this.grade_label.string = unitData.grade;
        this.study_label.string = unitData.studywordnum.toString();
        this.total_label.string = unitData.totalwordnum.toString();
        this.study_progress.progress = unitData.studywordnum / unitData.totalwordnum;
        let bookImgUrl = `${NetConfig.assertUrl}/imgs/bookcover/${unitData.bookname}/${unitData.grade}.jpg`;
        ImgUtil.loadRemoteImage(bookImgUrl,this.current_img,188.573,255.636);
        */
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
        ViewsManager.showTip(TextConfig.Function_Tip);
    }
    onModifyPlanClick(){
        ViewsManager.instance.showView(PrefabType.SettingPlanView,(node: Node) => {
            let nodeScript:SettingPlanView = node.getComponent(SettingPlanView);
            let titleBookName = `${this._curUnitStatus.book_name}${this._curUnitStatus.grade}`;
            nodeScript.updateTitleName(titleBookName);
        });
    }
    onChangeTextbookClick(){
        if(this._changeCallback){
            this._changeCallback();
        }
    }
}


