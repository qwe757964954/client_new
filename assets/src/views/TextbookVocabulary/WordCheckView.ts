import { _decorator, isValid, Label, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ViewsManager } from '../../manager/ViewsManager';
import { WordsDetailData } from '../../models/AdventureModel';
import { BookItemData, CheckOrderType, CheckWordItem, CheckWordModel, CheckWordResponse, CheckWordType, CurrentBookStatus } from '../../models/TextbookModel';
import { InterfacePath } from '../../net/InterfacePath';
import { NetNotify } from '../../net/NetNotify';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import List from '../../util/list/List';
import { SearchWordItem, SearchWordResponse } from '../myword/MyWordInfo';
import { WordSearchView } from '../myword/WordSearchView';
import { TabTopView } from './TabTopView';
import { WordCheckItem } from './WordCheckItem';
import { WordSortView } from './WordSortView';

const { ccclass, property } = _decorator;

@ccclass('WordCheckView')
export class WordCheckView extends BaseView {
    @property(Node)
    public top_layout: Node = null; // 顶部导航栏

    @property(List)
    public wordCheckScrollView: List = null;

    @property(WordSortView)
    public wordSortView: WordSortView = null;

    @property(Label)
    public total_word_text: Label = null;

    private _bookData: CurrentBookStatus = null;
    private _tabTop: TabTopView = null;
    private _bookTabData: BookItemData[] = [];
    private _currentType: CheckWordType = CheckWordType.AllWord;
    private _orderType: CheckOrderType = CheckOrderType.UnitSortOrder;
    private _wordUnits: { [unit: string]: CheckWordItem[] } = {};
    protected _detailData: WordsDetailData = null; // 当前单词详情数据
    private _subData: CheckWordItem = null;
    private _searchWordItem: SearchWordItem = null; // 查找的历史

    start() {
        super.start();
        this.initTabData();
    }

    private initTabData() {
        const tabStrArr = ["全部单词", "已学单词", "未学单词"];
        this._bookTabData = tabStrArr.map(name => ({ name }));
    }

    protected async initUI() {
        this.initNavTitle();
        await this.initTabContent();
        this.wordSortView.setMenuSelectCallback(() => this.onRequestCheckWord());
    }

    /** 初始化导航栏 */
    private initNavTitle() {
        this.createNavigation("单词列表", this.top_layout, () => {
            ViewsManager.instance.closeView(PrefabType.WordCheckView);
        });
    }

    /** 初始化模块事件 */
    protected onInitModuleEvent() {
        this.addModelListeners([
            [NetNotify.Classification_CheckWord, this.onCheckWord.bind(this)],
            [NetNotify.Classification_CollectWord, this.onCollectWord.bind(this)],
            [InterfacePath.Search_Word, this.onSearchWord.bind(this)],
            [InterfacePath.More_Word_Detail, this.onMoreWordDetail.bind(this)],
            [EventType.Word_Check_Item_Detail, this.onShowMore.bind(this)],
        ]);
    }

    private async onSearchWord(data: SearchWordResponse) {
        if (!isValid(data.word)) {
            console.error("单词为空");
            ViewsManager.showTip(TextConfig.Word_Empty_Tips);
            return;
        }
        this._searchWordItem = data.word;
        ServiceMgr.studyService.moreWordDetail(this._subData.word);
    }

    private onShowMore(data: CheckWordItem) {
        this._subData = data;
        ServiceMgr.studyService.searchWord(this._subData.word);
    }

    private async onMoreWordDetail(data: WordsDetailData) {
        if (data.code !== 200) {
            console.error("获取单词详情失败", data.msg);
            ViewsManager.showTip(TextConfig.Word_Error_Tips);
            this._detailData = null;
            return;
        }
        this._detailData = this.createDetailData(data);
        const node = await ViewsManager.instance.showViewAsync(PrefabType.WordSearchView);
        node.getComponent(WordSearchView).updateData(this._detailData);
    }

    private createDetailData(data: WordsDetailData): WordsDetailData {
        return {
            ...this._searchWordItem,
            sentence_list: data.sentence_list,
            similar_list: data.similar_list,
            structure: data.structure,
            variant: data.variant,
            collect_flag: this._searchWordItem.is_collect
        };
    }

    private onCollectWord(data: any) {
        console.log("收藏单词", data);
        this.onRequestCheckWord();
    }

    private onCheckWord(response: CheckWordResponse) {
        this._wordUnits = response.data.reduce((units, word) => {
            if (!units[word.unit_name]) {
                units[word.unit_name] = [];
            }
            units[word.unit_name].push(word);
            return units;
        }, {} as { [unit: string]: CheckWordItem[] });

        this.total_word_text.string = `共${response.data.length}词`;
        this.wordCheckScrollView.numItems = Object.keys(this._wordUnits).length;
    }

    /** 初始化tab选项 */
    private async initTabContent() {
        const node = await this.loadAndInitPrefab(PrefabType.TabTopView, this.node, {
            isAlignTop: true,
            isAlignHorizontalCenter: true,
            top: 117.027,
            horizontalCenter: 0
        });
        this._tabTop = node.getComponent(TabTopView);
        this._tabTop.loadTabData(this._bookTabData, (selectId: number) => {
            this.wordCheckScrollView.scrollTo(0);
            this._currentType = (selectId + 1) as CheckWordType;
            this.wordSortView.initData(this._currentType);
            this.onRequestCheckWord();
        });
    }

    private onRequestCheckWord() {
        const params: CheckWordModel = {
            book_id: this._bookData.book_id,
            word_type: this._currentType,
            order_type: this._orderType,
        };
        TBServer.reqCheckWord(params);
    }

    public initData(data: CurrentBookStatus) {
        this._bookData = data;
    }

    public onLoadWordCheckVerticalList(item: Node, idx: number) {
        const unit = Object.keys(this._wordUnits)[idx];
        const itemScript = item.getComponent(WordCheckItem);
        itemScript.updateItemProps(unit, this._wordUnits[unit]);
    }
}
