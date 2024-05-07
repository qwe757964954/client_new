import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { UnitListItemStatus } from '../../models/TextbookModel';
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

    private _curUnitStatus:UnitListItemStatus = null;

    private _modifyCallback:(isSave:boolean)=>void = null;

    private _breakThroughCallback:()=>void = null;

    start() {

    }
    updateUnitProps(unitData:UnitListItemStatus){
        console.log("updateUnitProps",unitData);
        this._curUnitStatus = unitData;
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

    onReviewClick(){

    }

    onBreakThroughClick(){
        console.log("onBreakThroughClick");
        if(this._breakThroughCallback){
            this._breakThroughCallback();
        }
    }

    onCheckWordClick(){

    }
    onModifyPlanClick(){
        ViewsManager.instance.showView(PrefabType.SettingPlanView,(node: Node) => {
        });
    }
    onChangeTextbookClick(){
        ViewsManager.instance.showView(PrefabType.TextbookListView, (node: Node) => {
            ViewsManager.instance.closeView(PrefabType.TextbookChallengeView);
        });
    }
}


