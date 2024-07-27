import { _decorator, EditBox, instantiate, isValid, JsonAsset, Node, Prefab } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { SoundMgr } from '../../manager/SoundMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { WordsDetailData } from '../../models/AdventureModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { WordHistoryItem } from './WordHistoryItem';
import { WordSearchView } from './WordSearchView';
const { ccclass, property } = _decorator;

/**单词简单结构 */
export interface WordSimpleData {
    word: string; //单词
    cn: string;   //释义
}

/**单词简单结构 */
export interface WordSimpleData2 {
    Word: string; //单词
    Cn: string;   //释义
    Symbol: string; //音标
}

/**查找单词网络回应数据 */
export interface NetWordSimpleData {
    Code: number, //网络返回的响应码
    Word: string; //单词
    Cn: string;   //释义
}

/**查找单词真实网络回应数据 */
export interface NetSearchWordData {
    code: number, //网络返回的响应码
    command_id: number; //命令号
    data: WordsDetailData; //单词详细数据
}

/**单词详情数据 */
export interface WordDetailData {
    word: string;
    ancillary: string; //助记
    cn: string;  //释义
    etyma: string; //词根
    example: string; //英语例句
    example_cn
}

/**例句数据 */
export interface WordSentence {
    Word: string,
    En: string,
    Cn: string,
    Id: string,
}

/**例句数据 */
export interface WordSpeech {
    sp: string,  //音标
    tr: string,  //释义
}

/**词根项 */
export interface WordRootItem {
    Name: string, //词根
}

export interface WordRoot {
    Roots: WordRootItem[], //词根
    Prefixs: WordRootItem[], //前缀
    Suffix: WordRootItem[], //后缀
}

