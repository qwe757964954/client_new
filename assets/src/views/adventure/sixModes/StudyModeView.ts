import { _decorator, instantiate, Label, Node, NodePool, Prefab, Sprite, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { NetConfig } from '../../../config/NetConfig';
import { PrefabType } from '../../../config/PrefabType';
import { DataMgr } from '../../../manager/DataMgr';
import RemoteImageManager from '../../../manager/RemoteImageManager';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { ViewsManager } from '../../../manager/ViewsManager';
import { GameMode } from '../../../models/AdventureModel';
import { UnitWordModel } from '../../../models/TextbookModel';
import CCUtil from '../../../util/CCUtil';
import { WordDetailView } from '../../common/WordDetailView';
import { BaseModeView } from './BaseModeView';
import { WordSplitItem } from './items/WordSplitItem';
import { WordMeaningView } from './WordMeaningView';

const { ccclass, property } = _decorator;

@ccclass('StudyModeView')
export class StudyModeView extends BaseModeView {

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
    btn_hideDetail: Node = null;

    protected _spilitData: any = null;
    protected _wordsData: UnitWordModel[] = null;
    protected _wordIndex: number = 0;
    protected _splits: any[] = [];
    protected _spliteItems: Node[] = [];
    protected _detailData: any = null;
    protected _levelData: any = null;
    protected _getWordsEveId: string;

    protected _isSplitPlaying: boolean = false;
    protected _currentSplitIdx: number = 0;
    protected _isCombine: boolean = false;
    protected _monster: Node = null;
    protected _nodePool: NodePool = new NodePool("wordSplitItem");
    private _isTweening: boolean = false;

    onLoad(): void {
        this.gameMode = GameMode.Study;
    }

    async initData(wordsdata: UnitWordModel[], levelData: any) {
        wordsdata = this.updateTextbookWords(wordsdata, levelData);
        this._spilitData = await DataMgr.instance.getWordSplitConfig();
        this.initWords(wordsdata);
        this.initMonster();
    }

    initWords(data: UnitWordModel[]) {
        this._wordsData = data;
        this._splits = this._wordsData.map(wordData => {
            const splitData = this._spilitData[wordData.word];
            return splitData ? splitData.split(" ") : wordData.word.includes(" ") ? wordData.word.split(" ") : [];
        });
        this.showCurrentWord();
    }

    showCurrentWord() {
        super.updateConstTime();
        this._isCombine = false;
        const wordData = this._wordsData[this._wordIndex];
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
        this.initWordDetail(wordData);
        this.playWordSound();
    }

    initSplitNode() {
        this.clearSplitItems();
        this._currentSplitIdx = 0;
        const splits = this._splits[this._wordIndex].length ? this._splits[this._wordIndex] : [this._wordsData[this._wordIndex].word];

        splits.forEach((split, i) => {
            const item = this.getSplitItem();
            item.getComponent(WordSplitItem).init(split);
            this.splitNode.addChild(item);
            CCUtil.onTouch(item, this.onSplitItemClick.bind(this, item, i), this);
            this._spliteItems.push(item);
        });
    }

    getSplitItem() {
        return this._nodePool.get() || instantiate(this.wordSplitItem);
    }

    clearSplitItems() {
        this._spliteItems.forEach(item => {
            CCUtil.offTouch(item, this.onSplitItemClick, this);
            this._nodePool.put(item);
        });
        this._spliteItems = [];
    }

    playWordSound() {
        const word = this._wordsData[this._wordIndex].word;
        const wordSoundUrl = this._spilitData[word] !== undefined 
            ? `/sounds/splitwords/${word}/${word}.wav` 
            : `/sounds/glossary/words/en/${word}.wav`;

        return RemoteSoundMgr.playSound(`${NetConfig.assertUrl}${wordSoundUrl}`);
    }

    onSplitItemClick(item: Node, idx: number) {
        if (this._isSplitPlaying || idx !== this._currentSplitIdx) return;

        this._isSplitPlaying = true;
        const wordSplitItem = item.getComponent(WordSplitItem);
        const splitWord = wordSplitItem.word;
        wordSplitItem.select();

        let url = `${NetConfig.assertUrl}/sounds/splitwords/${this._wordsData[this._wordIndex].word}/${splitWord}.wav`;
        if (!this._splits[this._wordIndex].length) {
            url = `${NetConfig.assertUrl}/sounds/glossary/words/en/${this._wordsData[this._wordIndex].word}.wav`;
        }

        RemoteSoundMgr.playSound(url).then(() => {
            this._isSplitPlaying = false;
            this._currentSplitIdx++;
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

    protected modeOver(): void {
        super.modeOver();
        console.log('学习完成,跳转词意模式');
        this.showTransitionView(async () => {
            const wordData = JSON.parse(JSON.stringify(this._wordsData));
            const levelData = JSON.parse(JSON.stringify(this._levelData));
            let node = await ViewsManager.instance.showLearnView(PrefabType.WordMeaningView);
            node.getComponent(WordMeaningView).initData(wordData, levelData);
            this.node.parent.destroy();
        });
    }

    showWordDetail() {
        if (this._isCombine || this._isSplitPlaying || this._isTweening) return;
        if (!this._detailData) {
            ViewsManager.showTip("未获取到单词详情数据");
            return;
        }
        const pos = this.mainNode.position;
        if (pos.y === -100) return;
        this.splitNode.active = false;
        this.wordDetailNode.active = true;

        this.wordDetailNode.getComponent(WordDetailView).init(this._wordsData[this._wordIndex].word, this._detailData);
        this.mainNode.setPosition(pos.x, -360, 0);
        this._isTweening = true;
        tween(this.mainNode).to(0.2, { position: new Vec3(pos.x, -100, 0) }).call(() => {
            this._isTweening = false;
            this.btn_hideDetail.angle = 0;
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

    onWordDetailClick() {
        if (this._isTweening) return;
        if (this.mainNode.position.y === -360) {
            this.showWordDetail();
        } else {
            this.hideWordDetail();
        }
    }

    protected initEvent(): void {
        super.initEvent();
        CCUtil.onTouch(this.btn_hideDetail, this.onWordDetailClick, this);
    }

    protected removeEvent(): void {
        super.removeEvent();
        CCUtil.offTouch(this.btn_hideDetail, this.onWordDetailClick, this);
        this._spliteItems.forEach((item, i) => {
            CCUtil.offTouch(item, this.onSplitItemClick.bind(this, item, i), this);
        });
    }

    onDestroy(): void {
        super.onDestroy();
        this._nodePool.clear();
    }
}
