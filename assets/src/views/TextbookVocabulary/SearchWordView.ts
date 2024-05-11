import { _decorator, Component, EditBox, instantiate, Node, Prefab, ScrollView } from 'cc';
import { WordHistoryItem } from './WordHistoryItem';
import { ServiceMgr } from '../../net/ServiceManager';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';
import CCUtil from '../../util/CCUtil';
import { WordSearchView } from './WordSearchView';
const { ccclass, property } = _decorator;

/**单词简单结构 */
export interface WordSimpleData {
    Word: string; //单词
    Cn: string;   //释义
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
export class SearchWordView extends Component {
    @property(EditBox)
    private edtSearchWord: EditBox = null;

    @property(ScrollView)
    private historyList: ScrollView = null;

    @property({ type: Node, tooltip: "返回按钮" })
    public btn_back: Node = null;

    @property({ type: Node, tooltip: "查找按钮" })
    public btn_search: Node = null;

    @property({ type: Node, tooltip: "清除所有的单词查找历史" })
    public btn_clearHistoryAll: Node = null;

    @property(Prefab)
    private preWordHistoryItem: Prefab = null;

    _historys: Array<WordSimpleData> = []; //查找的历史
    _historyObj = {}; //JSON组织的查找历史
    protected _detailData: NetWordSimpleData = null; //当前单词详情数据

    private _wordDetailEveId: string; //查找单词事件响应
    private _testWordDetailEveId: string = ""; // 测试单词事件响应
    private _testWordDetailItemEveId: string = ""; // 测试点击历史列表项时弹出单词详情事件响应
    private _delOneSearchWordEveId: string = ""; //删除一个单词历史纪录

    private _isSearching: boolean = false; //是否正在查找单词

    initData() {
        this._isSearching = false;
        this.historyList.content.removeAllChildren();

        this._historys = [];
        this._historyObj = {};
        if (localStorage.getItem("searchHistory")) {
            this._historyObj = JSON.parse(localStorage.getItem("searchHistory"));
            for (let k in this._historyObj) {

                let data: WordSimpleData = { Word: k, Cn: this._historyObj[k] };
                this._historys.push(data);
            }
        }

        for (let i = 0; i < this._historys.length; i++) {
            let data = this._historys[i];
            this.addHitstoryListItem(data);
        }
        this.historyList.scrollToTop();
    }

    initEvent(): void {
        CCUtil.onTouch(this.btn_back, this.closeView, this);
        CCUtil.onTouch(this.btn_search, this.onSearch, this);
        CCUtil.onTouch(this.btn_clearHistoryAll, this.onClearHistory, this);
        this._wordDetailEveId = EventManager.on(EventType.Classification_Word, this.onWordDetail.bind(this));
        this._testWordDetailEveId = EventManager.on(EventType.Search_Word, this.onTestSearchWord.bind(this));
        this._testWordDetailItemEveId = EventManager.on(EventType.Search_Word_Item, this.onTestSearchWordItem.bind(this));
        this._delOneSearchWordEveId = EventManager.on(EventType.Search_Word_Del_OneWord, this.onDelOneSearchWord.bind(this));

        this.edtSearchWord.node.on(EventType.Search_Word_Edt_Began, this.onEditBoxBeganEdit, this);
    }

    /**移除监听 */
    removeEvent() {
        CCUtil.offTouch(this.btn_back, this.closeView, this);
        CCUtil.offTouch(this.btn_search, this.onSearch, this);
        CCUtil.offTouch(this.btn_clearHistoryAll, this.onClearHistory, this);
        EventManager.off(EventType.Classification_Word, this._wordDetailEveId);
        EventManager.off(EventType.Search_Word, this._testWordDetailEveId);
        EventManager.off(EventType.Search_Word_Item, this._testWordDetailItemEveId);
        EventManager.off(EventType.Search_Word_Del_OneWord, this._delOneSearchWordEveId);
        //this.edtSearchWord.node.off("editing-did-began", this.onEditBoxBeganEdit, this);
    }

    protected onLoad(): void {
        this.initData();
        this.initEvent();
    }

    /**关闭页面 TODO*/
    private closeView() {
        //director.loadScene(SceneType.MainScene);
        ViewsManager.instance.closeView(PrefabType.SearchWorldView);
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
        if (!data.Word || !data.Cn) {
            return;
        }
        let itemHistory = instantiate(this.preWordHistoryItem);
        itemHistory.getComponent(WordHistoryItem).init(data);
        this.historyList.content.addChild(itemHistory);
    }

