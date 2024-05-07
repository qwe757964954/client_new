import { _decorator, isValid, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { MyTextbookStatus } from '../../models/TextbookModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import List from '../../util/list/List';
import { BookUnitModel, TextbookChallengeView } from '../Challenge/TextbookChallengeView';
import { NavTitleView } from '../common/NavTitleView';
import { MyContentItem } from './MyContentItem';
import { ITextbookRemindData, TextbookRemindView } from './TextbookRemindView';
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

    private _selectedIndex:number = 0;

    private _curBookData:BookUnitModel = null;
    start() {
        this.initUI();
    }
    protected initUI(){
        this.initNavTitle();
        TBServer.reqBookStatus();
    }

    initData(data:BookUnitModel){
        this._curBookData = data;
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

    getSelectDataIndex(){
        let select_id = 0;
        for (let index = 0; index < this._myTextbookDataArr.length; index++) {
            const element = this._myTextbookDataArr[index];
            console.log(element,this._curBookData);
            if(element.book_name == this._curBookData.book_name && 
                element.type_name == this._curBookData.type_name && 
                element.grade == this._curBookData.grade){
                select_id = index;
                break;
            }
        }
        return select_id;
    }

    onBookStatus(data:MyTextbookStatus[]){
        //判断data是数组，并且长度大于1
        if(Array.isArray(data) && data.length > 0){
            this._myTextbookDataArr = data;
            this.myScrollView.numItems = this._myTextbookDataArr.length;
            this.myScrollView.update();
            let select_id = this.getSelectDataIndex()
            this._selectedIndex = select_id;
            this.myScrollView.selectedId = select_id;
        }else{
            this._myTextbookDataArr = []
            this.myScrollView.numItems = this._myTextbookDataArr.length;
            this.myScrollView.update();
        }
    }
    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps("词书列表",()=>{
                ViewsManager.instance.showView(PrefabType.TextbookChallengeView,(node:Node)=>{
                    let itemScript:TextbookChallengeView = node.getComponent(TextbookChallengeView);
                    itemScript.initData(this._curBookData);
                    ViewsManager.instance.closeView(PrefabType.TextbookListView);
                });
            });
        });
    }
    onLoadMyTextBookVerticalList(item:Node, idx:number){
        let myTextbookItemScript:MyContentItem = item.getComponent(MyContentItem);
        let itemInfo:MyTextbookStatus = this._myTextbookDataArr[idx];
        myTextbookItemScript.updateMyContentItemProps(idx,itemInfo);
        myTextbookItemScript.setDeleteClickCallback((delIdx:number,bookStatus:MyTextbookStatus)=>{
            let data:ITextbookRemindData = {
                sure_text:"确定",
                cancel_text:"取消",
                content_text:`确定要删除${itemInfo.book_name}(${itemInfo.grade})吗？请注意删除后将不再保留该词书学习记录`,
                callFunc:(isSure:boolean)=>{
                    if(isSure){
                        this.myScrollView.aniDelItem(delIdx,()=>{
                            TBServer.reqBookDel(bookStatus)
                        },-1)
                    }
                }
            }
            this.showRemainCalL(data);
        });
    }
    showRemainCalL(data:ITextbookRemindData){
        ViewsManager.instance.showView(PrefabType.TextbookRemindView,(node:Node)=>{
            let remindScript:TextbookRemindView = node.getComponent(TextbookRemindView);
            remindScript.initRemind(data);
        });
    }

    onMyTextBookVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number){
        console.log("onMyTextBookVerticalSelected",item,selectedId);
        let itemInfo:MyTextbookStatus =  this._myTextbookDataArr[selectedId];
        let data:ITextbookRemindData = {
            sure_text:"确定",
            cancel_text:"取消",
            content_text:`是否切换\n${itemInfo.book_name}${itemInfo.grade}为当前在学`,
            callFunc:(isSure:boolean)=>{
                if(isSure){
                    this.setClickItemProps(item,selectedId);
                    ViewsManager.instance.showView(PrefabType.TextbookChallengeView, (node: Node) => {
                        ViewsManager.instance.closeView(PrefabType.TextbookListView);
                        let bookData:BookUnitModel = {
                            type_name:itemInfo.type_name,
                            book_name:itemInfo.book_name,
                            grade:itemInfo.grade
                        }
                        this._curBookData = bookData;
                        node.getComponent(TextbookChallengeView).initData(bookData);
                    });
                }else{
                    this.myScrollView.selectedId = this._selectedIndex;
                }
            }
        }
        
        if(this._selectedIndex!= selectedId){
            this.showRemainCalL(data);
        }else{
           this.setClickItemProps(item,selectedId);
        }
    }

    setClickItemProps(item:any,selectedId:number){
        this.clearItems();
        this._selectedIndex = selectedId;
        let itemScript = item.getComponent(MyContentItem);
        itemScript.flagBg.active = true;
        itemScript.select_infoBg.active = true;
    }

    clearItems(){
        for (let index = 0; index < this.myScrollView.numItems; index++) {
            let item = this.myScrollView.getItemByListId(index);
            console.log("clearItems_____",index,item);
            if(isValid(item)){
                let itemScript = item.getComponent(MyContentItem);
                itemScript.flagBg.active = false;
                itemScript.select_infoBg.active = false;
            }
        }
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
        console.log("onClickAddTextbook");
        ViewsManager.instance.showView(PrefabType.SelectWordView);
    }
}


