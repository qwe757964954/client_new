import { _decorator, Color, Component, EventTouch, instantiate, Label, Node, Prefab, ScrollView, Sprite, SpriteFrame, tween, v3 } from 'cc';
import { DetailSentenseItem } from './DetailSentenseItem';
import CCUtil from '../../util/CCUtil';
import AudioUtil from '../../util/AudioUtil';
import { DetailWordMeanItem } from './DetailWordMeanItem';
import { DetailWordNearSynonymMeanItem } from './DetailWordNearSynonymMeanItem';
import { DetailWordRootItem } from './DetailWordRootItem';
import { SearchWordDetail, WordSentence, WordSimpleData, WordSpeech } from './SearchWordView';
import { WordsDetailData } from '../../models/AdventureModel';
const { ccclass, property } = _decorator;

/**词根内容 */
export interface WordRootData { //{ type: "词根", txt: root }
    type: string,
    txt: string,
}

@ccclass('WordDetailPanel')
export class WordDetailPanel extends Component {
    @property({ type: Node, tooltip: "详情框" }) // 
    public detailBox: Node = null;

    @property({ type: Node, tooltip: "隐藏按钮" }) // 
    public hideBtn: Node = null;

    @property({ type: Node, tooltip: "tab1" }) // detailBox
    public tab1: Node = null;

    @property({ type: Node, tooltip: "tab2" }) //
    public tab2: Node = null;

    @property({ type: Node, tooltip: "tab3" }) //
    public tab3: Node = null;

    @property({ type: Node, tooltip: "tab4" }) //
    public tab4: Node = null;

    @property({ type: Node, tooltip: "tab5" }) // collectBtn
    public tab5: Node = null;

    @property({ type: Node, tooltip: "box1" }) //
    public box1: Node = null;

    @property({ type: Node, tooltip: "box2" }) //
    public box2: Node = null;

    @property({ type: Node, tooltip: "box3" }) //
    public box3: Node = null;

    @property({ type: Node, tooltip: "box4" }) //
    public box4: Node = null;

    @property({ type: Node, tooltip: "box5" }) // collectBtn
    public box5: Node = null;

    @property({ type: Node, tooltip: "搜集单词按钮" }) //
    public collectBtn: Node = null;

    @property({ type: ScrollView, tooltip: "例句滚动列表" })
    public sentenceList: ScrollView = null;

    @property({ type: ScrollView, tooltip: "词义滚动列表" }) // similarList
    public speechList: ScrollView = null;

    @property({ type: ScrollView, tooltip: "近义词滚动列表" })
    public similarList: ScrollView = null;

    @property({ type: ScrollView, tooltip: "词根滚动列表" })
    public rootList: ScrollView = null;

    @property({ type: Label, tooltip: "单词助记文本" }) //
    public prefixTxt: Label = null;

    @property({ type: Prefab, tooltip: "例句预制体" })
    private preSentenceItem: Prefab = null;

    @property({ type: Prefab, tooltip: "单词释义预制体" })
    private preWordMeanItem: Prefab = null;

    @property({ type: Prefab, tooltip: "近义词预制体" })
    private preWordNearSynonymMeanItem: Prefab = null;

    @property({ type: Prefab, tooltip: "词根预制体" })
    private preWordRootItem: Prefab = null;

    @property({ type: [SpriteFrame], tooltip: "tab图片按钮两个状态帧,0是高亮，1是非选中" })
    private sprtabImgAry: SpriteFrame[] = [];

    @property({ type: [SpriteFrame], tooltip: "顶部返回按钮两个图片状态,0是向上，1是向下" })
    private topReturnBtnImgAry: SpriteFrame[] = [];

    sentenceItems: Array<Node> = [];
    tabList: Array<Node> = []; //tab页数组
    boxList: Array<Node> = []; //下面box框

    wordData: WordsDetailData = null; //当前的词条数据
    word: string = "";    //当前词

    selectTabIdx: number = 1; //当前选中的tab索引
    selectTab: Node = null;   //当前选中页

    static NormalDetailBoxY: number = -140; //正常显示时detailBox的高度
    static SinkDetailBoxY: number = -977; //下沉到底部不显示时detailBox的高度

    protected onLoad(): void {
        this.sentenceItems = [];
        this.tabList = [this.tab1, this.tab2, this.tab3, this.tab4, this.tab5];
        this.boxList = [this.box1, this.box2, this.box3, this.box4, this.box5];
        this.init();
    }

