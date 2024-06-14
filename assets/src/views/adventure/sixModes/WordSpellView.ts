import { _decorator, instantiate, isValid, Label, Node, NodePool, Prefab, Sprite, SpriteFrame } from 'cc';
import { NetConfig } from '../../../config/NetConfig';
import { PrefabType } from '../../../config/PrefabType';
import GlobalConfig from '../../../GlobalConfig';
import { AdvLevelConfig, BookLevelConfig, DataMgr } from '../../../manager/DataMgr';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { ViewsManager } from '../../../manager/ViewsManager';
import { GameMode, SentenceData, WordGroupData, WordGroupModel, WordsDetailData } from '../../../models/AdventureModel';
import { UnitWordModel } from '../../../models/TextbookModel';
import { InterfacePath } from '../../../net/InterfacePath';
import { ServiceMgr } from '../../../net/ServiceManager';
import CCUtil from '../../../util/CCUtil';
import MD5Util from '../../../util/MD5Util';
import { TransitionView } from '../common/TransitionView';
import { BaseModeView } from './BaseModeView';
import { SpellWordItem } from './items/SpellWordItem';
import { WordReadingView } from './WordReadingView';
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
    @property({ type: Node, tooltip: "结果图片" })
    resultSprite: Node = null;
    @property({ type: SpriteFrame, tooltip: "正确图片" })
    rightSprite: SpriteFrame = null;
    @property({ type: SpriteFrame, tooltip: "错误图片" })
    wrongSprite: SpriteFrame = null;
    @property({ type: Node, tooltip: "播放例句按钮" })
    playSentenceBtn: Node = null;

    protected _spilitData: any = null;
    private _items: Node[] = [];
    protected _nodePool: NodePool = new NodePool("spellWordItem");

    protected _selectIdxs: number[] = []; //当前选中的索引
    protected _selectItems: Node[] = []; //选中item
    private _sentenceData: SentenceData = null; //句子数据
    private _wrongWordList: any[] = []; //错误单词列表
    private _wrongMode: boolean = false; //错误重答模式
    private _rightWordData: UnitWordModel = null; //正确单词数据
    private _selectLock: boolean = false; //选择锁
    private _wordGroup: WordGroupModel[];

    private _getWordGroupEvId: string; //获取单词组合数据事件id
    private _getTextBookWordGroupEvId: string; //获取教材单词组合数据事件id
    async initData(wordsdata: UnitWordModel[], levelData: any) {
        this.gameMode = GameMode.Spelling;
        this._spilitData = await DataMgr.instance.getWordSplitConfig();
        wordsdata = this.updateTextbookWords(wordsdata, levelData);
        this.initWords(wordsdata);
        this.initEvent();
        this.initMonster(); //初始化怪物
    }

    //获取关卡单词回包
    initWords(data: UnitWordModel[]) {
        console.log('initWords', data);
        console.log(this.node);
        if (!isValid(this.resultSprite)) {
            this.resultSprite = this.node.getChildByName('frame').getChildByName('resultIcon'); //
        }
        console.log("this.resultSprite_____", this.resultSprite);
        this._wordsData = data;
        let isAdventure = this._levelData.hasOwnProperty('islandId'); //是否是大冒险关卡
        if (isAdventure) { //单词大冒险获取组合模式选项
            let levelData = this._levelData as AdvLevelConfig;
            ServiceMgr.studyService.getWordGroup(levelData.bigId, levelData.smallId, levelData.mapLevelData.micro_id);
        } else { //教材单词获取组合模式选项
            let levelData = this._levelData as BookLevelConfig;
            ServiceMgr.studyService.getTextbookWordGroup(levelData.book_id, levelData.unit_id);
        }
    }

    onInitModuleEvent() {
        super.onInitModuleEvent();
        this.addModelListener(InterfacePath.Words_Group, this.onGetWordGroup);
        this.addModelListener(InterfacePath.Classification_WordGroup, this.onGetWordGroup);
    }

    onGetWordGroup(data: WordGroupData) {
        if (data.code != 200) {
            ViewsManager.showTip(data.msg);
            return;
        }
        console.log("wordGroups:", data.data);
        this.resultSprite.active = false;
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
        this.resultSprite.active = false;
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
            let word = this._rightWordData.word;
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

    onItemClick(e: any) {
        if (this._selectLock) return;
        let item = e.target;
        let wordItem = item.getComponent(SpellWordItem);
        let minIdx = this.getMinIdx(this._selectIdxs);
        let selectIdx = wordItem.selectIdx;
        wordItem.select(minIdx);
        if (wordItem.isSelect) {
            this._selectIdxs.push(minIdx);
            this._selectItems.push(item);
        } else {
            this._selectIdxs.splice(this._selectIdxs.indexOf(selectIdx), 1);
            this._selectItems.splice(this._selectItems.indexOf(item), 1);
        }
        let groupData = this.getGroupFromWord(this._rightWordData.word);
        if (groupData.opt_num == this._selectIdxs.length) { //选择完毕
            this._selectLock = true;
            let isRight = true;
            for (let i = 0; i < this._selectIdxs.length; i++) {
                let idx = i + 1;
                let item = this.getItemBySelectIdx(idx);
                if (item.getComponent(SpellWordItem).word != groupData["opt" + idx]) {
                    isRight = false;
                }
            }
            this.resultSprite.active = true;
            let word = this._rightWordData.word;
            this.onGameSubmit(word, isRight);
            if (isRight) { //回答正确
                this._rightNum++;
                if (this._wrongMode) {
                    if (this._wrongWordList.length == 0) {
                        this._wrongMode = false;
                        this._wordIndex++;
                    }
                } else {
                    this._wordIndex++;
                }
                this.resultSprite.getComponent(Sprite).spriteFrame = this.rightSprite;
                if (this._sentenceData) {
                    this.sentenceLabel.string = this._sentenceData.sentence;
                }
                this.attackMonster().then(() => {
                    if (this._wordIndex >= this._wordsData.length) {
                        if (this._wrongWordList.length > 0) {
                            this._wrongMode = true;
                            this.showCurrentWord();
                        } else {
                            this.monsterEscape();
                        }
                    } else {
                        this.showCurrentWord();
                    }
                });
            } else { //回答错误
                this.resultSprite.getComponent(Sprite).spriteFrame = this.wrongSprite;
                if (this._wrongWordList.indexOf(this._rightWordData) == -1 && !this._wrongMode && !this._errorWords[this._rightWordData.word]) {
                    this._errorNum++;
                    this._levelData.error_num = this._errorNum;
                    this.errorNumLabel.string = "错误次数：" + this._errorNum;
                }
                this._wrongWordList.push(this._rightWordData);
                if (!this._wrongMode) {
                    this._wordIndex++;
                    if (this._wordIndex >= this._wordsData.length) {
                        this._wrongMode = true;
                    }
                }
                this.scheduleOnce(() => {
                    this.showCurrentWord();
                }, 1);
            }
        }
    }

    protected modeOver(): void {
        console.log('拼模式完成');
        ViewsManager.instance.showView(PrefabType.TransitionView, (node: Node) => {
            let wordData = JSON.parse(JSON.stringify(this._wordsData));
            let levelData = JSON.parse(JSON.stringify(this._levelData));
            //跳转到下一场景
            node.getComponent(TransitionView).setTransitionCallback(() => {
                ViewsManager.instance.showView(PrefabType.WordReadingView, (node: Node) => {
                    ViewsManager.instance.closeView(PrefabType.WordSpellView);
                    this.node.destroy();
                    node.getComponent(WordReadingView).initData(wordData, levelData);
                });
            });
        });
    }

    getItemBySelectIdx(idx: number) {
        for (let i = 0; i < this._selectItems.length; i++) {
            if (this._selectItems[i].getComponent(SpellWordItem).selectIdx == idx) {
                return this._selectItems[i];
            }
        }
        return null;
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
        let groupData = this.getGroupFromWord(this._rightWordData.word);
        let splits = [];
        console.log('groupData', groupData);
        if (!groupData) {
            splits = [this._rightWordData.word];
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
            CCUtil.onTouch(item, this.onItemClick, this);
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
            this._items[i].getComponent(SpellWordItem).dispose();
            CCUtil.offTouch(this._items[i], this.onItemClick, this);
            this._items[i].parent = null;
            this._nodePool.put(this._items[i]);
        }

        this._items = [];
        this._selectIdxs = [];
        this._selectItems = [];
    }

    playSentence() {
        if (!this._sentenceData) return;
        // let url = NetConfig.assertUrl + "/sounds/glossary/sentence_tts/Emily/" + this._sentenceData.id + ".wav";
        let soundName = MD5Util.hex_md5(this._sentenceData.sentence);
        let type = GlobalConfig.USE_US ? "us" : "en";
        let url = NetConfig.assertUrl + "/sounds/sentence/" + type + "/" + soundName + ".wav"
        RemoteSoundMgr.playSound(url);
    }

    protected initEvent(): void {
        super.initEvent();

        CCUtil.onTouch(this.playSentenceBtn, this.playSentence, this);
    }
    protected removeEvent(): void {
        console.log("WordSpellView.......removeEvent")
        super.removeEvent();
        for (let i = 0; i < this._items.length; i++) {
            CCUtil.offTouch(this._items[i], this.onItemClick.bind(this, this._items[i], i), this);
        }
        CCUtil.offTouch(this.playSentenceBtn, this.playSentence, this);
    }

    onDestroy(): void {
        super.onDestroy();
        this._nodePool.clear();
    }

}


