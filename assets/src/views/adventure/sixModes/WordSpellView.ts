import { _decorator, instantiate, Label, Node, NodePool, Prefab } from 'cc';
import { DataMgr } from '../../../manager/DataMgr';
import { GameMode, SentenceData, WordsDetailData } from '../../../models/AdventureModel';
import { UnitWordModel } from '../../../models/TextbookModel';
import CCUtil from '../../../util/CCUtil';
import { BaseModeView } from './BaseModeView';
import { SpellWordItem } from './items/SpellWordItem';
const { ccclass, property } = _decorator;

@ccclass('WordSpellView')
export class WordSpellView extends BaseModeView {
    @property({ type: Prefab, tooltip: "选项item" })
    wordItem: Prefab = null;
    @property({ type: Node, tooltip: "选项节点" })
    itemNode: Node = null;
    @property({ type: Label, tooltip: "句子Label" })
    sentenceLabel: Label = null;
    @property({ type: Node, tooltip: "播放句子按钮" })
    playBtn: Node = null;
    @property({ type: Label, tooltip: "中文Label" })
    cnLabel: Label = null;

    protected _spilitData: any = null;
    private _items: Node[] = [];
    protected _nodePool: NodePool = new NodePool("spellWordItem");

    protected _splits: any[] = null; //当前单词拆分数据,临时测试用
    protected _selectIdxs: number[] = []; //当前选中的索引
    private _sentenceData: SentenceData = null; //句子数据
    private _wrongWordList: any[] = []; //错误单词列表
    private _wrongMode: boolean = false; //错误重答模式
    private _rightWordData: UnitWordModel = null; //正确单词数据
    private _selectLock: boolean = false; //选择锁
    async initData(wordsdata: UnitWordModel[], levelData: any) {
        this.gameMode = GameMode.Spelling;
        this._spilitData = await DataMgr.instance.getWordSplitConfig();
        super.initData(wordsdata, levelData);
        this.initWords(wordsdata);
        this.initEvent();
        this.initMonster(); //初始化怪物
    }

    //获取关卡单词回包
    initWords(data: UnitWordModel[]) {
        console.log('initWords', data);
        this._wordsData = data;
        let splits = [];
        for (let i = 0; i < this._wordsData.length; i++) {
            let word = this._wordsData[i].word;
            let splitData = this._spilitData[word];
            if (splitData) {
                splits.push(splitData.split(" "));
            } else {
                if (word.indexOf(" ") != -1) {
                    let word_sp = word.split(" ");
                    splits.push(word_sp);
                } else {
                    splits.push([]);
                }
            }
        }
        this._splits = splits;
        this.showCurrentWord();
    }

    showCurrentWord() {
        this._selectLock = false;
        this._rightWordData = this._wrongMode ? this._wrongWordList.shift() : this._wordsData[this._wordIndex];
        let word = this._rightWordData.word;
        this.initWordDetail(word);
        this.initItemNode();
    }

    onClassificationWord(data: WordsDetailData) {
        super.onClassificationWord(data);
        let sentences = this._detailData.sentence_list;
        if (sentences && sentences.length > 0) {
            this._sentenceData = sentences[0];
        }
        if (this._sentenceData) {
            let word = this._wordsData[this._wordIndex].word;
            let sentence = this._sentenceData.sentence;
            let lowerSent = sentence.toLowerCase();
            let lowerWord = word.toLowerCase();
            let startIndex = lowerSent.indexOf(lowerWord);
            let endIndex = startIndex + word.length;

            while (endIndex <= sentence.length - 1 && sentence[endIndex] != " " && sentence[endIndex] != "," && sentence[endIndex] != "." && sentence[endIndex] != "!" && sentence[endIndex] != "?") {
                endIndex++;
            }
            let str = "";
            if (startIndex == 0) {
                str = "_____" + sentence.substring(endIndex);
            } else {
                str = sentence.substring(0, startIndex) + "_____" + sentence.substring(endIndex);
            }
            this.sentenceLabel.string = str;
            this.cnLabel.string = this._sentenceData.cn;
        }
    }

    onItemClick(item: Node, idx: number) {
        let wordItem = item.getComponent(SpellWordItem);
        let minIdx = this.getMinIdx(this._selectIdxs);
        let selectIdx = wordItem.selectIdx;
        wordItem.select(minIdx);
        if (wordItem.isSelect)
            this._selectIdxs.push(minIdx);
        else{
            this._selectIdxs.splice(this._selectIdxs.indexOf(selectIdx), 1);
        }
        let word = this._wordsData[this._wordIndex].word
        this.onGameSubmit(word,true);
    }

    //获取不存在于数组中最小的值
    getMinIdx(arr: number[]) {
        let min = 1;
        while (arr.indexOf(min) != -1) {
            min++;
        }
        return min;
    }

    //初始化拆分节点
    initItemNode() {
        this.clearSplitItems();
        let splits = this._splits[this._wordIndex];
        console.log('splits', splits);
        if (splits.length == 0) {
            splits = [this._wordsData[this._wordIndex].word];
        }
        splits.sort((a, b) => {
            return Math.random() > 0.5 ? 1 : -1;
        }); //乱序
        for (let i = 0; i < splits.length; i++) {
            let item = this.getSplitItem();
            item.getComponent(SpellWordItem).init(splits[i]);
            item.parent = this.itemNode;
            CCUtil.onTouch(item, this.onItemClick.bind(this, item, i), this);
            this._items.push(item);
        }
    }

    getSplitItem() {
        let item = this._nodePool.get();
        if (!item) {
            item = instantiate(this.wordItem);
        }
        return item;
    }

    clearSplitItems() {
        for (let i = 0; i < this._items.length; i++) {
            for (let i = 0; i < this._items.length; i++) {
                CCUtil.offTouch(this._items[i], this.onItemClick.bind(this, this._items[i], i), this);
            }
            this._items[i].parent = null;
            this._nodePool.put(this._items[i]);
        }
        this._items = [];
    }

    protected initEvent(): void {
        super.initEvent();
    }
    protected removeEvent(): void {
        super.removeEvent();
        for (let i = 0; i < this._items.length; i++) {
            CCUtil.offTouch(this._items[i], this.onItemClick.bind(this, this._items[i], i), this);
        }
    }

    onDestroy(): void {
        super.onDestroy();
        this._nodePool.clear();
    }

}


