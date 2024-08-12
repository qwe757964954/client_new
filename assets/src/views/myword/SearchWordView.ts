import { _decorator, EditBox, isValid, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { SoundMgr } from '../../manager/SoundMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { WordsDetailData } from '../../models/AdventureModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { SearchWordItem, SearchWordResponse } from './MyWordInfo';
import { WordHistoryItem } from './WordHistoryItem';
import { WordSearchView } from './WordSearchView';
const { ccclass, property } = _decorator;

@ccclass('SearchWordView')
export class SearchWordView extends BaseView {
    @property(EditBox)
    private edtSearchWord: EditBox = null;

    @property(List)
    private historyList: List = null;

    @property({ type: Node, tooltip: "查找按钮" })
    public btnSearch: Node = null;

    @property({ type: Node, tooltip: "清除所有的单词查找历史" })
    public btnClearHistoryAll: Node = null;

    private _historys: SearchWordItem[] = []; // 查找的历史
    protected _detailData: WordsDetailData = null; // 当前单词详情数据
    private _collectWoldInfo:SearchWordItem = null;

    protected initUI(): void {
        SoundMgr.stopBgm();
        this.initData();
    }

    private initData() {
        const history = localStorage.getItem("searchHistory");
        this._historys = history ? JSON.parse(history) : [];
        this.historyList.numItems = this._historys.length;
    }

    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [InterfacePath.More_Word_Detail, this.onMoreWordDetail.bind(this)],
            [InterfacePath.Search_Word, this.onSearchWord.bind(this)],
            [InterfacePath.Total_Collect_Word, this.onTotalCollectWord.bind(this)],
            [EventType.Search_Collect_Work,this.onSearchCollectWork.bind(this)],
            [EventType.Search_Word_Item_Detail,this.onSearchItemDetail.bind(this)],
        ]);
    }

    onSearchItemDetail(data: SearchWordItem){
        this._collectWoldInfo = data;
        ServiceMgr.studyService.moreWordDetail(this._collectWoldInfo.word);
    }
    
    private async onSearchCollectWork(data:SearchWordItem){
        this._collectWoldInfo = data;
    }

    private async onTotalCollectWord(data: any) {
        if(!isValid(this.node) || !this.node.active){return}
        const historyItem = this._historys.find(item => item.word === this._collectWoldInfo.word);
        
        if (historyItem) {
            historyItem.is_collect = this._collectWoldInfo.is_collect ? 0 : 1;
            
            this.saveHistory();
            
            this.updateHistoryList();
        } else {
            console.error(`History item with word ${this._collectWoldInfo.word} not found.`);
        }
    }
    
    private async onSearchWord(data: SearchWordResponse) {
        console.log(data);
        if (!isValid(data.word)) {
            console.error("单词为空");
            ViewsManager.showTip(TextConfig.Word_Empty_Tips);
            return;
        }
        this._historys = [data.word, ...this._historys.filter(item => item.word !== data.word.word)];
        this.saveHistory();
        this.updateHistoryList();
    }

    private async onMoreWordDetail(data: WordsDetailData) {
        console.log("onMoreWordDetail", data);
        if(!isValid(this.node) || !this.node.active){return}
        if (data.code !== 200) {
            console.error("获取单词详情失败", data.msg);
            ViewsManager.showTip(TextConfig.Word_Error_Tips);
            this._detailData = null;
            return;
        }
        this._detailData = this.createDetailData(data);
        console.log(this._detailData);
        const node = await ViewsManager.instance.showViewAsync(PrefabType.WordSearchView);
        node.getComponent(WordSearchView).updateData(this._detailData);
    }

    private createDetailData(data: WordsDetailData): WordsDetailData {
        const historyItem = this._historys.find(h => h.word === this._collectWoldInfo.word);
        let detailData: WordsDetailData ={
            ...historyItem,
            sentence_list: data.sentence_list,
            similar_list: data.similar_list,
            structure: data.structure,
            variant: data.variant,
        };
        detailData.collect_flag = historyItem.is_collect;
        return detailData;
    }

    initEvent(): void {
        CCUtil.onBtnClick(this.btnSearch, this.onSearch.bind(this));
        CCUtil.onBtnClick(this.btnClearHistoryAll, this.onClearHistory.bind(this));
    }

    onDestroy(): void {
        super.onDestroy();
        SoundMgr.mainBgm();
    }

    private onSearch() {
        const word = this.edtSearchWord.string;
        if (word && word.length > 0) {
            ServiceMgr.studyService.searchWord(word);
        }
    }

    private onClearHistory() {
        this._historys = [];
        this.saveHistory();
        this.updateHistoryList();
    }

    private saveHistory() {
        localStorage.setItem("searchHistory", JSON.stringify(this._historys));
    }

    private updateHistoryList() {
        this.historyList.numItems = this._historys.length;
    }

    onLoadSearchWordList(item: Node, idx: number) {
        const itemScript = item.getComponent(WordHistoryItem);
        itemScript.updateWordProps(this._historys[idx]);
    }

    onSearchWordListSelected(item: any, selectedId: number) {
        if (!isValid(selectedId) || selectedId < 0 || !isValid(item)) return;
        console.log("onSearchWordListSelected.....", selectedId);
        // TBServer.reqWordDetail("0055a6e7e0fa064c446d284826ab5151");
    }
}
