import { _decorator, Component, Label, Node } from 'cc';
import { NetWordSimpleData, SearchWordDetail, WordSimpleData2 } from '../TextbookVocabulary/SearchWordView';
import CCUtil from '../../util/CCUtil';
import { RemoteSoundMgr } from '../../manager/RemoteSoundManager';
import { NetConfig } from '../../config/NetConfig';
import { EventType } from '../../config/EventType';
import EventManager from '../../util/EventManager';
import { ServiceMgr } from '../../net/ServiceManager';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';
import { WordSearchView } from '../TextbookVocabulary/WordSearchView';
const { ccclass, property } = _decorator;

@ccclass('DayWordItem')
export class DayWordItem extends Component {
    @property({ type: Label, tooltip: "单词文本" }) //
    public wordTxt: Label = null;

    @property({ type: Label, tooltip: "释义文本" }) //
    public cnTxt: Label = null;

    @property({ type: Label, tooltip: "音标文本" }) //
    public usSymbolTxt: Label = null;

    @property({ type: Node, tooltip: "播放声音" }) //
    public btnSound: Node = null;

    @property({ type: Node, tooltip: "播放声音" }) //
    public btnLearn: Node = null;

    _data: WordSimpleData2 = null;

    private _isSearching: boolean = false;
    private _testWordDetailEveId: string = "" //测试查找单词详情

    protected onLoad(): void {
        this.initEvent();
    }

    initUI(data: WordSimpleData2) {
        this._data = data;
        this.wordTxt.string = data.Word;
        this.cnTxt.string = data.Cn;
        this.usSymbolTxt.string = data.Symbol;

        this._isSearching = false;
    }

    initEvent() {
        CCUtil.onTouch(this.btnSound, this.onClickPlaySound, this);
        CCUtil.onTouch(this.btnLearn, this.onClickLearn, this);

        this._testWordDetailEveId = EventManager.on(EventType.Search_Word, this.onTestSearchWord.bind(this));
    }

    removeEvent() {
        CCUtil.offTouch(this.btnSound, this.onClickPlaySound, this);
        CCUtil.offTouch(this.btnLearn, this.onClickLearn, this);
        EventManager.off(EventType.Search_Word, this._testWordDetailEveId);
    }

    onClickPlaySound() {
        let word: string = this._data.Word;
        let wordSoundUrl = "/sounds/glossary/words/uk/" + word + ".wav";
        RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    //打开学习单词
    onClickLearn() {
        let word: string = this._data.Word;
        if (this._isSearching) return;
        this._isSearching = true;
        // 这句代码暂时无效，服务器接口没准备好
        ServiceMgr.studyService.getAdventureWord(word);
        //测试代码,接口没送到
        let testWordResp: NetWordSimpleData = { Code: 200, Word: word, Cn: "你好，一种敬语。" };
        EventManager.emit(EventType.Search_Word, testWordResp);
    }

    onTestSearchWord(data: NetWordSimpleData) {
        console.log("查找单词测试:", data);
        //this._detailData = data;
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

        }

        this._isSearching = false;
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


