import { _decorator, error, instantiate, isValid, Node, Prefab, view, Widget } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { BookItemData, ReqPlanData, SchoolBookGradeItemData, SchoolBookItemData, UnitListItemStatus } from '../../models/TextbookModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { ChallengeBottomView } from './ChallengeBottomView';
import { RightUnitView } from './RightUnitView';
const { ccclass, property } = _decorator;

@ccclass('TextbookChallengeView')
export class TextbookChallengeView extends BaseView {
    @property(Node)
    public top_layout:Node = null;          // 顶部导航栏

    @property(Node)
    public content_layout:Node = null;          // 内容

    private unitArr:any[] = [];
    private _unitDetailView:RightUnitView = null;
    private _bottomView:ChallengeBottomView = null;

    private _tabData:BookItemData = null;
    private _schoolData:SchoolBookItemData = null;
    private _schoolGradeData:SchoolBookGradeItemData = null;
    private _unitListArr:UnitListItemStatus = null;
    private _currentUnitIndex:number = 0;
    // EventMgr.dispatch(NetNotify.Classification_UnitListStatus,dataArr);
    start() {
        this.initUI();
    }
    protected initUI(){
        this.initNavTitle();
        this.initAmout();
        this.initChallengeBottom();
        this.initLeftMonster();
        this.initRightBookUnitInfo();
    }

    onInitModuleEvent(){
        this.addModelListener(NetNotify.Classification_UnitListStatus,this.onUnitListStatus);
        this.addModelListener(EventType.Select_Word_Plan,this.onSelectWordPlan);
        this.addModelListener(NetNotify.Classification_PlanModify,this.onPlanModify);
        
    }
    onPlanModify(data:any){

    }
    onSelectWordPlan(params:any){
        ViewsManager.instance.closeView(PrefabType.SettingPlanView);
        if(params.isSave){
            // let curUnitStatus:UnitListItemStatus = this._unitListArr[this._currentUnitIndex];
            // TBServer.reqBookAdd(curUnitStatus.typename,curUnitStatus.bookname,curUnitStatus.grade);
            let reqData:ReqPlanData = {
                book_name:this._schoolData.book_name,
                grade:this._schoolGradeData.grade,
                type_name:this._tabData.type_name,
                rank_num:parseInt(params.left),
                num:parseInt(params.right)
            }
            TBServer.reqModifyPlan(reqData);
        }
    }

    getCurrentUnit(){
        for (let index = 0; index < this._unitListArr.length; index++) {
            const element = this._unitListArr[index];
            if(element.studywordnum < element.totalwordnum){
                return index
            }
        }
        return this._unitListArr.length - 1;
    }

    onUnitListStatus(data:UnitListItemStatus){
        this._unitListArr = data;
        this._currentUnitIndex = this.getCurrentUnit();
        this._bottomView.updateItemList(this._unitListArr.data,this._currentUnitIndex);
        this._unitDetailView.updateUnitProps(this._unitListArr.data[this._currentUnitIndex]);
    }
    /**初始化数据 */
    initData(tabData:BookItemData,schoolData:SchoolBookItemData,gradeData:SchoolBookGradeItemData){
        this._tabData = tabData;
        this._schoolData = schoolData;
        this._schoolGradeData = gradeData;
        this.getUnitListStatus();
    }
    /**更新我的词书 */
    getUnitListStatus(){
        console.log("getUnitListStatus",this._tabData,this._schoolData,this._schoolGradeData);
        TBServer.reqUnitListStatus(this._tabData.type_name,this._schoolData.book_name,this._schoolGradeData.grade);
    }

    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps("我的词书",()=>{
                ViewsManager.instance.showView(PrefabType.SelectWordView, (node: Node) => {
                    ViewsManager.instance.closeView(PrefabType.TextbookChallengeView);
                });
            });
        });
    }
    /**初始化游戏数值 */
    initAmout(){
        ViewsManager.addAmout(this.top_layout,5.471,42.399).then((amoutScript: TopAmoutView) => {
            let dataArr:AmoutItemData[] = [{type:AmoutType.Diamond,num:0},
                {type:AmoutType.Coin,num:0},
                {type:AmoutType.Energy,num:0}];
            amoutScript.loadAmoutData(dataArr);
        });
    }

    /**出事右侧怪物详情 */
    initRightBookUnitInfo(){
        ResLoader.instance.load(`prefab/${PrefabType.RightUnitView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.content_layout.addChild(node);
            this._unitDetailView = node.getComponent(RightUnitView);
            let widgetCom = node.getComponent(Widget);
            if(!isValid(widgetCom)){
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignRight = true;
                widgetCom.isAlignVerticalCenter= true;
            }
            widgetCom.verticalCenter = 62.308;
            widgetCom.right = 62.308;
            this._unitDetailView.setModifyCallback((isSave:boolean)=>{

            });
        });
    }
    /**下方单元进度模块 */
    initChallengeBottom(){
        ResLoader.instance.load(`prefab/${PrefabType.ChallengeBottomView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.node.addChild(node);
            this._bottomView = node.getComponent(ChallengeBottomView);
        });
    }
    /**初始化左侧怪物 */
    initLeftMonster(){
        ResLoader.instance.load(`prefab/${PrefabType.ChallengeLeftView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
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
            widgetCom.left = 179.221 * viewSizeWidth / projectSizeWidth;
            widgetCom.updateAlignment();
        });
    }
}


