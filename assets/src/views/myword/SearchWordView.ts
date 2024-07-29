import { _decorator, EditBox, isValid, Node } from 'cc';
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

    @property({ type: Node, tooltip: "顶不layout" })
    public top_layout: Node = null;

    @property({ type: Node, tooltip: "查找按钮" })
    public btn_search: Node = null;

    @property({ type: Node, tooltip: "清除所有的单词查找历史" })
    public btn_clearHistoryAll: Node = null;

    private _historys: SearchWordItem[] = []; //查找的历史
    protected _detailData: WordsDetailData = null; //当前单词详情数据

    protected initUI(): void {
        SoundMgr.stopBgm();
        this.initNavTitle();
        this.initData();
    }

    initData() {
        this._historys = [];
        if (localStorage.getItem("searchHistory")) {
            this._historys = JSON.parse(localStorage.getItem("searchHistory"));
        }
        this.historyList.numItems = this._historys.length;
    }

    private initNavTitle() {
        this.createNavigation("翻译查询", this.top_layout, () => {
            ViewsManager.instance.closeView(PrefabType.SearchWorldView);
        });
    }

    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [InterfacePath.More_Word_Detail, this.onMoreWordDetail.bind(this)],
            [InterfacePath.Search_Word, this.onSearchWordbind.bind(this)]
        ]);
    }
    onSearchWordbind(data: SearchWordResponse) {
        console.log(data);
        if (!isValid(data.word)) {
            console.error("单词为空");
            ViewsManager.showTip(TextConfig.Word_Empty_Tips);
            return;
        }
        let historyList = this._historys.filter(item => item.word !== data.word.word);
        historyList.unshift(data.word)
        let historyObjStr: string = JSON.stringify(historyList);
        localStorage.setItem("searchHistory", historyObjStr);
        this._historys = JSON.parse(localStorage.getItem("searchHistory"));
        this.historyList.numItems = this._historys.length;
    }
    protected async onMoreWordDetail(data: WordsDetailData) {
        console.log("onMoreWordDetail", data);
        if (data.code != 200) {
            console.error("获取单词详情失败", data.msg);
            ViewsManager.showTip(TextConfig.Word_Error_Tips);
            this._detailData = null;
            return;
        }
        let his_item = this._historys.find(h => h.word === data.variant.word);
        this._detailData = {
            word: his_item.word,
            cn: his_item.cn,
            symbol: his_item.symbol,
            symbolus: his_item.symbolus,
            syllable: his_item.syllable,
            phonic: his_item.phonic,
            example: his_item.example,
            example_cn: his_item.example_cn,
            etyma: his_item.etyma,
            ancillary: his_item.ancillary,
            speech: his_item.speech,
            collect_flag:his_item.is_collect,
            sentence_list: data.sentence_list,
            similar_list: data.similar_list,
            structure: data.structure,
            variant: data.variant,
        }
        let node = await ViewsManager.instance.showViewAsync(PrefabType.WordSearchView);
        node.getComponent(WordSearchView).updateData(this._detailData);

    }

    initEvent(): void {
        CCUtil.onBtnClick(this.btn_search, this.onSearch.bind(this));
        CCUtil.onBtnClick(this.btn_clearHistoryAll, this.onClearHistory.bind(this));
    }

    private onEditBoxBeganEdit(edtBox: EditBox) {
        this.edtSearchWord.string = "";
    }
    onDestroy(): void {
        super.onDestroy();
        SoundMgr.mainBgm();
    }
    /**搜索单个单词的详情 */
    onSearch() { // 
        let word: string = this.edtSearchWord.string;
        if (!word && word.length > 0) {
            return;
        }
        ServiceMgr.studyService.searchWord(word);
    }

    /**清除所有的单词搜索历史 */
    onClearHistory() {
        this._historys = [];
        let historyObjStr: string = JSON.stringify(this._historys);
        localStorage.setItem("searchHistory", historyObjStr);
        this._historys = JSON.parse(localStorage.getItem("searchHistory"));
        this.historyList.numItems = this._historys.length;
    }

    onLoadSearchWordList(item: Node, idx: number) {
        let item_script = item.getComponent(WordHistoryItem);
        item_script.updateWordProps(this._historys[idx]);
    }
    onSearchWordListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!isValid(selectedId) || selectedId < 0 || !isValid(item)) { return; }
        console.log("onSearchWordListSelected.....", selectedId);
        // TBServer.reqWordDetail("0055a6e7e0fa064c446d284826ab5151");
    }
}


