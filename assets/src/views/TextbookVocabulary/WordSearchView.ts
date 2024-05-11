import { _decorator, Component, EventTouch, instantiate, Label, Node, Prefab, RichText, Sprite, SpriteFrame, tween, UITransform, v3 } from 'cc';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';
import CCUtil from '../../util/CCUtil';
import { NetConfig } from '../../config/NetConfig';
import ImgUtil from '../../util/ImgUtil';
import { RemoteSoundMgr } from '../../manager/RemoteSoundManager';
import { WordDetailPanel } from './WordDetailPanel';
import { SearchWordDetail, WordSentence } from './SearchWordView';
import { TextConfig } from '../../config/TextConfig';
const { ccclass, property } = _decorator;

@ccclass('WordSearchView')
export class WordSearchView extends Component {

    @property({ type: Label, tooltip: "单词详细释义文本" })
    public wordCnTxt: Label = null;

    @property({ type: Label, tooltip: "单词音标文本" })
    public usSymbolTxt: Label = null;

    @property({ type: Label, tooltip: "单词朗读文本" })
    public ukReadTxt: Label = null;

    @property({ type: Sprite, tooltip: "单词图片精灵" })
    public wordImg: Sprite = null;

    @property({ type: Label, tooltip: "单词标题" })
    public learnWordTxt: Label = null;

    @property({ type: Node, tooltip: "播放单词声音" }) //
    public usLearnSound: Node = null;

    @property({ type: Node, tooltip: "播放单词音标声音" }) //
    public ukSound: Node = null;

    @property({ type: Node, tooltip: "播放单词例句声音" }) //
    public sencenSoundBtn: Node = null;

    @property({ type: Node, tooltip: "显示更多例句" }) // meansBtn
    public moreBtn: Node = null;

    @property({ type: Node, tooltip: "显示更多例句" }) // 
    public meansBtn: Node = null;

    @property({ type: Node, tooltip: "四条线1" })
    public fourLine1: Node = null;

    @property({ type: Node, tooltip: "四条线2" })
    public fourLine2: Node = null;

    @property({ type: Node, tooltip: "词条图片框" })// 
    public imgBox: Node = null;

    @property({ type: Node, tooltip: "侧边图片按钮显示不显示按钮" })
    public wordImgBtn: Node = null;

    @property({ type: RichText, tooltip: "单词例句" })
    public sentenceTxt: RichText = null;

    @property({ type: Label, tooltip: "单词例句中文翻译" }) //
    public sentenceChTxt: Label = null;

    @property({ type: Prefab, tooltip: "单词详情预制体" }) //
    public preWordDetailPanel: Prefab = null;

    @property({ type: Node, tooltip: "返回按钮" })
    public btn_back: Node = null;

    @property({ type: [SpriteFrame], tooltip: "单词图片按钮两个帧" })
    private sprWordImgBtnAry: SpriteFrame[] = [];

    _wordData: SearchWordDetail = null; //单词详细信息
    _word: string = ""; //单词名字
    _imgShow: boolean = true; //是否显示图片

    _sentenceData: WordSentence = null; //例句信息
    _sentenceId: string = ""; //例句ID

    _tabIdx: number = 1; //显示更多的tab页

    _wordDetailPanel: WordDetailPanel = null;

    /** 初始化数据 */
    public initData(data: SearchWordDetail) {
        this._wordData = data;

        //this.initEvent();
        // this.initDetailPanel(this.wordData);
        this.createDetailPanel();
    }

    initDetailPanel(data) {
        console.log("wordData", data);
        this._word = data.Word;
        let word = data.Word;
        this.wordCnTxt.string = data.Cn;
        this.usSymbolTxt.string = TextConfig.US + data.SymbolUs + "";
        this.ukReadTxt.string = TextConfig.EN + data.Symbol + "";
        let wordImgUrl: string = NetConfig.currentUrl + "/assets/imgs/words/" + data.Word + ".jpg";
        ImgUtil.loadRemoteImage(wordImgUrl, this.wordImg.node, 450.134, 282.543);
        this.learnWordTxt.string = word;
        var lenLearnWordTxt = this.learnWordTxt.string.length;
        //var uiLearnWordTransform: UITransform = this.learnWordTxt.node.getComponent(UITransform);
        let y = this.imgBox.position.y;
        //this.imgBox.setPosition(v3(1100, y, 0));
        if (lenLearnWordTxt <= 24) { //字符位数在24以内，正常显示
            let x: number = 498;

            this.imgBox.setPosition(v3(x, y, 0));
            this._imgShow = true;
        } else { //字符不能超过24，超过24则图片不显示
            let x: number = 1080;//this.wordImgBtn.position.x;
            x = x + 20;
            this.imgBox.setPosition(v3(x, y, 0));
            this._imgShow = false;
        }
        //this.wordImgBtn.skin = this.imgShow ? "img/newWordGame/showImg_h.png" : "img/newWordGame/showImg.png";
        this.wordImgBtn.getComponent(Sprite).spriteFrame = this._imgShow ? this.sprWordImgBtnAry[0] : this.sprWordImgBtnAry[1];

        this.onWordDetail(data);
    }

