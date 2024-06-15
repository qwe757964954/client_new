import { _decorator, Label, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { NetConfig } from '../../../config/NetConfig';
import { PrefabType } from '../../../config/PrefabType';
import GlobalConfig from '../../../GlobalConfig';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { ViewsManager } from '../../../manager/ViewsManager';
import { GameMode, SentenceData, WordsDetailData } from '../../../models/AdventureModel';
import { UnitWordModel } from '../../../models/TextbookModel';
import CCUtil from '../../../util/CCUtil';
import { ToolUtil } from '../../../util/ToolUtil';
import { WordDetailView } from '../../common/WordDetailView';
import { TransitionView } from '../common/TransitionView';
import { BaseModeView } from './BaseModeView';
import { WordPracticeView } from './WordPracticeView';
const { ccclass, property } = _decorator;

/**词意模式页面*/
@ccclass('WordMeaningView')
export class WordMeaningView extends BaseModeView {

    @property({ type: Label, tooltip: "单词Label" })
    wordLabel: Label = null;
    @property({ type: Label, tooltip: "音标Label" })
    symbolLabel: Label = null;
    @property({ type: Node, tooltip: "更多按钮" })
    public btn_more: Node = null;
    @property({ type: Node, tooltip: "单词详情面板" })
    wordDetailNode: Node = null;
    @property({ type: Node, tooltip: "隐藏详情面板按钮" })
    btn_hideDetail: Node = null;
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


    private _words: string[] = []; //单词数据列表
    private _wordsCn: string[] = []; //中文数据列表
    private _optionList: any[] = []; //选项列表
    private _wrongWordList: any[] = []; //错误单词列表

    private _wrongMode: boolean = false; //错误重答模式
    private _rightWordData: UnitWordModel = null; //正确单词数据
    private _sentenceData: SentenceData = null; //例句数据

    private _selectLock: boolean = false; //选择锁

    async initData(wordsdata: UnitWordModel[], levelData: any) {
        this.gameMode = GameMode.WordMeaning;
        wordsdata = this.updateTextbookWords(wordsdata, levelData);
        this.initWords(wordsdata);
        this.initMonster(); //初始化怪物
    }

    //获取关卡单词回包
    initWords(data: UnitWordModel[]) {
        console.log('initWords', data);
        this._wordsData = data;
        for (let i = 0; i < data.length; i++) {
            this._words.push(data[i].word);
            this._wordsCn.push(data[i].cn);
        }
        this.showCurrentWord();
    }

    //显示当前单词
    showCurrentWord() {
        super.updateConstTime();
        this._selectLock = false;
        this._rightWordData = this._wrongMode ? this._wrongWordList.shift() : this._wordsData[this._wordIndex];
        console.log('word', this._rightWordData);
        let word = this._rightWordData.word;
        this.wordLabel.string = word;
        this.symbolLabel.string = this._rightWordData.symbol;
        this.initWordDetail(this._rightWordData);
        this.randomOption(this._rightWordData);
        this.playWordSound();
    }

    randomOption(rightWordData: any) {
        this._optionList = [];
        this._optionList.push({ cn: rightWordData.cn, en: rightWordData.word });
        let leng = this._wordsCn.length < 3 ? this._wordsCn.length : 3;
        while (this._optionList.length < leng) {
            let randomIndex = Math.round(Math.random() * (this._wordsCn.length - 1));
            let ishave = false;
            for (let i = 0; i < this._optionList.length; i++) {
                if (this._optionList[i].cn == this._wordsCn[randomIndex]) {
                    ishave = true;
                    break;
                }
            }
            if (this._wordsCn[randomIndex] != rightWordData.Cn && !ishave) {
                this._optionList.push({ cn: this._wordsCn[randomIndex], en: this._words[randomIndex] })
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


    playWordSound() {
        let word = this._rightWordData.word;
        let wordSoundUrl = "";
        wordSoundUrl = "/sounds/glossary/words/en/" + word + ".wav";
        return RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    playSentenceSound() {
        if (!this._sentenceData) return;
        // let url = NetConfig.assertUrl + "/sounds/glossary/sentence_tts/Emily/" + this._sentenceData.id + ".wav";
        let soundName = ToolUtil.md5(this._sentenceData.sentence);
        let type = GlobalConfig.USE_US ? "us" : "en";
        let url = NetConfig.assertUrl + "/sounds/sentence/" + type + "/" + soundName + ".wav"
        RemoteSoundMgr.playSound(url);
    }

    showWordDetail() {
        if (!this._detailData) {
            ViewsManager.showTip("未获取到单词详情数据");
            return;
        }
        let pos = this.mainNode.position;
        if (pos.y == -100) return;
        this.wordDetailNode.active = true;
        this.btn_hideDetail.active = true;
        this.btn_more.active = false;

        this.wordDetailNode.getComponent(WordDetailView).init(this._wordsData[this._wordIndex].word, this._detailData);
        this.mainNode.setPosition(pos.x, -360, 0);
        tween(this.mainNode).to(0.2, { position: new Vec3(pos.x, -100, 0) }).start();
    }

    hideWordDetail() {
        this.wordDetailNode.active = false;
        this.btn_hideDetail.active = false;
        this.btn_more.active = true;
        let pos = this.mainNode.position;
        tween(this.mainNode).to(0.2, { position: new Vec3(pos.x, -360, 0) }).start();
    }

    onAnswerClick(index: number) {
        if (this._selectLock) return;
        this._selectLock = true;
        let isRight = false;
        if (this._rightWordData.word == this._optionList[index].en) {
            isRight = true;
        }
        let answerNode = this.answerList[index];
        answerNode.getChildByName("wordLabel").getComponent(Label).string = this._optionList[index].cn + " = " + this._optionList[index].en;
        let resSymbol = answerNode.getChildByName("resSymbol");
        resSymbol.active = true;

        let word = this._rightWordData.word;
        this.onGameSubmit(word, isRight);


        if (isRight) {
            answerNode.getComponent(Sprite).spriteFrame = this.rightBg;
            resSymbol.getComponent(Sprite).spriteFrame = this.rightSymbol;
            this._rightNum++;
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
                        this.monsterEscape();
                    }
                } else {
                    this.showCurrentWord();
                }
            });

        } else {
            answerNode.getComponent(Sprite).spriteFrame = this.errorBg;
            resSymbol.getComponent(Sprite).spriteFrame = this.errorSymbol;
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

    protected modeOver(): void {
        console.log('词意模式完成');
        ViewsManager.instance.showView(PrefabType.TransitionView, (node: Node) => {
            let wordData = JSON.parse(JSON.stringify(this._wordsData));
            let levelData = JSON.parse(JSON.stringify(this._levelData));
            //跳转到下一场景
            node.getComponent(TransitionView).setTransitionCallback(() => {
                console.log("过渡界面回调_________________________");
                ViewsManager.instance.showView(PrefabType.WordPracticeView, (node: Node) => {
                    node.getComponent(WordPracticeView).initData(wordData, levelData);
                    ViewsManager.instance.closeView(PrefabType.WordMeaningView);
                });
            });
        });
    }

    onClassificationWord(data: WordsDetailData) {
        super.onClassificationWord(data);
        let sentences = this._detailData.sentence_list;
        if (sentences && sentences.length > 0) {
            this._sentenceData = sentences[0];
            this.sentenceLabel.string = this._sentenceData.sentence;
        }
    }

    protected initEvent(): void {
        super.initEvent();
        CCUtil.onTouch(this.btn_more, this.showWordDetail, this);
        CCUtil.onTouch(this.btn_hideDetail, this.hideWordDetail, this);
        CCUtil.onTouch(this.wordSound, this.playWordSound, this);
        CCUtil.onTouch(this.sentenceSound, this.playSentenceSound, this);
        for (let i = 0; i < this.answerList.length; i++) {
            CCUtil.onTouch(this.answerList[i], this.onAnswerClick.bind(this, i), this);
        }
    }
    protected removeEvent(): void {
        super.removeEvent();
        CCUtil.offTouch(this.btn_more, this.showWordDetail, this);
        CCUtil.offTouch(this.btn_hideDetail, this.hideWordDetail, this);
        CCUtil.offTouch(this.wordSound, this.playWordSound, this);
        CCUtil.offTouch(this.sentenceSound, this.playSentenceSound, this);
        for (let i = 0; i < this.answerList.length; i++) {
            CCUtil.offTouch(this.answerList[i], this.onAnswerClick.bind(this, i), this);
        }
    }
}

