import { _decorator, Component, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { TBServer } from '../../service/TextbookService';
import List from '../../util/list/List';
import { NavTitleView } from '../common/NavTitleView';
import { MyContentItem, MyTextbookItemData } from './MyContentItem';
import { VocabularyItemData } from './TabContentItem';
const { ccclass, property } = _decorator;

@ccclass('TextbookListView')
export class TextbookListView extends Component {
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

    private _myTextbookDataArr:MyTextbookItemData[] = [];
    private _vocabularyDataArr:VocabularyItemData[] = [];
    start() {
        this.initUI();
    }
    protected initUI(){
        this.initNavTitle();
        this.loadMyTextBookData();
        TBServer.reqBookStatus();
    }

    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps("选择词书",()=>{
                ViewsManager.instance.closeView(PrefabType.TextbookListView);
            });
        });
    }
    loadMyTextBookData(){
        let myTextbookDataArr:MyTextbookItemData[] = [{imgUrl:"https://cdn.pixabay.com/photo/2020/05/15/13/28/reading-5173530_1280.jpg",name:"外研社",desc:"必修1",collect_count:0,total_collect:51,already_learned_count:0,total_already_learned:479,isLearned:true},
        {imgUrl:"https://cdn.pixabay.com/photo/2020/05/15/13/28/reading-5173530_1280.jpg",name:"外研社",desc:"选修1",collect_count:0,total_collect:27,already_learned_count:0,total_already_learned:261,isLearned:true},
        {imgUrl:"https://cdn.pixabay.com/photo/2020/05/15/13/28/reading-5173530_1280.jpg",name:"外研社",desc:"八上",collect_count:0,total_collect:24,already_learned_count:0,total_already_learned:408,isLearned:true},
        {imgUrl:"https://cdn.pixabay.com/photo/2020/05/15/13/28/reading-5173530_1280.jpg",name:"外研社",desc:"八下",collect_count:0,total_collect:24,already_learned_count:0,total_already_learned:325,isLearned:true},
        {imgUrl:"https://cdn.pixabay.com/photo/2020/05/15/13/28/reading-5173530_1280.jpg",name:"外研社",desc:"七上",collect_count:0,total_collect:24,already_learned_count:0,total_already_learned:272,isLearned:true},
        {imgUrl:"https://cdn.pixabay.com/photo/2020/05/15/13/28/reading-5173530_1280.jpg",name:"外研社",desc:"七下",collect_count:0,total_collect:24,already_learned_count:0,total_already_learned:355,isLearned:true},
        ]
        this._myTextbookDataArr = myTextbookDataArr;
        this.myScrollView.numItems = this._myTextbookDataArr.length;
        this.myScrollView.update();
        this.myScrollView.selectedId = 0;
    }
    onLoadMyTextBookVerticalList(item:Node, idx:number){
        let myTextbookItemScript:MyContentItem = item.getComponent(MyContentItem);
        let itemInfo:MyTextbookItemData = this._myTextbookDataArr[idx];
        myTextbookItemScript.updateMyContentItemProps(idx,itemInfo);
        myTextbookItemScript.setClickCallback((delIdx:number)=>{
            if (delIdx >= 0 && delIdx < this._myTextbookDataArr.length) {
                this._myTextbookDataArr.splice(delIdx, 1); // 从数组中删除特定索引处的元素
            } 
            this.myScrollView.aniDelItem(delIdx,()=>{
                this.myScrollView.numItems = this._myTextbookDataArr.length;
                this.myScrollView.update();
                this.updateShowMyScrollEmpty();
            },-1)
            
        });
    }

    onMyTextBookVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number){
        console.log("onMyTextBookVerticalSelected",item,selectedId);
    }

    updateShowTextBook(selectId:number){
        this.vocabularyLayout.active = selectId!==-1;
        this.myTextbookLayout.active = selectId===-1;
        /**显示我的可成要更新下显示 */
        if(selectId===-1){
            this.updateShowMyScrollEmpty();
        }
    }
    hidenMyTextbook(){
        this.myScrollEmpty.active = false;
        this.myScrollView.node.active = false;
    }
    updateShowMyScrollEmpty(){
        this.myScrollEmpty.active = this._myTextbookDataArr.length === 0;
        this.myScrollView.node.active = this._myTextbookDataArr.length !== 0;
    }

    onClickHelp(){
        console.log("onClickHelp");
        ViewsManager.instance.showView(PrefabType.SelectWordHelp);
    }

    protected onDestroy(): void {
        console.log("SelectWordView  onDestroy");
    }
}


