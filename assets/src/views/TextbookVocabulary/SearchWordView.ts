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

    historys: Array<any> = []; //查找的历史
    historyObj: any = {}; //JSON组织的查找历史
    protected _detailData: any = null; //当前单词详情数据

    private _wordDetailEveId: string; //查找单词事件响应
    private _testWordDetailEveId: string = ""; // 测试单词事件响应
    private _testWordDetailItemEveId: string = ""; // 测试点击历史列表项时弹出单词详情事件响应
    private _delOneSearchWordEveId: string = ""; //删除一个单词历史纪录

    private isSearching: boolean = false; //是否正在查找单词

    initData() {
        this.isSearching = false;
        this.historyList.content.removeAllChildren();

        this.historys = [];
        this.historyObj = {};
        if (localStorage.getItem("searchHistory")) {
            this.historyObj = JSON.parse(localStorage.getItem("searchHistory"));
            for (let k in this.historyObj) {
                let data = { Word: k, Cn: this.historyObj[k] };
                this.historys.push(data);
            }
        }

        for (let i = 0; i < this.historys.length; i++) {
            let data = this.historys[i];
            this.addHitstoryListItem(data);
        }
        this.historyList.scrollToTop();
    }

    initEvent(): void {
        CCUtil.onTouch(this.btn_back, this.closeView, this);
        CCUtil.onTouch(this.btn_search, this.onSearch, this);
        CCUtil.onTouch(this.btn_clearHistoryAll, this.onClearHistory, this);
        this._wordDetailEveId = EventManager.on(EventType.Classification_Word, this.onWordDetail.bind(this));
        this._testWordDetailEveId = EventManager.on("SearchWord", this.onTestSearchWord.bind(this));
        this._testWordDetailItemEveId = EventManager.on("SearchWordItem", this.onTestSearchWordItem.bind(this));
        this._delOneSearchWordEveId = EventManager.on("DelOneSearchWord", this.onDelOneSearchWord.bind(this));

        this.edtSearchWord.node.on("editing-did-began", this.onEditBoxBeganEdit, this);
    }

    /**移除监听 */
    removeEvent() {
        CCUtil.offTouch(this.btn_back, this.closeView, this);
        CCUtil.offTouch(this.btn_search, this.onSearch, this);
        CCUtil.offTouch(this.btn_clearHistoryAll, this.onClearHistory, this);
        EventManager.off(EventType.Classification_Word, this._wordDetailEveId);
        EventManager.off("SearchWord", this._testWordDetailEveId);
        EventManager.off("SearchWordItem", this._testWordDetailItemEveId);
        EventManager.off("DelOneSearchWord", this._delOneSearchWordEveId);
        this.edtSearchWord.node.off("editing-did-began", this.onEditBoxBeganEdit, this);
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
    addHitstoryListItem(data: any) {
        console.log("addHitstoryList data:", data);
        if (!data) {
            return;
        }
        if (!data.Word || !data.Cn) {
            return;
        }
        let itemHistory = instantiate(this.preWordHistoryItem);
        itemHistory.getComponent(WordHistoryItem).Init(data);
        this.historyList.content.addChild(itemHistory);
    }

    start() {

    }

    protected onDestroy(): void {
        //EventManager.off(EventType.Classification_Word, this._wordDetailEveId);
        this.removeEvent();
    }

    /**获取单词详情*/
    onWordDetail(data: any) { // { Word: data.Word, Cn: data.Cn }
        if (data.Code != 200) {
            console.error("获取单词详情失败", data);
            return;
        }
        this._detailData = data.Data;
        console.log("获取单词详情:", data);
    }

    onTestSearchWord(data: any) {
        console.log("查找单词测试:", data);
        this._detailData = data;
        if (data.Code != 200) {
            console.error("获取单词详情失败", data);
            this.isSearching = false;
            return;
        }

        if (data.Word !== "") {
            //暂时还没做到
            //let searchView = new WordSearchView(data);
            //searchView.popup();
            //打开单词详情
            ViewsManager.instance.showView(PrefabType.WordSearchView, (node: Node) => {
                let wordData = {
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
            if (!this.historyObj[data.Word]) {
                //this.clearBtn();
                this.historyObj[data.Word] = data.Cn;
                this.historys.push({ Word: data.Word, Cn: data.Cn });
                //this.historyList.array = this.historys;
                let historyObjStr: string = JSON.stringify(this.historyObj);
                localStorage.setItem("searchHistory", historyObjStr);
                this.addHitstoryListItem(data);
            }
        }

        this.isSearching = false;
    }

    onTestSearchWordItem(data: any) {
        let word: string = data.Word;
        if (!word) {
            return;
        }
        if (this.isSearching) return;
        this.isSearching = true;
        //word = word.trim();
        console.log("查找单词详情");
        // 这句代码暂时无效，服务器接口没准备好
        ServiceMgr.studyService.getClassificationWord(word);
        //测试代码,接口没送到
        EventManager.emit("SearchWord", { Code: 200, Word: word, Cn: "你好，一种敬语。" });
    }

    /**删除一个词条 */
    onDelOneSearchWord(data: any) {
        let delWord: string = data as string;
        if (!delWord) {
            return;
        }
        for (let i = 0; i < this.historys.length; i++) {
            if (this.historys[i].Word == delWord) {
                this.historys.splice(i, 1);
                break;
            }
        }
        delete this.historyObj[data];
        localStorage.setItem("searchHistory", JSON.stringify(this.historyObj));
    }

    /**搜索单个单词的详情 */
    onSearch() { // 
        let word: string = this.edtSearchWord.string;
        if (!word) {
            return;
        }
        if (this.isSearching) return;
        this.isSearching = true;
        //word = word.trim();
        console.log("查找单词详情");
        // 这句代码暂时无效，服务器接口没准备好
        ServiceMgr.studyService.getClassificationWord(word);
        //测试代码,接口没送到
        EventManager.emit("SearchWord", { Code: 200, Word: word, Cn: "你好，一种敬语。" });
    }

    /**清除所有的单词搜索历史 */
    onClearHistory() {
        this.historyObj = {};
        localStorage.removeItem("searchHistory");
        this.historys = [];
        this.historyList.content.removeAllChildren();
    }



    update(deltaTime: number) {

    }
}


