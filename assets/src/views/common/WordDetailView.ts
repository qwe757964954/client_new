import { _decorator, Color, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
import List from '../../util/list/List';
import { WordSentensItem } from './WordSentensItem';
import { WordMeanItem } from '../study/item/WordMeanItem';
import { WordSimilarItem } from '../study/item/WordSimilarItem';
import { SentenceData, WordsDetailData } from '../../models/AdventureModel';
const { ccclass, property } = _decorator;

@ccclass('WordDetailView')
export class WordDetailView extends Component {
    @property({ type: [Node], tooltip: "tab" }) //tab节点
    tabNode: Node[] = [];
    @property({ type: [Node], tooltip: "view" }) //view节点
    viewNode: Node[] = [];
    @property({ type: List, tooltip: "句子List" }) //例句列表
    sentenceList: List = null;
    @property({ type: List, tooltip: "释义List" })
    wordMeansList: List = null;
    @property({ type: List, tooltip: "相似词List" })
    similarList: List = null;
    @property({ type: SpriteFrame, tooltip: "未选中tab样式" })
    unSelectTab: SpriteFrame = null;
    @property({ type: SpriteFrame, tooltip: "选中tab样式" })
    selectTab: SpriteFrame = null;
    @property({ type: Label, tooltip: "助记" })
    assistLabel: Label = null;
    private _word: string = "";
    private _tabIdx: number = 0;
    private _detailData: WordsDetailData = null;
    private _sentences: SentenceData[] = []; //例句
    private _means: { sp: string, tr: string }[] = [];  //释义
    private _similars: { cn: string, word: string }[] = []; //相似词

    //eventId
    private _getWordsEveId: string = "";
    start() {
        this.initView();
    }

    protected onLoad(): void {
        this.addEvent();
    }

    init(word: string, detalData: WordsDetailData) {
        this._word = word;
        this._detailData = detalData;
        if (!this._detailData) return;
        if (this._detailData.sentence_list) { //例句
            this.initSentences(this._detailData.sentence_list);
        }
        if (this._detailData.speech) { //释义
            let means = JSON.parse(this._detailData.speech);
            this.initMeans(means);
        }
        if (this._detailData.similar_list) { //相似词
            this.initSimilars(this._detailData.similar_list);
        }
        if (this._detailData.ancillary) { //助记
            this.assistLabel.string = this._detailData.ancillary;
        }
        this._tabIdx = 0;
    }

    initView() {
        this.showView();
    }

    addEvent() {
        for (let i = 0; i < this.tabNode.length; i++) {
            CCUtil.onTouch(this.tabNode[i], this.onTabSelcet.bind(this, this.tabNode[i], i), this);
        }
    }

    //初始化例句
    initSentences(sentences: SentenceData[]) {
        this._sentences = sentences;
        this.sentenceList.numItems = this._sentences.length;
    }
    //初始化释义
    initMeans(means: { sp: string, tr: string }[]) {
        this._means = means;
        this.wordMeansList.numItems = this._means.length;
    }
    //初始化相似词
    initSimilars(similars: { cn: string, word: string }[]) {
        this._similars = similars;
        this.similarList.numItems = this._similars.length;
    }

    onSentensRender(item: Node, idx: number) {
        item.getComponent(WordSentensItem).setData(this._sentences[idx]);
    }
    onWordMeansRender(item: Node, idx: number) {
        item.getComponent(WordMeanItem).setData(this._means[idx]);
    }
    onSimilarRender(item: Node, idx: number) {
        item.getComponent(WordSimilarItem).setData(this._similars[idx]);
    }

    onTabSelcet(tab: Node, index: number) {
        if (index == this._tabIdx) return;
        this._tabIdx = index;
        for (let i = 0; i < this.tabNode.length; i++) {
            if (i == index) {
                this.tabNode[i].getComponent(Sprite).spriteFrame = this.selectTab;
                this.tabNode[i].getChildByName("Label").getComponent(Label).color = new Color(122, 45, 17);
            } else {
                this.tabNode[i].getComponent(Sprite).spriteFrame = this.unSelectTab;
                this.tabNode[i].getChildByName("Label").getComponent(Label).color = new Color(162, 118, 104);
            }
        }
        this.showView();
    }

    showView() {
        for (let i = 0; i < this.viewNode.length; i++) {
            this.viewNode[i].active = i == this._tabIdx;
        }
        if (this._tabIdx == 0) {
            this.sentenceList.numItems = this._sentences.length;
        } else if (this._tabIdx == 1) {
            this.wordMeansList.numItems = this._means.length;
        } else if (this._tabIdx == 2) {
            this.similarList.numItems = this._similars.length;
        }
    }

    removeEvent() {
        for (let i = 0; i < this.tabNode.length; i++) {
            CCUtil.offTouch(this.tabNode[i], this.onTabSelcet.bind(this, this.tabNode[i], i), this);
        }
    }

    onDestroy() {
        this.removeEvent();
    }
}


