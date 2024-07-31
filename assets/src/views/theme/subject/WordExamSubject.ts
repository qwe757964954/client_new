import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, Vec3 } from 'cc';
import { BaseView } from '../../../script/BaseView';
import List from '../../../util/list/List';
import { UnitWord } from '../../../models/AdventureModel';
import { ExamItem } from '../../adventure/sixModes/items/ExamItem';
import { EventMgr } from '../../../util/EventManager';
import { EventType } from '../../../config/EventType';
import { WordBaseData } from '../../../models/SubjectModel';
const { ccclass, property } = _decorator;

@ccclass('WordExamSubject')
export class WordExamSubject extends BaseView {
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

    private _wordLetters: string[];
    private _fillLetters: string[];
    private _currentLetterIdx: number = 0;
    private _examItemList: Node[] = [];
    private _rightWordData: WordBaseData;

    setData(word: WordBaseData) {
        this._rightWordData = word;
        this.cnLabel.string = word.cn;
    }

    start(): void {
        this.initSubject();
    }

    initSubject() {
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
            let isRight = true;
            if (this._fillLetters.join("") == this._rightWordData.word) { //正确
                console.log("选择正确");
                this.resultIcon.spriteFrame = this.rightIcon;
            } else { //错误
                console.log("选择错误");
                this.resultIcon.spriteFrame = this.wrongIcon;
                isRight = false;
            }
            this.resultIcon.node.active = true;
            EventMgr.dispatch(EventType.GradeSkip_Subject_Result, isRight);
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

    onFillItemRender(item: Node, index: number) {
        item.getChildByName("letterLabel").getComponent(Label).string = this._fillLetters[index];
    }

    initExamItem() {
        this.clearSplitItems();
        let maxX = 0;
        for (let i = 0; i < this._wordLetters.length; i++) {
            let examItem = instantiate(this.examItem);
            examItem.getComponent(ExamItem).setData(this._wordLetters[i]);
            let posX = 95 * (i % 12);
            examItem.position = new Vec3(posX, -115 * Math.floor(i / 12));
            examItem.parent = this.itemNode;
            examItem.on(Node.EventType.TOUCH_END, this.onExamItemClick, this);
            this._examItemList.push(examItem);
            if (maxX < posX) {
                maxX = posX;
            }
        }
        this.itemNode.position = new Vec3(-maxX / 2 - 36, this.itemNode.position.y);
    }

    clearSplitItems() {
        for (let i = 0; i < this._examItemList.length; i++) {
            if (!this._examItemList[i]) continue;
            this._examItemList[i].off(Node.EventType.TOUCH_END, this.onExamItemClick, this);
            this._examItemList[i].destroy();
        }
        this._examItemList = [];
    }

    //回退键处理
    onBackKeyClick() {
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

    protected removeEvent(): void {
        this.clearSplitItems();
    }
}


