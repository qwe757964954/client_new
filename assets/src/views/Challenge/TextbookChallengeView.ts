import { _decorator, error, Node, Prefab, SpriteFrame, view } from 'cc';
import { EventType } from '../../config/EventType';
import { KeyConfig } from '../../config/KeyConfig';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { BookAwardListModel, BookPlanDetail, CurrentBookStatus, ModifyPlanData, UnitListItemStatus } from '../../models/TextbookModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import StorageUtil from '../../util/StorageUtil';
import { ChallengeLeftView } from '../TextbookVocabulary/ChallengeLeftView';
import { ChallengeRemindView, IChallengeRemindData } from '../TextbookVocabulary/ChallengeRemindView';
import { SettingPlanView } from '../TextbookVocabulary/SettingPlanView';
import { TextbookListView } from '../TextbookVocabulary/TextbookListView';
import { WordCheckView } from '../TextbookVocabulary/WordCheckView';
import { BreakThroughView } from './BreakThroughView';
import { ChallengeBottomView } from './ChallengeBottomView';
import ChallengeUtil from './ChallengeUtil';
import { RightUnitCallbackType, RightUnitView } from './RightUnitView';
import { MapCoordinates } from './ScrollMapView';
const { ccclass, property } = _decorator;
export interface BookUnitModel {
    type_name?:string,
    book_name?:string,
    grade?:string

}
@ccclass('TextbookChallengeView')
export class TextbookChallengeView extends BaseView {
    @property(Node)
    public top_layout:Node = null;          // 顶部导航栏

    @property(Node)
    public content_layout:Node = null;          // 内容

    private _unitDetailView:RightUnitView = null;
    private _bottomView:ChallengeBottomView = null;

    private _bookData:CurrentBookStatus = null;
    private _unitListArr:UnitListItemStatus = null;
    private _planData:BookPlanDetail = null;
    private _monsterView:ChallengeLeftView = null;
    // EventMgr.dispatch(NetNotify.Classification_UnitListStatus,dataArr);
    start() {
        super.start();
    }
    protected async initUI(){
        await this.initLeftMonster();
        this.initNavTitle();
        this.initAmout();
        await this.initChallengeBottom();
        await this.initRightBookUnitInfo();
        TBServer.reqCurrentBook();
        let first_enter = StorageUtil.getData(KeyConfig.FIRST_TEXTBOOK_CHALLENGE,"1");
        if(first_enter === "1"){
            this.showFirstEnter();
        }
    }



    protected showFirstEnter(){
        let rick_str = "<color=#864d42>亲爱的闯词同学：\n欢迎来到教材词汇挑战之旅！这里充满着无尽的知识和奖励的神秘宝箱，它包含了能够富裕探险者智慧和能力的奖励。很久以前，这个宝箱是由勇敢的学者们守护的，他们用智慧和勇气保护着它。但是有一天夜晚，一群贪婪的怪兽悄悄闯入王国，偷走了宝箱的钥匙，并将其分散在各个教材单元深处。这些怪兽用不同的单词作为保护钥匙的魔法屏障，试图阻止任何人发现它们。</color><color=#466cc9>你的任务是击败这些“钥匙怪”，并夺取它们手中的“怪物钥匙”，开启神秘宝箱。</color>"
        let data: IChallengeRemindData = {
            sure_text: "查看任务",
            content_text: rick_str,
            // callFunc: (isSure: boolean) => {
            //     if (isSure) {
            //         StorageUtil.saveData(KeyConfig.FIRST_TEXTBOOK_CHALLENGE,"0");
            //     }
            // }
        }

        ViewsManager.instance.showPopup(PrefabType.ChallengeRemindView).then((node:Node) => {
            let remindScript: ChallengeRemindView = node.getComponent(ChallengeRemindView);
            remindScript.initRemind(data);
            StorageUtil.saveData(KeyConfig.FIRST_TEXTBOOK_CHALLENGE,"0");
        })
    }

    onInitModuleEvent(){
        this.addModelListener(NetNotify.Classification_CurrentBook, this.onCurrentBookStatus);
        this.addModelListener(NetNotify.Classification_UnitListStatus,this.onUnitListStatus);
        this.addModelListener(EventType.Select_Word_Plan,this.onSelectWordPlan);
        this.addModelListener(NetNotify.Classification_PlanModify,this.onPlanModify);
        this.addModelListener(NetNotify.Classification_BookPlanDetail,this.onBookPlanDetail);
        this.addModelListener(NetNotify.Classification_BookAwardList,this.onBookAwardList);
        this.addModelListener(EventType.Update_Textbook_Challenge,this.onUpdateTextbookChallenge);
    }

    onUpdateTextbookChallenge(){
        TBServer.reqCurrentBook();
    }

    onCurrentBookStatus(data:CurrentBookStatus){
        console.log("onCurrentBookStatus",data);
        this._bookData = data;
        this._unitDetailView.updateUnitProps(this._bookData);
        this.getUnitListStatus();
        this.getBookPlanDetail();
        this._bottomView.updateItemList(data);
        this._monsterView.updateMonsterInfo(this._bookData.monster_id);
    }
    onPlanModify(data:any){
        TBServer.reqBookPlanDetail(this._bookData.book_id);
    }

