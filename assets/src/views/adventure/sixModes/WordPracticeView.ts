import { _decorator, Label, Node } from 'cc';
import { EventType } from '../../../config/EventType';
import { NetConfig } from '../../../config/NetConfig';
import { PrefabType } from '../../../config/PrefabType';
import { AdvLevelConfig, DataMgr } from '../../../manager/DataMgr';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { ViewsManager } from '../../../manager/ViewsManager';
import { GameMode } from '../../../models/AdventureModel';
import { UnitWordModel } from '../../../models/TextbookModel';
import { ServiceMgr } from '../../../net/ServiceManager';
import CCUtil from '../../../util/CCUtil';
import EventManager from '../../../util/EventManager';
import List from '../../../util/list/List';
import { TransitionView } from '../common/TransitionView';
import { BaseModeView } from './BaseModeView';
import { LetterItem } from './items/LetterItem';
import { SelectLetterItem } from './items/SelectLetterItem';
import { WordSpellView } from './WordSpellView';
const { ccclass, property } = _decorator;

@ccclass('WordPracticeView')
export class WordPracticeView extends BaseModeView {
    @property({ type: Label, tooltip: "单词Label" })
    wordLabel: Label = null;
    @property({ type: Node, tooltip: "单词读音" })
    wordSound: Node = null;
    @property({ type: Label, tooltip: "中文意思" })
    wordMeanLabel: Label = null;
    @property({ type: List, tooltip: "字母List" })
    letterList: List = null;
    @property({ type: List, tooltip: "选择List" })
    selectList: List = null;

    private _currentWord: UnitWordModel; //当前单词
    private _letterList: string[] = []; //字母列表
    private _currentLetterIdx: number = 0; //当前字母索引
    private _letterItems: Node[] = []; //字母节点
    private _selectLetterList: any[] = []; //选择的字母列表
    private _selectLetterItems: Node[] = []; //选择字母节点

    private _spilitData: any = null; //拆分数据

    private _getWordsEveId: string = ""; //获取单词事件id

    async initData(wordsdata: UnitWordModel[], levelData: any) {
        this.gameMode = GameMode.Practice;
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
        this.showCurrentWord();
    }

    showCurrentWord() {
        this.clearItems();
        this._currentLetterIdx = 0;
        this._currentWord = this._wordsData[this._wordIndex];
        let word = this._currentWord.word;
        for (let i = 0; i < word.length; i++) {
            this._selectLetterList.push({ letter: word[i], color: 0 });
            this._letterList.push(word[i]);
        }
        //暂时获取拆分数据用来标记颜色
        let splitData = this._spilitData[this._currentWord.word];
        let splits = [];
        if (splitData) {
            splits = splitData.split(" ");
        } else {
            if (word.indexOf(" ") != -1) {
                splits = word.split(" ");
            }
        }
        let colorIdx = 1;
        let idx = 0;
        for (let i = 0; i < splits.length; i++) {
            if (this._selectLetterList[idx].letter != splits[i][0]) { //如果当前字母与拆分不对应则跳过该字母
                idx++;
                continue;
            }
            let temp = idx;
            for (let j = idx; j < temp + splits[i].length; j++) {
                if (!this._selectLetterList[j]) continue;
                this._selectLetterList[j].color = colorIdx;
                idx++;
            }
            colorIdx++;
            if (colorIdx > 3) {
                colorIdx = 1;
            }
        }
        console.log("letterList", this._letterList);
        console.log("selectLetterList", this._selectLetterList);
        this.wordLabel.string = this._currentWord.word;
        this.wordMeanLabel.string = this._currentWord.cn;
        this.letterList.numItems = this._letterList.length;
        this.selectList.numItems = this._selectLetterList.length;

        this.playWordSound();
    }

    onLetterRender(item: Node, index: number) {
        item.getComponent(LetterItem).setData(this._letterList[index]);
        this._letterItems[index] = item;
    }

    onSelectLetterRender(item: Node, index: number) {
        item.getComponent(SelectLetterItem).setData(this._selectLetterList[index]);
        this._selectLetterItems[index] = item;
        CCUtil.onTouch(item, this.onItemClick.bind(this, item, index), this);
    }

    onItemClick(item: Node, index: number) {
        if (index != this._currentLetterIdx) return;
        item.removeFromParent();
        this._letterItems[index].getComponent(LetterItem).showLetter();
        this._currentLetterIdx++;

        //当前词答题完毕
        if (this._currentLetterIdx >= this._currentWord.word.length) {
            this._wordIndex++;
            this._rightNum++;

            this.attackMonster().then(() => {
                if (this._wordIndex >= this._wordsData.length) {
                    this.monsterEscape();
                } else {
                    this.showCurrentWord();
                }
            });
        }
        let word = this._wordsData[this._wordIndex].word
        this.onGameSubmit(word, true);
    }

    protected modeOver(): void {
        console.log('练习模式完成');
        ViewsManager.instance.showView(PrefabType.TransitionView, (node: Node) => {
            let wordData = JSON.parse(JSON.stringify(this._wordsData));
            let levelData = JSON.parse(JSON.stringify(this._levelData));
            //跳转到下一场景
            node.getComponent(TransitionView).setTransitionCallback(() => {
                ViewsManager.instance.showView(PrefabType.WordSpellView, (node: Node) => {
                    node.getComponent(WordSpellView).initData(wordData, levelData);
                    ViewsManager.instance.closeView(PrefabType.WordPracticeView);
                });
            });
        });
    }

    playWordSound() {
        let word = this._currentWord.word;
        let wordSoundUrl = "";
        wordSoundUrl = "/sounds/glossary/words/en/" + word + ".wav";
        return RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    clearItems() {
        for (let i = 0; i < this._selectLetterItems.length; i++) {
            if (this._selectLetterItems[i]) {
                CCUtil.offTouch(this._selectLetterItems[i], this.onItemClick.bind(this, this._selectLetterItems[i], i), this);
            }
        }
        this._selectLetterList = [];
        this._letterList = [];
        this._selectLetterItems = [];
        this._letterItems = [];
    }

    protected initEvent(): void {
        super.initEvent();
        CCUtil.onTouch(this.wordSound, this.playWordSound, this);
    }
    protected removeEvent(): void {
        super.removeEvent();
        CCUtil.offTouch(this.wordSound, this.playWordSound, this);
        this.clearItems();
    }
}