    init() {
        this.addEvent();
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    setData(data: WordsDetailData) {
        this.wordData = data;
        this.initDetailPanel(data);
    }

    initDetailPanel(data: WordsDetailData) {
        this.word = data.word;
        this.hideBtn.getComponent(Sprite).spriteFrame = this.topReturnBtnImgAry[0];
        this.sentenceList.content.removeAllChildren();
        this.speechList.content.removeAllChildren();
        this.similarList.content.removeAllChildren();
        this.rootList.content.removeAllChildren();
        //this.collectBtn.skin = (GameDataController.getCollectWord(data.Word) != null) ? "img/myword/star_wrong.png" : "img/myword/common icon_star_red.png";
        let sentensData = data.sentence_list;
        if (sentensData && sentensData.length > 0) {
            for (let i = 0; i < sentensData.length; i++) {
                // data.sentence_list[i].word = data.Word;
                let sentencData = sentensData[i];
                let sentenceData: WordSentence = {
                    Word: this.word,
                    En: sentencData.sentence,
                    Cn: sentencData.cn,
                    Id: sentencData.id,
                }
                this.addSentenceListItem(sentenceData);
            }
        }

        if (data.speech) { //单词释义
            let speeches = JSON.parse(data.speech);//JSON.parse(data.Speech);
            if (speeches && speeches.length > 0) {
                for (let i = 0; i < speeches.length; i++) {
                    this.addSpeechListItem(speeches[i]);
                }
            }
        }
        // 如果有近义词列表
        if (data.similar_list && data.similar_list.length > 0) {
            for (let i = 0; i < data.similar_list.length; i++) {
                this.addSimilarList(data.similar_list[i]);
            }
        }

        //单词助记
        if (data.ancillary) {
            this.prefixTxt.string = data.ancillary;
        } else {
            this.prefixTxt.string = "";
        }

        //词根
        if (data.structure && ((data.structure.Prefixs && data.structure.Prefixs.length > 0) ||
            (data.structure.Roots && data.structure.Roots.length > 0) ||
            (data.structure.Suffix && data.structure.Suffix.length > 0))) {

            if (data.structure.Roots) {
                let root = "";
                for (let i = 0; i < data.structure.Roots.length; i++) {
                    root += data.structure.Roots[i].Name;
                    if (i != data.structure.Roots.length - 1) {
                        root += "\n";
                    }
                }

                let rootData = { type: "词根", txt: root };
                this.addRootListItem(rootData);
            }

            if (data.structure.Prefixs) { // 前缀
                let pre = "";
                for (let i = 0; i < data.structure.Prefixs.length; i++) {
                    pre += data.structure.Prefixs[i].Name;
                    if (i != data.structure.Prefixs.length - 1) {
                        pre += "\n";
                    }
                }

                let rootData = { type: "前缀", txt: pre };
                this.addRootListItem(rootData);
            }

            if (data.structure.Suffix) { //后缀
                let suff = "";
                for (let i = 0; i < data.structure.Suffix.length; i++) {
                    suff += data.structure.Suffix[i].Name;
                    if (i != data.structure.Suffix.length - 1) {
                        suff += "\n";
                    }
                }

                let rootData = { type: "后缀", txt: suff };
                this.addRootListItem(rootData);
            }
        }


    }

    /**向sentenceList里添加一项内容*/
    addSentenceListItem(data: WordSentence) {
        console.log("addSentenceList data:", data);
        if (!data) {
            return;
        }
        if (!data.Word || !data.Cn) {
            return;
        }
        let itemSentence = instantiate(this.preSentenceItem);
        itemSentence.getComponent(DetailSentenseItem).init(data);
        this.sentenceList.content.addChild(itemSentence);
    }

    /**向词义列表里添加一项 */
    addSpeechListItem(data: WordSpeech) { //{ sp: "vt.", tr: "vi. 赠送，捐赠"}
        console.log("addSpeechListItem data:", data);
        if (!data) {
            return;
        }
        if (!data.sp || !data.tr) {
            return;
        }
        let itemSpeech = instantiate(this.preWordMeanItem);
        itemSpeech.getComponent(DetailWordMeanItem).init(data);
        this.speechList.content.addChild(itemSpeech);
    }

    /**添加一个近义词 */
    addSimilarList(data: WordSimpleData) { // {Cn:"近义词释义", Word:"近义词本身"}
        console.log("addSimilarList data:", data);
        if (!data) {
            return;
        }
        if (!data.cn || !data.word) {
            return;
        }
        let itemSimilar = instantiate(this.preWordNearSynonymMeanItem);
        itemSimilar.getComponent(DetailWordNearSynonymMeanItem).Init(data);
        this.similarList.content.addChild(itemSimilar);
    }

    /** 添加一个词根 */
    addRootListItem(data: WordRootData) { // {type:"词根", txt:"词根内容"}
        console.log("addRootListItem data:", data);
        if (!data) {
            return;
        }
        if (!data.type || !data.txt) {
            return;
        }
        let itemRoot = instantiate(this.preWordRootItem);
        itemRoot.getComponent(DetailWordRootItem).Init(data);
        this.rootList.content.addChild(itemRoot);
    }

    addEvent() {
        for (let i = 0; i < this.tabList.length; i++) {
            CCUtil.onTouch(this.tabList[i], this.onTabSelect, this);
        }
        CCUtil.onTouch(this.hideBtn, this.hide, this);
    }

    removeEvent() {
        for (let i = 0; i < this.tabList.length; i++) {
            CCUtil.offTouch(this.tabList[i], this.onTabSelect, this);
        }
        CCUtil.offTouch(this.hideBtn, this.hide, this);
    }

    show(tabIdx = 1) {
        //SoundUtil.playLocalSound("sound/moreShow.wav");
        AudioUtil.playEffect("sound/moreShow");
        this.hideBtn.getComponent(Sprite).spriteFrame = this.topReturnBtnImgAry[0];
        this.node.active = true;
        this.selectTabIdx = tabIdx - 1;
        this.selectTab = this.tabList[this.selectTabIdx - 1]; //this["tab" + this.selectTabIdx];
        this.changeTab();
        var x: number = this.detailBox.position.x;
        var y: number = WordDetailPanel.SinkDetailBoxY; //底部高度，-977
        var destY: number = WordDetailPanel.NormalDetailBoxY; //正常显示时的高度，-127
        this.detailBox.setPosition(v3(x, y, 0));
        //Laya.Tween.to(this.detailBox, { y: 128 }, 200);
        //this.node.active = true;
        tween(this.detailBox)
            .to(0.3, { position: v3(x, destY, 0) })
            .delay(0.2)
            .call(() => {
                this.hideBtn.getComponent(Sprite).spriteFrame = this.topReturnBtnImgAry[1];
            })
            .start();
    }

    hide() {
        //SoundUtil.playLocalSound("sound/moreShow.wav");
        /* Laya.Tween.to(this.detailBox, { y: 1300 }, 200, null, Laya.Handler.create(this, () => {
             this.visible = false;
         }, null, false));*/
        AudioUtil.playEffect("sound/moreShow");
        var x: number = this.detailBox.position.x;
        var destY: number = WordDetailPanel.SinkDetailBoxY;
        tween(this.detailBox)
            .to(0.3, { position: v3(x, destY, 0) })
            .call(() => {
                this.hideBtn.getComponent(Sprite).spriteFrame = this.topReturnBtnImgAry[0];
                this.node.active = false;
            })
            .start();
    }

    /**根据当前选取的索引来设置当前tab页 */
    changeTab() {
        for (let i = 0; i < this.boxList.length; i++) {
            this.boxList[i].active = false;
        }
        this.boxList[this.selectTabIdx].active = true;

        for (let i = 0; i < this.tabList.length; i++) {
            this.tabList[i].getChildByName("bg").getComponent(Sprite).spriteFrame = this.sprtabImgAry[1];
            this.tabList[i].getChildByName("tabTxt").getComponent(Label).color = new Color("#ffffff");
        }
        this.tabList[this.selectTabIdx].getChildByName("bg").getComponent(Sprite).spriteFrame = this.sprtabImgAry[0];
        this.tabList[this.selectTabIdx].getChildByName("tabTxt").getComponent(Label).color = new Color("#452114");
    }

    /**点击切换当前tab页 */
    onTabSelect(e: EventTouch) {
        //SoundUtil.playLocalSound("sound/studyTab.wav");
        AudioUtil.playEffect("sound/studyTab");
        let tabIdx = Number(e.currentTarget.name); //获取点击的tab页的索引号
        tabIdx = tabIdx - 1;
        if (this.selectTab) { //如果当前有选中的tab页，设置非选中状态
            this.selectTab.getChildByName("bg").getComponent(Sprite).spriteFrame = this.sprtabImgAry[1];
            this.selectTab.getChildByName("tabTxt").getComponent(Label).color = new Color("#ffffff");
        }
        this.boxList[this.selectTabIdx].active = false;
        this.selectTabIdx = tabIdx;
        this.selectTab = e.currentTarget;
        this.tabList[this.selectTabIdx].getChildByName("bg").getComponent(Sprite).spriteFrame = this.sprtabImgAry[0];
        this.tabList[this.selectTabIdx].getChildByName("tabTxt").getComponent(Label).color = new Color("#452114");
        this.changeTab();
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


