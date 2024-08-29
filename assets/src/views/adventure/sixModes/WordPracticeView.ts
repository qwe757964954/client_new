import { _decorator, Label, Node } from 'cc';
import { NetConfig } from '../../../config/NetConfig';
import { PrefabType } from '../../../config/PrefabType';
import { DataMgr } from '../../../manager/DataMgr';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { ViewsMgr } from '../../../manager/ViewsManager';
import { GameMode } from '../../../models/AdventureModel';
import { UnitWordModel } from '../../../models/TextbookModel';
import CCUtil from '../../../util/CCUtil';
import List from '../../../util/list/List';
import { Shake } from '../../../util/Shake';
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

    private _currentWord: UnitWordModel = null; // 当前单词
    private _letterList: string[] = []; // 字母列表
    private _currentLetterIdx: number = 0; // 当前字母索引
    private _letterItems: Node[] = []; // 字母节点
    private _selectLetterList: any[] = []; // 选择的字母列表
    private _selectLetterItems: Node[] = []; // 选择字母节点
    private _spilitData: any = null; // 拆分数据

    async initData(wordsdata: UnitWordModel[], levelData: any): Promise<void> {
        this.gameMode = GameMode.Practice;
        this._spilitData = await DataMgr.instance.getWordSplitConfig();
        wordsdata = this.updateTextbookWords(wordsdata, levelData);
        this.initWords(wordsdata);
        this.initMonster(); // 初始化怪物
    }

    private initWords(data: UnitWordModel[]): void {
        this._wordsData = data;
        this.showCurrentWord();
    }

    private showCurrentWord(): void {
        super.updateConstTime();
        this.clearItems();
        this._currentLetterIdx = 0;
        this._currentWord = this._wordsData[this._wordIndex];
        this._rightWordData = this._currentWord;

        this._letterList = Array.from(this._currentWord.word);
        this._selectLetterList = this._letterList.map(letter => ({ letter, color: 0 }));

        this.processSplitData(this._currentWord.word);

        this.wordLabel.string = this._currentWord.word;
        this.wordMeanLabel.string = this._currentWord.cn;
        this.letterList.numItems = this._letterList.length;
        this.selectList.numItems = this._selectLetterList.length;
        this.initWordDetail(this._currentWord);

        this.playWordSound();
    }

    private processSplitData(word: string): void {
        const splitData = this._spilitData[word];
        const splits = splitData ? splitData.split(" ") : word.includes(" ") ? word.split(" ") : [word];

        let colorIdx = 1;
        let idx = 0;

        splits.forEach(split => {
            while (this._selectLetterList[idx]?.letter !== split[0]) {
                idx++;
            }
            for (let j = 0; j < split.length; j++) {
                if (this._selectLetterList[idx]) {
                    this._selectLetterList[idx].color = colorIdx;
                    idx++;
                }
            }
            colorIdx = colorIdx % 3 + 1;
        });
    }

    private onLetterRender(item: Node, index: number): void {
        item.getComponent(LetterItem).setData(this._letterList[index]);
        this._letterItems[index] = item;
    }

    private onSelectLetterRender(item: Node, index: number): void {
        item.getComponent(SelectLetterItem).setData(this._selectLetterList[index]);
        this._selectLetterItems[index] = item;
        CCUtil.onTouch(item, () => this.onItemClick(item, index), this);
    }

    private onItemClick(item: Node, index: number): void {
        if (index !== this._currentLetterIdx) {
            item.getComponent(Shake).shakeNode();
            return;
        }

        this._selectLetterItems.forEach(node => {
            const shake = node.getComponent(Shake);
            if (shake?.isShaking) shake.stopShake();
        });

        item.removeFromParent();
        this._letterItems[index].getComponent(LetterItem).showLetter();

        this._currentLetterIdx++;
        while (this._currentWord.word[this._currentLetterIdx] === " ") {
            this._currentLetterIdx++;
        }

        if (this._currentLetterIdx >= this._currentWord.word.length) {
            this.handleWordComplete();
        }
    }

    private handleWordComplete(): void {
        const word = this._currentWord.word;
        this.onGameSubmit(word, true);
        this._wordIndex++;
        this._rightNum++;
        this._comboNum++;
        this.showRightSpAni();

        this.attackMonster().then(() => {
            if (this._wordIndex >= this._wordsData.length) {
                this.monsterEscape();
            } else {
                this.showCurrentWord();
            }
        });
    }

    protected modeOver(): void {
        super.modeOver();
        console.log('练习模式完成');
        this.showTransitionView(async () => {
            const wordData = [...this._wordsData];
            const levelData = { ...this._levelData };
            console.log("过渡界面回调_________________________");
            const node = await ViewsMgr.showLearnView(PrefabType.WordSpellView);
            node.getComponent(WordSpellView).initData(wordData, levelData);
            this.node.parent.destroy();
        });
    }

    private playWordSound(): void {
        const word = this._currentWord.word;
        const wordSoundUrl = `/sounds/glossary/words/en/${word}.wav`;
        RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    private clearItems(): void {
        this._selectLetterItems.forEach(item => {
            CCUtil.offTouch(item, () => this.onItemClick(item, this._selectLetterItems.indexOf(item)), this);
        });
        this._selectLetterList = [];
        this._letterList = [];
        this._selectLetterItems = [];
        this._letterItems = [];
    }

    protected initEvent(): void {
        super.initEvent();
        CCUtil.onTouch(this.wordSound, () => this.playWordSound(), this);
    }

    protected removeEvent(): void {
        super.removeEvent();
        CCUtil.offTouch(this.wordSound, () => this.playWordSound(), this);
        this.clearItems();
    }
}
