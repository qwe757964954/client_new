import { _decorator, error, instantiate, isValid, Node, Prefab, SpriteFrame, view, Widget } from 'cc';
import { EventType } from '../../config/EventType';
import { KeyConfig } from '../../config/KeyConfig';
import { PrefabType } from '../../config/PrefabType';
import GlobalConfig from '../../GlobalConfig';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { BookAwardListModel, BookPlanDetail, CurrentBookStatus, ModifyPlanData, UnitListItemStatus } from '../../models/TextbookModel';
import { User } from '../../models/User';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import StorageUtil from '../../util/StorageUtil';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { ChallengeRemindView, IChallengeRemindData } from '../TextbookVocabulary/ChallengeRemindView';
import { TextbookListView } from '../TextbookVocabulary/TextbookListView';
import { WordCheckView } from '../TextbookVocabulary/WordCheckView';
import { BreakThroughView } from './BreakThroughView';
import { ChallengeBottomView } from './ChallengeBottomView';
import { RightUnitView } from './RightUnitView';
const { ccclass, property } = _decorator;


export interface BookUnitModel {
    type_name:string,
    book_name:string,
    grade:string
}



@ccclass('TextbookChallengeView')
export class TextbookChallengeView extends BaseView {
    @property(Node)
    public top_layout:Node = null;          // 顶部导航栏

    @property(Node)
    public content_layout:Node = null;          // 内容

    private unitArr:any[] = [];
    private _unitDetailView:RightUnitView = null;
    private _bottomView:ChallengeBottomView = null;

    private _bookData:CurrentBookStatus = null;
    private _unitListArr:UnitListItemStatus = null;
    private _currentUnitIndex:number = 0;
    private _planData:BookPlanDetail = null;
    // EventMgr.dispatch(NetNotify.Classification_UnitListStatus,dataArr);
    start() {
        super.start();
        GlobalConfig.initResolutionRules();
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
    }
    onCurrentBookStatus(data:CurrentBookStatus){
        console.log("onCurrentBookStatus",data);
        this._bookData = data;
        this._unitDetailView.updateUnitProps(this._bookData);
        this.getUnitListStatus();
        this.getBookPlanDetail();
        this._bottomView.updateItemList(data);
    }
    onPlanModify(data:any){
        let params:BookUnitModel = {
            type_name:this._bookData.type_name,
            book_name:this._bookData.book_name,
            grade:this._bookData.grade
        }
        TBServer.reqBookPlanDetail(params);
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
                plan_id:this._planData.id,
                rank_num:parseInt(params.left),
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
        this._unitDetailView.updateUnitTotal(this._unitListArr.gate_total);
    }
    /**获取词书单元信息 */
    getUnitListStatus(){
        let params:BookUnitModel = {
            type_name:this._bookData.type_name,
            book_name:this._bookData.book_name,
            grade:this._bookData.grade
        }
        TBServer.reqUnitListStatus(params);
    }

    /**获取词书计划详情 */
    getBookPlanDetail(){
        let params:BookUnitModel = {
            type_name:this._bookData.type_name,
            book_name:this._bookData.book_name,
            grade:this._bookData.grade
        }
        TBServer.reqBookPlanDetail(params);
        /**顺带请求学习奖励list */
        TBServer.reqBookAwardList(this._bookData.type_name,this._bookData.book_name);
    }
    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps("我的词书",()=>{
                ViewsManager.instance.closeView(PrefabType.TextbookChallengeView);
                GlobalConfig.initRessolutionHeight();
            });
        });
    }
    /**初始化游戏数值 */
    initAmout(){
        ViewsManager.addAmout(this.top_layout,5.471,42.399).then((amoutScript: TopAmoutView) => {
            let dataArr:AmoutItemData[] = [{type:AmoutType.Diamond,num:User.diamond},
                {type:AmoutType.Coin,num:User.coin},
                {type:AmoutType.Energy,num:User.stamina}];
            amoutScript.loadAmoutData(dataArr);
        });
    }

    initRightBookUnitInfo() {
        return new Promise((resolve, reject) => {
            ResLoader.instance.load(`prefab/${PrefabType.RightUnitView.path}`, Prefab, (err, prefab) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                let node = instantiate(prefab);
                this.content_layout.addChild(node);
                this._unitDetailView = node.getComponent(RightUnitView);
                let widgetCom = node.getComponent(Widget);
                if (!isValid(widgetCom)) {
                    widgetCom = node.addComponent(Widget);
                    widgetCom.isAlignRight = true;
                    widgetCom.isAlignVerticalCenter = true;
                }
                widgetCom.verticalCenter = 62.308;
                widgetCom.right = 62.308;
                this._unitDetailView.setModifyCallback((isSave) => {
                    // Your callback logic
                });
                this._unitDetailView.setBreakThroughCallback(() => {
                    ViewsManager.instance.showView(PrefabType.BreakThroughView, (node) => {
                        let itemScript = node.getComponent(BreakThroughView);
                        itemScript.initData(this._bookData,this._unitListArr);
                        ViewsManager.instance.closeView(PrefabType.TextbookChallengeView);
                    });
                });
                this._unitDetailView.setChangeBookCallback(() => {
                    ViewsManager.instance.showView(PrefabType.TextbookListView, (node) => {
                        let itemScript = node.getComponent(TextbookListView);
                        itemScript.initData(this._bookData);
                        ViewsManager.instance.closeView(PrefabType.TextbookChallengeView);
                    });
                });
                this._unitDetailView.setCheckWordCallback(() => {
                    ViewsManager.instance.showView(PrefabType.WordCheckView, (node) => {
                        let itemScript = node.getComponent(WordCheckView);
                        itemScript.initData(this._bookData);
                    });
                });
                resolve(true); // Resolve the promise once all asynchronous operations are completed
            });
        });
    }
    initChallengeBottom() {
        return new Promise((resolve, reject) => {
            ResLoader.instance.load(`prefab/${PrefabType.ChallengeBottomView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
                if (err) {
                    error && console.error(err);
                    reject(err);
                    return;
                }
                let node = instantiate(prefab);
                this.node.addChild(node);
                this._bottomView = node.getComponent(ChallengeBottomView);
                resolve(true);
            });
        });
    }

    /**初始化左侧怪物 */
    initLeftMonster(){
        return new Promise((resolve, reject) => {
            ResLoader.instance.load(`prefab/${PrefabType.ChallengeLeftView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
                if (err) {
                    error && console.error(err);
                    reject(err);
                    return;
                }
                let node = instantiate(prefab);
                this.content_layout.addChild(node);
                let widgetCom = node.getComponent(Widget);
                if(!isValid(widgetCom)){
                    widgetCom = node.addComponent(Widget);
                    widgetCom.isAlignLeft = true;
                    widgetCom.isAlignVerticalCenter= true;
                }
                let viewSizeWidth = view.getVisibleSize().width;
                let projectSizeWidth = view.getDesignResolutionSize().width;
                console.log("viewSizeWidth = ", viewSizeWidth, " projectSizeWidth = ", projectSizeWidth);
                widgetCom.verticalCenter = 78.489;
                widgetCom.left = 108.736 * viewSizeWidth / projectSizeWidth;
                widgetCom.updateAlignment();
                resolve(true);
            });
        });
        
    }
}


