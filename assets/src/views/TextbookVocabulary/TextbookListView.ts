import { _decorator, isValid, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { CurrentBookStatus, MyTextbookListDelete, MyTextbookListStatus, MyTextbookStatus } from '../../models/TextbookModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import { MyContentItem } from './MyContentItem';
const { ccclass, property } = _decorator;

@ccclass('TextbookListView')
export class TextbookListView extends BaseView {
    @property(Node)
    public top_layout: Node = null;          // 顶部导航栏
    @property(List)
    public myScrollView: List = null;
    @property(Node)
    public myScrollEmpty: Node = null;          // 顶部导航栏

    @property(Node)
    public myTextbookLayout: Node = null;          // 我的词库

    @property(Node)
    public add_textbook_bg: Node = null;          // 我的词库

    private _myTextbookDataArr: MyTextbookStatus[] = [];

    private _curBookData: CurrentBookStatus = null;
    initEvent() {
        CCUtil.onBtnClick(this.add_textbook_bg, this.onClickAddTextbook.bind(this));
    }

    protected initUI() {
        this.viewAdaptSize();
        this.initNavTitle();
        TBServer.reqBookStatus();
    }

    initData(data: CurrentBookStatus) {
        this._curBookData = data;
    }

    /** 初始化模块事件 */
    protected onInitModuleEvent() {
        this.addModelListener(NetNotify.Classification_BookStatus, this.onBookStatus);
        this.addModelListener(NetNotify.Classification_BookDel, this.onBookDel);
        this.addModelListener(NetNotify.Classification_ChangeTextbook, this.onChangeTextbook);
        this.addModelListener(NetNotify.Classification_CurrentBook, this.onCurrentBookStatus);
    }
    onBookDel(data:MyTextbookListDelete) {
        if(isValid(data.book_id)){
            this._curBookData.book_id = data.book_id;
            TBServer.reqCurrentBook();
        }
        TBServer.reqBookStatus();
        this.updateShowMyScrollEmpty();
    }
    onCurrentBookStatus(curBook: CurrentBookStatus): void {
        /**当前词书状态 */
        this._curBookData = curBook;
    }
    getSelectDataIndex() {
        // Find the index of the element where book_id matches this._curBookData.book_id
        const index = this._myTextbookDataArr.findIndex(element => element.book_id === this._curBookData.book_id);
        
        // Return the index, which will be -1 if no match is found
        return index;
    }

    onBookStatus(bookData: MyTextbookListStatus) {
        //判断data是数组，并且长度大于1
        if (Array.isArray(bookData.data) && bookData.data.length > 0) {
            this._myTextbookDataArr = bookData.data;
            this.myScrollView.numItems = this._myTextbookDataArr.length;
            let select_id = this.getSelectDataIndex()
            this.myScrollView.selectedId = -1;
            this.myScrollView.selectedId = select_id;
            this.myScrollView.update();
        } else {
            this._myTextbookDataArr = []
            this.myScrollView.numItems = this._myTextbookDataArr.length;
            this.myScrollView.update();
        }
    }
    /**初始化导航栏 */
    initNavTitle() {
        this.createNavigation("词书列表",this.top_layout, () => {
            // ViewsManager.instance.showView(PrefabType.TextbookChallengeView, (node: Node) => {
                ViewsManager.instance.closeView(PrefabType.TextbookListView);
            // });
        });
    }
    onLoadMyTextBookVerticalList(item: Node, idx: number) {
        let myTextbookItemScript: MyContentItem = item.getComponent(MyContentItem);
        let itemInfo: MyTextbookStatus = this._myTextbookDataArr[idx];
        myTextbookItemScript.updateMyContentItemProps(idx, itemInfo);
        myTextbookItemScript.setDeleteClickCallback((delIdx: number, bookStatus: MyTextbookStatus) => {
            ViewsMgr.showConfirm(TextConfig.Textbook_Delete_Tip.replace("s%",`${itemInfo.book_name}(${itemInfo.grade})`), () => {
                this.myScrollView.aniDelItem(delIdx, () => {
                    TBServer.reqBookDel(bookStatus)
                }, -1)
            });
        });
    }
    onMyTextBookVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        /**
         * -1主要是用于重置scrollview selectid ,需过滤
         */
        if (selectedId === -1 || !isValid(item)) {
            return;
        }
        let itemInfo: MyTextbookStatus = this._myTextbookDataArr[selectedId];
        if (itemInfo.book_id !== this._curBookData.book_id) {
            ViewsMgr.showConfirm(TextConfig.Textbook_Change_Tip.replace("s%",`《${itemInfo.book_name}${itemInfo.grade}》`), () => {
                ViewsManager.showTip(TextConfig.Success_Change_Book.replace("s%",`《${itemInfo.book_name}${itemInfo.grade}》`));
                    TBServer.reqChangeTextbook(itemInfo.book_id);
            },() => {
                let select_id = this.getSelectDataIndex()
                this.myScrollView.selectedId = select_id;
            });
        }
    }

    updateShowMyScrollEmpty() {
        // this.myScrollEmpty.active = this._myTextbookDataArr.length === 0;
        // this.myScrollView.node.active = this._myTextbookDataArr.length !== 0;
    }
    onChangeTextbook(){
        // ViewsManager.instance.showView(PrefabType.TextbookChallengeView, (node: Node) => {
        //     ViewsManager.instance.closeView(PrefabType.TextbookListView);
        // });
        EventMgr.dispatch(EventType.Update_Textbook_Challenge);
        ViewsManager.instance.closeView(PrefabType.TextbookListView);
    }
    onClickHelp() {
        console.log("onClickHelp");
        ViewsManager.instance.showView(PrefabType.SelectWordHelp);
    }

    onClickAddTextbook() {
        console.log("onClickAddTextbook");
        ViewsManager.instance.showView(PrefabType.SelectWordView, (node: Node) => {
            // ViewsManager.instance.closeView(PrefabType.TextbookListView);
        });
    }
}


