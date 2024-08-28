import { _decorator, instantiate, Label, Node, Prefab, Sprite, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { NetConfig } from '../../../../config/NetConfig';
import { TextConfig } from '../../../../config/TextConfig';
import RemoteImageManager from '../../../../manager/RemoteImageManager';
import { RemoteSoundMgr } from '../../../../manager/RemoteSoundManager';
import { ViewsManager, ViewsMgr } from '../../../../manager/ViewsManager';
import { AdventureCollectWordModel, WordsDetailData } from '../../../../models/AdventureModel';
import { ReqCollectWord, UnitWordModel } from '../../../../models/TextbookModel';
import { InterfacePath } from '../../../../net/InterfacePath';
import { NetNotify } from '../../../../net/NetNotify';
import { ServiceMgr } from '../../../../net/ServiceManager';
import { BaseView } from '../../../../script/BaseView';
import { TBServer } from '../../../../service/TextbookService';
import CCUtil from '../../../../util/CCUtil';
import { Shake } from '../../../../util/Shake';
import { WordDetailView } from '../../../common/WordDetailView';
import { GameSourceType } from '../BaseModeView';
import { WordSplitItem } from '../items/WordSplitItem';
const { ccclass, property } = _decorator;

@ccclass('StudyOprate')
export class StudyOprate extends BaseView {

    @property({ type: Node, tooltip: "收藏按钮" })
    public btn_collect: Node = null;

    @property({ type: Node, tooltip: "更多按钮" })
    public btn_more: Node = null;

    @property({ type: Prefab, tooltip: "单词拆分item" })
    public wordSplitItem: Prefab = null;

    @property({ type: Label, tooltip: "单词Label" })
    wordLabel: Label = null;

    @property({ type: Label, tooltip: "音标Label" })
    symbolLabel: Label = null;

    @property({ type: Label, tooltip: "中文Label" })
    cnLabel: Label = null;

    @property({ type: Node, tooltip: "拆分节点容器" })
    splitNode: Node = null;

    @property({ type: Node, tooltip: "完整单词节点" })
    wholeWordNode: Node = null;

    @property({ type: Label, tooltip: "完整单词Label" })
    wholeWordLabel: Label = null;

    @property({ type: Sprite, tooltip: "单词图片" })
    wordImg: Sprite = null;

    @property({ type: Node, tooltip: "单词详情面板" })
    wordDetailNode: Node = null;

    @property({ type: Node, tooltip: "隐藏详情面板按钮" })
    btn_zoom: Node = null;
    protected _spliteItems: Node[] = [];

    protected _rightWordData: UnitWordModel = null; //正确单词数据
    protected _sourceType: GameSourceType = null;//游戏来源类型
    protected _spilitData: any = null;
    protected _currentSplitIdx: number = 0;
    protected _splits: any[] = [];
    protected _wordIndex: number = 0;
    protected _isCombine: boolean = false;
    private _playingUrl: string = null;
    protected _wordsData: UnitWordModel[] = null;
    protected _detailData: WordsDetailData = null; //当前单词详情数据
    private _isTweening: boolean = false;
    protected _isSplitPlaying: boolean = false;
    protected initUI(): void {
        this.offViewAdaptSize();

    }
    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [NetNotify.Classification_Word, this.onClassificationWord],
            [NetNotify.Classification_CollectWord, this.onCollectWord],
            [NetNotify.Classification_AdventureCollectWord, this.onAdventureCollectWord],
            [InterfacePath.Adventure_Word, this.onClassificationWord],
        ]);
    }
    protected initEvent(){
        CCUtil.onBtnClick(this.btn_collect, this.onClickCollectEvent.bind(this));
        CCUtil.onTouch(this.btn_zoom, this.onWordDetailClick, this);
    }

    protected removeEvent(): void {
        CCUtil.offTouch(this.btn_zoom, this.onWordDetailClick, this);
    }

    onWordDetailClick() {
        if (this._isTweening) return;
        if (this.node.position.y === -360) {
            this.showWordDetail();
        } else {
            this.hideWordDetail();
        }
    }

    showWordDetail() {
        if (this._isCombine || this._isSplitPlaying || this._isTweening) return;
        if (!this._detailData) {
            ViewsManager.showTip("未获取到单词详情数据");
            return;
        }
        const pos = this.node.position;
        if (pos.y === -100) return;
        this.splitNode.active = false;
        this.wordDetailNode.active = true;

        this.wordDetailNode.getComponent(WordDetailView).init(this._wordsData[this._wordIndex].word, this._detailData);
        this.node.setPosition(pos.x, -360, 0);
        this._isTweening = true;
        tween(this.node).to(0.2, { position: new Vec3(pos.x, -100, 0) }).call(() => {
            this._isTweening = false;
            this.btn_zoom.angle = 0;
        }).start();
    }

    hideWordDetail() {
        if (this._isTweening) return;
        this.splitNode.active = true;
        this.wordDetailNode.active = false;
        const pos = this.mainNode.position;
        this._isTweening = true;
        tween(this.mainNode).to(0.2, { position: new Vec3(pos.x, -360, 0) }).call(() => {
            this._isTweening = false;
            this.btn_hideDetail.angle = 180;
        }).start();
    }

    updateData(wordData:UnitWordModel){
        this._rightWordData = wordData;
        this._isCombine = false;
        this.wordLabel.string = this.wholeWordLabel.string = wordData.word;
        this.symbolLabel.string = wordData.symbol;
        this.cnLabel.string = wordData.cn;
        this.splitNode.active = true;
        this.wholeWordNode.active = false;
        const imgUrl = `${NetConfig.assertUrl}/imgs/words/${wordData.word}.jpg`;
        RemoteImageManager.i.loadImage(imgUrl, this.wordImg);
        const splitData = this._spilitData[wordData.word];
        const phonics = splitData && !wordData.word.includes(" ") ? splitData.replace(/ /g, "·") : wordData.word;

        this.initSplitNode();
    }
    initSplitNode() {
        this.clearSplitItems();
        this._currentSplitIdx = 0;
        const splits = this._splits[this._wordIndex].length ? this._splits[this._wordIndex] : [this._wordsData[this._wordIndex].word];

        splits.forEach((split, i) => {
            const item = instantiate(this.wordSplitItem);
            item.getComponent(WordSplitItem).init(split);
            this.splitNode.addChild(item);
            CCUtil.onTouch(item, this.onSplitItemClick.bind(this, item, i), this);
            this._spliteItems.push(item);
        });
    }
    clearSplitItems() {
        this._spliteItems.forEach(item => {
            CCUtil.offTouch(item, this.onSplitItemClick, this);
        });
        this._spliteItems = [];
    }
    onSplitItemClick(item: Node, idx: number) {
        if (this._isCombine) return;
        if (idx != this._currentSplitIdx) {
            item.getComponent(Shake).shakeNode();
            return;
        }
        if (this._playingUrl)
            RemoteSoundMgr.stopSound(this._playingUrl);
        // this._isSplitPlaying = true;
        const wordSplitItem = item.getComponent(WordSplitItem);
        const splitWord = wordSplitItem.word;
        wordSplitItem.select();

        let url = `${NetConfig.assertUrl}/sounds/splitwords/${this._wordsData[this._wordIndex].word}/${splitWord}.wav`;
        if (!this._splits[this._wordIndex].length) {
            url = `${NetConfig.assertUrl}/sounds/glossary/words/en/${this._wordsData[this._wordIndex].word}.wav`;
        }
        this._playingUrl = url;
        this._currentSplitIdx++;
        RemoteSoundMgr.playSound(url).then(() => {
            // this._isSplitPlaying = false;
            if (this._currentSplitIdx === this._splits[this._wordIndex].length) {
                this.combineWord();
            }
        });
    }

    combineWord() {
        this._isCombine = true;
        const total = this._spliteItems.length;
        const halfIdx = (total % 2 === 0) ? (Math.ceil(total / 2) - 0.5) : ((total + 1) / 2 - 1);

        this._spliteItems.forEach((item, i) => {
            item.getComponent(Shake).stopShake();
            if (total % 2 !== 0 && i === halfIdx) return;
            const oldPos = item.position;
            const targetX = i < halfIdx ? oldPos.x + 35 * (halfIdx - i) : oldPos.x - 35 * (i - halfIdx);
            tween(item).to(0.2, { position: new Vec3(targetX, oldPos.y, 0) }).start();
        });

        this.wholeWordNode.active = true;
        this.wholeWordNode.getComponent(UIOpacity).opacity = 0;
        this.scheduleOnce(() => {
            this.wholeWordNode.getComponent(UIOpacity).opacity = 255;
            const labelWidth = this.wholeWordLabel.getComponent(UITransform).contentSize.width;
            this.wholeWordNode.getComponent(UITransform).width = labelWidth + 100;
            this.splitNode.active = false;

            this.playWordSound().then(() => {
                this._wordIndex++;
                this._rightNum++;
                this._comboNum++;
                this.showRightSpAni();
                this.attackMonster().then(() => {
                    if (this._wordIndex === this._wordsData.length) {
                        this.monsterEscape();
                    } else {
                        this.showCurrentWord();
                    }
                });
            });
        }, 0.2);

        this.onGameSubmit(this._wordsData[this._wordIndex].word, true);
    }
    playWordSound() {
        const word = this._wordsData[this._wordIndex].word;
        const wordSoundUrl = this._spilitData[word] !== undefined
            ? `/sounds/splitwords/${word}/${word}.wav`
            : `/sounds/glossary/words/en/${word}.wav`;

        return RemoteSoundMgr.playSound(`${NetConfig.assertUrl}${wordSoundUrl}`);
    }
    //获取单词详情
    initWordDetail(word: UnitWordModel) {
        if (GameSourceType.word_game == this._sourceType) { //大冒险关卡
            ServiceMgr.studyService.getAdventureWord(word.w_id);
        } else if (GameSourceType.classification == this._sourceType) { //教材单词关卡
            TBServer.reqWordDetail(word.w_id);
        } else if (GameSourceType.review == this._sourceType || GameSourceType.reviewSpecial === this._sourceType) {
            // TBServer.reqWordDetail(word.w_id);
        }
        this.setCollect(word.collect == 1 ? true : false);
    }

    /**是否收藏 */
    public setCollect(isCollect: boolean) {
        this.btn_collect.getComponent(Sprite).grayscale = !isCollect
    }
    /**收藏单词 */
    onClickCollectEvent() {
        if (!this._rightWordData) return;
        let wordData = this._rightWordData;
        wordData.collect = wordData.collect == 1 ? 0 : 1;
        if (GameSourceType.classification == this._sourceType) { //教材关卡
            let reqParam: ReqCollectWord = {
                w_id: wordData.w_id,
                action: wordData.collect,
            }
            TBServer.reqCollectWord(reqParam);
        } else if (GameSourceType.word_game == this._sourceType) {
            //大冒险关卡
            let reqParam: AdventureCollectWordModel = {
                w_id: wordData.w_id,
                action: wordData.collect,
            }
            ServiceMgr.studyService.reqAdventureCollectWord(reqParam);
        }

    }
    protected onClassificationWord(data: WordsDetailData) {
        if (data.code != 200) {
            console.error("获取单词详情失败", data.msg);
            this._detailData = null;
            return;
        }
        console.log("获取单词详情", data);
        this._detailData = data;
        this.setCollect(this._detailData.collect === 1);
    }

    protected onCollectWord(data: any) {
        console.log("onCollectWord", data);
        this.setCollect(this._rightWordData.collect === 1);
        if (this._rightWordData.collect) {
            ViewsMgr.showTipSmall(TextConfig.Collect_Succ, this.btn_collect, new Vec3(0, 80, 0));
        } else {
            ViewsMgr.showTipSmall(TextConfig.Collect_Cancel, this.btn_collect, new Vec3(0, 80, 0));
        }
    }

    protected onAdventureCollectWord(data: any) {
        if (data.code != 200) {
            ViewsManager.showTip(data.msg);
            return;
        }
        this.setCollect(this._rightWordData.collect === 1);
        if (this._rightWordData.collect) {
            ViewsMgr.showTipSmall(TextConfig.Collect_Succ, this.btn_collect, new Vec3(0, 80, 0));
        } else {
            ViewsMgr.showTipSmall(TextConfig.Collect_Cancel, this.btn_collect, new Vec3(0, 80, 0));
        }
    }
}

