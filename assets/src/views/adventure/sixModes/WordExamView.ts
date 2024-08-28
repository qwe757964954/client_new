import { _decorator, instantiate, Label, Node, NodePool, Prefab, Sprite, SpriteFrame, Vec3 } from 'cc';
import { EventType } from '../../../config/EventType';
import { PrefabType } from '../../../config/PrefabType';
import { TextConfig } from '../../../config/TextConfig';
import { SoundMgr } from '../../../manager/SoundMgr';
import { ViewsMgr } from '../../../manager/ViewsManager';
import { GameMode } from '../../../models/AdventureModel';
import { UnitWordModel } from '../../../models/TextbookModel';
import CCUtil from '../../../util/CCUtil';
import { EventMgr } from '../../../util/EventManager';
import List from '../../../util/list/List';
import { BaseModeView, GameSourceType } from './BaseModeView';
import { ExamReportView } from './ExamReportView';
import { ExamItem } from './items/ExamItem';
const { ccclass, property } = _decorator;

@ccclass('WordExamView')
export class WordExamView extends BaseModeView {
    @property({ type: List, tooltip: "填空item" })
    fillList: List = null;
    @property({ type: Prefab, tooltip: "ExamItem" })
    examItem: Prefab = null;
    @property({ type: Node, tooltip: "Item容器" })
    itemNode: Node = null;
    @property(Label)
    cnLabel: Label = null;
    @property({ type: Sprite, tooltip: "结果icon" })
    resultIcon: Sprite = null;
    @property({ type: SpriteFrame, tooltip: "正确icon" })
    rightIcon: SpriteFrame = null;
    @property({ type: SpriteFrame, tooltip: "错误icon" })
    wrongIcon: SpriteFrame = null;

    private _selectLock: boolean = false;
    private _wrongMode: boolean = false; //错误重答模式
    private _wrongWordList: any[] = []; //错误单词列表

    private _wordLetters: string[];
    private _fillLetters: string[];
    private _currentLetterIdx: number = 0;
    private _examItemList: Node[] = [];

    private _nodePool: NodePool = new NodePool("ExamItem");

    async initData(wordsdata: UnitWordModel[], levelData: any) {
        this.gameMode = GameMode.Exam;
        wordsdata = this.updateTextbookWords(wordsdata, levelData);
        this.initWords(wordsdata);
        this.initMonster(); //初始化怪物
    }

    //获取关卡单词回包
    initWords(data: UnitWordModel[]) {
        this._wordsData = data;
        this.showCurrentWord();
    }
    showCurrentWord() {
        super.updateConstTime();
        this.resultIcon.node.active = false;
        this._selectLock = false;
        this._currentLetterIdx = 0;
        this._rightWordData = this._wrongMode ? this._wrongWordList.shift() : this._wordsData[this._wordIndex];
        this.cnLabel.string = this._rightWordData.cn;
        console.log('word', this._rightWordData);
        let word = this._rightWordData.word;
        let trimWord = word.replace(/\s/g, '');
        this._wordLetters = trimWord.split('');
        this._wordLetters.sort((a, b) => {
            return Math.random() - 0.5;
        })
        console.log("trimword", trimWord);
        this._fillLetters = [];
        for (let i = 0; i < word.length; i++) {
            if (word[i] == " ") {
                this._fillLetters.push(" ");
            } else {
                this._fillLetters.push("_");
            }
        }
        this.fillList.numItems = this._fillLetters.length;

        this.initExamItem();
        this.topNode.updateLabelProcess(this._wordIndex,this._wordsData.length,this._errorNum);
    }