    onBookAwardList(data:BookAwardListModel){
        // this._unitDetailView.updateStudyProgress(data);
    }

    onBookPlanDetail(data:BookPlanDetail){
        this._planData = data;
        this._unitDetailView.updateRightPlan(data);
    }

    onSelectWordPlan(params:any){
        ViewsManager.instance.closePopup(PrefabType.SettingPlanView);
        if(params.isSave){
            let modifyData:ModifyPlanData = {
                cu_id:this._planData.cu_id,
                num:parseInt(params.right)
            }
            TBServer.reqModifyPlan(modifyData);
        }
    }

    onUnitListStatus(data:UnitListItemStatus){
        this._unitListArr = data;
        ResLoader.instance.load(`prefab/${PrefabType.MapPointItem.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
            }
        });
        ResLoader.instance.load("adventure/bg/long_background/bg_map_01/spriteFrame", SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
            }
        });
        const map_count = ChallengeUtil.calculateMapsNeeded(data.gate_total, MapCoordinates.length);
        this._unitDetailView.updateUnitTotal(this._unitListArr.gate_total);
    }
    /**获取词书单元信息 */
    getUnitListStatus(){
        TBServer.reqUnitListStatus(this._bookData.book_id);
    }

    /**获取词书计划详情 */
    getBookPlanDetail(){
        TBServer.reqBookPlanDetail(this._bookData.book_id);
        /**顺带请求学习奖励list */
        // TBServer.reqBookAwardList(this._bookData.type_name,this._bookData.book_name);
    }
    /**初始化导航栏 */
    initNavTitle(){
        this.createNavigation("我的词书",this.top_layout, () => {
            ViewsManager.instance.closeView(PrefabType.TextbookChallengeView);
        });
    }
    /**初始化游戏数值 */
    initAmout(){
        ViewsManager.addAmount(this.top_layout,5.471,42.399)
    }

    async initRightBookUnitInfo() {
        // 加载并初始化 Prefab
        const node = await this.loadAndInitPrefab(PrefabType.RightUnitView, this.content_layout, {
            isAlignVerticalCenter: true,
            isAlignRight: true,
            verticalCenter: 62.308,
            right: 62.308
        });
        // 获取并配置 RightUnitView 组件
        this._unitDetailView = node.getComponent(RightUnitView);
        // 设置各类回调
        this._unitDetailView.setCallback(RightUnitCallbackType.MODIFY, (isSave) => {
            // Your callback logic
            ViewsManager.instance.showPopup(PrefabType.SettingPlanView).then((node: Node)=>{
                let nodeScript:SettingPlanView = node.getComponent(SettingPlanView);
                let titleBookName = `${this._bookData.book_name}${this._bookData.grade}`;
                nodeScript.updateTitleName(titleBookName,this._unitListArr.gate_total);
            })
        });
        this._unitDetailView.setCallback(RightUnitCallbackType.BREAK_THROUGH, this.showBreakThroughView.bind(this));
        this._unitDetailView.setCallback(RightUnitCallbackType.CHANGE_BOOK, this.showChangeBookView.bind(this));
        this._unitDetailView.setCallback(RightUnitCallbackType.CHECK_WORD, this.showCheckWordView.bind(this));
        this._unitDetailView.setCallback(RightUnitCallbackType.REVIEW, this.showReviewView.bind(this));
    }
    
    // 显示 BreakThroughView
    private async showBreakThroughView() {
        const node = await ViewsManager.instance.showLearnView(PrefabType.BreakThroughView);
        const itemScript = node.getComponent(BreakThroughView);
        itemScript.initData(this._bookData, this._unitListArr);
        ViewsManager.instance.closeView(PrefabType.TextbookChallengeView);
    }
    
    // 显示 ChangeBookView
    private async showChangeBookView() {
        const node = await ViewsManager.instance.showViewAsync(PrefabType.TextbookListView);
        const itemScript = node.getComponent(TextbookListView);
        itemScript.initData(this._bookData);
        // ViewsManager.instance.closeView(PrefabType.TextbookChallengeView);
    }
    
    // 显示 CheckWordView
    private async showCheckWordView() {
        const node = await ViewsManager.instance.showViewAsync(PrefabType.WordCheckView);
        const itemScript = node.getComponent(WordCheckView);
        itemScript.initData(this._bookData);
    }
    
    // 显示 ReviewPlanView
    private async showReviewView() {
        await ViewsManager.instance.showViewAsync(PrefabType.ReviewPlanView);
        // ViewsManager.instance.closeView(PrefabType.TextbookChallengeView);
    }
    
    
    async initChallengeBottom() {
        let node = await this.loadAndInitPrefab(PrefabType.ChallengeBottomView, this.node)
        this._bottomView = node.getComponent(ChallengeBottomView);
    }

    /**初始化左侧怪物 */
    async initLeftMonster(){
        let viewSizeWidth = view.getVisibleSize().width;
        let projectSizeWidth = view.getDesignResolutionSize().width;
        let node = await this.loadAndInitPrefab(PrefabType.ChallengeLeftView, this.content_layout,{
            isAlignLeft: true,
            isAlignVerticalCenter: true,
            verticalCenter: 78.489,
            left: 108.736 * viewSizeWidth / projectSizeWidth
        })
        this._monsterView = node.getComponent(ChallengeLeftView);
    }
}


