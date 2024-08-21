import { _decorator, Label, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { EventType } from '../../../config/EventType';
import { NetConfig } from '../../../config/NetConfig';
import { PrefabType } from '../../../config/PrefabType';
import { TextConfig } from '../../../config/TextConfig';
import { WordSourceType } from '../../../config/WordConfig';
import GlobalConfig from '../../../GlobalConfig';
import { ItemData } from '../../../manager/DataMgr';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { SoundMgr } from '../../../manager/SoundMgr';
import { ViewsManager, ViewsMgr } from '../../../manager/ViewsManager';
import { GameMode, SentenceData, WordsDetailData } from '../../../models/AdventureModel';
import { s2cReviewPlanLongTimeWordSubmit, s2cReviewPlanOption, s2cReviewPlanOptionWord, s2cReviewPlanSubmit } from '../../../models/NetModel';
import { UnitWordModel } from '../../../models/TextbookModel';
import { InterfacePath } from '../../../net/InterfacePath';
import { ServiceMgr } from '../../../net/ServiceManager';
import CCUtil from '../../../util/CCUtil';
import { EventMgr } from '../../../util/EventManager';
import { Shake } from '../../../util/Shake';
import { ToolUtil } from '../../../util/ToolUtil';
import { WordDetailView } from '../../common/WordDetailView';
import { ReviewEndView } from '../../reviewPlan/ReviewEndView';
import { BaseModeView, GameSourceType } from './BaseModeView';
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
    @property(Node)
    symbolNode: Node = null;
    @property(Node)
    sentenceNode: Node = null;


    private _words: string[] = []; //单词数据列表
    private _wordsCn: string[] = []; //中文数据列表
    private _optionList: any[] = []; //选项列表
    private _wrongWordList: any[] = []; //错误单词列表

    private _wrongMode: boolean = false; //错误重答模式
    private _sentenceData: SentenceData = null; //例句数据

    private _selectLock: boolean = false; //选择锁
    private _isUIShowOver: boolean = false; //UI显示结束
    private _isNetOver: boolean = false; //网络请求结束
    private _netHandler: Function = null;

    private _rewardList: ItemData[] = [];

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
        if (GameSourceType.review == this._sourceType || GameSourceType.reviewSpecial === this._sourceType ||
            GameSourceType.errorWordbook == this._sourceType || GameSourceType.collectWordbook == this._sourceType) {
            this.sentenceLabel.node.parent.active = false;
        }
        this._selectLock = false;
        this._rightWordData = this._wrongMode ? this._wrongWordList.shift() : this._wordsData[this._wordIndex];
        let word = this._rightWordData.word;
        this.wordLabel.string = word;
        this.symbolLabel.string = this._rightWordData.symbol;
        this.initWordDetail(this._rightWordData);
        if (GameSourceType.reviewSpecial === this._sourceType || GameSourceType.review === this._sourceType ||
            GameSourceType.errorWordbook == this._sourceType || GameSourceType.collectWordbook == this._sourceType) {
            for (let i = 0; i < 3; i++) {
                this.answerList[i].active = false;
            }
            if (WordSourceType.word_game == this._rightWordData.source) {
                ServiceMgr.studyService.reqReviewPlanOption(this._rightWordData.w_id, this._rightWordData.big_id, this._rightWordData.subject_id);
            } else if (WordSourceType.classification == this._rightWordData.source) {
                ServiceMgr.studyService.reqReviewPlanOptionEx(this._rightWordData.w_id, this._rightWordData.book_id, this._rightWordData.unit_id);
            } else if (WordSourceType.total == this._rightWordData.source) {
                ServiceMgr.studyService.reqReviewPlanOptionEx2(this._rightWordData.word);
            }
        } else {
            this.randomOption(this._rightWordData);
        }
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
    randomOptionEx(rightWordData: UnitWordModel, words: s2cReviewPlanOptionWord[]) {
        this._optionList = [];
        this._optionList.push({ cn: rightWordData.cn, en: rightWordData.word });
        let needCount = Math.min(2, words.length);
        if (needCount > 0) {
            let tmpList = words.concat();
            for (let i = 0; i < needCount; i++) {
                let idx = ToolUtil.getRandomInt(0, tmpList.length - 1);
                let value = tmpList[idx];
                this._optionList.push({ cn: value.cn, en: value.word });
                tmpList.splice(idx, 1);
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
    /**显示下一题目 */
    showNextWord() {
        if (!this._isUIShowOver || !this._isNetOver) return;
        this._isUIShowOver = false;
        this._isNetOver = false;
        this.showCurrentWord();
    }
    /**ui显示结束 */
    uiShowOver() {
        console.log("uiShowOver");
        this._isUIShowOver = true;
        this.showNextWord();
    }


    /**网络请求结束 */
    netReqOver() {
        console.log("netReqOver");
        if (GameSourceType.reviewSpecial == this._sourceType || GameSourceType.review == this._sourceType) {
            let data = this._currentSubmitResponse as s2cReviewPlanLongTimeWordSubmit;
            if (data && data.reward_list) {
                this._rewardList.push(...data.reward_list);
            }
        }
        this._isNetOver = true;
        this.unschedule(this._netHandler);
        this._netHandler = null;
        this.showNextWord();
        /**以下方法也可以放到基类中去调用 */
        if (this._isModeOver && !this._isDoModeOver) {
            this.modeOver();
        }
    }
    /**网络超时回调 */
    netTimeOut() {
        if (this._netHandler) {
            return;
        }
        this._netHandler = () => {
            if (!this._isNetOver && this._curWordSubmitData) {
                this.onGameSubmit(this._curWordSubmitData.word, this._curWordSubmitData.isRight, this._curWordSubmitData.wordData, this._curWordSubmitData.answer);
            }
        }
        this.schedule(this._netHandler, 3);
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
        this.onGameSubmit(word, isRight, this._rightWordData, this._optionList[index].cn);
        this.netTimeOut();

        if (isRight) {
            this._comboNum++;
            this.showRightSpAni();
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
                        this.uiShowOver();
                    } else {
                        this.monsterEscape();
                    }
                } else {
                    this.uiShowOver();
                }
            });

        } else {
            SoundMgr.wrong();
            answerNode.getComponent(Sprite).spriteFrame = this.errorBg;
            answerNode.getComponent(Shake).shakeNode(0.5, 6);
            resSymbol.getComponent(Sprite).spriteFrame = this.errorSymbol;
            this._comboNum = 0;
            // if (this._wrongWordList.indexOf(this._rightWordData) == -1 && !this._wrongMode && !this._errorWords[this._rightWordData.word]) {
            this._errorNum++;
            this._levelData.error_num = this._errorNum;
            this.errorNumLabel.string = "错误次数：" + this._errorNum;

            // }
            if (GameSourceType.reviewSpecial != this._sourceType) {//复习规划 长时间未复习题目没有错题模式
                this._wrongWordList.push(this._rightWordData);
                if (!this._wrongMode) {
                    this._wordIndex++;
                    if (this._wordIndex >= this._wordsData.length) {
                        this._wrongMode = true;
                    }
                }
            } else {
                this._wordIndex++;
            }
            this.scheduleOnce(() => {
                this.uiShowOver();
            }, 1);
        }

    }

    protected modeOver(): void {
        super.modeOver();
        console.log('词意模式完成');
        if (GameSourceType.review == this._sourceType) {
            let data = this._currentSubmitResponse as s2cReviewPlanSubmit;
            if (0 == data.pass_flag) {
                return;
            }
            ViewsMgr.showView(PrefabType.ReviewEndView, (node: Node) => {
                let rewardList = data.reward_list;
                node.getComponent(ReviewEndView).init(this._levelData.souceType, rewardList);
                this.node.destroy();
            });
            return;
        }
        if (GameSourceType.errorWordbook == this._sourceType || GameSourceType.collectWordbook == this._sourceType) {
            EventMgr.emit(EventType.Wordbook_List_Refresh);// 通知
            ViewsMgr.showAlert(TextConfig.All_level_Tip, () => {
                this.node.destroy();
            });
            return;
        }
        if (GameSourceType.reviewSpecial === this._sourceType) {
            ViewsMgr.showRewards(this._rewardList, () => {
                ServiceMgr.studyService.reqReviewPlan();//刷新复习规划
                this.node.destroy();
            });
            return;
        }
        this.showTransitionView(async () => {
            let wordData = JSON.parse(JSON.stringify(this._wordsData));
            let levelData = JSON.parse(JSON.stringify(this._levelData));
            console.log("过渡界面回调_________________________");
            let node = await ViewsMgr.showLearnView(PrefabType.WordPracticeView);
            node.getComponent(WordPracticeView).initData(wordData, levelData);
            this.node.parent.destroy();
        })
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

        this.addModelListener(InterfacePath.c2sReviewPlanOption, this.onRepReviewPlanOption.bind(this));
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

        this.removeModelListener(InterfacePath.c2sReviewPlanOption);
    }
    /**复习规划 题目选项 */
    onRepReviewPlanOption(data: s2cReviewPlanOption) {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        this.randomOptionEx(this._rightWordData, data.word_cn_list);
    }
}

