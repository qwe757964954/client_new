import { _decorator, Component, Node } from 'cc';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
import List from '../../util/list/List';
import { WordSentensItem } from './WordSentensItem';
const { ccclass, property } = _decorator;

@ccclass('WordDetailView')
export class WordDetailView extends Component {
    @property({ type: [Node], tooltip: "tab" }) //tab节点
    tabNode: Node[] = [];
    @property({ type: [Node], tooltip: "view" }) //view节点
    viewNode: Node[] = [];
    @property({ type: List, tooltip: "句子List" }) //例句列表
    sentenceList: List = null;
    private _word: string = "";
    private _tabIdx: number = 0;
    private _detailData: any = null;
    private _sentences: { Id: number, En: string, Cn: string }[] = [];

    //eventId
    private _getWordsEveId: string = "";
    start() {

    }

    protected onLoad(): void {
        this.addEvent();
    }

    init(word: string, detalData: any) {
        this._word = word;
        this._detailData = detalData;
        if (this._detailData && this._detailData.Sentences) {
            this.initSentences(this._detailData.Sentences);
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

    initSentences(sentences: { Id: number, En: string, Cn: string }[]) {
        this._sentences = sentences;
        this.sentenceList.numItems = this._sentences.length;
    }

    onSentensRender(item: Node, idx: number) {
        item.getComponent(WordSentensItem).setData(this._sentences[idx]);
    }

    onTabSelcet(tab: Node, index: number) {
        if (index == this._tabIdx) return;
        this._tabIdx = index;
    }

    showView() {
        for (let i = 0; i < this.viewNode.length; i++) {
            this.viewNode[i].active = i == this._tabIdx;
        }
    }

    removeEvent() {
        for (let i = 0; i < this.tabNode.length; i++) {
            CCUtil.offTouch(this.tabNode[i], this.onTabSelcet.bind(this, this.tabNode[i], i), this);
        }
        EventManager.off(EventType.Classification_Word, this._getWordsEveId);
    }

    onDestroy() {
        this.removeEvent();
    }
}


