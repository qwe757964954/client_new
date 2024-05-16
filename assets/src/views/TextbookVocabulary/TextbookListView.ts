import { _decorator, isValid, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { CurrentBookStatus, MyTextbookStatus } from '../../models/TextbookModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import List from '../../util/list/List';
import { BookUnitModel } from '../Challenge/TextbookChallengeView';
import { NavTitleView } from '../common/NavTitleView';
import { MyContentItem } from './MyContentItem';
import { ITextbookRemindData, TextbookRemindView } from './TextbookRemindView';
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

    private _myTextbookDataArr: MyTextbookStatus[] = [];

    private _curBookData: CurrentBookStatus = null;
    start() {
        this.initUI();
    }
    protected initUI() {
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
    }
    onBookDel() {
        TBServer.reqBookStatus();
        this.updateShowMyScrollEmpty();
    }

    getSelectDataIndex() {
        let select_id = 0;
        for (let index = 0; index < this._myTextbookDataArr.length; index++) {
            const element = this._myTextbookDataArr[index];
            if (element.book_name == this._curBookData.book_name &&
                element.type_name == this._curBookData.type_name &&
                element.grade == this._curBookData.grade) {
                select_id = index;
                break;
            }
        }
        return select_id;
    }

    onBookStatus(data: MyTextbookStatus[]) {
        //判断data是数组，并且长度大于1
        if (Array.isArray(data) && data.length > 0) {
            this._myTextbookDataArr = data;
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
        ViewsManager.addNavigation(this.top_layout, 0, 0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps("词书列表", () => {
                ViewsManager.instance.showView(PrefabType.TextbookChallengeView, (node: Node) => {
                    ViewsManager.instance.closeView(PrefabType.TextbookListView);
                });
            });
        });
    }
    onLoadMyTextBookVerticalList(item: Node, idx: number) {
        let myTextbookItemScript: MyContentItem = item.getComponent(MyContentItem);
        let itemInfo: MyTextbookStatus = this._myTextbookDataArr[idx];
        myTextbookItemScript.updateMyContentItemProps(idx, itemInfo);
        myTextbookItemScript.setDeleteClickCallback((delIdx: number, bookStatus: MyTextbookStatus) => {
            let data: ITextbookRemindData = {
                sure_text: "确定",
                cancel_text: "取消",
                content_text: `确定要删除${itemInfo.book_name}(${itemInfo.grade})吗？请注意删除后将不再保留该词书学习记录`,
                callFunc: (isSure: boolean) => {
                    if (isSure) {
                        this.myScrollView.aniDelItem(delIdx, () => {
                            TBServer.reqBookDel(bookStatus)
                        }, -1)
                    }
                }
            }
            this.showRemainCalL(data);
        });
    }
    showRemainCalL(data: ITextbookRemindData) {
        ViewsManager.instance.showView(PrefabType.TextbookRemindView, (node: Node) => {
            let remindScript: TextbookRemindView = node.getComponent(TextbookRemindView);
            remindScript.initRemind(data);
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
        let data: ITextbookRemindData = {
            sure_text: "确定",
            cancel_text: "取消",
            content_text: `是否切换\n《${itemInfo.book_name}${itemInfo.grade}》为当前在学`,
            callFunc: (isSure: boolean) => {
                if (isSure) {
                    let bookData: BookUnitModel = {
                        type_name: itemInfo.type_name,
                        book_name: itemInfo.book_name,
                        grade: itemInfo.grade
                    }
                    TBServer.reqChangeTextbook(bookData);
                }else{
                    let select_id = this.getSelectDataIndex()
                    this.myScrollView.selectedId = select_id;
                }
            }
        }
        if (itemInfo.book_name !== this._curBookData.book_name ||
            itemInfo.type_name !== this._curBookData.type_name ||
            itemInfo.grade !== this._curBookData.grade) {
            this.showRemainCalL(data);
        }
    }

    updateShowMyScrollEmpty() {
        // this.myScrollEmpty.active = this._myTextbookDataArr.length === 0;
        // this.myScrollView.node.active = this._myTextbookDataArr.length !== 0;
    }
    onChangeTextbook(){
        ViewsManager.instance.showView(PrefabType.TextbookChallengeView, (node: Node) => {
        });
    }
    onClickHelp() {
        console.log("onClickHelp");
        ViewsManager.instance.showView(PrefabType.SelectWordHelp);
    }

    onClickAddTextbook() {
        console.log("onClickAddTextbook");
        ViewsManager.instance.showView(PrefabType.SelectWordView, (node: Node) => {
            ViewsManager.instance.closeView(PrefabType.TextbookListView);
        });
    }
}


