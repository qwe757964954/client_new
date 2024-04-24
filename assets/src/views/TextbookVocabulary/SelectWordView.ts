import { _decorator, Component, error, instantiate, isValid, Node, Prefab, Widget } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import List from '../../util/list/List';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { MyContentItem, MyTextbookItemData } from './MyContentItem';
import { RightNavView } from './RightNavView';
import { TabContentItem, VocabularyItemData } from './TabContentItem';
import { TabItemData, TabTopView } from './TabTopView';
const { ccclass, property } = _decorator;

@ccclass('SelectWordView')
export class SelectWordView extends Component {
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
        this.initAmout();
        this.initTabContent();
        this.loadRightMonster();
        this.loadRightNav();
        this.loadMyTextBookData();
        this.loadTextBookData();
        this.updateShowTextBook(-1);
    }
    /**加载右侧导航 */
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
                widgetCom.isAlignRight = true;
                widgetCom.isAlignBottom = true;
            }
            widgetCom.right = 270.266;
            widgetCom.bottom = -10.057;
            widgetCom.updateAlignment();
            let navScript = node.getComponent(RightNavView);
            let dataArr:TabItemData[] = [
                {name:"新概念",isSelected:true},
                {name:"新概念青少版",isSelected:false},
                {name:"新概念青少版(新)",isSelected:false},
                {name:"剑桥国际少儿",isSelected:false},
                {name:"1000 Bacsic",isSelected:false},
                {name:"2000 Core",isSelected:false},
                {name:"新概念青少版(新)2",isSelected:false},
                {name:"剑桥国际少儿2",isSelected:false},
                {name:"1000 Bacsic2",isSelected:false},
                {name:"2000 Core2",isSelected:false},
            ];
            navScript.loadNavListData(dataArr,(selectId:number)=>{
                console.log("nav selectId = ",selectId);
                // this.updateShowTextBook(selectId);
            });
            
        });
    }
    /**右侧怪物列表 */
    loadRightMonster(){
        ResLoader.instance.load(`prefab/${PrefabType.RightMonster.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.myTextbookLayout.addChild(node);
            let widgetCom = node.getComponent(Widget);
            if (!isValid(widgetCom)) {
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignRight = true;
                widgetCom.isAlignBottom = true;
            }
            widgetCom.right = 176.599;
            widgetCom.bottom = 7.1935;
            widgetCom.updateAlignment();
            // let tabScript = node.getComponent(TabTopView);
            // let dataArr:TabItemData[] = [
            //     {name:"小阶段",isSelected:false},
            //     {name:"中阶段",isSelected:false},
            //     {name:"高阶段",isSelected:false},
            //     {name:"教辅",isSelected:false},
            //     {name:"考级",isSelected:false},
            //     {name:"基础",isSelected:false},
            //     {name:"专业",isSelected:false},
            // ];
            // tabScript.loadTabData(dataArr,(selectId:number)=>{
            //     console.log("selectId = ",selectId);
            //     this.updateShowTextBook(selectId);
            // });
        });
    }

    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps("选择词书",()=>{
                ViewsManager.instance.closeView(PrefabType.SelectWordView);
            });
        });
    }
    /**初始化游戏数值 */
    initAmout(){
        ViewsManager.addAmout(this.top_layout,18.628,159.38).then((amoutScript: TopAmoutView) => {
            let dataArr:AmoutItemData[] = [{type:AmoutType.Diamond,num:0},
                {type:AmoutType.Coin,num:0},
                {type:AmoutType.Energy,num:0}];
            amoutScript.loadAmoutData(dataArr);
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
            widgetCom.top = 140.033;
            widgetCom.horizontalCenter = 0;
            widgetCom.updateAlignment();
            let tabScript = node.getComponent(TabTopView);
            let dataArr:TabItemData[] = [
                {name:"小阶段",isSelected:false},
                {name:"中阶段",isSelected:false},
                {name:"高阶段",isSelected:false},
                {name:"教辅",isSelected:false},
                {name:"考级",isSelected:false},
                {name:"基础",isSelected:false},
                {name:"专业",isSelected:false},
            ];
            tabScript.loadTabData(dataArr,(selectId:number)=>{
                console.log("selectId = ",selectId);
                this.updateShowTextBook(selectId);
            });
        });
    }
    loadTextBookData(){
        let vocabularyDataArr:VocabularyItemData[] = [{imgUrl:"https://cdn.pixabay.com/photo/2020/05/15/13/28/reading-5173530_1280.jpg",name:"第一册",word_count:0,isCollect:true},
        {imgUrl:"https://cdn.pixabay.com/photo/2020/05/15/13/28/reading-5173530_1280.jpg",name:"第二册",word_count:0,isCollect:true},
        {imgUrl:"https://cdn.pixabay.com/photo/2020/05/15/13/28/reading-5173530_1280.jpg",name:"第三册",word_count:0,isCollect:true},
        {imgUrl:"https://cdn.pixabay.com/photo/2020/05/15/13/28/reading-5173530_1280.jpg",name:"第四册",word_count:0,isCollect:true},
        ]
        this._vocabularyDataArr = vocabularyDataArr;
        this.textBookScrollView.numItems = this._vocabularyDataArr.length;
        this.textBookScrollView.update();
    }
    onLoadTextBookVerticalList(item:Node, idx:number){
        console.log("onLoadTextBookVerticalList_______________");
        let tabContentItemScript:TabContentItem = item.getComponent(TabContentItem);
        let itemInfo:VocabularyItemData = this._vocabularyDataArr[idx];
        tabContentItemScript.updateItemProps(idx,itemInfo);
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
    protected onDestroy(): void {
        console.log("SelectWordView  onDestroy");
    }
}


