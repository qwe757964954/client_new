import { _decorator, error, instantiate, isValid, Node, Prefab, Widget } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { BookListItemData, SchoolBookGradeItemData, SchoolBookListGradeItemData, SchoolBookListItemData } from '../../models/TextbookModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import List from '../../util/list/List';
import { BookUnitModel, TextbookChallengeView } from '../Challenge/TextbookChallengeView';
import { NavTitleView } from '../common/NavTitleView';
import { RightNavView } from './RightNavView';
import { PlanSaveData } from './SettingPlanView';
import { TabContentItem } from './TabContentItem';
import { TabTopView } from './TabTopView';
const { ccclass, property } = _decorator;

@ccclass('SelectWordView')
export class SelectWordView extends BaseView {
    @property(Node)
    public top_layout:Node = null;          // 顶部导航栏
    @property(List)
    public textBookScrollView:List = null;
    @property(List)
    public myScrollView:List = null;
    @property(Node)
    public myScrollEmpty:Node = null;          // 顶部导航栏

    @property(Node)
    public vocabularyLayout:Node = null;          // 选择词库

    @property(Node)
    public myTextbookLayout:Node = null;          // 我的词库
    private _schoolGradeListData:SchoolBookListGradeItemData = null;
    private _bookLiskData:BookListItemData = null;/**tab数据 */
    private _schoolBookListDataArr:SchoolBookListItemData = null;/**词书左侧导航数据 */
    private _tabTop:TabTopView = null;/**tabview */
    private _rightNav:RightNavView = null;/**左侧导航 */
    private _tabIndex:number = 0;
    private _leftNavIndex:number = 0; /**左侧导航索引 */
    private _gradeSelectId:number = 0;
    private _planData:PlanSaveData = null;
    start() {
        this.initUI();
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
        this.addModelListener(NetNotify.Classification_BookAdd,this.onBookAdd);
        this.addModelListener(EventType.Select_Word_Plan,this.onSelectWordPlan);
        this.addModelListener(NetNotify.Classification_PlanAdd,this.onAddPlan);
        this.addModelListener(NetNotify.Classification_AddPlanBook,this.onAddPlanBook);
	}
    onSelectWordPlan(params:PlanSaveData){
        if(params.isSave){
            this._planData = params;
            let reqData = {
                type_name:this._bookLiskData.dataArr[this._tabIndex].type_name,
                book_name:this._schoolBookListDataArr.data[this._leftNavIndex].book_name,
                grade:this._schoolGradeListData.data[this._gradeSelectId].grade,
                rank_num:parseInt(this._planData.left),
                num:parseInt(this._planData.right),
            }
            TBServer.reqAddPlanBook(reqData);
        }else{
            this.textBookScrollView.selectedId = -1;
            this.textBookScrollView.update(); 
        }
    }

    onAddPlanBook(data){
        
        ViewsManager.instance.showView(PrefabType.TextbookChallengeView, (node: Node) => {
            ViewsManager.instance.closeView(PrefabType.SelectWordView);
            let type_name = this._bookLiskData.dataArr[this._tabIndex].type_name;
            let book_name = this._schoolBookListDataArr.data[this._leftNavIndex].book_name;
            let grade = this._schoolGradeListData.data[this._gradeSelectId].grade;
            let bookData:BookUnitModel = {
                type_name:type_name,
                book_name:book_name,
                grade:grade
            }
            node.getComponent(TextbookChallengeView).initData(bookData);
        });
    }

    onBookAdd(){
        let reqData = {
            type_name:this._bookLiskData.dataArr[this._tabIndex].type_name,
            book_name:this._schoolBookListDataArr.data[this._leftNavIndex].book_name,
            grade:this._schoolGradeListData.data[this._gradeSelectId].grade,
            rank_num:parseInt(this._planData.left),
            num:parseInt(this._planData.right),
        }
        TBServer.reqPlanAdd(reqData)
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
                this._leftNavIndex = selectId;
                TBServer.reqSchoolBookGrade(this._bookLiskData.dataArr[this._tabIndex].type_name,this._schoolBookListDataArr.data[this._leftNavIndex].book_name);
            }
        });
    }
    onBookList(data:BookListItemData){
        this._bookLiskData = data;
        this._tabTop.loadTabData(this._bookLiskData.dataArr,(selectId:number)=>{
            this._tabIndex = selectId;
            TBServer.reqSchoolBook(this._bookLiskData.dataArr[this._tabIndex].type_name);
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
                widgetCom.isAlignVerticalCenter = true;
            }
            widgetCom.left = 34.1095;
            widgetCom.verticalCenter = -22.884;
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
        tabContentItemScript.updateItemProps(idx,itemInfo,this._schoolBookListDataArr.data[this._leftNavIndex]);
    }
    onTextBookVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number){
        console.log("onTextBookVerticalSelected",item,selectedId);
        if(selectedId === -1){return}
        this._gradeSelectId = selectedId;
        ViewsManager.instance.showView(PrefabType.SettingPlanView,(node: Node) => {
        });
    }
}


