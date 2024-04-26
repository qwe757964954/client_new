import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { MyTextbookStatus } from '../../models/TextbookModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import List from '../../util/list/List';
import { NavTitleView } from '../common/NavTitleView';
import { MyContentItem } from './MyContentItem';
const { ccclass, property } = _decorator;

@ccclass('TextbookListView')
export class TextbookListView extends BaseView {
    @property(Node)
    public top_layout:Node = null;          // 顶部导航栏
    @property(List)
    public myScrollView:List = null;
    @property(Node)
    public myScrollEmpty:Node = null;          // 顶部导航栏

    @property(Node)
    public myTextbookLayout:Node = null;          // 我的词库

    private _myTextbookDataArr:MyTextbookStatus[] = [];
    start() {
        this.initUI();
    }
    protected initUI(){
        this.initNavTitle();
        TBServer.reqBookStatus();
    }

    /** 初始化模块事件 */
	protected onInitModuleEvent() {
		this.addModelListener(NetNotify.Classification_BookStatus,this.onBookStatus);
        this.addModelListener(NetNotify.Classification_BookDel,this.onBookDel);
	}
    onBookDel(){
        console.log("删除成功——————————————————",this.myScrollView.numItems);
        TBServer.reqBookStatus();
        this.updateShowMyScrollEmpty();
    }
    onBookStatus(data:MyTextbookStatus[]){
        this._myTextbookDataArr = data;
        this.myScrollView.numItems = this._myTextbookDataArr.length;
        this.myScrollView.update();
        this.myScrollView.selectedId = 0;
    }
    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps("词书列表",()=>{
                ViewsManager.instance.closeView(PrefabType.TextbookListView);
            });
        });
    }
    onLoadMyTextBookVerticalList(item:Node, idx:number){
        let myTextbookItemScript:MyContentItem = item.getComponent(MyContentItem);
        let itemInfo:MyTextbookStatus = this._myTextbookDataArr[idx];
        myTextbookItemScript.updateMyContentItemProps(idx,itemInfo);
        myTextbookItemScript.setDeleteClickCallback((delIdx:number,bookStatus:MyTextbookStatus)=>{
            this.myScrollView.aniDelItem(delIdx,()=>{
                TBServer.reqBookDel(bookStatus)
            },-1)
        });
    }
    onMyTextBookVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number){
        console.log("onMyTextBookVerticalSelected",item,selectedId);
    }
    updateShowMyScrollEmpty(){
        // this.myScrollEmpty.active = this._myTextbookDataArr.length === 0;
        // this.myScrollView.node.active = this._myTextbookDataArr.length !== 0;
    }

    onClickHelp(){
        console.log("onClickHelp");
        ViewsManager.instance.showView(PrefabType.SelectWordHelp);
    }

    onClickAddTextbook(){

    }
}


