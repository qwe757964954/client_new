import { _decorator, Label, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { BookItemData, CheckOrderType, CheckWordItem, CheckWordModel, CheckWordResponse, CheckWordType, CurrentBookStatus } from '../../models/TextbookModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import List from '../../util/list/List';
import { TabTopView } from './TabTopView';
import { WordCheckItem } from './WordCheckItem';
import { WordSortView } from './WordSortView';
const { ccclass, property } = _decorator;


@ccclass('WordCheckView')
export class WordCheckView extends BaseView {
    @property(Node)
    public top_layout:Node = null;          // 顶部导航栏
    @property(List)
    public wordCheckScrollView:List = null;

    @property(WordSortView)
    public wordSortView:WordSortView = null;

    @property(Label)
    public total_word_text:Label = null;

    private _bookData:CurrentBookStatus = null;
    private _tabTop:TabTopView = null;
    private _bookTabData:BookItemData[] = [];

    private _currentType:CheckWordType = CheckWordType.AllWord;
    private _orderType:CheckOrderType = CheckOrderType.UnitSortOrder;
    
    private _wordUnits:{ [unit: string]: CheckWordItem[] } = {};

    start() {
        this.viewAdaptSize();
        super.start();
        this.initTabData();
    }

    initTabData(){
        let tabStrArr = ["全部单词","已学单词","未学单词","收藏单词"];
        for (let i = 0; i < tabStrArr.length; i++) {
            const element = tabStrArr[i];
            let data:BookItemData = {
                name:element,
            }
            this._bookTabData.push(data);
        }
    }

    async initUI(){
        this.initNavTitle();
        this.initTabContent();
        this.wordSortView.setMenuSelectCallback((order_type:CheckOrderType)=>{
            this.onRequestCheckWord();
        });
        
    }

    /**初始化导航栏 */
    initNavTitle(){
        this.createNavigation("单词列表",this.top_layout, () => {
            ViewsManager.instance.closeView(PrefabType.WordCheckView);
        });
    }
    /** 初始化模块事件 */
	protected onInitModuleEvent() {
		this.addModelListener(NetNotify.Classification_CheckWord,this.onCheckWord);
	}
    onCheckWord(response:CheckWordResponse) {
        this._wordUnits = {};
        response.data.forEach(word => {
            if (!this._wordUnits[word.unit_name]) {
                this._wordUnits[word.unit_name] = [];
            }
            this._wordUnits[word.unit_name].push(word);
        });
        console.log(this._wordUnits);
        console.log(Object.keys(this._wordUnits).length);
        this.total_word_text.string = `共${response.data.length}词`;
        this.wordCheckScrollView.numItems = Object.keys(this._wordUnits).length;
        // this.wordCheckScrollView.update();
    }
    /**初始化tab选项 */
    async initTabContent(){
        let node = await this.loadAndInitPrefab(PrefabType.TabTopView, this.node, {
            isAlignTop: true,
            isAlignHorizontalCenter: true,
            top: 117.027,
            horizontalCenter: 0
        })
        this._tabTop = node.getComponent(TabTopView);
        this._tabTop.loadTabData(this._bookTabData,(selectId:number)=>{
            this.wordCheckScrollView.scrollTo(0);
            this._currentType = (selectId+1) as CheckWordType;
            this.wordSortView.initData(this._currentType);
            this.onRequestCheckWord();
        });
    }

    onRequestCheckWord(){
        let params:CheckWordModel = {
            book_id:this._bookData.book_id,
            word_type:this._currentType,
            order_type:this._orderType,
        }
        TBServer.reqCheckWord(params);
    }

    initData(data:CurrentBookStatus){
        this._bookData = data;
    }

    onLoadWordCheckVerticalList(item:Node, idx:number){
        console.log('onLoadWordCheckVerticalList',item,idx);
        let unit = Object.keys(this._wordUnits)[idx];
        let itemScript = item.getComponent(WordCheckItem);
        itemScript.updateItemProps(unit,this._wordUnits[unit])
    }

}