    private onWordDetail(data): void {
        if (!this._sentenceData) {
            let sentensDatas = data.Sentences;
            let sentData;
            if (sentensDatas && sentensDatas.length > 0) {
                sentData = sentensDatas[0]; //第0句第一句例句
                sentData.Word = data.Word;
                let word = data.Word;
                let sentence: string = sentData.En; //英语部分
                this._sentenceId = sentData.Id;

                let lowerSent: string = sentence.toLowerCase(); //句子变小写
                let lowerWord = word.toLowerCase(); //单词变小写
                let startIndex = lowerSent.indexOf(lowerWord); //寻找单词的位置
                if (startIndex != 0) { //如果单词在中间位置
                    startIndex = lowerSent.indexOf(" " + lowerWord); //前面的空格也算？
                }
                let endIndex = startIndex + word.length; // 单词结束位置
                //单词结束后，后面可能还有空格，和标点符号
                /*while (endIndex <= sentence.length - 1 && sentence[endIndex] != " "
                    && sentence[endIndex] != "," && sentence[endIndex] != "."
                    && sentence[endIndex] != "!" && sentence[endIndex] != "?") {
                    endIndex++;
                }*/
                var strHead: string = "";
                var strMid: string = ""
                var strTail: string = "";
                if (startIndex === -1) { //如果没有找到
                    this.sentenceTxt.string = "<color=#6C331F>" + sentence + "</color>";
                }
                else if (startIndex === 0) { //如果单词出现在首位
                    strTail = sentence.substring(endIndex);
                    this.sentenceTxt.string = "<color=#ff4e00>" + word + "</color>" + "<color=#6C331F>" + strTail + "</color>";
                }
                else if (startIndex > 0 && startIndex <= sentence.length - 1) { //单词在中间
                    strHead = sentence.substring(0, startIndex);
                    strMid = sentence.substring(startIndex, endIndex + 1);
                    strTail = sentence.substring(endIndex + 1);
                    this.sentenceTxt.string = "<color=#6C331F>" + strHead + "</color>" +
                        "<color=#ff4e00>" + strMid + "</color>" + "<color=#6C331F>" + strTail + "</color>";
                }
                else {
                    this.sentenceTxt.string = "<color=#6C331F>" + sentence + "</color>";
                }
                this.sentenceChTxt.string = sentData.Ch; //中文部分
            }
        }
    }

    /**关闭页面 TODO*/
    private closeView() {
        //director.loadScene(SceneType.MainScene);
        ViewsManager.instance.closeView(PrefabType.WordSearchView);
    }

    /**显示/关闭 词条图片 */
    private onShowWord() {
        this._imgShow = !this._imgShow;
        let targetX = this._imgShow ? 498 : (1080 + 20);
        let y = this.imgBox.position.y;
        //Laya.Tween.to(this.imgBox, { x: targetX }, 200);
        tween(this.imgBox)
            .to(0.2, { position: v3(targetX, y, 0) })
            .start();
        this.wordImgBtn.getComponent(Sprite).spriteFrame = this._imgShow ? this.sprWordImgBtnAry[0] : this.sprWordImgBtnAry[1];
        //this.wordImgBtn.skin = this.imgShow ? "img/newWordGame/showImg_h.png" : "img/newWordGame/showImg.png";
    }

    /**播放单词声音 */
    private onPlaySound() {
        let wordSoundUrl = "/sounds/glossary/words/en/" + this._word + ".wav";
        RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    /**播放音标 */
    private playUkSound() {
        let wordSoundUrl = "/sounds/glossary/words/uk/" + this._word + ".wav";
        RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    /**播放单词例句声音 */
    private onPlaySentence() {
        //SoundUtil.playSound("/assets/sounds/glossary/sentence_tts/Emily/" + this.sentenceId + ".wav")
        let wordSoundUrl = "/sounds/glossary/sentence_tts/Emily/" + this._sentenceId + ".wav";
        RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    /**显示更多例句 */
    private showDetail(e: EventTouch) {
        console.log(e);
        if (e.currentTarget.name === "moreBtn") { //点击更多例句按钮
            this._tabIdx = 1;
        }
        else {
            this._tabIdx = 2;
        }
        this._wordDetailPanel.show(this._tabIdx);
    }

    protected onLoad(): void {
        this.initEvent();
        //this.initDetailPanel(this.wordData);
        //this.createDetailPanel();
    }

    private createDetailPanel(): void {
        var ndWordDetailPanel = instantiate(this.preWordDetailPanel);
        this.node.addChild(ndWordDetailPanel);
        this._wordDetailPanel = ndWordDetailPanel.getComponent(WordDetailPanel);
        this._wordDetailPanel.setData(this._wordData);

        this._wordDetailPanel.node.active = false;
    }

    initDetail(data) {
        if (data.Word != "") {
            this._wordDetailPanel.getComponent(WordDetailPanel).setData(data);
        }
    }

    initEvent() {
        CCUtil.onTouch(this.btn_back, this.closeView, this);
        CCUtil.onTouch(this.wordImgBtn, this.onShowWord, this);
        CCUtil.onTouch(this.usLearnSound, this.onPlaySound, this);
        CCUtil.onTouch(this.ukSound, this.playUkSound, this);
        CCUtil.onTouch(this.sencenSoundBtn, this.onPlaySentence, this);
        CCUtil.onTouch(this.moreBtn, this.showDetail, this);
        CCUtil.onTouch(this.meansBtn, this.showDetail, this);
    }

    /**移除监听 */
    removeEvent() {
        CCUtil.offTouch(this.btn_back, this.closeView, this);
        CCUtil.offTouch(this.wordImgBtn, this.onShowWord, this);
        CCUtil.offTouch(this.usLearnSound, this.onPlaySound, this);
        CCUtil.offTouch(this.ukSound, this.playUkSound, this);
        CCUtil.offTouch(this.sencenSoundBtn, this.onPlaySentence, this);
        CCUtil.offTouch(this.moreBtn, this.showDetail, this);
        CCUtil.offTouch(this.meansBtn, this.showDetail, this);
    }

    start() {
        this.initDetailPanel(this._wordData);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    update(deltaTime: number) {

    }
}


