import { _decorator, error, instantiate, isValid, Node, Prefab, view, Widget } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import GlobalConfig from '../../GlobalConfig';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { BookAwardListModel, BookPlanDetail, CurrentBookStatus, ModifyPlanData, UnitListItemStatus } from '../../models/TextbookModel';
import { User } from '../../models/User';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { TextbookListView } from '../TextbookVocabulary/TextbookListView';
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
        this.initUI();
        GlobalConfig.initResolutionRules();
    }
    protected async initUI(){
        this.initNavTitle();
        this.initAmout();
        await this.initChallengeBottom();
        await this.initLeftMonster();
        await this.initRightBookUnitInfo();
        TBServer.reqCurrentBook();
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
        // this.getBookPlanDetail();
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
        ViewsManager.instance.closeView(PrefabType.SettingPlanView);
        if(params.isSave){
            let modifyData:ModifyPlanData = {
                plan_id:this._planData.id,
                rank_num:parseInt(params.left),
                num:parseInt(params.right)
            }
            TBServer.reqModifyPlan(modifyData);
        }
    }

    getCurrentUnit(){
        return 0;
        for (let index = 0; index < this._unitListArr.data.length; index++) {
            const element = this._unitListArr[index];
            if(element.studywordnum < element.totalwordnum){
                return index
            }
        }
        return this._unitListArr.data.length - 1;
    }

    onUnitListStatus(data:UnitListItemStatus){
        this._unitListArr = data;
        this._currentUnitIndex = this.getCurrentUnit();
        this._bottomView.updateItemList(this._unitListArr.data,this._currentUnitIndex);
        // this._unitDetailView.updateUnitProps(this._unitListArr.data[this._currentUnitIndex]);
    }
    /**更新我的词书 */
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
                // ViewsManager.instance.showView(PrefabType.SelectWordView, (node: Node) => {
                //     ViewsManager.instance.closeView(PrefabType.TextbookChallengeView);
                // });
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
                        itemScript.initData(this._bookData);
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


