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
        this._words = data.map(wordData => wordData.word);
        this._wordsCn = data.map(wordData => wordData.cn);
        this.showCurrentWord();
    }

    //显示当前单词
    showCurrentWord() {
        super.updateConstTime();
        if (this.isReviewMode()) {
            this.sentenceLabel.node.parent.active = false;
        }

        this._selectLock = false;
        this._rightWordData = this._wrongMode ? this._wrongWordList.shift() : this._wordsData[this._wordIndex];
        const { word, symbol } = this._rightWordData;

        this.wordLabel.string = word;
        this.symbolLabel.string = symbol;
        this.initWordDetail(this._rightWordData);

        if (this.isReviewMode()) {
            this.handleReviewMode();
        } else {
            this.randomOption(this._rightWordData);
        }

        this.playWordSound();
    }

    isReviewMode() {
        return [GameSourceType.review, GameSourceType.reviewSpecial, GameSourceType.errorWordbook, GameSourceType.collectWordbook].includes(this._sourceType);
    }

    handleReviewMode() {
        this.answerList.forEach(answer => answer.active = false);

        const { word, big_id, subject_id, book_id, unit_id, source } = this._rightWordData;
        const requestOptions = {
            [WordSourceType.word_game]: () => ServiceMgr.studyService.reqReviewPlanOption(word, big_id, subject_id),
            [WordSourceType.classification]: () => ServiceMgr.studyService.reqReviewPlanOptionEx(word, book_id, unit_id),
            [WordSourceType.total]: () => ServiceMgr.studyService.reqReviewPlanOptionEx2(word),
        };

        (requestOptions[source] || (() => { }))();
    }

    randomOption(rightWordData: any) {
        this._optionList = this.createOptionList(rightWordData, 3);
        this.displayOptions();
    }
    createOptionList(rightWordData: any, maxOptions: number) {
        const options = [{ cn: rightWordData.cn, en: rightWordData.word }];
        const availableOptions = this._wordsCn.filter(cn => cn !== rightWordData.cn);

        while (options.length < maxOptions && availableOptions.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableOptions.length);
            const cn = availableOptions[randomIndex];
            availableOptions.splice(randomIndex, 1);
            options.push({ cn, en: this._words[this._wordsCn.indexOf(cn)] });
        }

        return options.sort(() => Math.random() - 0.5);
    }

    displayOptions() {
        this.answerList.forEach((answer, index) => {
            if (index < this._optionList.length) {
                const { cn } = this._optionList[index];
                answer.active = true;
                answer.getChildByName("wordLabel").getComponent(Label).string = cn;
                answer.getComponent(Sprite).spriteFrame = this.normalBg;
                answer.getChildByName("resSymbol").active = false;
            } else {
                answer.active = false;
            }
        });
    }

    randomOptionEx(rightWordData: UnitWordModel, words: s2cReviewPlanOptionWord[]) {
        this._optionList = [{ cn: rightWordData.cn, en: rightWordData.word }];
        let needCount = Math.min(2, words.length);
        if (needCount > 0) {
            const tmpList = [...words];
            for (let i = 0; i < needCount; i++) {
                const idx = ToolUtil.getRandomInt(0, tmpList.length - 1);
                const value = tmpList.splice(idx, 1)[0];
                this._optionList.push({ cn: value.cn, en: value.word });
            }
        }
        this._optionList.sort(() => Math.random() - 0.5);
        this.displayOptions();
    }
    playWordSound() {
        const url = `/sounds/glossary/words/en/${this._rightWordData.word}.wav`;
        RemoteSoundMgr.playSound(NetConfig.assertUrl + url);
    }

    playSentenceSound() {
        if (!this._sentenceData) return;

        const soundName = ToolUtil.md5(this._sentenceData.sentence);
        const type = GlobalConfig.USE_US ? "us" : "en";
        const url = `/sounds/sentence/${type}/${soundName}.wav`;

        RemoteSoundMgr.playSound(NetConfig.assertUrl + url);
    }


    showWordDetail() {
        if (!this._detailData) {
            ViewsManager.showTip("未获取到单词详情数据");
            return;
        }
        if (this.mainNode.position.y === -100) return;

        this.wordDetailNode.active = true;
        this.btn_hideDetail.active = true;
        this.btn_more.active = false;

        this.wordDetailNode.getComponent(WordDetailView).init(this._wordsData[this._wordIndex].word, this._detailData);
        tween(this.mainNode).to(0.2, { position: new Vec3(this.mainNode.position.x, -100, 0) }).start();
    }

    hideWordDetail() {
        this.wordDetailNode.active = false;
        this.btn_hideDetail.active = false;
        this.btn_more.active = true;

        tween(this.mainNode).to(0.2, { position: new Vec3(this.mainNode.position.x, -360, 0) }).start();
    }
    /**显示下一题目 */
    showNextWord() {
        if (this._isUIShowOver && this._isNetOver) {
            this._isUIShowOver = false;
            this._isNetOver = false;
            this.showCurrentWord();
        }
    }
    /** UI显示结束 */
    uiShowOver() {
        console.log("uiShowOver");
        this._isUIShowOver = true;
        this.showNextWord();
    }

    /** 网络请求结束 */
    netReqOver() {
        console.log("netReqOver");
        this.handleNetRequestResponse();
        this._isNetOver = true;
        this.unschedule(this._netHandler);
        this._netHandler = null;
        this.showNextWord();
        this.checkModeCompletion();
    }
    /** 处理网络请求响应 */
    private handleNetRequestResponse() {
        if (GameSourceType.reviewSpecial === this._sourceType || GameSourceType.review === this._sourceType) {
            const data = this._currentSubmitResponse as s2cReviewPlanLongTimeWordSubmit;
            if (data?.reward_list) {
                this._rewardList.push(...data.reward_list);
            }
        }
    }
    /** 检查模式是否完成 */
    private checkModeCompletion() {
        if (this._isModeOver && !this._isDoModeOver) {
            this.modeOver();
        }
    }

    /** 网络超时回调 */
    netTimeOut() {
        if (this._netHandler) return;

        this._netHandler = () => {
            if (!this._isNetOver && this._curWordSubmitData) {
                this.onGameSubmit(this._curWordSubmitData.word, this._curWordSubmitData.isRight, this._curWordSubmitData.wordData, this._curWordSubmitData.answer);
            }
        };
        this.schedule(this._netHandler, 3);
    }

    /** 处理答案点击事件 */
    onAnswerClick(index: number) {
        if (this._selectLock) return;
        this._selectLock = true;

        const isRight = this._rightWordData.word === this._optionList[index].en;
        const answerNode = this.answerList[index];
        const wordLabel = answerNode.getChildByName("wordLabel").getComponent(Label);
        const resSymbol = answerNode.getChildByName("resSymbol").getComponent(Sprite);

        wordLabel.string = `${this._optionList[index].cn} = ${this._optionList[index].en}`;
        resSymbol.node.active = true;

        this.onGameSubmit(this._rightWordData.word, isRight, this._rightWordData, this._optionList[index].cn);
        this.netTimeOut();

        if (isRight) {
            this.handleCorrectAnswer(answerNode, resSymbol);
        } else {
            this.handleIncorrectAnswer(answerNode, resSymbol);
        }
    }
    /** 处理正确答案的逻辑 */
    private handleCorrectAnswer(answerNode: Node, resSymbol: Sprite) {
        this._comboNum++;
        this.showRightSpAni();
        answerNode.getComponent(Sprite).spriteFrame = this.rightBg;
        resSymbol.spriteFrame = this.rightSymbol;
        this._rightNum++;

        if (this._wrongMode) {
            if (this._wrongWordList.length === 0) {
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
    }

    private handleIncorrectAnswer(answerNode: Node, resSymbol: Sprite) {
        SoundMgr.wrong();
        answerNode.getComponent(Sprite).spriteFrame = this.errorBg;
        answerNode.getComponent(Shake).shakeNode(0.5, 6);
        resSymbol.spriteFrame = this.errorSymbol;
        this._comboNum = 0;
        this._errorNum++;
        this._levelData.error_num = this._errorNum;
        this.topNode.updateErrorNumber(this._errorNum);

        if (GameSourceType.reviewSpecial !== this._sourceType) {
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

    /** 模式完成 */
    protected modeOver(): void {
        super.modeOver();
        console.log('词意模式完成');
        switch (this._sourceType) {
            case GameSourceType.review:
                this.handleReviewModeOver();
                break;
            case GameSourceType.errorWordbook:
            case GameSourceType.collectWordbook:
                this.handleWordbookMode();
                break;
            case GameSourceType.reviewSpecial:
                this.handleSpecialReviewMode();
                break;
            default:
                this.handleDefaultMode();
                break;
        }
    }
    /** 处理复习模式 */
    private handleReviewModeOver() {
        const data = this._currentSubmitResponse as s2cReviewPlanSubmit;
        if (data.pass_flag === 0) return;

        ViewsMgr.showView(PrefabType.ReviewEndView, (node: Node) => {
            const rewardList = data.reward_list;
            node.getComponent(ReviewEndView).init(this._levelData.souceType, rewardList);
            this.node.destroy();
        });
    }
    /** 处理词汇书模式 */
    private handleWordbookMode() {
        EventMgr.emit(EventType.Wordbook_List_Refresh); // 通知
        ViewsMgr.showAlert(TextConfig.All_level_Tip, () => {
            this.node.destroy();
        });
    }
    /** 处理复习规划特别模式 */
    private handleSpecialReviewMode() {
        ViewsMgr.showRewards(this._rewardList, () => {
            ServiceMgr.studyService.reqReviewPlan(); // 刷新复习规划
            this.node.destroy();
        });
    }
    /** 处理默认模式 */
    private handleDefaultMode() {
        this.showTransitionView(async () => {
            const wordData = JSON.parse(JSON.stringify(this._wordsData));
            const levelData = JSON.parse(JSON.stringify(this._levelData));
            console.log("过渡界面回调_________________________");
            const node = await ViewsMgr.showLearnView(PrefabType.WordPracticeView);
            node.getComponent(WordPracticeView).initData(wordData, levelData);
            this.node.parent.destroy();
        });
    }

    /** 分类单词 */
    onClassificationWord(data: WordsDetailData) {
        super.onClassificationWord(data);
        const sentences = this._detailData.sentence_list;
        if (sentences?.length > 0) {
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

