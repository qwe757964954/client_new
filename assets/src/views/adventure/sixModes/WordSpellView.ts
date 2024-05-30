import { _decorator, instantiate, Label, Node, NodePool, Prefab } from 'cc';
import { AdvLevelConfig, DataMgr } from '../../../manager/DataMgr';
import { GameMode, SentenceData, WordGroupData, WordGroupModel, WordsDetailData } from '../../../models/AdventureModel';
import { UnitWordModel } from '../../../models/TextbookModel';
import CCUtil from '../../../util/CCUtil';
import { BaseModeView } from './BaseModeView';
import { SpellWordItem } from './items/SpellWordItem';
import { ServiceMgr } from '../../../net/ServiceManager';
import EventManager from '../../../util/EventManager';
import { EventType } from '../../../config/EventType';
import { InterfacePath } from '../../../net/InterfacePath';
import { ViewsManager } from '../../../manager/ViewsManager';
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

    protected _selectIdxs: number[] = []; //当前选中的索引
    private _sentenceData: SentenceData = null; //句子数据
    private _wrongWordList: any[] = []; //错误单词列表
    private _wrongMode: boolean = false; //错误重答模式
    private _rightWordData: UnitWordModel = null; //正确单词数据
    private _selectLock: boolean = false; //选择锁
    private _wordGroup: WordGroupModel[];

    private _rightIdxs: number[] = []; //正确索引顺序

    private _getWordGroupEvId: string; //获取单词组合数据事件id
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
        let isAdventure = this._levelData.hasOwnProperty('islandId'); //是否是大冒险关卡
        if (isAdventure) { //单词大冒险获取组合模式选项
            let levelData = this._levelData as AdvLevelConfig;
            ServiceMgr.studyService.getWordGroup(levelData.islandId, levelData.levelId, levelData.mapLevelData.micro_id);
        } else { //教材单词获取组合模式选项

        }
    }

    onGetWordGroup(data: WordGroupData) {
        if (data.code != 200) {
            ViewsManager.showTip(data.msg);
            return;
        }
        console.log("wordGroups:", data.data);
        this._wordGroup = data.data;
        this.showCurrentWord();
    }

    getGroupFromWord(word: string) {
        let data = this._wordGroup.find(val => val.word == word);
        return data;
        // if (!data) {
        //     alert("未找到单词-----" + word + "------!");
        //     return [];
        // }
        // let group = [data.opt1, data.opt2, data.opt3, data.opt4];
        // return group;
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
        if (this._selectLock) return;
        let wordItem = item.getComponent(SpellWordItem);
        let minIdx = this.getMinIdx(this._selectIdxs);
        let selectIdx = wordItem.selectIdx;
        wordItem.select(minIdx);
        if (wordItem.isSelect)
            this._selectIdxs.push(minIdx);
        else {
            this._selectIdxs.splice(this._selectIdxs.indexOf(selectIdx), 1);
        }
        let groupData = this.getGroupFromWord(this._wordsData[this._wordIndex].word);
        if (groupData.opt_num == this._selectIdxs.length) { //选择完毕
            this._selectLock = true;
            for (let i = 0; i < this._selectIdxs.length; i++) {

            }
        }
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
        let groupData = this.getGroupFromWord(this._wordsData[this._wordIndex].word);
        let splits = [];
        console.log('groupData', groupData);
        if (!groupData) {
            splits = [this._wordsData[this._wordIndex].word];
        } else {
            splits = [groupData.opt1, groupData.opt2, groupData.opt3, groupData.opt4];
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
            this._rightIdxs.push(splits.indexOf(groupData["opt" + (i + 1)]));
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
        this._getWordGroupEvId = EventManager.on(InterfacePath.Words_Group, this.onGetWordGroup.bind(this));
    }
    protected removeEvent(): void {
        super.removeEvent();
        for (let i = 0; i < this._items.length; i++) {
            CCUtil.offTouch(this._items[i], this.onItemClick.bind(this, this._items[i], i), this);
        }
        EventManager.off(InterfacePath.Words_Group, this._getWordGroupEvId);
    }

    onDestroy(): void {
        super.onDestroy();
        this._nodePool.clear();
    }

}