/**单词详情数据 */
export interface SearchWordDetail {
    Word: string, //单词
    Cn: string,  //释义
    SymbolUs: string, //英式音标
    Symbol: string,  //美式音标
    Sentences: WordSentence[], //例句
    Speech: WordSpeech[], //拼读
    Similars: WordSimpleData[], //近义词数组
    Ancillary: string, //单词助记
    Structure: WordRoot, // 单词词根
}

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

    @property(Prefab)
    private preWordHistoryItem: Prefab = null;

    _historys: Array<WordSimpleData> = []; //查找的历史
    _historyObj = {}; //JSON组织的查找历史
    protected _detailData: WordsDetailData = null; //当前单词详情数据

    protected initUI(): void {
        SoundMgr.stopBgm();
        this.initNavTitle();
        this.initData();
        this.historyList.numItems = 10;
    }

    initData() {
        this._historys = [];
        this._historyObj = {};
        if (localStorage.getItem("searchHistory")) {
            this._historyObj = JSON.parse(localStorage.getItem("searchHistory"));
            for (let k in this._historyObj) {
                let data: WordSimpleData = { word: k, cn: this._historyObj[k] };
                this._historys.push(data);
            }
        }
    }

    private initNavTitle() {
        this.createNavigation("翻译查询",this.top_layout, () => {
            ViewsManager.instance.closeView(PrefabType.SearchWorldView);
        });
    }

    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [EventType.Search_Word_Item, this.onSearchWordItem.bind(this)],
            [EventType.Search_Word_Del_OneWord,this.onDelOneSearchWord.bind(this)],
            [EventType.Search_Word_Edt_Began,this.onEditBoxBeganEdit.bind(this)],
            [InterfacePath.Adventure_Word, this.onClassificationWord.bind(this)]
        ]);
    }
    protected async onClassificationWord(data: WordsDetailData) {
        if (data.code != 200) {
            console.error("获取单词详情失败", data.msg);
            this._detailData = null;
            return;
        }
        console.log("获取单词详情", data);
        const jsonData = await ResLoader.instance.loadAsyncPromise<JsonAsset>('myword/word_detail', JsonAsset);
        console.log("获取单词详情", jsonData);
        this._detailData = jsonData.json as WordsDetailData;
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

    /**向historyList里添加一项内容*/
    addHitstoryListItem(data: WordSimpleData) {
        //console.log("addHitstoryList data:", data);
        if (!data) {
            return;
        }
        if (!data.word || !data.cn) {
            return;
        }
        let itemHistory = instantiate(this.preWordHistoryItem);
        itemHistory.getComponent(WordHistoryItem).init(data);
        this.historyList.content.addChild(itemHistory);
    }

    onDestroy(): void {
        super.onDestroy();
        SoundMgr.mainBgm();
    }

    /*
    onClassificationWord(data: WordsDetailData) {
        console.log(data);
        if (data.code != 200) {
            console.log("获取单词详情失败", data);
            ViewsManager.showTip(TextConfig.Search_Word_Fail);
            return;
        }
        this._detailData = data;


        if (this._detailData.word !== "") {
            //打开单词详情
            

            if (!this._historyObj[this._detailData.word]) {
                //this.clearBtn();
                this._historyObj[this._detailData.word] = this._detailData.cn;
                this._historys.push({ word: this._detailData.word, cn: this._detailData.cn });
                //this.historyList.array = this.historys;
                let historyObjStr: string = JSON.stringify(this._historyObj);
                localStorage.setItem("searchHistory", historyObjStr);
                let wordSimpleData: WordSimpleData = { word: this._detailData.word, cn: this._detailData.cn };
                this.addHitstoryListItem(wordSimpleData);
            }
        }
    }
    */
    onTestSearchWord(data: NetSearchWordData) {
        console.log("查找单词测试:", data);
        this._detailData = data.data;
        if (data.code != 200) {
            console.error("获取单词详情失败", data);
            return;
        }


        if (this._detailData.word !== "") {
            //暂时还没做到
            //let searchView = new WordSearchView(data);
            //searchView.popup();
            //打开单词详情
            /*
            ViewsManager.instance.showView(PrefabType.WordSearchView, (node: Node) => {
                let wordData: WordsDetailData = {
                    word: this._detailData.word,//"congrantulationcongrantu",//data.Word,//"Daidai",
                    cn: this._detailData.cn,//"呆呆是一只比熊名犬",
                    symbol: "[/ ˈtiːtʃə(r) /]",
                    symbolus: "[/ ˈtiːtʃə(r) /]",
                    etyma: "",
                    variant: null,
                    sentence_list: [
                        {
                            id: "1001",
                            sentence: "Please give me a apple",
                            cn: "请给我一个苹果",

                        },
                    ],
                    speech: "",
                    similar_list: [
                        { word: "send", cn: "n. 送给" },
                        { word: "donate", cn: "n. 捐赠" },
                    ],
                    ancillary: "背单词没有捷径",
                    structure: {
                        Roots: [{ Name: "er" }, { Name: "alt" }],
                        Prefixs: [{ Name: "pre" }, { Name: "le" }],
                        Suffix: [{ Name: "root" }, { Name: "me" }],
                    },
                    syllable: "d-o-g",
                    phonic: "d·o·g",
                    example: "Dogs bark.",
                    example_cn: "狗叫",
                    code: 200,
                    msg: "请求成功",
                };
                node.getComponent(WordSearchView).initData(wordData);
            });
            if (!this._historyObj[this._detailData.word]) {
                //this.clearBtn();
                this._historyObj[this._detailData.word] = this._detailData.cn;
                this._historys.push({ word: this._detailData.word, cn: this._detailData.cn });
                //this.historyList.array = this.historys;
                let historyObjStr: string = JSON.stringify(this._historyObj);
                localStorage.setItem("searchHistory", historyObjStr);
                this.addHitstoryListItem(this._detailData);
            }
                */
        }
    }

    onSearchWordItem(data: WordSimpleData) {
        let word: string = data.word;
        if (!word) {
            return;
        }
        //word = word.trim();
        console.log("查找单词详情");
        // 这句代码暂时无效，服务器接口没准备好
        ServiceMgr.studyService.getAdventureWord(word);
        //测试代码,接口没送到
        //let testWordResp: NetWordSimpleData = { Code: 200, Word: word, Cn: "你好，一种敬语。" };
        //EventManager.emit(EventType.Search_Word, testWordResp);
    }

    /**删除一个词条 */
    onDelOneSearchWord(data: string) {
        let delWord: string = data as string;
        if (!delWord) {
            return;
        }
        for (let i = 0; i < this._historys.length; i++) {
            if (this._historys[i].word == delWord) {
                this._historys.splice(i, 1);
                break;
            }
        }
        delete this._historyObj[data];
        localStorage.setItem("searchHistory", JSON.stringify(this._historyObj));
    }

    /**搜索单个单词的详情 */
    onSearch() { // 
        let word: string = this.edtSearchWord.string;
        if (!word) {
            return;
        }
        //word = word.trim();
        console.log("查找单词详情");
        // 这句代码暂时无效，服务器接口没准备好
        ServiceMgr.studyService.getAdventureWord(word);
        //测试代码,接口没送到
        //let testWordResp: NetWordSimpleData = { Code: 200, Word: word, Cn: "你好，一种敬语。" };
        //EventManager.emit(EventType.Search_Word, testWordResp);
    }

    /**清除所有的单词搜索历史 */
    onClearHistory() {
        this._historyObj = {};
        localStorage.removeItem("searchHistory");
        
    }

    onLoadSearchWordList(item:Node, idx:number){
        
    }
    onSearchWordListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onSearchWordListSelected.....",selectedId);
        // TBServer.reqWordDetail("0055a6e7e0fa064c446d284826ab5151");
        ServiceMgr.studyService.getAdventureWord("34e4cd05005de4303ee70902a61701c0");

    }
}


