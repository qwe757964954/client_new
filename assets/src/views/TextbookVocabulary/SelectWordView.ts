import { _decorator, error, instantiate, isValid, Node, Prefab, Widget } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import GlobalConfig from '../../GlobalConfig';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { BookListItemData, SchoolBookGradeItemData, SchoolBookListGradeItemData, SchoolBookListItemData, UnitListItemStatus } from '../../models/TextbookModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import List from '../../util/list/List';
import { NavTitleView } from '../common/NavTitleView';
import { RightNavView } from './RightNavView';
import { PlanSaveData, SettingPlanView } from './SettingPlanView';
import { TabContentItem } from './TabContentItem';
import { TabTopView } from './TabTopView';
const { ccclass, property } = _decorator;

@ccclass('SelectWordView')
export class SelectWordView extends BaseView {
    @property(Node)
    public top_layout:Node = null;          // 顶部导航栏
    @property(List)
    public textBookScrollView:List = null;
    @property(Node)
    public vocabularyLayout:Node = null;          // 选择词库
    private _schoolGradeListData:SchoolBookListGradeItemData = null;
    private _bookLiskData:BookListItemData = null;/**tab数据 */
    private _schoolBookListDataArr:SchoolBookListItemData = null;/**词书左侧导航数据 */
    private _tabTop:TabTopView = null;/**tabview */
    private _rightNav:RightNavView = null;/**左侧导航 */
    // private _tabIndex:number = 0;
    // private _leftNavIndex:number = 0; /**左侧导航索引 */
    // private _gradeSelectId:number = 0;
    private _planData:PlanSaveData = null;

    private _curTypeName:string = "";
    private _curBookName:string = "";
    private _curGradeName:string = "";
    private _curBookid:string = "";
    private _curPhaseId:number = 0;
    start() {
        super.start();
        GlobalConfig.initResolutionRules();
        
    }
    protected initUI(){
        this.initNavTitle();
        this.initTabContent();
        this.loadRightNav();
    }
    /** 初始化模块事件 */
	protected onInitModuleEvent() {
		this.addModelListener(NetNotify.Classification_List,this.onBookList);
        this.addModelListener(NetNotify.Classification_SchoolBook,this.onSchoolBookList);
        this.addModelListener(NetNotify.Classification_SchoolGrade,this.onSchoolGradeList);
        this.addModelListener(EventType.Select_Word_Plan,this.onSelectWordPlan);
        this.addModelListener(NetNotify.Classification_AddPlanBook,this.onAddPlanBook);
        this.addModelListener(NetNotify.Classification_UnitListStatus,this.onUnitListStatus);
	}
    onSelectWordPlan(params:PlanSaveData){
        if(params.isSave){
            this._planData = params;
            let reqData = {
                book_id:this._curBookid,
                num:parseInt(this._planData.right),
            }
            TBServer.reqAddPlanBook(reqData);
        }else{
            this.textBookScrollView.selectedId = -1;
            this.textBookScrollView.update(); 
        }
    }
    onUnitListStatus(data:UnitListItemStatus){
        ViewsManager.instance.showPopup(PrefabType.SettingPlanView).then((node: Node)=>{
            let titleBookName = `${this._curBookName}${this._curGradeName}`
            let nodeScript:SettingPlanView = node.getComponent(SettingPlanView)
            nodeScript.updateTitleName(titleBookName,data.gate_total);
        })
    }
    onAddPlanBook(data){
        ViewsManager.instance.showView(PrefabType.TextbookChallengeView, (node: Node) => {
            ViewsManager.instance.closeView(PrefabType.SelectWordView);
        });
    }

    onAddPlan(){
        
    }

    onSchoolGradeList(data:SchoolBookListGradeItemData){
        this._schoolGradeListData = data;
        this.textBookScrollView.numItems = this._schoolGradeListData.data.length;
        this.textBookScrollView.selectedId = -1;
        this.textBookScrollView.update();
    }
    onSchoolBookList(data:SchoolBookListItemData){
        this._schoolBookListDataArr = data;
        this._rightNav.loadNavListData(this._schoolBookListDataArr.data,(selectId:number)=>{
            if(selectId >= 0){
                this._curBookName = this._schoolBookListDataArr.data[selectId].book_name;
                TBServer.reqSchoolBookGrade(this._curPhaseId,this._curBookName);
            }
        });
    }
    onBookList(data:BookListItemData){
        this._bookLiskData = data;
        this._tabTop.loadTabData(this._bookLiskData.data,(selectId:number)=>{
            this._curTypeName = this._bookLiskData.data[selectId].type_name
            this._curPhaseId = this._bookLiskData.data[selectId].phase_id
            TBServer.reqSchoolBook(this._curPhaseId);
        });
    }
 
    /**加载左侧导航 */
    loadRightNav(){
        ResLoader.instance.load(`prefab/${PrefabType.RightNavView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.vocabularyLayout.addChild(node);
            let widgetCom = node.getComponent(Widget);
            if (!isValid(widgetCom)) {
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignLeft = true;
                widgetCom.isAlignTop = true;
                widgetCom.isAlignBottom = true;
            }
            widgetCom.left = 34.1095;
            widgetCom.top = -26;
            widgetCom.bottom = -26;
            widgetCom.updateAlignment();
            let navScript = node.getComponent(RightNavView);
            this._rightNav = navScript;
        });
    }


    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps("添加词书",()=>{
                ViewsManager.instance.closeView(PrefabType.SelectWordView);
                GlobalConfig.initRessolutionHeight();
            });
        });
    }
    /**初始化tab选项 */
    initTabContent(){
        ResLoader.instance.load(`prefab/${PrefabType.TabTopView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.node.addChild(node);
            let widgetCom = node.getComponent(Widget);
            if (!isValid(widgetCom)) {
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignTop = true;
                widgetCom.isAlignHorizontalCenter = true;
            }
            widgetCom.top = 117.027;
            widgetCom.horizontalCenter = 0;
            widgetCom.updateAlignment();
            let tabScript = node.getComponent(TabTopView);
            this._tabTop = tabScript;
            TBServer.reqBookList();
        });
    }
    onLoadTextBookVerticalList(item:Node, idx:number){
        let tabContentItemScript:TabContentItem = item.getComponent(TabContentItem);
        let itemInfo:SchoolBookGradeItemData = this._schoolGradeListData.data[idx];
        console.log("book data",itemInfo);
        tabContentItemScript.updateItemProps(idx,itemInfo,this._curBookName);
    }
    /**获取词书单元信息 */
    getUnitListStatus(){
        TBServer.reqUnitListStatus(this._curBookid);
    }

    onTextBookVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number){
        if(selectedId === -1){return}
        let itemInfo:SchoolBookGradeItemData = this._schoolGradeListData.data[selectedId];
        this._curBookid = itemInfo.book_id;
        this._curGradeName = itemInfo.grade;
        this.getUnitListStatus();
    }
}


