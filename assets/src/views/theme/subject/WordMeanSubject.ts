import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { BaseView } from '../../../script/BaseView';
import { BossTopicData, SentenceData, UnitWord, WordsDetailData } from '../../../models/AdventureModel';
import { ServiceMgr } from '../../../net/ServiceManager';
import { InterfacePath } from '../../../net/InterfacePath';
import CCUtil from '../../../util/CCUtil';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { NetConfig } from '../../../config/NetConfig';
import { ToolUtil } from '../../../util/ToolUtil';
import GlobalConfig from '../../../GlobalConfig';
import { Shake } from '../../../util/Shake';
import { EventMgr } from '../../../util/EventManager';
import { EventType } from '../../../config/EventType';
import { WordBaseData } from '../../../models/SubjectModel';
const { ccclass, property } = _decorator;

@ccclass('WordMeanSubject')
export class WordMeanSubject extends BaseView {
    @property({ type: Label, tooltip: "单词Label" })
    wordLabel: Label = null;
    @property({ type: Label, tooltip: "音标Label" })
    symbolLabel: Label = null;
    @property({ type: [Node], tooltip: "答案列表" })
    answerList: Node[] = [];
    @property({ type: SpriteFrame, tooltip: "正确背景" })
    rightBg: SpriteFrame = null;
    @property({ type: SpriteFrame, tooltip: "错误背景" })
    errorBg: SpriteFrame = null;
    @property({ type: SpriteFrame, tooltip: "正常背景" })
    normalBg: SpriteFrame = null;
    @property({ type: SpriteFrame, tooltip: "正确符号" })
    rightSymbol: SpriteFrame = null;
    @property({ type: SpriteFrame, tooltip: "错误符号" })
    errorSymbol: SpriteFrame = null;
    @property({ type: Node, tooltip: "单词读音" })
    wordSound: Node = null;
    @property({ type: Node, tooltip: "例句读音" })
    sentenceSound: Node = null;
    @property({ type: Label, tooltip: "例句" })
    sentenceLabel: Label = null;

    private _detailData: WordsDetailData = null;
    private _rightWordData: WordBaseData = null;
    private _sentenceData: SentenceData = null;
    private _optWords: WordBaseData[] = [];
    private _optionList: WordBaseData[] = [];
    private _selectLock: boolean = false;

    setData(answer: WordBaseData, opts: WordBaseData[]) {
        this._rightWordData = answer;
        this._optWords = opts;
        this.wordLabel.string = answer.word;
        this.symbolLabel.string = answer.symbol;
        ServiceMgr.studyService.getAdventureWord(answer.w_id);
        this.randomOption();
    }

    setBossData(data: BossTopicData, opts: BossTopicData[]) {

    }

    onWordDetail(data: WordsDetailData) {
        if (data.code != 200) {
            console.error("获取单词详情失败", data.msg);
            return;
        }
        this._detailData = data;
        let sentences = this._detailData.sentence_list;
        if (sentences && sentences.length > 0) {
            this._sentenceData = sentences[0];
            this.sentenceLabel.string = sentences[0].sentence;
        }
    }

    onInitModuleEvent() {
        this.addModelListener(InterfacePath.Adventure_Word, this.onWordDetail);
    }

    randomOption() {
        this._optionList = [];
        this._optionList.push(this._rightWordData);
        let leng = this._optWords.length < 3 ? this._optWords.length : 3;
        while (this._optionList.length < leng) {
            let randomIndex = Math.round(Math.random() * (this._optWords.length - 1));
            let ishave = false;
            for (let i = 0; i < this._optionList.length; i++) {
                if (this._optionList[i].cn == this._optWords[randomIndex].cn) {
                    ishave = true;
                    break;
                }
            }
            if (this._optWords[randomIndex].cn != this._rightWordData.cn && !ishave) {
                this._optionList.push(this._optWords[randomIndex])
            }
        }
        this._optionList.sort((a, b) => {
            return Math.random() > 0.5 ? 1 : -1;
        })

        for (let i = 0; i < 3; i++) {
            if (i < this._optionList.length) {
                this.answerList[i].active = true;
                this.answerList[i].getChildByName("wordLabel").getComponent(Label).string = this._optionList[i].cn;
                this.answerList[i].getComponent(Sprite).spriteFrame = this.normalBg;
                this.answerList[i].getChildByName("resSymbol").active = false;
            } else {
                this.answerList[i].active = false;
            }
        }
    }

    onAnswerClick(index: number) {
        if (this._selectLock) return;
        this._selectLock = true;
        let isRight = false;
        if (this._rightWordData.word == this._optionList[index].word) {
            isRight = true;
        }
        let answerNode = this.answerList[index];
        answerNode.getChildByName("wordLabel").getComponent(Label).string = this._optionList[index].cn + " = " + this._optionList[index].word;
        let resSymbol = answerNode.getChildByName("resSymbol");
        resSymbol.active = true;

        if (isRight) {
            answerNode.getComponent(Sprite).spriteFrame = this.rightBg;
            resSymbol.getComponent(Sprite).spriteFrame = this.rightSymbol;
        } else {
            answerNode.getComponent(Sprite).spriteFrame = this.errorBg;
            answerNode.getComponent(Shake).shakeNode(0.5, 6);
            resSymbol.getComponent(Sprite).spriteFrame = this.errorSymbol;
        }
        EventMgr.dispatch(EventType.GradeSkip_Subject_Result, isRight);
    }

    playWordSound() {
        let word = this._rightWordData.word;
        let wordSoundUrl = "";
        wordSoundUrl = "/sounds/glossary/words/en/" + word + ".wav";
        return RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    playSentenceSound() {
        if (!this._sentenceData) return;
        let soundName = ToolUtil.md5(this._sentenceData.sentence);
        let type = GlobalConfig.USE_US ? "us" : "en";
        let url = NetConfig.assertUrl + "/sounds/sentence/" + type + "/" + soundName + ".wav";
        RemoteSoundMgr.playSound(url);
    }

    protected initEvent(): void {
        CCUtil.onTouch(this.wordSound, this.playWordSound, this);
        CCUtil.onTouch(this.sentenceSound, this.playSentenceSound, this);
        for (let i = 0; i < this.answerList.length; i++) {
            CCUtil.onTouch(this.answerList[i], this.onAnswerClick.bind(this, i), this);
        }
    }

    protected removeEvent(): void {
        CCUtil.offTouch(this.wordSound, this.playWordSound, this);
        CCUtil.offTouch(this.sentenceSound, this.playSentenceSound, this);
        for (let i = 0; i < this.answerList.length; i++) {
            CCUtil.offTouch(this.answerList[i], this.onAnswerClick.bind(this, i), this);
        }
    }
}