    onExamItemClick(e: Event) {
        if (this._selectLock) return;
        let item: any = e.currentTarget;
        let selectLetter = item.getComponent(ExamItem).letter;
        console.log("selectLetter", selectLetter);
        this._fillLetters[this._currentLetterIdx] = selectLetter;
        this._currentLetterIdx++;
        if (this._currentLetterIdx == this._fillLetters.length) { //判断是否正确
            this._selectLock = true;
            if (this._fillLetters.join("") == this._rightWordData.word) { //正确
                console.log("选择正确");
                this.resultIcon.spriteFrame = this.rightIcon;
                this.onGameSubmit(this._rightWordData.word, true, this._rightWordData, this._fillLetters.join(""));
                this._rightNum++;
                this._comboNum++;
                this.showRightSpAni();
                if (this._wrongMode) {
                    if (this._wrongWordList.length == 0) {
                        this._wrongMode = false;
                        this._wordIndex++;
                    }
                } else {
                    this._wordIndex++;
                }

                this.attackMonster().then(() => {
                    if (this._wordIndex >= this._wordsData.length) {
                        if (this._wrongWordList.length > 0) {
                            this._wrongMode = true;
                            this.showCurrentWord();
                        } else {
                            this.modeOver();
                        }
                    } else {
                        this.showCurrentWord();
                    }
                });
            } else { //错误
                console.log("选择错误");
                this.resultIcon.spriteFrame = this.wrongIcon;
                this.onGameSubmit(this._rightWordData.word, false, this._rightWordData, this._fillLetters.join(""));
                this._comboNum = 0;
                SoundMgr.wrong();
                // if (this._wrongWordList.indexOf(this._rightWordData) == -1 && !this._wrongMode && !this._errorWords[this._rightWordData.word]) {
                this._errorNum++;
                this._levelData.error_num = this._errorNum;
                this.topNode.updateErrorNumber(this._errorNum);

                // }
                this._wrongWordList.push(this._rightWordData);
                if (!this._wrongMode) {
                    this._wordIndex++;
                    if (this._wordIndex >= this._wordsData.length) {
                        this._wrongMode = true;
                    }
                }
                this.monsterAttack().then(() => {
                    this.showCurrentWord();
                    this.checkResult();
                    // if (WordSourceType.word_game == this._sourceType) {

                    // }
                });
            }
            this.resultIcon.node.active = true;
        } else {
            while (this._fillLetters[this._currentLetterIdx] == " ") {
                this._currentLetterIdx++;
            }
        }
        this.fillList.numItems = this._fillLetters.length;
        let letterIdx = this._wordLetters.indexOf(selectLetter);
        if (letterIdx != -1) {
            this._wordLetters.splice(letterIdx, 1);
        }
        this.initExamItem();
    }

    checkResult() {
        if (!this._currentSubmitResponse) return;
        //失败
        if (this._currentSubmitResponse.pass_flag >= 1) {
            this.modeOver();
        }
    }

    protected modeOver(): void {
        super.modeOver();
        console.log('评测完成，显示结算');
        if (GameSourceType.errorWordbook == this._sourceType || GameSourceType.collectWordbook == this._sourceType) {
            EventMgr.emit(EventType.Wordbook_List_Refresh);
            ViewsMgr.showAlert(TextConfig.All_level_Tip, () => {
                this.node.destroy();
            });
            return;
        }
        if (this._currentSubmitResponse.pass_flag == 1 || this._currentSubmitResponse.pass_flag == 2) { //成功或失败
            ViewsMgr.showView(PrefabType.ExamReportView, (node: Node) => {
                let nodeScript = node.getComponent(ExamReportView);
                nodeScript.initData(this._currentSubmitResponse, this._sourceType);
                this.node.parent.destroy();
            });
        }
    }

    //回退键处理
    onBackKeyClick() {
        SoundMgr.click();
        if (this._selectLock) return;
        let lastLetterIdx = -1;
        for (let i = this._fillLetters.length - 1; i >= 0; i--) {
            if (this._fillLetters[i] != "_" && this._fillLetters[i] != " ") {
                lastLetterIdx = i;
                break;
            }
        }
        if (lastLetterIdx == -1) return;
        let lastLetter = this._fillLetters[lastLetterIdx];
        this._fillLetters[lastLetterIdx] = "_";
        this._wordLetters.push(lastLetter);
        this._currentLetterIdx = lastLetterIdx;
        this.fillList.numItems = this._fillLetters.length;
        this.initExamItem();
    }

    initExamItem() {
        this.clearSplitItems();
        let maxX = 0;
        for (let i = 0; i < this._wordLetters.length; i++) {
            let examItem = this.getEaxmItem();
            examItem.getComponent(ExamItem).setData(this._wordLetters[i]);
            let posX = 95 * (i % 12);
            examItem.position = new Vec3(posX, -115 * Math.floor(i / 12));
            examItem.parent = this.itemNode;
            // examItem.on(Node.EventType.TOUCH_END, this.onExamItemClick, this);
            CCUtil.onTouch(examItem, this.onExamItemClick, this);
            this._examItemList.push(examItem);
            if (maxX < posX) {
                maxX = posX;
            }
        }
        this.itemNode.position = new Vec3(-maxX / 2 - 36, this.itemNode.position.y);
    }

    onFillItemRender(item: Node, index: number) {
        item.getChildByName("letterLabel").getComponent(Label).string = this._fillLetters[index];
    }

    getEaxmItem() {
        let item = this._nodePool.get();
        if (!item) {
            item = instantiate(this.examItem);
        }
        return item;
    }

    clearSplitItems(destory: boolean = false) {
        for (let i = 0; i < this._examItemList.length; i++) {
            this._examItemList[i].parent = null;
            if (!destory)
                this._nodePool.put(this._examItemList[i]);
            // this._examItemList[i].off(Node.EventType.TOUCH_END, this.onExamItemClick, this);
            CCUtil.offTouch(this._examItemList[i], this.onExamItemClick, this);
        }
        this._examItemList = [];
    }

    onDestroy(): void {
        super.onDestroy();
        this.clearSplitItems(true);
        this._nodePool.clear();
    }
}