    start() {

    }

    protected onDestroy(): void {
        //EventManager.off(EventType.Classification_Word, this._wordDetailEveId);
        this.removeEvent();
    }

    /**获取单词详情*/
    onWordDetail(data) { // { Word: data.Word, Cn: data.Cn }
        if (data.Code != 200) {
            console.error("获取单词详情失败", data);
            return;
        }
        this._detailData = data.Data;
        console.log("获取单词详情:", data);
    }

    onTestSearchWord(data: NetWordSimpleData) {
        console.log("查找单词测试:", data);
        this._detailData = data;
        if (data.Code != 200) {
            console.error("获取单词详情失败", data);
            this._isSearching = false;
            return;
        }

        if (data.Word !== "") {
            //暂时还没做到
            //let searchView = new WordSearchView(data);
            //searchView.popup();
            //打开单词详情
            ViewsManager.instance.showView(PrefabType.WordSearchView, (node: Node) => {
                let wordData: SearchWordDetail = {
                    Word: data.Word,//"congrantulationcongrantu",//data.Word,//"Daidai",
                    Cn: data.Cn,//"呆呆是一只比熊名犬",
                    SymbolUs: "[/ ˈtiːtʃə(r) /]",
                    Symbol: "[/ ˈtiːtʃə(r) /]",
                    Sentences: [
                        {
                            Word: "",
                            En: "Please give me a apple",
                            Cn: "请给我一个苹果",
                            Id: "1001",
                        },
                    ],
                    Speech: [
                        {
                            sp: "vt.",
                            tr: "vi. 赠送，捐赠",
                        },
                        {
                            sp: "vt.",
                            tr: "给，提供，支付，使产生",
                        },
                    ],
                    Similars: [
                        { Word: "send", Cn: "n. 送给" },
                        { Word: "donate", Cn: "n. 捐赠" },
                    ],
                    Ancillary: "背单词没有捷径",
                    Structure: {
                        Roots: [{ Name: "er" }, { Name: "alt" }],
                        Prefixs: [{ Name: "pre" }, { Name: "le" }],
                        Suffix: [{ Name: "root" }, { Name: "me" }],
                    }
                };
                node.getComponent(WordSearchView).initData(wordData);
            });
            if (!this._historyObj[data.Word]) {
                //this.clearBtn();
                this._historyObj[data.Word] = data.Cn;
                this._historys.push({ Word: data.Word, Cn: data.Cn });
                //this.historyList.array = this.historys;
                let historyObjStr: string = JSON.stringify(this._historyObj);
                localStorage.setItem("searchHistory", historyObjStr);
                this.addHitstoryListItem(data);
            }
        }

        this._isSearching = false;
    }

    onTestSearchWordItem(data: NetWordSimpleData) {
        let word: string = data.Word;
        if (!word) {
            return;
        }
        if (this._isSearching) return;
        this._isSearching = true;
        //word = word.trim();
        console.log("查找单词详情");
        // 这句代码暂时无效，服务器接口没准备好
        ServiceMgr.studyService.getAdventureWord(word);
        //测试代码,接口没送到
        let testWordResp: NetWordSimpleData = { Code: 200, Word: word, Cn: "你好，一种敬语。" };
        EventManager.emit(EventType.Search_Word, testWordResp);
    }

    /**删除一个词条 */
    onDelOneSearchWord(data: string) {
        let delWord: string = data as string;
        if (!delWord) {
            return;
        }
        for (let i = 0; i < this._historys.length; i++) {
            if (this._historys[i].Word == delWord) {
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
        if (this._isSearching) return;
        this._isSearching = true;
        //word = word.trim();
        console.log("查找单词详情");
        // 这句代码暂时无效，服务器接口没准备好
        ServiceMgr.studyService.getAdventureWord(word);
        //测试代码,接口没送到
        let testWordResp: NetWordSimpleData = { Code: 200, Word: word, Cn: "你好，一种敬语。" };
        EventManager.emit(EventType.Search_Word, testWordResp);
    }

    /**清除所有的单词搜索历史 */
    onClearHistory() {
        this._historyObj = {};
        localStorage.removeItem("searchHistory");
        this._historys = [];
        this.historyList.content.removeAllChildren();
    }



    update(deltaTime: number) {

    }
}


